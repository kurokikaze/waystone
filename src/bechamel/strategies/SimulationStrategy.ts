import { byName } from 'moonlands/dist/esm/cards'
import { AnyEffectType } from 'moonlands/dist/esm/types';
import CardInGame from 'moonlands/dist/esm/classes/CardInGame';

import {
  PROMPT_TYPE_MAY_ABILITY,
  ACTION_ATTACK,
  ACTION_PASS,
  ACTION_PLAY,
  ACTION_POWER,
  ACTION_RESOLVE_PROMPT,
  TYPE_CREATURE, TYPE_RELIC,
  PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE,
} from "../const";
import { ClientCard, GameState } from "../GameState";
import { Strategy } from './Strategy';
import { createState, getStateScore } from './simulationUtils'
import { HashBuilder } from './HashBuilder';
import { ActionOnHold, C2SActionOnHold, ExpandedClientCard, ProcessedClientCard, SerializedClientState, SimulationEntity, StateRepresentation } from '../types';
import { ActionExtractor } from './ActionExtractor';
import { C2SAction, ClientAttackAction, ClientResolvePromptAction, FromClientPassAction, FromClientPlayAction, FromClientPowerAction } from '../../clientProtocol';
import { PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE, PROMPT_TYPE_PAYMENT_SOURCE, ZONE_TYPE_IN_PLAY } from 'moonlands/dist/esm/const';
import { SimulationQueue } from './SimulationQueue';

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

type HistoryEntry = {
  state: string
  action: C2SAction
  fromHold: boolean
}

export class SimulationStrategy implements Strategy {
  // public static deckId = '62ed47ae99dd0db04e9f657b' // Online deck
  // public static deckId = '5f60e45e11283f7c98d9259b' // Local deck (Naroom)
  public static deckId = '5f60e45e11283f7c98d9259c' // Local deck (Arderial)
  // public static deckId = '6305ec3aa14ce19348dfd7f9' // Local deck (Underneath/Naroom)

  public static failsafe = 500

  private waitingTarget?: {
    source: string
    target: string
  }

  private leaves = new Map<string, Leaf>()
  private playerId?: number
  private gameState?: GameState
  private hashBuilder: HashBuilder

  private history: HistoryEntry[] = []
  private historyLength = 15
  private actionCameFromHold = false

  protected graph: string = ''

  protected actionsOnHold: C2SActionOnHold[] = []
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

  private resolveTargetPrompt(target: string, targetName?: string) {
    return {
      type: ACTION_RESOLVE_PROMPT,
      promptType: this.gameState?.getPromptType(),
      target,
      ...(targetName ? { targetName } : {}),
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

  private resolveCardsPrompt(cards: CardInGame[], type: string, zone: string, zoneOwner: number): C2SAction {
    return {
      type: ACTION_RESOLVE_PROMPT,
      promptType: type || this.gameState?.getPromptType(),
      zone,
      zoneOwner,
      cards: cards.map(({ id }) => id),
      // This is needed so we know which cards we selected if ids change (from inside the sim to the outside)
      cardNames: cards.map(({ card }) => card),
      player: this.playerId,
    } as C2SAction
  }

  private simulationActionToClientAction(simAction: AnyEffectType): C2SAction {
    switch (simAction.type) {
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
          // console.log(`SimAction path`)
          return this.resolveTargetPrompt(simAction.target.id, simAction.target.card.name)
        }
        if ('number' in simAction && typeof simAction.number == 'number') {
          return this.resolveNumberPrompt(simAction.number)
        }
        if ('cards' in simAction && simAction.cards instanceof Array) {
          // @ts-ignore
          return this.resolveCardsPrompt(simAction.cards, '', simAction.zone, simAction.zoneOwner);
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

  private simulateAttacksQueue(simulationQueue: SimulationQueue, initialScore: number, opponentId: number): AnyEffectType {
    const hashes = new Set<string>()
    let bestAction: { score: number, action: AnyEffectType[] } = {
      score: initialScore,
      action: [this.pass()]
    }
    if (!this.playerId) {
      return this.pass()
    }
    // Simulation itself
    let failsafe = SimulationStrategy.failsafe
    let counter = 0
    while (simulationQueue.hasItems() && failsafe > 0) {
      failsafe -= 1
      counter += 1
      const workEntity = simulationQueue.shift()
      if (workEntity) {
        try {
          workEntity.sim.update(workEntity.action)
        } catch (e: any) {
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
          bestAction.action = workEntity?.actionLog.map(({ action }) => action) || []
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
        if ('target' in action && 'card' in action.target) {
          return `RESOLVE_PROMPT ${action.target.card.name}`
        }
        if ('number' in action) {
          return `RESOLVE_PROMPT ${action.number}`
        }
        if ('useEffect' in action) {
          return `RESOLVE_PROMPT ${action.useEffect ? '' : 'don\'t '}use effect (player ${action.player})`
        }
        return `RESOLVE_PROMPT other (player ${action.player})`
      }
      case ACTION_ATTACK: {
        return `ATTACK ${action.source.card.name} -> ${action.target.card.name} (player ${action.player})`
      }
      case ACTION_PASS: {
        return 'PASS'
      }
    }
    return `Unknown action: ${action.type}`
  }

  private simulateActionsQueue(simulationQueue: SimulationQueue, initialScore: number, opponentId: number): ActionOnHold[] {
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

    while (simulationQueue.hasItems() && counter <= SimulationStrategy.failsafe) {
      counter += 1
      const workEntity = simulationQueue.shift()
      if (workEntity && workEntity.action) {
        try {
          workEntity.sim.update(workEntity.action)
        } catch (e: any) {
          console.log('Error applying action')
          console.dir(workEntity.action)
          console.log(`Message: ${e.message}`)
          console.dir(e.stack)
        }
        const score = getStateScore(workEntity.sim, this.playerId, opponentId)
        const hash = this.hashBuilder.makeHash(workEntity.sim)
        try {
          this.graph = this.graph + `  "${workEntity.previousHash}" -> "${hash}" [label="${this.actionToLabel(workEntity.action)}"]\n`
        } catch (_e) {
          console.error('Error generating label perhaps')
          console.dir(_e)
        }
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

    let bestAction: { score: number, actions: ActionOnHold[] } = {
      score: initialScore,
      actions: []
    }

    this.leaves.forEach((value: Leaf) => {
      if (!value.isPrompt && (value.score > bestAction.score) || (value.score == bestAction.score && value.actionLog.length < bestAction.actions.length)) {
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

  public getHeldActions() {
    return this.actionsOnHold
  }

  private shouldClearHeldActions(): boolean {
    if (!this.actionsOnHold.length) return false
    if (!this.gameState) return false

    const { action } = this.actionsOnHold[0]
    if (this.gameState.getStep() === STEP_NAME.CREATURES) {
      const playableCards = this.gameState.getPlayableCards()
      const ids = new Set(playableCards.map(({ id }) => id))
      if (
        action.type === ACTION_PLAY &&
        'payload' in action &&
        !ids.has(action.payload.card.id)
      ) {
        console.log(`Failed summon, passing. Dropping ${this.actionsOnHold.length} actions on hold.`)
        return true;
      }
    } else if (this.gameState.getStep() === STEP_NAME.PRS1 || this.gameState.getStep() === STEP_NAME.PRS2) {
      const creaturesRelicsAndMagi: (ProcessedClientCard | ClientCard)[] = [
        ...this.gameState.getMyCreaturesInPlay(),
        ...this.gameState.getMyRelicsInPlay(),
      ]
      const myMagi = this.gameState.getMyMagi()
      if (myMagi) {
        creaturesRelicsAndMagi.push(myMagi)
      }
      const ids = new Set(creaturesRelicsAndMagi.map(({ id }) => id))
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

      if (action.type === ACTION_ATTACK && !this.gameState.getMyCreaturesInPlay().some(pcc => pcc.id == action.source)) {
        console.log(`Unknown attacker, probably killed by a unforeseen effect?`)
        return true;
      }
    }

    if (this.gameState.isInMyPromptState() && action.type !== ACTION_RESOLVE_PROMPT) {
      console.log('Non-prompt action in the prompt state (simulation)')
      console.dir(action)
      console.dir(this.actionsOnHold)
      return true
    }

    return false
  }


  private fixTargetPromptResolution(action: C2SAction & { targetName: string }): C2SAction {
    const promptAvailableCards = this.gameState?.state.promptParams.cards?.map(({ id }) => id);
    console.log(`Searching for the ${action.targetName}`)
    if ('target' in action && typeof action.target == 'string' && promptAvailableCards) {
      const cards = this.gameState?.getMyCreaturesInPlay()
      for (const cardId of promptAvailableCards) {
        const card = cards?.find(card => card.id === cardId);
        if (card && card.card.name === action.targetName) {
          return {
            ...action,
            target: card.id,
          } as C2SAction
        }
      }
    }
    console.log(`Fixing the target prompt failed`)
    return action;
  }

  private fixCardPromptResolution(action: C2SAction): C2SAction {
    const promptAvailableCards = this.gameState?.state.promptParams.cards?.map(({ id }) => id);

    // @ts-ignore
    if ('cards' in action && action.cards && action.cards instanceof Array && action.cards.some((card: string) => !promptAvailableCards?.includes(card as unknown as string))) {
      const availableCardPairs: Record<string, string[]> = {}
      // console.dir(this.gameState?.state.promptParams.cards)
      for (let card of this.gameState?.state.promptParams.cards!) {
        if (!(card.card in availableCardPairs)) {
          availableCardPairs[card.card] = []
        }
        availableCardPairs[card.card].push(card.id)
      }

      const newCards: string[] = []
      // @ts-ignore
      for (const cardName of action.cardNames) {
        if (!(cardName.name in availableCardPairs) || availableCardPairs[cardName.name].length == 0) {
          // console.dir(action)
          // console.dir(cardName)
          throw new Error(`Cannot find ${cardName.name} in the prompt zone`)
        }
        const newId = availableCardPairs[cardName.name].pop()!
        newCards.push(newId)
      }

      return {
        ...action,
        cards: newCards,
      } as C2SAction;
    }

    return action;
  }

  public requestAction(): C2SAction {
    const action = this.generateAction();
    if (this.gameState) {
      const historyEntry: HistoryEntry = {
        state: JSON.stringify(this.gameState.state),
        action,
        fromHold: this.actionCameFromHold,
      }
      this.history.push(historyEntry)
      if (this.history.length > this.historyLength) {
        this.history = this.history.slice(0, this.historyLength)
      }
    }
    return action;
  }

  public requestHistory(): HistoryEntry[] {
    return this.history;
  }

  private generateAction(): C2SAction {
    this.actionCameFromHold = false

    if (this.shouldClearHeldActions()) {
      this.actionsOnHold = []
    }

    if (!this.gameState) {
      return this.pass()
    }

    if (this.actionsOnHold.length) {
      this.actionCameFromHold = true
      const { action, hash } = this.actionsOnHold.shift()!

      // const testSim = createState(
      //   this.gameState,
      //   this.playerId || 2,
      //   this.gameState.getOpponentId(),
      // )

      // const checkHash = this.hashBuilder.makeHash(testSim);

      // If we are passing at the creatures step, clear the actions on hold
      if (action && action.type === ACTION_PASS && this.gameState.getStep() === STEP_NAME.CREATURES) {
        this.actionsOnHold = []
      }
      // if (checkHash !== hash) {
      //   console.error(`Hashes do not match. Probably something strange has happened.`)
      //   console.error(`Action hash: ${hash}, state hash: ${checkHash}`);
      // }

      if (action.type == ACTION_RESOLVE_PROMPT && (
        this.gameState.getPromptType() == PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE
      )) {
        return this.fixCardPromptResolution(action)
      }

      if (action.type == ACTION_RESOLVE_PROMPT &&
        this.gameState.getPromptType() == PROMPT_TYPE_PAYMENT_SOURCE &&
        !this.gameState.state.promptParams.cards?.some(({ id }) => id == action.target)
      ) {
        // console.log(`Target is ${action.target}`)
        // console.dir(this.gameState.state.promptParams.cards)
        // const cardIsIn = this.gameState.state.promptParams.cards?.some(card => card.card == action.target)
        return this.fixTargetPromptResolution(action as ClientResolvePromptAction & { targetName: string })
      }
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

      if (this.gameState.waitingForPaymentSourceSelection()) {
        return {
          type: ACTION_RESOLVE_PROMPT,
          // promptType: PROMPT_TYPE_CHOOSE_CARDS,
          target: this.gameState.getPaymentSourceCards()[0],
          player: this.playerId,
        }
      }

      if (this.gameState.isInPromptState(this.playerId) && this.gameState.getPromptType() === PROMPT_TYPE_MAY_ABILITY) {
        const myMagi = this.gameState.getMyMagi()
        if (myMagi.card === 'Stradus' && this.gameState.state.promptGeneratedBy === myMagi.id) {
          return {
            type: ACTION_RESOLVE_PROMPT,
            // promptType: PROMPT_TYPE_MAY_ABILITY,
            useEffect: true,
            player: this.playerId,
          }
        }
        return {
          type: ACTION_RESOLVE_PROMPT,
          // promptType: PROMPT_TYPE_MAY_ABILITY,
          useEffect: false,
          player: this.playerId,
        }
      }

      if (this.waitingTarget && this.gameState.waitingForTarget(this.waitingTarget.source, this.playerId)) {
        // console.log(`Waiting for target resolve path`)
        // console.dir(this.waitingTarget)
        return this.resolveTargetPrompt(this.waitingTarget.target, 'waitingTarget')
      }

      if (this.gameState.playerPriority(this.playerId)) {
        const step = this.gameState.getStep()
        switch (step) {
          case STEP_NAME.ENERGIZE: {
            //   if (this.gameState.isInMyPromptState()) {
            //     if (this.gameState.getPromptType() == PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE) {
            //       console.log(`Game makes us choose N cards from the zone on Energize step`)
            //       console.dir(this.gameState.state.promptParams)
            //     }
            //   }
          }
          case STEP_NAME.PRS1:
          case STEP_NAME.PRS2: {

            if (this.gameState.isInMyPromptState()) {
              if (
                this.gameState.getPromptType() === PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE ||
                this.gameState.getPromptType() === PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE
              ) {
                return this.resolveChooseCardsPrompt()
              }
              // console.log(`Prompt state without previous action: ${this.gameState.getPromptType()}`)
            }
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

            const simulationQueue = new SimulationQueue();
            simulationQueue.addFromSim(outerSim, this.playerId, TEMPORARY_OPPONENT_ID, [], hash, this.hashBuilder)
            //const simulationQueue: SimulationEntity[] = ActionExtractor.extractActions(outerSim, this.playerId, TEMPORARY_OPPONENT_ID, [], hash, this.hashBuilder)
            const bestActions = this.simulateActionsQueue(simulationQueue, initialScore, TEMPORARY_OPPONENT_ID)
            const finalHash = this.hashBuilder.makeHash(outerSim)
            if (finalHash !== hash) {
              console.log(`Change leak! hashes mismatch: ${hash} => ${finalHash}`)
            }

            if (!bestActions[0]) {
              return this.pass()
            }

            this.actionsOnHold = bestActions.slice(1).filter(({ action }) =>
              (action.type === ACTION_PLAY && 'payload' in action && action.payload.player === this.playerId) ||
              ('player' in action && action.player === this.playerId)
            ).map(({ action, hash }) => ({
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
              const simulationQueue = new SimulationQueue();
              simulationQueue.addFromSim(outerSim, this.playerId, TEMPORARY_OPPONENT_ID, [], hash, this.hashBuilder)
              // const simulationQueue = ActionExtractor.extractActions(outerSim, this.playerId, TEMPORARY_OPPONENT_ID, [], hash, this.hashBuilder)

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
            // We get here if we accidentally (yeah) killed opposing Adis. It's ATTACK step, we're in the prompt state.
            // Or it's someone like Gum-Gum.
            if (this.gameState.isInMyPromptState()) {
              if (this.gameState.getPromptType() == PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE) {
                return this.resolveChooseCardsPrompt()
              }
              throw new Error(`Unexpected prompt type in ATTACK step: ${this.gameState.getPromptType()}`);
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

  resolveChooseCardsPrompt() {
    if (!this.gameState) {
      throw new Error('Trying to resolve prompt without gameState present')
    }
    const availableCards = this.gameState.state.promptParams.cards || []
    if (this.gameState.getPromptType() == PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE) {
      if (availableCards.length == 0) {
        throw new Error('Cannot resolve PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE with 0 cards (can I?)')
      }
    }
    // The conversion to CardInGame is OK because resolveCardPrompt only cares about card ids
    return this.resolveCardsPrompt(
      availableCards.slice(0, this.gameState.state.promptParams.numberOfCards || 0)
        .map(card => card as unknown as CardInGame),
      this.gameState.state.promptType || '',
      this.gameState.state.promptParams.zone || ZONE_TYPE_IN_PLAY,
      this.gameState.state.promptParams.zoneOwner || 0,
    )
  }
}
