// @ts-nocheck
import { ACTION_PASS, ACTION_RESOLVE_PROMPT, PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE } from "moonlands/dist/const"
import {Socket} from "socket.io-client"
import { ClientAction, ClientPassAction, FromClientPassAction } from "../clientProtocol"
import { GameState } from "./GameState"
import {Strategy} from './strategies/Strategy'
import { SerializedClientState } from "./types"

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

    this.io.on('gameData', (data: {playerId: number, state: SerializedClientState}) => {
      this.playerId = data.playerId
      this.gameState = new GameState(data.state)
      this.gameState.setPlayerId(data.playerId)

      strategy.setup(this.gameState, this.playerId)

      if (this.gameState.playerPriority(this.playerId) || this.gameState.isInPromptState(this.playerId)) {
        this.requestAndSendAction()
      }
    })

    this.io.on('action', (action: ClientAction | {type: 'display/priority', player: number}) => {
      if (this.gameState && this.playerId && action) {
        try {
          this.gameState.update(action)
        } catch(e: any) {
          console.log('Error applying the action')
          console.dir(action)
          console.log(e?.message)
        }

        if (this.gameState.hasGameEnded()) {
          console.log(this.gameState.getWinner() === this.playerId ? 'We won' : 'We lost');
          this.io.close();
          // process.exit(0);
          return true;
        }

        if (action.type === 'display/priority') {
          // console.log('Got priority action')
          if (action.player === this.playerId) {
            this.requestAndSendAction()
          }
        } 
      }
    })
  }

  private requestAndSendAction() {
    if (!this.gameState) {
      this.io.emit('clientAction', {type: ACTION_PASS, player: this.playerId} as FromClientPassAction)
      return;
    }
    const inPromptState = this.gameState.isInPromptState(this.playerId)
    const currentStep = this.gameState.getStep()
    if (this.strategy && this.gameState && this.playerId &&
        (this.gameState.playerPriority(this.playerId) || inPromptState)
    ) {
      if (currentStep !== 5) {
        // console.log(`[${this.playerId}] Step is ${STEP_NAMES[currentStep]}, ${inPromptState ? 'in prompt state ' : ''} requesting action`)
        const action = this.strategy.requestAction()
        if (action) {
          this.io.emit('clientAction', action)
        } else {
          console.log('No action returned from request')
        }
      }
    }
  }
}