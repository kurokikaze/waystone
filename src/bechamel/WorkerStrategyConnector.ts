import { ACTION_RESOLVE_PROMPT } from "moonlands"
import { GameState } from "./GameState"
import { PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE, PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE, PROMPT_TYPE_SINGLE_CREATURE_FILTERED } from "./const"
import {Strategy} from './strategies/Strategy'
import { ClientResolvePromptAction } from "../clientProtocol"

const STEP_NAMES: Record<number, string> = {
  0: 'Energize',
  1: 'Power/Relic/Spell (1)',
  2: 'Attack',
  3: 'Creatures',
  4: 'Power/Relic/Spell (2)',
  5: 'Draw',
}

export class WorkerStrategyConnector {
  private playerId?: number
  private gameState?: GameState
  private strategy?: Strategy
  public constructor() {}

  public connect(strategy: Strategy) {
    this.strategy = strategy

    onmessage = (message) => {
      if (message.data.type === 'special/setup' && message.data.playerId > 0) {
        this.playerId = message.data.playerId as number
        this.gameState = new GameState(message.data.state)
        this.gameState.setPlayerId(message.data.playerId)
  
        strategy.setup(this.gameState, this.playerId)
        console.log('We got the game data')
        console.log(`We are player ${this.playerId}`)
        if (this.gameState.playerPriority(this.playerId) || this.gameState.isInPromptState(this.playerId)) {
          this.requestAndSendAction()
        }
      } else {
        const action = message.data;
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
            close();
            // process.exit(0);
            return true;
          }
  
          if (action.type === 'display/priority') {
            if (action.player === this.playerId) {
              this.requestAndSendAction()
            }
          } 
        }
  
      }
    }
  }

  private requestAndSendAction() {
    if (!this.gameState || !this.playerId) {
      return
    }
    const inPromptState = this.gameState.isInPromptState(this.playerId)
    const currentStep = this.gameState.getStep()
    if (this.strategy && this.gameState && this.playerId &&
        (this.gameState.playerPriority(this.playerId) || inPromptState)
    ) {
      if (currentStep !== 5 && this.gameState.playerPriority(this.playerId)) {
        // console.log(`Step is ${STEP_NAMES[currentStep]}, ${inPromptState ? 'in prompt state ' : ''} requesting action`)
        const action = this.strategy.requestAction()
        if (action) {
          console.log(`Thinking is done, chosen action is:`)
          console.dir(action);
          postMessage(action)
        } else {
          console.log('No action returned from request')
        }
      } else if (!this.gameState.playerPriority(this.playerId) && inPromptState) {
        console.log('Prompted outside of our turn.');
        switch(this.gameState.getPromptType()) {
          case PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE: {
            const cards = this.gameState.state.promptParams.cards || [];
            const resultCards = cards?.slice(0, this.gameState.state.promptParams.numberOfCards);
            postMessage({
              type: ACTION_RESOLVE_PROMPT,
              promptType: PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
              zone: this.gameState.state.promptParams.zone,
              zoneOwner: this.gameState.state.promptParams.zoneOwner,
              cards: resultCards.map(({id}) => id),
              generatedBy: this.gameState.state.promptGeneratedBy,
              player: this.playerId,
            });
            break;
          }
          // This is probably a Giant Vulbor
          case PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE: {
            postMessage({
              type: ACTION_RESOLVE_PROMPT,
              promptType: PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE,
              zone: this.gameState.state.promptParams.zone,
              zoneOwner: this.gameState.state.promptParams.zoneOwner,
              cards: [],
              generatedBy: this.gameState.state.promptGeneratedBy,
              player: this.playerId,
            });
            break;
          }
          default:
            console.log(`We are prompted outside of our turn, the prompt type is ${this.gameState.getPromptType()}`)
        }
      } else if (currentStep == 5 && this.gameState.playerPriority(this.playerId) && inPromptState) {
        // This is a special case for Gar trigger
        switch (this.gameState.getPromptType()) {
          case PROMPT_TYPE_SINGLE_CREATURE_FILTERED: {
            const cards = this.gameState.getCardsForFilteredPrompt();
            postMessage({
              type: ACTION_RESOLVE_PROMPT,
              promptType: PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
              zone: this.gameState.state.promptParams.zone,
              zoneOwner: this.gameState.state.promptParams.zoneOwner,
              target: cards[0].id,
              generatedBy: this.gameState.state.promptGeneratedBy,
              player: this.playerId,
            } as ClientResolvePromptAction);
            break;
          }
          default: {
            console.log(`We are prompted on the DRAW step, the prompt type is ${this.gameState.getPromptType()}`)
          }
        }
              
      }
    }
  }
}