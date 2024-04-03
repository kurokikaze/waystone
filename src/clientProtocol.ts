import { TYPE_CREATURE } from "@moonlands_old/dist"
import { ConvertedCard } from "moonlands/dist/classes/CardInGame"
import {
  ACTION_ATTACK,
  ACTION_ENTER_PROMPT,
  PROMPT_TYPE_NUMBER,
  ACTION_EFFECT,
  EFFECT_TYPE_START_OF_TURN,
  EFFECT_TYPE_END_OF_TURN,
  EFFECT_TYPE_DRAW,
  EFFECT_TYPE_PAYING_ENERGY_FOR_POWER,
  EFFECT_TYPE_MAGI_IS_DEFEATED,
  ACTION_PASS,
  ACTION_PLAY,
  ACTION_POWER,
  ACTION_RESOLVE_PROMPT,
  PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
  PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE,
  PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES,
  PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES,
  PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE,
  EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES,
  EFFECT_TYPE_RETURN_CREATURE_RETURNING_ENERGY,
  EFFECT_TYPE_CARD_MOVED_BETWEEN_ZONES,
  EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE,
  EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
  EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI,
  EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
  EFFECT_TYPE_DISCARD_RESHUFFLED,
  EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
  EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
  EFFECT_TYPE_CREATURE_ATTACKS,
  EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE,
  EFFECT_TYPE_MOVE_ENERGY,
  EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
  EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT,
  EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE,
  ACTION_PLAYER_WINS,
  PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE,
  PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
  PROMPT_TYPE_CHOOSE_CARDS,
  EFFECT_TYPE_PLAY_SPELL,
  EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES,
  EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
  EFFECT_TYPE_DIE_ROLLED,
  EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES,
  PROMPT_TYPE_POWER_ON_MAGI,
  PROMPT_TYPE_ALTERNATIVE,
  PROMPT_TYPE_PAYMENT_SOURCE,
  TYPE_RELIC,
  TYPE_SPELL,
  EFFECT_TYPE_ENERGY_DISCARDED_FROM_CREATURE, 
  EFFECT_TYPE_ENERGY_DISCARDED_FROM_MAGI,
  EFFECT_TYPE_DISCARD_CARD_FROM_HAND
} from "moonlands/dist/const"
import { ZoneType, RestrictionObjectType, StaticAbilityType, TriggerEffectType } from "moonlands/dist/types"
import { ExpirationObjectType, RestrictionType } from "moonlands/dist/types/common"
import { AlternativeType } from "moonlands/dist/types/prompt"
// import { EFFECT_TYPE_ENERGY_DISCARDED_FROM_CREATURE, EFFECT_TYPE_ENERGY_DISCARDED_FROM_MAGI } from "moonlands/src/const"

export type HiddenConvertedCard = {
	id: string,
	owner: number,
	card: null,
	data: null,
}

export type ConvertedCardMinimal = {
  id: string,
}

export type ClientAttackAction = {
  type: typeof ACTION_ATTACK,
  source: string,
  target: string,
  additionalAttackers?: string[],
  player: number,
}

interface ClientEnterPromptInterface {
  type: typeof ACTION_ENTER_PROMPT,
  message?: string,
  player: number,
}

export type ClientEnterPromptChooseNCardsFromZone = ClientEnterPromptInterface & {
  promptType: typeof PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
  zone: ZoneType,
  restrictions: RestrictionObjectType[] | null,
  cards: ConvertedCard[],
  zoneOwner: number,
  numberOfCards: number,
}

export type ClientEnterPromptChooseUpToNCardsFromZone = ClientEnterPromptInterface & {
  promptType: typeof PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE,
  zone: ZoneType,
  restrictions: RestrictionObjectType[] | null,
  cards: ConvertedCard[],
  zoneOwner: number,
  numberOfCards: number,
}

export type ClientEnterPromptNumber = ClientEnterPromptInterface & {
  promptType: typeof PROMPT_TYPE_NUMBER,
  min: number,
  max: number,
  generatedBy: string,
}

export type ClientEnterPromptDistributeEnergyOnCreatures = ClientEnterPromptInterface & {
  promptType: typeof PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES,
  amount: number,
}

export type ClientEnterPromptRearrangeEnergyOnCreatures = ClientEnterPromptInterface & {
  promptType: typeof PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES,
}

export type ClientEnterPromptRearrangeCardsOfZone = ClientEnterPromptInterface & {
  promptType: typeof PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE,
  zone: ZoneType,
  cards: ConvertedCard[],
  zoneOwner: number,
  numberOfCards: number,
}

export type ClientEnterPromptAnyCreatureExceptSource = ClientEnterPromptInterface & {
  promptType: typeof PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE,
  source: ConvertedCard,
}

export type ClientEnterPromptChooseCards = ClientEnterPromptInterface & {
    promptType: typeof PROMPT_TYPE_CHOOSE_CARDS,
    promptParams: {
      availableCards: string[],
      startingCards: string[],
    },
    generatedBy: string,
    player: number,
}

export type ClientEnterPromptSingleCreatureFiltered = ClientEnterPromptInterface & {
  promptType: typeof PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
  restrictions: RestrictionObjectType[],
  restriction: RestrictionType,
  restrictionValue: string | string[] | number
}

export type ClientEnterPromptPowerOnMagi = ClientEnterPromptInterface & {
  promptType: typeof PROMPT_TYPE_POWER_ON_MAGI,
  magi: ConvertedCard,
}

export type ClientEnterPromptAlternatives = ClientEnterPromptInterface & {
  promptType: typeof PROMPT_TYPE_ALTERNATIVE
  alternatives: AlternativeType[]
  generatedBy: string | undefined // Except we cannot have prompts from undefined... probably
}

export type ClientEnterPromptPaymentSource = ClientEnterPromptInterface & {
  promptType: typeof PROMPT_TYPE_PAYMENT_SOURCE,
  paymentType: typeof TYPE_CREATURE | typeof TYPE_SPELL | typeof TYPE_RELIC;
  amount: number;
}

export type ClientEnterPromptAction = ClientEnterPromptChooseNCardsFromZone |
  ClientEnterPromptChooseUpToNCardsFromZone |
  ClientEnterPromptNumber |
  ClientEnterPromptDistributeEnergyOnCreatures |
  ClientEnterPromptChooseUpToNCardsFromZone |
  ClientEnterPromptRearrangeCardsOfZone |
  ClientEnterPromptAnyCreatureExceptSource |
  ClientEnterPromptSingleCreatureFiltered |
  ClientEnterPromptRearrangeEnergyOnCreatures |
  ClientEnterPromptChooseCards |
  ClientEnterPromptAlternatives |
  ClientEnterPromptPaymentSource |
  ClientEnterPromptPowerOnMagi;

export type ClientEffectAction = ClientEffectRearrangeEnergyOnCreatures |
  ClientEffectReturnCreatureReturningEnergy |
  ClientEffectStartOfTurn |
  ClientEffectEndOfTurn |
  ClientEffectDraw |
  ClientEffectAddEnergyToMagi |
  ClientEffectCardMovedBetweenZones |
  ClientEffectRearrangeCardsOfZone |
  ClientEffectPayingEnergyForPower |
  ClientEffectMagiIsDefeated |
  ClientEffectAddEnergyToCreature |
  ClientEffectDiscardReshuffled |
  ClientEffectDiscardEnergyFromMagi |
  ClientEffectEnergyDiscardedFromCreature |
  ClientEffectEnergyDiscardedFromMagi |
  ClientEffectDiscardCreatureFromPlay |
  ClientEffectRemoveEnergyFromMagi |
  ClientEffectForbidAttackToCreature |
  ClientEffectRemoveEnergyFromCreature |
  ClientEffectDiscardEnergyFromCreature |
  ClientEffectDiscardCardFromHand |
  ClientEffectMoveEnergy |
  ClientEffectDistributeEnergyOnCreatures |
  ClientEffectMoveCardsBetweenZones |
  ClientEffectMoveCardBetweenZones |
  ClientEffectCreateContinuousEffect |
  ClientEffectPlaySpell |
  ClientEffectDieRolled |
  ClientEffectCreatureAttacks;

  export type ClientEffectPlaySpell = {
  type: typeof ACTION_EFFECT
  effectType: typeof EFFECT_TYPE_PLAY_SPELL
  card: ConvertedCard
  player: number
  generatedBy: string
}

export type ClientEffectCreateContinuousEffect = {
  type: typeof ACTION_EFFECT,
  effectType: typeof EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT,
  generatedBy: string,
  expiration: ExpirationObjectType,
  staticAbilities: StaticAbilityType[],
  triggerEffects: TriggerEffectType[],
  player: number,
}

export type ClientEffectDiscardReshuffled = {
  type: typeof ACTION_EFFECT,
  effectType: typeof EFFECT_TYPE_DISCARD_RESHUFFLED,
  cards: string[],
  player: number,
}

export type ClientEffectCreatureAttacks = {
  type: typeof ACTION_EFFECT,
  effectType: typeof EFFECT_TYPE_CREATURE_ATTACKS,
  packHuntAttack?: boolean,
  source: ConvertedCardMinimal,
  target: ConvertedCardMinimal,
  sourceAtStart: ConvertedCardMinimal,
  targetAtStart: ConvertedCardMinimal,
  player: number,
}

export type ClientEffectRearrangeEnergyOnCreatures = {
  type: typeof ACTION_EFFECT,
  effectType: typeof EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES;
	energyOnCreatures: Record<string, number>;
}

export type ClientEffectReturnCreatureReturningEnergy = {
  type: typeof ACTION_EFFECT,
  effectType: typeof EFFECT_TYPE_RETURN_CREATURE_RETURNING_ENERGY,
  target: ConvertedCardMinimal | ConvertedCardMinimal[],
  source?: ConvertedCardMinimal,
  generatedBy: string,
}

export type ClientEffectStartOfTurn = {
  type: typeof ACTION_EFFECT,
  effectType: typeof EFFECT_TYPE_START_OF_TURN,
  player: number,
}

export type ClientEffectMoveEnergy = {
  type: typeof ACTION_EFFECT,
  effectType: typeof EFFECT_TYPE_MOVE_ENERGY,
  source: ConvertedCard,
  target: ConvertedCard,
  amount: number,
  generatedBy: string,
  player: number,
}

export type ClientEffectEndOfTurn = {
  type: typeof ACTION_EFFECT,
  effectType: typeof EFFECT_TYPE_END_OF_TURN,
  player: number,
}

export type ClientEffectDraw = {
  type: typeof ACTION_EFFECT,
  effectType: typeof EFFECT_TYPE_DRAW,
  player: number,
}

export type ClientEffectDieRolled = {
  type: typeof ACTION_EFFECT,
  effectType: typeof EFFECT_TYPE_DIE_ROLLED,
  result: number,
  player: number,
  generatedBy: string,
}

export type ClientEffectDistributeEnergyOnCreatures = {
  type: typeof ACTION_EFFECT,
  effectType: typeof EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES,
  energyOnCreatures: Record<string, number>,
  power?: boolean,
  spell?: boolean,
  source?: ConvertedCard,
  player: number,
  generatedBy: string,
}

export type ClientEffectMoveCardsBetweenZones = {
  type: typeof ACTION_EFFECT,
  effectType: typeof EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES,
  sourceZone: ZoneType,
  destinationZone: ZoneType,
  target: (ConvertedCardMinimal | HiddenConvertedCard)[],
  generatedBy: string,
  player: number,
}

export type ClientEffectMoveCardBetweenZones = {
  type: typeof ACTION_EFFECT,
  effectType: typeof EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
  sourceZone: ZoneType,
  destinationZone: ZoneType,
  target: ConvertedCardMinimal | HiddenConvertedCard,
  generatedBy: string,
  player: number,
}

export type ClientEffectCardMovedBetweenZones = {
  type: typeof ACTION_EFFECT,
  effectType: typeof EFFECT_TYPE_CARD_MOVED_BETWEEN_ZONES,
  sourceZone: ZoneType,
  sourceCard: ConvertedCard | HiddenConvertedCard,
  destinationCard: ConvertedCard | HiddenConvertedCard,
  destinationZone: ZoneType,
  convertedFor: number,
  player: number,
  generatedBy: string,
}

export type ClientEffectRearrangeCardsOfZone = {
  type: typeof ACTION_EFFECT,
  cards: string[],
  zone: ZoneType,
  zoneOwner: number,
  effectType: typeof EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE,
  player: number,
}

export type ClientEffectPayingEnergyForPower = {
  type: typeof ACTION_EFFECT,
  effectType: typeof EFFECT_TYPE_PAYING_ENERGY_FOR_POWER,
  amount: number,
  target: ConvertedCard,
  player: number,
}

export type ClientEffectMagiIsDefeated = {
  type: typeof ACTION_EFFECT,
  effectType: typeof EFFECT_TYPE_MAGI_IS_DEFEATED,
  target: ConvertedCard,
  player: number,
  generatedBy: string,
}

export type ClientEffectDiscardCreatureFromPlay = {
  type: typeof ACTION_EFFECT,
  effectType: typeof EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
  target: ConvertedCard,
  player: number,
  generatedBy: string,
}

export type ClientEffectDiscardCardFromHand = {
  type: typeof ACTION_EFFECT,
  effectType: typeof EFFECT_TYPE_DISCARD_CARD_FROM_HAND,
  target: ConvertedCard,
  player: number,
  generatedBy: string,
}


export type ClientEffectDiscardEnergyFromCreature = {
  type: typeof ACTION_EFFECT,
  effectType: typeof EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
  amount: number,
  target: ConvertedCardMinimal | ConvertedCardMinimal[],
  source: ConvertedCardMinimal | null,
  player: number,
  generatedBy: string,
}

export type ClientEffectDiscardEnergyFromMagi = {
  type: typeof ACTION_EFFECT,
  effectType: typeof EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
  amount: number,
  target: ConvertedCard,
  source: ConvertedCard | null,
  player: number,
  generatedBy: string,
}

export type ClientEffectEnergyDiscardedFromCreature = {
  type: typeof ACTION_EFFECT,
  effectType: typeof EFFECT_TYPE_ENERGY_DISCARDED_FROM_CREATURE,
  amount: number,
  target: ConvertedCardMinimal | ConvertedCardMinimal[],
  source: ConvertedCardMinimal | null,
  player: number,
  generatedBy: string,
}

export type ClientEffectEnergyDiscardedFromMagi = {
  type: typeof ACTION_EFFECT,
  effectType: typeof EFFECT_TYPE_ENERGY_DISCARDED_FROM_MAGI,
  amount: number,
  target: ConvertedCard,
  source: ConvertedCard | null,
  player: number,
  generatedBy: string,
}

export type ClientEffectAddEnergyToMagi = {
  type: typeof ACTION_EFFECT,
  effectType: typeof EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
  amount: number,
  target: ConvertedCard,
  source: ConvertedCard | null,
  player: number,
  generatedBy: string,
}

export type ClientEffectAddEnergyToCreature = {
  type: typeof ACTION_EFFECT,
  effectType: typeof EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
  amount: number,
  target: ConvertedCard | ConvertedCard[],
  source: ConvertedCard | null | false,
  player: number,
  generatedBy: string,
}

export type ClientEffectRemoveEnergyFromCreature = {
  type: typeof ACTION_EFFECT,
  effectType: typeof EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE,
  amount: number,
  target: ConvertedCard | ConvertedCard[],
  source: ConvertedCard | null,
  player: number,
  generatedBy: string,
}

export type ClientEffectRemoveEnergyFromMagi = {
  type: typeof ACTION_EFFECT,
  effectType: typeof EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI,
  amount: number,
  target: ConvertedCard,
  player: number,
  generatedBy: string,
}

export type ClientEffectForbidAttackToCreature = {
  type: typeof ACTION_EFFECT,
  effectType: typeof EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE,
  target: ConvertedCardMinimal,
  player: number,
}

export type ClientPassAction = {
  type: typeof ACTION_PASS,
  newStep: number,
  player: number,
}

// We add newStep only when converting this action from server
export type FromClientPassAction = {
  type: typeof ACTION_PASS,
  player: number,
}

export type ClientPlayAction = {
  type: typeof ACTION_PLAY,
  payload: {
    card: ConvertedCard,
  },
  forcePriority?: boolean,
  player: number,
}

// Here we have two actions: one that is sent from server when a player plays a card,
// and another one sent from client when he intends to play a card.
// In second case we only need the card Id
export type FromClientPlayAction = {
  type: typeof ACTION_PLAY,
  payload: {
    card: ConvertedCardMinimal,
  },
  forcePriority?: boolean,
  player: number,
}

export type ClientPowerAction = {
  type: typeof ACTION_POWER,
  source: ConvertedCard,
  power: string,
  player: number,
}

export type FromClientPowerAction = {
  type: typeof ACTION_POWER,
  source: string,
  power: string,
  player: number,
}

export type PlayerWinsAction = {
  type: typeof ACTION_PLAYER_WINS,
  player: number,
}

export type ClientResolvePromptAction = {
  type: typeof ACTION_RESOLVE_PROMPT,
  target?: string,
  targetCard?: ConvertedCard | HiddenConvertedCard,
  targetPlayer?: number,
  number?: number,
  player: number,
  zone?: ZoneType,
  alternative?: string,
  zoneOwner?: number,
  useEffect?: boolean,
  cards?: string[],
  power?: string,
}

type CommonAction = ClientAttackAction | ClientEnterPromptAction | ClientEffectAction
export type ClientAction = CommonAction | ClientPassAction | ClientPlayAction | ClientPowerAction | ClientResolvePromptAction | PlayerWinsAction;

// @deprecated Merged into ClientAction
export type ClientCommand = ClientEnterPromptAction | ClientEffectAction | ClientAction;
export type ClientMessage = {
  for: number,
  action: ClientAction,
}
export type C2SAction = CommonAction | FromClientPlayAction | FromClientPowerAction | FromClientPassAction | ClientResolvePromptAction;