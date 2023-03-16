import {Socket} from "socket.io-client"
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

// export const debounce = <F extends (...args: any[]) => any>(func: F, waitFor: number) => {
//   let timeout: NodeJS.Timeout

//   return (...args: Parameters<F>): Promise<ReturnType<F>> =>
//     new Promise(resolve => {
//       if (timeout) {
//         clearTimeout(timeout)
//       }

//       timeout = setTimeout(() => resolve(func(...args)), waitFor)
//     })
// }

export class StrategyConnector {
  private playerId?: number
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
      console.log('We got the game data')
      if (this.gameState.playerPriority(this.playerId) || this.gameState.isInPromptState(this.playerId)) {
        this.requestAndSendAction()
      }
    })

    this.io.on('action', action => {
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
          process.exit(0);
          return true;
        }

        if (action.type === 'display/priority') {
          if (action.player === this.playerId) {
            this.requestAndSendAction()
          }
        } 
      }
    })
  }

  private requestAndSendAction() {
    const inPromptState = this.gameState.isInPromptState(this.playerId)
    const currentStep = this.gameState.getStep()
    if (this.strategy && this.gameState && this.playerId &&
        (this.gameState.playerPriority(this.playerId) || inPromptState)
    ) {
      if (currentStep !== 5) {
        console.log(`Step is ${STEP_NAMES[currentStep]}, ${inPromptState ? 'in prompt state ' : ''} requesting action`)
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