// @ts-nocheck
import { ACTION_PASS } from 'moonlands/dist/esm/const'
import { Socket } from "socket.io-client"
import { ClientAction, FromClientPassAction } from "../clientProtocol"
import { GameState } from "./GameState"
import { Strategy } from './strategies/Strategy'
import { SerializedClientState } from "./types"
import { ErrorDumpService } from '../services/ErrorDumpService'

const STEP_NAMES: Record<number, string> = {
    0: 'Energize',
    1: 'Power/Relic/Spell (1)',
    2: 'Attack',
    3: 'Creatures',
    4: 'Power/Relic/Spell (2)',
    5: 'Draw',
}

export class StrategyConnector {
    private playerId: number = 2
    private gameState?: GameState
    private strategy?: Strategy
    public constructor(private readonly io: Socket) {}

    public connect(strategy: Strategy) {
        this.strategy = strategy

        this.io.on('gameData', (data: { playerId: number, state: SerializedClientState }) => {
            this.playerId = data.playerId
            console.log('Strategy receives game data')
            this.gameState = new GameState(data.state)
            this.gameState.setPlayerId(data.playerId)

            strategy.setup(this.gameState, this.playerId)
        })

        this.io.on('action', (action: ClientAction | { type: 'display/priority', player: number }) => {
            if (this.gameState && this.playerId && action) {
                try {
                    const stateBefore = JSON.parse(JSON.stringify(this.gameState.state))
                    this.gameState.update(action)

                    if (
                        action.type == "actions/enter_prompt" &&
                        action.promptType == "prompt/payment_source" &&
                        action.player == 1 &&
                        !this.gameState.isInPromptState(action.player)
                    ) {
                        console.log(`Entered payment prompt unsuccesfully. Action:`)
                        console.dir(action)
                    }
                } catch (e: any) {
                    console.log('Error applying the action')
                    console.dir(action)
                    console.log(e?.message)
                    try {
                        ErrorDumpService.dumpActionFailure(action, stateBefore, e, { location: 'StrategyConnector', playerId: this.playerId, turn: this.gameState?.turnNumber, step: this.gameState?.getStep?.() })
                    } catch (_err) {
                        // ignore
                    }
                }

                if (this.gameState.hasGameEnded()) {
                    console.log(this.gameState.getWinner() === this.playerId ? 'We won' : 'We lost');
                    this.io.close();

                    return true;
                }
            }
        })
    }

    public requestAndSendAction() {
        if (!this.gameState) {
            this.io.emit('clientAction', { type: ACTION_PASS, player: this.playerId } as FromClientPassAction)
            return;
        }
        const inPromptState = this.gameState.isInPromptState(this.playerId)
        const currentStep = this.gameState.getStep()
        if (this.strategy && this.gameState && this.playerId &&
            (this.gameState.playerPriority(this.playerId) || inPromptState)
        ) {
            if (currentStep !== 5 || inPromptState) {
                const action = this.strategy.requestAction()

                if (action) {
                    const serializedState = JSON.parse(JSON.stringify(this.gameState.state))

                    // If we are in prompt state and strategy returned a pass, dump state and abort
                    if (this.gameState.isInPromptState(this.playerId) && action.type == ACTION_PASS) {
                        console.log(`${this.gameState.turnNumber}:${this.gameState.getStep()}`)
                        ErrorDumpService.dumpGameState(serializedState, { reason: 'pass_in_prompt', location: 'StrategyConnector', playerId: this.playerId, turn: this.gameState?.turnNumber, step: this.gameState?.getStep?.() })
                        ErrorDumpService.dumpActionFailure(action, serializedState, new Error('Strategy returned PASS while in prompt'), { location: 'StrategyConnector', playerId: this.playerId })
                        throw new Error(`Here we go, returning pass for the prompt`)
                    }

                    // Try to simulate applying the action to a cloned GameState to detect invalid actions
                    try {
                        const testState = new GameState(serializedState)
                        testState.setPlayerId(this.playerId)
                        testState.update(action)
                    } catch (e: any) {
                        console.error('Strategy produced an action that fails to apply on cloned state')
                        try {
                            ErrorDumpService.dumpGameState(serializedState, { reason: 'strategy_action_causes_error_on_update', actionType: action?.type, action, location: 'StrategyConnector.requestAndSendAction', playerId: this.playerId, step: this.gameState?.getStep?.(), turn: this.gameState?.turnNumber })
                        } catch (_err) {}
                        try {
                            ErrorDumpService.dumpActionFailure(action, serializedState, e, { location: 'StrategyConnector.requestAndSendAction', playerId: this.playerId })
                        } catch (_err) {}
                        throw new Error('Strategy returned an action that would fail when applied; aborting send')
                    }

                    this.io.emit('clientAction', action, this.gameState.state)
                } else {
                    throw new Error('No action returned from request')
                }
            } else {
                throw new Error(`We are here in step ${currentStep}, and shouldn't request actions`)
            }
        } else {
            throw new Error(`Some strange conditions to call requestAndSendAction`)
        }
    }
}