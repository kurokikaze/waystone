import Card from "moonlands/dist/classes/Card"
import { ConvertedCard, InGameData } from "moonlands/dist/classes/CardInGame"
import { LogEntryType, PromptParams, PromptTypeType } from "moonlands/dist/types"
import { C2SAction, ClientCommand, HiddenConvertedCard } from "./clientProtocol"

export type EngineConnector = {
  emit: (action: C2SAction) => void
}

export type MessageType = {
  type: string,
  source?: string,
  card?: string,
  power?: string,
  chosenTarget?: string,
  chosenNumber?: number,
}

export type ExtendedCard = Omit<ConvertedCard, "card"> & {card: Card}

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
  startingCards?: string[]
  availableCards?: string[]
  restrictionValue?: string | string[] | number | boolean
  zoneOwner?: number
}

type AnimationStateType = {
  type: string,
  source: string,
  target: string,
  additionalAttacker?: string,
}

type LastPositionsMap = Record<string, [number, number]>;

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
