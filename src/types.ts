import Card from "moonlands/src/classes/Card"
import { ConvertedCard, HiddenConvertedCard, InGameData } from "moonlands/src/classes/CardInGame"
import { LogEntryType, PromptParams, PromptTypeType, ZoneType } from "moonlands/src/types"
import { C2SAction } from "./clientProtocol"
import { AlternativeType } from "moonlands/src/types/prompt"
import { TYPE_CREATURE, TYPE_RELIC, TYPE_SPELL } from "moonlands"
import { CARD_STYLE_DRAGGABLE, CARD_STYLE_LOCKET, CARD_STYLE_NORMAL } from "./const"

export type EngineConnector = {
  emit: (action: C2SAction) => void
}

export type MessageType = {
  type: string,
  source?: string,
  card?: string,
  power?: string,
  player?: number,
  chosenTarget?: string,
  chosenNumber?: number,
}

export type ExtendedCard = Omit<ConvertedCard, "card"> & { card: Card }

export type CardStyleType = typeof CARD_STYLE_NORMAL | typeof CARD_STYLE_LOCKET | typeof CARD_STYLE_DRAGGABLE;

export type ContinuousEffectType = {
  generatedBy: string,
  expiration: any,
  staticAbilities: any[],
  triggerEffects: any[],
  player: number,
  id: string,
}

type Pack = {
  leader: string,
  hunters: string[]
}

export type ExpandedPromptParams = Omit<Omit<Omit<PromptParams, "promptType">, "zoneOwner">, "restrictionValue"> & {
  amount?: number
  cards?: ConvertedCard[]
  magi?: ConvertedCard,
  startingCards?: string[]
  availableCards?: string[]
  alternatives?: AlternativeType[]
  paymentType?: typeof TYPE_CREATURE | typeof TYPE_SPELL | typeof TYPE_RELIC;
  paymentAmount?: number;
  restrictionValue?: string | string[] | number | boolean
  zoneOwner?: number
  targetZones?: ZoneType[]
}

type AnimationStateType = {
  type: string,
  source: string,
  target: string,
  additionalAttacker?: string,
}

type LastPositionsMap = Record<string, [number, number]>;

export type EnergyLossRecord = {
  value: number;
  card: string;
  ttl: number;
  id: number;
}

export type ChallengeType = {
  id: string
  name: string
  created: string
  own: boolean
}

export type State = {
  zones: {
    playerHand: ConvertedCard[],
    playerDeck: HiddenConvertedCard[],
    playerDiscard: ConvertedCard[],
    playerActiveMagi: ConvertedCard[],
    playerMagiPile: HiddenConvertedCard[],
    playerDefeatedMagi: ConvertedCard[],
    inPlay: ConvertedCard[],
    opponentHand: HiddenConvertedCard[],
    opponentDeck: HiddenConvertedCard[],
    opponentDiscard: ConvertedCard[],
    opponentActiveMagi: ConvertedCard[],
    opponentMagiPile: HiddenConvertedCard[],
    opponentDefeatedMagi: ConvertedCard[],
  },
  continuousEffects: ContinuousEffectType[],
  staticAbilities: ExtendedCard[],
  animation: AnimationStateType | null,
  message: MessageType | null,
  log: LogEntryType[],
  step: number | null,
  turnTimer: boolean,
  turnSecondsLeft: number | null,
  gameEnded: boolean,
  winner: number | null,
  activePlayer: number,
  packs: Pack[],
  energyLosses: EnergyLossRecord[],
  energyLossId: number;
  energyPrompt: {
    freeEnergy: number,
    cards: Record<string, number>
  },
  prompt: boolean,
  promptPlayer: number | null,
  promptType: PromptTypeType | null,
  promptMessage: string | null,
  promptParams: ExpandedPromptParams | null,
  promptGeneratedBy: string | null,
  promptAvailableCards: string[] | null,
  lastPositions: LastPositionsMap,
  energyAnimationsShown: Set<number>,
  challenges: {
    challenges: ChallengeType[],
  }
}

export type DraggedItem = {
  card: Card,
  data: InGameData,
  id: string,
  pack: {
    leader: string,
    hunters: string[]
  }
}

export type SecondCard = {
  card: Card,
  data: InGameData,
  id: string,
  guarded: boolean
}

export type AffectedByType = {
  name: string
  text: string
  expiration?: { type: string, turns?: number }
}

export type EnrichedCard = {
  id: string
  owner: number
  data: InGameData & { affectedBy?: AffectedByType[] } // List of ids of the static abilities the card is affected by
  card: Card
  originalCard: Card
}

export type DeckType = {
	cards: string[]
	name: string
}
