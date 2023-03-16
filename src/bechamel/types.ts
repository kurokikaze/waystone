import { log } from 'console'
import { ACTION_PASS, ACTION_PLAY, ACTION_POWER, State } from 'moonlands/src'
import Card from 'moonlands/src/classes/Card'
import CardInGame, { ConvertedCard } from 'moonlands/src/classes/CardInGame'
import { AnyEffectType, ContinuousEffectType, LogEntryType, PromptTypeType, RestrictionObjectType, RestrictionType, ZoneType } from 'moonlands/src/types'
import { ResolvePromptType } from 'moonlands/src/types/resolvePrompt'
import { ACTION_ATTACK, ACTION_CONCEDE, ACTION_NONE, COST_X } from './const'

export type Challenge = {
  deck: string
  deckId: string
  user: string
  userId: number
}

export type GameResponse = {
  hash: string
}

export interface EnrichedAction {
  source?: CardInGame;
  power?: boolean;
  spell?: boolean;
  attack?: boolean;
  replacedBy?: string[];
}

type PassType = EnrichedAction & {
  type: typeof ACTION_PASS;
  player: number;
  generatedBy?: string;
}

type ConcedeType = EnrichedAction & {
  type: typeof ACTION_CONCEDE;
  player: number;
  generatedBy?: string;
}

export type NormalPlayType = EnrichedAction & {
  type: typeof ACTION_PLAY;
  player: number;
  payload: {
      card: CardInGame;
      player: number;
  }
  forcePriority?: false;
  generatedBy?: string;
}

type InGameData = { 
	energy: number;
	controller: number;
	attacked: number;
	actionsUsed: string[];
	energyLostThisTurn: number;
	defeatedCreature: boolean;
	hasAttacked: boolean;
	wasAttacked: boolean;
	burrowed?: boolean;
	ableToAttack?: boolean;
	energyLossThreshold?: number;
}

type ClientCard = {
  card: string
  id: string
  data: InGameData
  owner: number
}

export type ExpandedClientCard = ClientCard & {
  _card: Card
}

export type HiddenCard = {
  card: null
  id: string
  data: {}
  owner: number
}

type PromptParamsType = {
  cards?: ConvertedCard[];
  source?: CardInGame;
  availableCards?: string[];
  numberOfCards?: number;
  restrictions?: RestrictionObjectType[] | null;
  restriction?: RestrictionType;
  amount?: number;
  zone?: ZoneType;
  zoneOwner?: number;
  min?: number;
  max?: number;
}

export type SerializedClientState = {
  zones: {
    playerHand: ClientCard[],
    opponentHand: HiddenCard[],
    playerDeck: HiddenCard[],
    opponentDeck: HiddenCard[],
    playerActiveMagi: ClientCard[],
    opponentActiveMagi: ClientCard[],
    playerMagiPile: ClientCard[],
    opponentMagiPile: HiddenCard[],
    inPlay: ClientCard[],
    playerDefeatedMagi: ClientCard[],
    opponentDefeatedMagi: ClientCard[],
    playerDiscard: ClientCard[],
    opponentDiscard: ClientCard[],
  }
  continuousEffects: ContinuousEffectType[];
  step: number;
  turn: number;
  goesFirst: number,
  activePlayer: number;
  prompt: boolean;
  promptType: PromptTypeType | null;
  promptMessage: string | null;
  promptPlayer: number;
  promptGeneratedBy: string | null;
  promptParams: PromptParamsType;
  log: LogEntryType[];
  gameEnded: boolean;
  winner: number | null;
}

export type StateRepresentation = {
  zones: {
    playerHand: ClientCard[],
    opponentHand: HiddenCard[],
    playerDeck: HiddenCard[],
    opponentDeck: HiddenCard[],
    playerActiveMagi: ClientCard[],
    opponentActiveMagi: ClientCard[],
    playerMagiPile: ClientCard[],
    opponentMagiPile: HiddenCard[],
    inPlay: ClientCard[],
    playerDefeatedMagi: ClientCard[],
    opponentDefeatedMagi: ClientCard[],
    playerDiscard: ClientCard[],
    opponentDiscard: ClientCard[],
  },
  continuousEffects: any[],
  staticAbilities: any[],
  turnTimer: boolean,
  turnSecondsLeft: number | null,
  gameEnded: boolean,
  winner: number | null,
  activePlayer: number,
  energyPrompt: boolean,
  prompt: boolean,
  step: number,
  promptPlayer: number | null,
  promptType: PromptTypeType | null,
  promptMessage: string | null,
  promptParams: PromptParamsType,
  promptGeneratedBy: string | null,
  promptAvailableCards: [],
}

type PowerType = {
  name: string;
  text: string;
  cost: number | typeof COST_X;
  effects: AnyEffectType[];
}

type PowerActionType = EnrichedAction & {
  type: typeof ACTION_POWER;
  power: PowerType;
  source: CardInGame;
  player: number;
  generatedBy?: string;
}

export type AttackType = {
  type: typeof ACTION_ATTACK;
  source: CardInGame;
  target: CardInGame;
  additionalAttackers?: CardInGame[];
  player: number;
}

export type PlayerActionType = PassType | PowerActionType | NormalPlayType | ResolvePromptType | AttackType

export type SimulationEntity = {
  sim: State,
  action: any,
  actionLog: any[],
  previousHash: string,
}
