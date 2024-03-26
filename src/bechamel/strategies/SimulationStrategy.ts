import {byName} from 'moonlands/src/cards'
import { AnyEffectType } from 'moonlands/src/types';
import CardInGame from 'moonlands/src/classes/CardInGame';

import {
  PROMPT_TYPE_MAY_ABILITY,
  ACTION_ATTACK,
  ACTION_PASS,
  ACTION_PLAY,
  ACTION_POWER,
  ACTION_RESOLVE_PROMPT,
  TYPE_CREATURE, TYPE_RELIC, PROPERTY_CONTROLLER,
} from "../const";
import {ClientCard, GameState} from "../GameState";
import {Strategy} from './Strategy';
import {createState, getStateScore} from './simulationUtils'
import {HashBuilder} from './HashBuilder';
import {ActionOnHold, C2SActionOnHold, ExpandedClientCard, ProcessedClientCard, SimulationEntity} from '../types';
import {ActionExtractor} from './ActionExtractor';
import { C2SAction, ClientAttackAction, FromClientPassAction, FromClientPlayAction, FromClientPowerAction } from '../../clientProtocol';

const STEP_NAME = {
  ENERGIZE: 0,
  PRS1: 1,
  ATTACK: 2,
  CREATURES: 3,
  PRS2: 4,
  DRAW: 5,
}

const addCardData = (card: any) => ({
  ...card,
  _card: card.card === '<Wild>' ? null : byName(card.card),
})

type Leaf = {
  hash: string
  parentHash: string
  score: number
  actionLog: ActionOnHold[]
  isPrompt: boolean
}


export class SimulationStrategy implements Strategy {
  // public static deckId = '62ed47ae99dd0db04e9f657b' // Online deck
  // public static deckId = '5f60e45e11283f7c98d9259b' // Local deck (Naroom)
  public static deckId = '5f60e45e11283f7c98d9259c' // Local deck (Arderial)
  // public static deckId = '6305ec3aa14ce19348dfd7f9' // Local deck (Underneath/Naroom)

  public static failsafe = 1000

  private waitingTarget?: {
    source: string
    target: string
  }

  private leaves = new Map<string, Leaf>()
  private playerId?: number
  private gameState?: GameState
  private hashBuilder: HashBuilder
  private graph: string = ''

  private actionsOnHold: C2SActionOnHold[] = []
  private StoredTree: SimulationEntity[] = []

  constructor() {
    this.hashBuilder = new HashBuilder()
  }

  public setup(state: GameState, playerId: number) {
    this.gameState = state
    this.playerId = playerId
  }

  private pass(): FromClientPassAction {
    return {
      type: ACTION_PASS,
      player: this.playerId || 0,
    }
  }

  private play(cardId: string, comment?: string): FromClientPlayAction {
    return {
      type: ACTION_PLAY,
      payload: {
        card: {
          id: cardId,
          // @ts-ignore
          comment,
        },
      },

      player: this.playerId || 0,
    }
  }

  private attack(from: string, to: string, add?: string): ClientAttackAction {
    return add ? {
      type: ACTION_ATTACK,
      source: from,
      additionalAttackers: [add],
      target: to,
      player: this.playerId || 2,
    } : {
      type: ACTION_ATTACK,
      source: from,
      target: to,
      player: this.playerId || 2,
    }
  }

  private power(source: string, power: string): FromClientPowerAction {
    return {
      type: ACTION_POWER,
      source,
      power,
      player: this.playerId || 0,
    }
  }

  private resolveTargetPrompt(target: string, type?: string) {
    return {
      type: ACTION_RESOLVE_PROMPT,
      promptType: type || this.gameState?.getPromptType(),
      target,
      player: this.playerId,
    } as C2SAction
  }

  private resolveNumberPrompt(number: number, type?: string): C2SAction {
    return {
      type: ACTION_RESOLVE_PROMPT,
      promptType: type || this.gameState?.getPromptType(),
      number,
      player: this.playerId,
    } as C2SAction
  }

  private resolveCardsPrompt(cards: CardInGame[], type?: string): C2SAction {
    return {
      type: ACTION_RESOLVE_PROMPT,
      promptType: type || this.gameState?.getPromptType(),
      cards: cards.map(({id}) => id),
      player: this.playerId,
    } as C2SAction
  }

  private simulationActionToClientAction(simAction: AnyEffectType): C2SAction {
    switch(simAction.type) {
      case ACTION_PLAY: {
        if ('payload' in simAction) {
          return this.play(simAction.payload.card.id, `Play the card ${simAction.payload.card.card.name}`)
        }
        break;
      }
      case ACTION_POWER: {
        if (simAction.source && simAction.power && 'name' in simAction.power) {
          return this.power(simAction.source.id, simAction.power.name)
        }
        break;
      }
      case ACTION_ATTACK: {
        const add = simAction.additionalAttackers ? simAction.additionalAttackers[0]?.id : ''
        if (simAction.source instanceof CardInGame && simAction.target instanceof CardInGame) {
          return this.attack(simAction.source.id, simAction.target.id, add)
        }
        break;
      }
      case ACTION_RESOLVE_PROMPT: {
        if ('target' in simAction && simAction.target && simAction.target instanceof CardInGame) {
          return this.resolveTargetPrompt(simAction.target.id)
        }
        if ('number' in simAction && typeof simAction.number == 'number') {
          return this.resolveNumberPrompt(simAction.number)
        }
        if ('cards' in simAction && simAction.cards instanceof Array) {
          return this.resolveCardsPrompt(simAction.cards);
        }
        console.log('No transformer for ACTION_RESOLVE_PROMPT action')
        console.dir(simAction)
        break
      }
      case ACTION_PASS: {
        return this.pass()
      }
      default: {
        console.log('No transformer for sim action')
        console.dir(simAction)
        return this.pass()
      }
    }
    return this.pass()
  }

  private simulateAttacksQueue(simulationQueue: SimulationEntity[], initialScore: number, opponentId: number): AnyEffectType {
    const hashes = new Set<string>()
    let bestAction: {score: number, action: AnyEffectType[] } = {
      score: initialScore,
      action: [this.pass()]
    }
    if (!this.playerId) {
      return this.pass()
    }
    // Simulation itself
    let failsafe = SimulationStrategy.failsafe
    let counter = 0
    while (simulationQueue.length && failsafe > 0) {
      failsafe -= 1
      counter += 1
      const workEntity = simulationQueue.pop()
      if (workEntity) {
        try {
          workEntity.sim.update(workEntity.action)
        } catch(e: any) {
          debugger;
          console.error('Error applying action')
          if ('payload' in workEntity.action) {
            console.dir(workEntity.action.payload.card);
          }
          console.dir(workEntity)
          console.dir(e.stack)
          throw new Error('Away!')
        }
        const score = getStateScore(workEntity.sim, this.playerId, opponentId)
        if (score > bestAction.score) {
          bestAction.score = score
          bestAction.action = workEntity?.actionLog.map(({action}) => action) || []
        }
        const hash = this.hashBuilder.makeHash(workEntity.sim)
        if (hashes.has(hash)) {
          continue
        }

        hashes.add(hash)
        simulationQueue.push(...ActionExtractor.extractActions(workEntity.sim, this.playerId, opponentId, workEntity.actionLog, hash, this.hashBuilder))
      }
    }

    return bestAction.action[0]
  }

  private actionToLabel(action: Record<string, any>): string {
    switch (action.type) {
      case ACTION_PLAY: {
        return `PLAY ${action.payload.card.card.name}`
      }
      case ACTION_POWER: {
        return `POWER ${action.source.card.name} ${action.power.name}`
      }
      case ACTION_RESOLVE_PROMPT: {
        return `RESOLVE_PROMPT ${action.target.card.name || action.number}`
      }
      case ACTION_ATTACK: {
        return `ATTACK ${action.source.card.name} -> ${action.target.card.name}`
      }
      case ACTION_PASS: {
        return 'PASS'
      }
    }
    return `Unknown action: ${action.type}`
  }

  private simulateActionsQueue(simulationQueue: SimulationEntity[], initialScore: number, opponentId: number): ActionOnHold[] {
    const hashes = new Set<string>()
    if (!this.playerId) {
      return [{
        action: this.pass(),
        hash: '*',
    }]
    }
    // Simulation itself
    let counter = 0
    
    this.leaves.clear()

    while (simulationQueue.length && counter <= SimulationStrategy.failsafe) {
      counter += 1
      const workEntity = simulationQueue.shift()
      if (workEntity && workEntity.action) {
        try {
          workEntity.sim.update(workEntity.action)
        } catch(e: any) {
          debugger;
          console.log('Error applying action')
          console.dir(workEntity.action)
          console.log(`Message: ${e.message}`)
          console.dir(workEntity.sim.state.promptType)
          console.dir(workEntity.sim.state.promptPlayer)
          console.log(`Controller: ${workEntity.sim.modifyByStaticAbilities(workEntity.action.target, PROPERTY_CONTROLLER)}`)
          console.dir(workEntity.actionLog)
          console.dir(workEntity.sim.state.continuousEffects);
          console.dir(e.stack)
        }
        const score = getStateScore(workEntity.sim, this.playerId, opponentId)
        const hash = this.hashBuilder.makeHash(workEntity.sim)
        try {
          this.graph = this.graph + `  "${workEntity.previousHash}" -> "${hash}" [label="${this.actionToLabel(workEntity.action)}"]\n`
        } catch (_e) {}
        if (hashes.has(hash)) {
          continue
        }

        hashes.add(hash)
        this.leaves.delete(workEntity.previousHash)
        this.leaves.set(hash, {
          hash,
          parentHash: hash,
          score,
          actionLog: workEntity.actionLog,
          isPrompt: Boolean(workEntity.sim.state.prompt),
        })
        simulationQueue.push(...ActionExtractor.extractActions(workEntity.sim, this.playerId, opponentId, workEntity.actionLog, hash, this.hashBuilder))
        // delete workEntity.sim;
      }
    }

    let bestAction: {score: number, actions: ActionOnHold[] } = {
      score: initialScore,
      actions: []
    }

    this.leaves.forEach((value: Leaf) => {
      if (!value.isPrompt && (value.score > bestAction.score)|| (value.score == bestAction.score && value.actionLog.length < bestAction.actions.length)) {
        bestAction.score = value.score
        bestAction.actions = value.actionLog
      }
    })

    // console.log(`
    // digraph sim {
    //   ${this.graph}
    // }
    // `)
    // console.log(`Done ${counter} power simulations. Leaves reached: ${this.leaves.size}`)
    // console.log(`Best found score is ${bestAction.score} (initial is ${initialScore})`)
    return bestAction.actions
  }

  private shouldClearHeldActions(): boolean {
    if (!this.actionsOnHold.length) return false
    if (!this.gameState) return false

    const {action} = this.actionsOnHold[0]
    if (this.gameState.getStep() === STEP_NAME.CREATURES) {
      const playableCards = this.gameState.getPlayableCards()
      const ids = new Set(playableCards.map(({id}) => id))
      if (
        action.type === ACTION_PLAY &&
        'payload' in action &&
        !ids.has(action.payload.card.id)
      ) {
        console.log(`Failed summon, passing. Dropping ${this.actionsOnHold.length} actions on hold.`)
        return true;
      }
    } else if (this.gameState.getStep() === STEP_NAME.PRS1 || this.gameState.getStep() === STEP_NAME.PRS2) {
      const creaturesRelicsAndMagi: (ProcessedClientCard|ClientCard)[] = [
        ...this.gameState.getMyCreaturesInPlay(),
        ...this.gameState.getMyRelicsInPlay(),
      ]
      const myMagi = this.gameState.getMyMagi()
      if (myMagi) {
        creaturesRelicsAndMagi.push(myMagi)
      }
      const ids = new Set(creaturesRelicsAndMagi.map(({id}) => id))
      if (
        action.type === ACTION_POWER &&
        !ids.has(action.source)
      ) {
        console.log(`Failed power activation, no card with id ${action.source} (power to be activated is ${action.power}). Dropping ${this.actionsOnHold.length} actions on hold.`)
        return true;
      }
    } else if (this.gameState.getStep() === STEP_NAME.ATTACK) {
      if (!(action.type === ACTION_PASS || action.type === ACTION_ATTACK)) {
        console.log('Non-attack action in the attack step')
        return true
      }
    }

    if (this.gameState.isInMyPromptState() && action.type !== ACTION_RESOLVE_PROMPT) {
      console.log('Non-prompt action in the prompt state')
      return true
    }

    return false
  }

  public requestAction(): C2SAction {
    if (this.shouldClearHeldActions()) {
      this.actionsOnHold = []
    }

    if (!this.gameState) {
      return this.pass()
    }

    if (this.actionsOnHold.length) {
      const {action, hash} = this.actionsOnHold.shift()!

      const testSim = createState(
        this.gameState,
        this.playerId || 2,
        this.gameState.getOpponentId(),
      )

      const checkHash = this.hashBuilder.makeHash(testSim);

      // If we are passing at the creatures step, clear the actions on hold
      if (action && action.type === ACTION_PASS && this.gameState.getStep() === STEP_NAME.CREATURES) {
        this.actionsOnHold = []
      }
      // if (checkHash !== hash) {
      //   console.error(`Hashes do not match. Probably something strange has happened.`)
      //   console.error(`Action hash: ${hash}, state hash: ${checkHash}`);
      // }

      return action
    }

    if (this.gameState && this.playerId) {
      if (this.gameState.waitingForCardSelection()) {
        return {
          type: ACTION_RESOLVE_PROMPT,
          // promptType: PROMPT_TYPE_CHOOSE_CARDS,
          cards: this.gameState.getStartingCards(),
          player: this.playerId,
        }
      }

      if (this.gameState.isInPromptState(this.playerId) && this.gameState.getPromptType() === PROMPT_TYPE_MAY_ABILITY) {
        return {
          type: ACTION_RESOLVE_PROMPT,
          // promptType: PROMPT_TYPE_MAY_ABILITY,
          useEffect: false,
          player: this.playerId,
        }
      }

      if (this.waitingTarget && this.gameState.waitingForTarget(this.waitingTarget.source, this.playerId)) {
        return this.resolveTargetPrompt(this.waitingTarget.target)
      }

      if (this.gameState.playerPriority(this.playerId)) {
        const step = this.gameState.getStep()
        switch(step) {
          case STEP_NAME.PRS1: 
          case STEP_NAME.PRS2: {
            const playable = this.gameState.getPlayableCards()
              .map(addCardData)
              .filter((card: any) => card._card.type === TYPE_RELIC)
            const relics = this.gameState.getMyRelicsInPlay().map(card => card._card?.name)

            if (playable.some(card => !relics.includes(card._card.name))) {
              const playableRelic = playable.find(card => !relics.includes(card._card.name))
              if (playableRelic) {
                if (!playableRelic.id) {
                  console.error(`Non-playable relic chosen somehow`);
                }
                return this.play(playableRelic?.id)
              }
            }

            // We need to preserve opponent id because some static effects depend on it
            const TEMPORARY_OPPONENT_ID = this.gameState.getOpponentId();

            this.graph = '';

            const outerSim = createState(
              this.gameState,
              this.playerId || 2,
              TEMPORARY_OPPONENT_ID,
            )

            const hash = this.hashBuilder.makeHash(outerSim)
            const initialScore = getStateScore(outerSim, this.playerId, TEMPORARY_OPPONENT_ID)

            const simulationQueue: SimulationEntity[] = ActionExtractor.extractActions(outerSim, this.playerId, TEMPORARY_OPPONENT_ID, [], hash, this.hashBuilder)
            const bestActions = this.simulateActionsQueue(simulationQueue, initialScore, TEMPORARY_OPPONENT_ID)
            const finalHash = this.hashBuilder.makeHash(outerSim)
            if (finalHash !== hash) {
              console.log(`Change leak! hashes mismatch: ${hash} => ${finalHash}`)
            }

            if (!bestActions[0]) {
              return this.pass()
            }

            this.actionsOnHold = bestActions.slice(1).filter(({action}) =>
              (action.type === ACTION_PLAY && 'payload' in action && action.payload.player === this.playerId) ||
              ('player' in action && action.player === this.playerId)
            ).map(({action, hash}) => ({
              action: this.simulationActionToClientAction(action),
              hash,
            }));

            // console.log('Saving the graph data as ' + finalHash);
            // console.log(btoa(this.graph));
            // if (this.actionsOnHold.length) {
              // console.log(`Stored ${this.actionsOnHold.length} actions on hold`)
              // console.dir(this.actionsOnHold)
            // }
            const bestAction = bestActions[0]
            // if (bestAction.type === ACTION_PLAY) {
            //   // console.error(`Playing the card`);
            //   // console.dir(bestAction.payload.card);
            // }
            return this.simulationActionToClientAction(bestAction.action)
          }

          case STEP_NAME.CREATURES: {
            const myMagiCard = this.gameState.getMyMagi()
            if (!myMagiCard) {
              return this.pass()
            }
            const magiBaseCard = byName(myMagiCard.card)
            if (!magiBaseCard) {
              return this.pass()
            }
            const myMagi: ExpandedClientCard = {
              ...myMagiCard,
              _card: magiBaseCard
            }
            const availableEnergy = myMagi.data.energy
            const playable = this.gameState.getPlayableCards()
              .map(addCardData)
              .filter(card => {
                const regionTax = (myMagi._card.region === card._card.region) ? 0 : 1
                return card._card.type === TYPE_CREATURE && card._card.cost && (card._card.cost + regionTax) <= availableEnergy
              })
            if (playable.length) {
              const playableCreature = playable[0]
              return this.play(playableCreature.id)
            }
            return this.pass()
          }
          case STEP_NAME.ATTACK: {
            const opponentMagi = this.gameState.getOpponentMagi()

            if (opponentMagi) {
              const TEMPORARY_OPPONENT_ID = this.gameState.getOpponentId();
              const myCreatures = this.gameState.getMyCreaturesInPlay()

              if (myCreatures.length == 0) {
                return this.pass()
              }

              const outerSim = createState(
                this.gameState, 
                this.playerId || 2,
                TEMPORARY_OPPONENT_ID,
              )

              const hash = this.hashBuilder.makeHash(outerSim)
              const simulationQueue = ActionExtractor.extractActions(outerSim, this.playerId, TEMPORARY_OPPONENT_ID, [], hash, this.hashBuilder)

              const initialScore = getStateScore(outerSim, this.playerId, TEMPORARY_OPPONENT_ID)

              const bestAction = this.simulateAttacksQueue(simulationQueue, initialScore, TEMPORARY_OPPONENT_ID)
              if (!bestAction) {
                console.error(`Some strange actions encountered`);
                console.dir(bestAction);
              }
              if (bestAction.type === ACTION_ATTACK || bestAction.type === ACTION_RESOLVE_PROMPT) {
                return this.simulationActionToClientAction(bestAction)
              }
            }
            return this.pass()
          }
          default:
            return this.pass()
        }
      }
    }
    return this.pass()
  }
}
