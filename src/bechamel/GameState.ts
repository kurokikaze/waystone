import {
  ACTION_TIME_NOTIFICATION,
  ACTION_ATTACK,
  ACTION_EFFECT,
  ACTION_ENTER_PROMPT,
  ACTION_PASS,
  ACTION_PLAYER_WINS,
  ACTION_POWER,
  ACTION_RESOLVE_PROMPT,
  PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE,
  PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
  PROMPT_TYPE_NUMBER,
  PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
  TYPE_CREATURE,
  TYPE_MAGI,
  TYPE_RELIC,
  TYPE_SPELL,
  EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
  EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
  EFFECT_TYPE_CARD_MOVED_BETWEEN_ZONES,
  EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT,
  EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
  EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
  EFFECT_TYPE_END_OF_TURN,
  EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE,
  EFFECT_TYPE_MOVE_ENERGY,
  EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES,
  EFFECT_TYPE_START_OF_TURN,

  PROMPT_TYPE_CHOOSE_CARDS,
  ZONE_TYPE_IN_PLAY,
  ZONE_TYPE_ACTIVE_MAGI,
  ZONE_TYPE_DECK,
  ZONE_TYPE_DEFEATED_MAGI,
  ZONE_TYPE_DISCARD,
  ZONE_TYPE_HAND,
  ZONE_TYPE_MAGI_PILE,
  PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE,
} from './const'
import {byName} from 'moonlands/src/cards'
import {ExpandedClientCard, HiddenCard, ProcessedClientCard, SerializedClientState, StateRepresentation} from './types'
import { ClientAction, HiddenConvertedCard } from '../clientProtocol'
import { ConvertedCard } from 'moonlands/dist/classes/CardInGame'
import { EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI, EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE, REGION_UNIVERSAL, EFFECT_TYPE_DISCARD_RESHUFFLED } from 'moonlands/dist/const'
import {getCardDetails} from './common'
import { tickDownContinuousEffects } from '../reducers/utils'
import { State } from '../types'

const nanoid = () => 'new_nanoid'
const zonesToConsiderForStaticAbilities = new Set(['inPlay', 'opponentInPlay', 'playerActiveMagi', 'opponentActiveMagi'])

export interface SimplifiedCard {
  name: string,
  type: typeof TYPE_CREATURE | typeof TYPE_MAGI | typeof TYPE_RELIC | typeof TYPE_SPELL,
  region: 'regions/naroom',
  cost: null | number,
  data: Object,
}

export type ClientCard = {
  card: string,
  id: string,
  data: {
    energy: number,
    controller: number,
    attacked: number,
    actionsUsed: string[],
    energyLostThisTurn: number,
    defeatedCreature: boolean,
    hasAttacked: boolean,
    wasAttacked: boolean,
    staticAbilities?: string[]
  },
  owner: number
}

type Card = {
  _card: SimplifiedCard,
  card: string,
  id: string,
  data: {
    energy: number,
    controller: number,
    attacked: number,
    actionsUsed: string[],
    energyLostThisTurn: number,
    defeatedCreature: boolean,
    hasAttacked: boolean,
    wasAttacked: boolean,
    staticAbilities?: string[]
  },
  owner: number
}

export const findInPlay = (state: StateRepresentation, id: string) => {
	const cardPlayerInPlay = state.zones.inPlay.find(card => card.id === id);
	if (cardPlayerInPlay) return cardPlayerInPlay;

	const cardPlayerMagi = state.zones.playerActiveMagi.find(card => card.id === id);
	if (cardPlayerMagi) return cardPlayerMagi;

	const cardOpponentMagi = state.zones.opponentActiveMagi.find(card => card.id === id);
	if (cardOpponentMagi) return cardOpponentMagi;

	return null;
};

const clientZoneNames = {
	[ZONE_TYPE_DECK as string]: 'Deck',
	[ZONE_TYPE_HAND as string]: 'Hand',
	[ZONE_TYPE_DISCARD as string]: 'Discard',
	[ZONE_TYPE_ACTIVE_MAGI as string]: 'ActiveMagi',
	[ZONE_TYPE_MAGI_PILE as string]: 'MagiPile',
	[ZONE_TYPE_DEFEATED_MAGI as string]: 'DefeatedMagi',
	[ZONE_TYPE_IN_PLAY as string]: 'InPlay',
};

export class GameState {
  playerId: number = 0
  state: StateRepresentation
  public constructor(serializedState: SerializedClientState) {
    this.state = {
      // continuousEffects: [],
      staticAbilities: [],
      energyPrompt: false,
      turnTimer: false,
      turnSecondsLeft: 0,
      promptAvailableCards: [],
      ...serializedState,
    }
  }

  public setPlayerId(playerId: number) {
    this.playerId = playerId
  }

  public playerPriority(playerId: number): boolean {
    return this.state.activePlayer === playerId
  }

  public waitingForCardSelection(): boolean {
    return (this.state.prompt && this.state.promptType === PROMPT_TYPE_CHOOSE_CARDS)
  }

  public isInPromptState(playerId: number): boolean {
    return (this.state.prompt && this.state.promptPlayer === playerId)
  }

  public waitingForTarget(byId: string, playerId: number): boolean {
    return this.isInPromptState(playerId) && this.state.promptGeneratedBy === byId
  }

  public getPromptType() {
    return this.state.prompt ? this.state.promptType : null
  }

  public getStartingCards(): string[] {
    if (!this.waitingForCardSelection()) { return [] }

    return this.state.promptParams.availableCards || []
  }

  public update(action: any) {
    this.state = this.reducer(this.state, action)
  }

  public getStep() {
    return this.state.step
  }

  public getPlayableCards(): ClientCard[] {
    const magi = this.getMyMagi()
    const magiCard = byName(magi.card);
    if (!magiCard) return [];
    return this.state.zones.playerHand.filter(card => {
      const cardData = byName(card.card);
      if (!cardData) return false;
      if (cardData.type === TYPE_RELIC && (cardData.region !== magiCard.region) && cardData.region !== REGION_UNIVERSAL) return false;
      if (typeof cardData.cost !== 'number') return true;
      const regionTax = (magiCard.region === cardData.region) ? 0 : 1;
      return cardData.cost + regionTax <= magi.data.energy; 
    })
  }

  public getMyRelicsInPlay(): ProcessedClientCard[] {
    const realState = getCardDetails(this.state)
    return realState.inPlay
      .map(card => ({
        ...card,
        _card: card.card,
      }))
      .filter<ProcessedClientCard>((card): card is ProcessedClientCard => card._card?.type === TYPE_RELIC && card.data.controller === this.playerId)
  }

  public getMyCreaturesInPlay(): ProcessedClientCard[] {
    const realState = getCardDetails(this.state)
    // const processedCards: ProcessedClientCard[] = realState.inPlay
    // .map(card => ({
    //   ...card,
    //   _card: card.card,
    // }));
    // return processedCards.filter<ProcessedClientCard>((card): card is ProcessedClientCard => card._card?.type === TYPE_CREATURE && card.data.controller === this.playerId)
    return realState.inPlay
      .map(card => ({
        ...card,
        _card: card.card,
      }))
      .filter<ProcessedClientCard>((card): card is ProcessedClientCard => card._card?.type === TYPE_CREATURE && card.data.controller === this.playerId)
  }

  public getContinuousEffects() {
    return this.state.continuousEffects;
  }

  public getEnemyCreaturesInPlay(): ProcessedClientCard[] {
    const realState = getCardDetails(this.state)
    return realState.inPlay
      .map(card => ({
        ...card,
        _card: card.card,
      }))
      .filter<ProcessedClientCard>((card): card is ProcessedClientCard => Boolean(card._card?.type === TYPE_CREATURE && card.data.controller !== this.playerId))
  }


  public getEnemyRelicsInPlay(): ProcessedClientCard[] {
    const realState = getCardDetails(this.state)
    return realState.inPlay
      .map(card => ({
        ...card,
        _card: card.card,
      }))
      .filter<ProcessedClientCard>((card): card is ProcessedClientCard => card._card?.type === TYPE_RELIC && card.owner !== this.playerId)
  }

  public getMyMagi(): ClientCard {
    return this.state.zones.playerActiveMagi[0]
  }

  public getMyMagiPile(): ClientCard[] {
    return this.state.zones.playerMagiPile
  }

  public hasGameEnded(): boolean {
    return this.state.gameEnded;
  }

  public getWinner(): number | null {
    return this.state.winner;
  }

  public getOpponentMagi(): ClientCard {
    return this.state.zones.opponentActiveMagi[0]
  }

  private getZoneName = (serverZoneType: string, source: Card | ConvertedCard | HiddenConvertedCard): keyof typeof this.state.zones => {
    if (!(serverZoneType in clientZoneNames)) {
      throw new Error(`Unknown zone: ${serverZoneType}`);
    }
  
    if (serverZoneType === ZONE_TYPE_IN_PLAY) {
      return 'inPlay';
    }
    const zonePrefix = source.owner === this.playerId ? 'player' : 'opponent';
    const zoneName = clientZoneNames[serverZoneType];
    return `${zonePrefix}${zoneName}` as keyof typeof this.state.zones;
  }

  private reducer(state: StateRepresentation, action: any): StateRepresentation {
    switch (action.type) {
      case ACTION_TIME_NOTIFICATION: {
        return {
          ...state,
          turnTimer: true,
          turnSecondsLeft: 20,
        };
      }
      case ACTION_PLAYER_WINS: {
        return {
          ...state,
          gameEnded: true,
          winner: action.player,
        };
      }
      case ACTION_PASS: {
        postMessage({
          botState: JSON.stringify({
            ...state,
            step: action.newStep,
          }, null, 2),
        })
        return {
          ...state,
          step: action.newStep,
        };
      }
      case ACTION_POWER: {
        const sourceId = action.source.id;
        const sourceName = action.power;
    
        return {
          ...state,
          zones: {
            ...state.zones,
            inPlay: state.zones.inPlay.map(
              card => card.id === sourceId
                ? ({...card, data: {...card.data, actionsUsed: [...card.data.actionsUsed, sourceName]}})
                : card
            ),
            playerActiveMagi: state.zones.playerActiveMagi.map(
              card => card.id === sourceId
                ? ({...card, data: {...card.data, actionsUsed: [...card.data.actionsUsed, sourceName]}})
                : card
            ),
            opponentActiveMagi: state.zones.opponentActiveMagi.map(
              card => card.id === sourceId
                ? ({...card, data: {...card.data, actionsUsed: [...card.data.actionsUsed, sourceName]}})
                : card
            ),
          },
        };
      }
      case ACTION_ENTER_PROMPT: {
        var promptParams = action.promptParams;
        var energyPrompt = state.energyPrompt;
  
        switch (action.promptType) {
          case PROMPT_TYPE_NUMBER: {
            promptParams = {
              min: action.min,
              max: action.max
            };
            break;
          }
          case PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE: {
            promptParams = {
              source: action.source,
            };
            break;
          }
          case PROMPT_TYPE_SINGLE_CREATURE_FILTERED: {
            promptParams = {
              restrictions: action.restrictions,
              restriction: action.restriction,
              restrictionValue: action.restrictionValue,
            };
            break;
          }
          case PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE: {
            promptParams = {
              zone: action.zone,
              restrictions: action.restrictions,
              cards: action.cards,
              zoneOwner: action.zoneOwner,
              numberOfCards: action.numberOfCards,
            };
            break;
          }
          case PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE: {
            promptParams = {
              zone: action.zone,
              restrictions: action.restrictions,
              cards: action.cards,
              zoneOwner: action.zoneOwner,
              numberOfCards: action.numberOfCards,
            };
            break;
          }
        }
  
        return {
          ...state,
          prompt: true,
          promptPlayer: action.player,
          promptType: action.promptType,
          promptMessage: action.message || null,
          promptParams,
          promptGeneratedBy: action.generatedBy,
          promptAvailableCards: action.availableCards || [],
          energyPrompt,
        };
      }

      case ACTION_RESOLVE_PROMPT: {
        return {
          ...state,
          prompt: false,
          promptPlayer: null,
          promptType: null,
          promptParams: {},
          promptGeneratedBy: null,
          promptAvailableCards: [],
        };
      }
      case ACTION_ATTACK: {
        const attackerIds = [action.source, ...(action.additionalAttackers || [])];
        return {
          ...state,
          zones: {
            ...state.zones,
            inPlay: state.zones.inPlay.map(card =>
              attackerIds.includes(card.id) ? ({
                ...card,
                data: {
                  ...card.data,
                  attacked: card.data.attacked + 1,
                  hasAttacked: true,
                },
              }) : card,
            ),
          },
        };
      }
      case ACTION_EFFECT: {
        return this.applyEffect(state, action);
      }
      default: {
        return state;
      }
    }
  }

  private turnNumber = 0;
  private applyEffect(state: StateRepresentation, action: ClientAction): StateRepresentation {
    if (!('effectType' in action)) {
      return state;
    }
    switch(action.effectType) {
      case EFFECT_TYPE_CARD_MOVED_BETWEEN_ZONES: {
        const sourceZone = this.getZoneName(action.sourceZone, action.sourceCard);
        const destinationZone = this.getZoneName(action.destinationZone, action.destinationCard);
  
        var staticAbilities = state.staticAbilities || [];
  
        if (zonesToConsiderForStaticAbilities.has(sourceZone)) {
          // We are removing card with static ability from the play
          staticAbilities = staticAbilities.filter(card => card.id !== action.sourceCard.id);
        } else if (zonesToConsiderForStaticAbilities.has(destinationZone) && action.destinationCard.card && byName(action.destinationCard.card)?.data.staticAbilities) {
          staticAbilities.push({
            ...action.destinationCard,
            card: byName(action.destinationCard.card),
          });
        }

        if (!(state.zones[sourceZone]) || !(destinationZone in state.zones)) {
          return state
        }

        const sourceZoneContent: (ClientCard | HiddenCard)[] = state.zones[sourceZone]

        return {
          ...state,
          staticAbilities,
          zones: {
            ...state.zones,
            [sourceZone]: sourceZoneContent.filter((card: {id: string}): boolean => card.id !== action.sourceCard.id),
            [destinationZone]: [...state.zones[destinationZone], action.destinationCard],
          },
        };
      }
      case EFFECT_TYPE_START_OF_TURN: {
        this.turnNumber += 1;
        postMessage({
          botState: JSON.stringify(state, null, 2),
        })
        if (action.player === this.playerId) {
          return {
            ...state,
            zones: {
              ...state.zones,
              inPlay: state.zones.inPlay.map(card => card.data.controller === this.playerId ? ({...card, data: {...card.data, attacked: 0, hasAttacked: false, wasAttacked: false, actionsUsed: []}}) : card),
              playerActiveMagi: state.zones.playerActiveMagi.map(card => ({...card, data: {...card.data, wasAttacked: false, actionsUsed: []}})),
            },
            activePlayer: action.player,
            continuousEffects: tickDownContinuousEffects(state.continuousEffects, false),
          };
        } else {
          return {
            ...state,
            zones: {
              ...state.zones,
              inPlay: state.zones.inPlay.map(card => card.data.controller !== this.playerId ? ({...card, data: {...card.data, attacked: 0, hasAttacked: false, wasAttacked: false, actionsUsed: []}}) : card),
              opponentActiveMagi: state.zones.opponentActiveMagi.map(card => ({...card, data: {...card.data, wasAttacked: false, actionsUsed: []}})),
            },
            activePlayer: action.player,
            continuousEffects: tickDownContinuousEffects(state.continuousEffects, true),
          };
        }
      }
      case EFFECT_TYPE_END_OF_TURN: {
        return {
          ...state,
          turnTimer: false, 
        };
      }
      case EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI: {
        const playerActiveMagi = [...(state.zones.playerActiveMagi || [])]
          .map(card => card.id == action.target.id ? {...card, data: {...card.data, energy: card.data.energy - action.amount}} : card);
        const opponentActiveMagi = [...(state.zones.opponentActiveMagi || [])]
          .map(card => card.id == action.target.id ? {...card, data: {...card.data, energy: card.data.energy - action.amount}} : card);
  
        return {
          ...state,
          zones: {
            ...state.zones,
            playerActiveMagi,
            opponentActiveMagi,
          },
        };
      }
      case EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE: {
        const idsToFind = (action.target instanceof Array) ? action.target.map(({id}) => id) : [action.target.id];
  
        const inPlay = [...(state.zones.inPlay || [])]
          .map(card => idsToFind.includes(card.id) ? {...card, data: {...card.data, energy: card.data.energy - action.amount}} : card);

        return {
          ...state,
          zones: {
            ...state.zones,
            inPlay,
          },
        };
      }
      case EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE: {
        const inPlay = [...state.zones.inPlay].map(
          card => card.id === action.target.id ?
            {...card, data: {...card.data, attacked: Infinity}} :
            card,
        );
  
        return {
          ...state,
          zones: {
            ...state.zones,
            inPlay,
          },
        };
      }
      case EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE: {
        const idsToFind = (action.target instanceof Array) ? action.target.map(({id}) => id) : [action.target.id];
  
  
        const inPlay = [...state.zones.inPlay].map(card => idsToFind.includes(card.id) ? {...card, data: {...card.data, energy: Math.max(card.data.energy - action.amount, 0)}} : card);
  
        return {
          ...state,
          zones: {
            ...state.zones,
            inPlay,
          },
        };                    
      }
      case EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI: {
        // const magiFound = findInPlay(state, action.target.id);
  
        const playerActiveMagi = [...state.zones.playerActiveMagi].map(card => card.id == action.target.id ? {...card, data: {...card.data, energy: Math.max(card.data.energy - action.amount, 0)}} : card);
        const opponentActiveMagi = [...state.zones.opponentActiveMagi].map(card => card.id == action.target.id ? {...card, data: {...card.data, energy: Math.max(card.data.energy - action.amount, 0)}} : card);
  
        return {
          ...state,
          zones: {
            ...state.zones,
            playerActiveMagi,
            opponentActiveMagi,
          },
        };
      }
      case EFFECT_TYPE_MOVE_ENERGY: {
        const playerActiveMagi = [...state.zones.playerActiveMagi]
          .map(card => card.id == action.target.id ? {...card, data: {...card.data, energy: card.data.energy + action.amount}} : card)
          .map(card => card.id == action.source.id ? {...card, data: {...card.data, energy: card.data.energy - action.amount}} : card);
  
        const opponentActiveMagi = [...state.zones.opponentActiveMagi]
          .map(card => card.id == action.target.id ? {...card, data: {...card.data, energy: card.data.energy + action.amount}} : card)
          .map(card => card.id == action.source.id ? {...card, data: {...card.data, energy: card.data.energy - action.amount}} : card);
  
        const inPlay = [...(state.zones.inPlay || [])]
          .map(card => card.id == action.target.id ? {...card, data: {...card.data, energy: card.data.energy + action.amount}} : card)
          .map(card => card.id == action.source.id ? {...card, data: {...card.data, energy: card.data.energy - action.amount}} : card);
  
        return {
          ...state,
          zones: {
            ...state.zones,
            playerActiveMagi,
            opponentActiveMagi,
            inPlay,
          },
        };
      }
      case EFFECT_TYPE_ADD_ENERGY_TO_CREATURE: {
        const idsToFind = (action.target instanceof Array) ? action.target.map(({id}) => id) : [action.target.id];
  
        const inPlay = [...(state.zones.inPlay || [])].map(card => idsToFind.includes(card.id) ? {...card, data: {...card.data, energy: card.data.energy + action.amount}} : card);
  
        return {
          ...state,
          zones: {
            ...state.zones,
            inPlay,
          },
        };
      }
      case EFFECT_TYPE_ADD_ENERGY_TO_MAGI: {
        const playerActiveMagi = [...(state.zones.playerActiveMagi || [])]
          .map(card => card.id == action.target.id ? {...card, data: {...card.data, energy: card.data.energy + action.amount}} : card);
        const opponentActiveMagi = [...(state.zones.opponentActiveMagi || [])]
          .map(card => card.id == action.target.id ? {...card, data: {...card.data, energy: card.data.energy + action.amount}} : card);
  
        return {
          ...state,
          zones: {
            ...state.zones,
            playerActiveMagi,
            opponentActiveMagi,
          },
        };
      }
      case EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES: {
        const ids = Object.keys(action.energyOnCreatures);
        return {
          ...state,
          zones: {
            ...state.zones,
            inPlay: state.zones.inPlay.map(cardInPlay => ids.includes(cardInPlay.id) ? { ...cardInPlay, data: { ...cardInPlay.data, energy: action.energyOnCreatures[cardInPlay.id]}}: cardInPlay)
          },
        };
      }
      case EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT: {
        return {
          ...state,
          continuousEffects: [
            ...state.continuousEffects,
            {
              generatedBy: action.generatedBy,
              expiration: action.expiration,
              staticAbilities: action.staticAbilities || [],
              triggerEffects: action.triggerEffects || [],
              player: action.player,
              id: action.generatedBy || nanoid(),
            },
          ],
        };
      }
      case EFFECT_TYPE_DISCARD_RESHUFFLED: {
        const newState: StateRepresentation = action.player === this.playerId ? {
          ...state,
          zones: {
            ...state.zones,
            playerDiscard: [],
            playerDeck: action.cards.map(cardId => ({id: cardId, owner: action.player, card: null, data: {}})),
          },
        } : {
          ...state,
          zones: {
            ...state.zones,
            opponentDiscard: [],
            opponentDeck: action.cards.map(cardId => ({id: cardId, owner: action.player, card: null, data: {}})),
          },
        };
        return newState;
      }
    }
    return state;
  }
}