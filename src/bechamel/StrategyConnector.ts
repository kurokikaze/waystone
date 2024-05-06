// @ts-nocheck
import { ACTION_PASS } from "moonlands/dist/const"
import { Socket } from "socket.io-client"
import { ClientAction, FromClientPassAction } from "../clientProtocol"
import { GameState } from "./GameState"
import { Strategy } from './strategies/Strategy'
import { SerializedClientState } from "./types"
import { BaseDirectory, writeTextFile } from '@tauri-apps/api/fs'

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
  public constructor(private readonly io: Socket) { }

  public connect(strategy: Strategy) {
    this.strategy = strategy

    this.io.on('gameData', (data: { playerId: number, state: SerializedClientState }) => {
      this.playerId = data.playerId
      console.log('Strategy receives game data')
      this.gameState = new GameState(data.state)
      this.gameState.setPlayerId(data.playerId)

      console.log('Strategy setup')
      strategy.setup(this.gameState, this.playerId)

      if (this.gameState.playerPriority(this.playerId) || this.gameState.isInPromptState(this.playerId)) {
        console.log('Requesting first action')
        this.requestAndSendAction()
      }
    })

    this.io.on('action', (action: ClientAction | { type: 'display/priority', player: number }) => {
      if (this.gameState && this.playerId && action) {
        console.log(`Got action in bot`)
        console.dir(action)
        try {
          this.gameState.update(action)

          /*
          {
              "type": "actions/enter_prompt",
              "promptType": "prompt/payment_source",
              "paymentType": "types/creature",
              "cards": [
                  {
                      "id": "vxDvbFfzbUiysvsLBEtFB"
                  },
                  {
                      "id": "hWMPXqay5rju-XAsUqL1T"
                  }
              ],
              "amount": 5,
              "generatedBy": "rxnIY6xUWtaYeimhvL2Mp",
              "player": 1
          }
          */
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
        }

        if (this.gameState.hasGameEnded()) {
          console.log(this.gameState.getWinner() === this.playerId ? 'We won' : 'We lost');
          this.io.close();

          return true;
        }

        if (action.type === 'display/priority') {
          // console.log('Got priority action')
          if (action.player === this.playerId) {
            this.requestAndSendAction()
          }
        }

        if (action.type == 'display/status') {
          console.log(`Caught status inside the strategy`)
          if (this.isTauri()) {
            writeTextFile(`player_${this.playerId}_state.json`, JSON.stringify(this.gameState.state), { dir: BaseDirectory.AppConfig })
          } else {
            console.dir(this.gameState.state)
          }
        }
      }
    })
  }

  private isTauri() {
    return Boolean(
      typeof window !== 'undefined' &&
      window !== undefined &&
      // @ts-ignore
      window.__TAURI_IPC__ !== undefined
    )
  }
  private requestAndSendAction() {
    if (!this.gameState) {
      this.io.emit('clientAction', { type: ACTION_PASS, player: this.playerId } as FromClientPassAction)
      return;
    }
    const inPromptState = this.gameState.isInPromptState(this.playerId)
    const currentStep = this.gameState.getStep()
    if (this.strategy && this.gameState && this.playerId &&
      (this.gameState.playerPriority(this.playerId) || inPromptState)
    ) {
      if (currentStep !== 5) {
        const action = this.strategy.requestAction()
        if (action) {
          if (this.gameState.isInPromptState(this.playerId) && action.type == ACTION_PASS) {
            console.log(`Here we go, returning pass for the prompt`)
          }
          this.io.emit('clientAction', action)
        } else {
          console.log('No action returned from request')
        }
      } else {
        console.log(`We are here in step ${currentStep}, and cannot request action`)
      }
    }
  }
}