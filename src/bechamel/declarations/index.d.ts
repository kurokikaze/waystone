/// <reference types="node" />
import {
  TYPE_CREATURE,
  TYPE_MAGI,
  TYPE_RELIC,
  TYPE_SPELL,
  ACTION_PASS,
  ACTION_PLAY,
  ACTION_POWER,
  ACTION_EFFECT,
  ACTION_SELECT,
  ACTION_CALCULATE,
  ACTION_ENTER_PROMPT,
  ACTION_RESOLVE_PROMPT,
  ACTION_GET_PROPERTY_VALUE,
  ACTION_ATTACK,
  ACTION_PLAYER_WINS,
  PROPERTY_ID,
  PROPERTY_TYPE,
  PROPERTY_CONTROLLER,
  PROPERTY_ENERGY_COUNT,
  PROPERTY_REGION,
  PROPERTY_COST,
  PROPERTY_ENERGIZE,
  PROPERTY_MAGI_STARTING_ENERGY,
  PROPERTY_ATTACKS_PER_TURN,
  PROPERTY_CAN_ATTACK_MAGI_DIRECTLY,
  PROPERTY_POWER_COST,
  PROPERTY_CREATURE_TYPES,
  PROPERTY_STATUS,
  PROPERTY_ABLE_TO_ATTACK,
  PROPERTY_MAGI_NAME,
  PROPERTY_CAN_BE_ATTACKED,
  CALCULATION_SET,
  CALCULATION_DOUBLE,
  CALCULATION_ADD,
  CALCULATION_SUBTRACT,
  CALCULATION_HALVE_ROUND_DOWN,
  CALCULATION_HALVE_ROUND_UP,
  CALCULATION_MIN,
  CALCULATION_MAX,
  SELECTOR_CREATURES,
  SELECTOR_CREATURES_AND_MAGI,
  SELECTOR_RELICS,
  SELECTOR_OWN_MAGI,
  SELECTOR_ENEMY_MAGI,
  SELECTOR_CREATURES_OF_REGION,
  SELECTOR_CREATURES_NOT_OF_REGION,
  SELECTOR_OWN_CREATURES,
  SELECTOR_ENEMY_CREATURES,
  SELECTOR_TOP_MAGI_OF_PILE,
  SELECTOR_MAGI_OF_REGION,
  SELECTOR_OPPONENT_ID,
  SELECTOR_MAGI_NOT_OF_REGION,
  SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE,
  SELECTOR_CARDS_WITH_ENERGIZE_RATE,
  SELECTOR_OWN_CARDS_IN_PLAY,
  SELECTOR_CREATURES_OF_TYPE,
  SELECTOR_CREATURES_NOT_OF_TYPE,
  SELECTOR_OWN_CREATURES_OF_TYPE,
  SELECTOR_STATUS,
  SELECTOR_CREATURES_WITHOUT_STATUS,
  SELECTOR_CREATURES_OF_PLAYER,
  STATUS_BURROWED,
  PROMPT_TYPE_NUMBER,
  PROMPT_TYPE_SINGLE_CREATURE,
  PROMPT_TYPE_SINGLE_MAGI,
  PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE,
  PROMPT_TYPE_CHOOSE_CARDS,
  NO_PRIORITY,
  PRIORITY_PRS,
  PRIORITY_ATTACK,
  PRIORITY_CREATURES,
  EFFECT_TYPE_DRAW,
  EFFECT_TYPE_RESHUFFLE_DISCARD,
  EFFECT_TYPE_MOVE_ENERGY,
  EFFECT_TYPE_ROLL_DIE,
  EFFECT_TYPE_PLAY_CREATURE,
  EFFECT_TYPE_PLAY_RELIC,
  EFFECT_TYPE_PLAY_SPELL,
  EFFECT_TYPE_CREATURE_ENTERS_PLAY,
  EFFECT_TYPE_RELIC_ENTERS_PLAY,
  EFFECT_TYPE_MAGI_IS_DEFEATED,
  EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
  EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE,
  EFFECT_TYPE_PAYING_ENERGY_FOR_RELIC,
  EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL,
  EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
  EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE,
  EFFECT_TYPE_ADD_ENERGY_TO_CREATURE_OR_MAGI,
  EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
  EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
  EFFECT_TYPE_ENERGIZE,
  EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
  EFFECT_TYPE_DISCARD_CREATURE_OR_RELIC,
  EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
  EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY,
  EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY,
  EFFECT_TYPE_PAYING_ENERGY_FOR_POWER,
  EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI,
  EFFECT_TYPE_CREATURE_DEFEATS_CREATURE,
  EFFECT_TYPE_CREATURE_IS_DEFEATED, // Possibly redundant
  EFFECT_TYPE_BEFORE_DAMAGE,
  EFFECT_TYPE_DEAL_DAMAGE,
  EFFECT_TYPE_AFTER_DAMAGE,
  EFFECT_TYPE_CREATURE_ATTACKS,
  EFFECT_TYPE_CREATURE_IS_ATTACKED,
  EFFECT_TYPE_START_OF_TURN,
  EFFECT_TYPE_END_OF_TURN,
  EFFECT_TYPE_MAGI_FLIPPED,
  EFFECT_TYPE_FIND_STARTING_CARDS,
  EFFECT_TYPE_DRAW_REST_OF_CARDS,
  REGION_UNIVERSAL,
  COST_X,
  COST_X_PLUS_ONE,
  ZONE_TYPE_HAND,
  ZONE_TYPE_IN_PLAY,
  ZONE_TYPE_DISCARD,
  ZONE_TYPE_ACTIVE_MAGI,
  ZONE_TYPE_MAGI_PILE,
  ZONE_TYPE_DECK,
  ZONE_TYPE_DEFEATED_MAGI,
  PROPERTY_PROTECTION,
  CALCULATION_MULTIPLY,
} from "./const";
import CardInGame, { ConvertedCard, InGameData } from "./classes/CardInGame";
import Card, { CostType, ModifiedCardType } from "./classes/Card";
import Zone from "./classes/Zone";
import {
  AnyEffectType,
  PromptTypeType,
  RestrictionObjectType,
  RestrictionType,
  LogEntryType,
  PropertyType,
  EnrichedAction,
  StaticAbilityType,
  OperatorType,
  ConditionType,
  FindType,
  ContinuousEffectType,
  EffectType,
  ZoneType,
  Region,
  ProtectionType,
} from "./types";
import { EnhancedDelayedTriggerType } from "./types/effect";
import { CardType, StatusType } from "./types/common";
declare type EnrichedStaticAbilityType = StaticAbilityType & {
  player: number;
};
declare type GameStaticAbility = StaticAbilityType & {
  selector: typeof SELECTOR_STATUS;
};
declare type PriorityType =
  | typeof NO_PRIORITY
  | typeof PRIORITY_PRS
  | typeof PRIORITY_ATTACK
  | typeof PRIORITY_CREATURES;
declare type CardWithModification = {
  card: Card;
  data: InGameData;
  modifiedCard: ModifiedCardType;
  id: string;
  owner: number;
};
declare type PromptParamsType = {
  cards?: ConvertedCard[];
  source?: CardInGame;
  availableCards?: string[];
  startingCards?: string[];
  numberOfCards?: number;
  restrictions?: RestrictionObjectType[] | null;
  restriction?: RestrictionType;
  amount?: number;
  zone?: ZoneType;
  zoneOwner?: number;
  min?: number;
  max?: number;
};
export declare type MetaDataValue =
  | CardInGame
  | CardInGame[]
  | Region
  | number
  | Record<string, number>;
export declare type MetaDataRecord = Record<string, MetaDataValue>;
declare type StateShape = {
  step: number | null;
  turn?: number;
  prompt: boolean;
  players: number[];
  promptType: PromptTypeType | null;
  promptMessage?: string;
  promptPlayer?: number;
  promptGeneratedBy?: string;
  promptVariable?: string;
  promptParams: PromptParamsType;
  activePlayer: number;
  goesFirst?: number;
  zones: Zone[];
  log: LogEntryType[];
  actions: AnyEffectType[];
  savedActions: AnyEffectType[];
  mayEffectActions: AnyEffectType[];
  fallbackActions: AnyEffectType[];
  continuousEffects: ContinuousEffectType[];
  spellMetaData: Record<string, MetaDataRecord>;
  delayedTriggers: EnhancedDelayedTriggerType[];
};
declare type DeckType = {
  player: number;
  deck: CardInGame[];
};
export declare class State {
  state: StateShape;
  players: number[];
  decks: DeckType[];
  winner: boolean | number;
  debug: boolean;
  turn: number | null;
  rollDebugValue: number | null;
  actionsOne: any[];
  actionsTwo: any[];
  onAction: Function | null;
  turnTimer: number | null;
  timerEnabled: boolean;
  turnTimeout: NodeJS.Timer | null;
  turnNotifyTimeout: NodeJS.Timer | null;
  constructor(state: StateShape);
  closeStreams(): void;
  setOnAction(callback: (e: AnyEffectType) => void): void;
  addActionToStream(action: AnyEffectType): void;
  addValuesToAction(action: AnyEffectType): AnyEffectType;
  enableDebug(): void;
  setRollDebugValue(value: number): void;
  resetRollDebugValue(): void;
  setWinner(player: number): void;
  hasWinner(): boolean;
  clone(): State;
  setPlayers(player1: number, player2: number): this;
  setDeck(player: number, cardNames: string[]): void;
  enableTurnTimer(timer?: number): void;
  startTurnTimer(): void;
  stopTurnTimer(): void;
  endTurn(): void;
  addActionToLog(action: AnyEffectType): void;
  createZones(): Zone[];
  serializeData(
    playerId: number,
    hideZones?: boolean,
  ): {
    zones: {
      playerHand: ConvertedCard[];
      opponentHand:
        | import("./classes/CardInGame").HiddenConvertedCard[]
        | ConvertedCard[];
      playerDeck:
        | import("./classes/CardInGame").HiddenConvertedCard[]
        | ConvertedCard[];
      opponentDeck:
        | import("./classes/CardInGame").HiddenConvertedCard[]
        | ConvertedCard[];
      playerActiveMagi: ConvertedCard[];
      opponentActiveMagi: ConvertedCard[];
      playerMagiPile: ConvertedCard[];
      opponentMagiPile:
        | import("./classes/CardInGame").HiddenConvertedCard[]
        | ConvertedCard[];
      inPlay: (
        | import("./classes/CardInGame").HiddenConvertedCard
        | ConvertedCard
      )[];
      playerDefeatedMagi: ConvertedCard[];
      opponentDefeatedMagi: ConvertedCard[];
      playerDiscard: ConvertedCard[];
      opponentDiscard: ConvertedCard[];
    };
    continuousEffects: ContinuousEffectType[];
    step: number | null;
    turn: number | undefined;
    goesFirst: number | undefined;
    activePlayer: number;
    prompt: boolean;
    promptType: PromptTypeType | null;
    promptMessage: string | undefined;
    promptPlayer: number | undefined;
    promptGeneratedBy: string | undefined;
    promptParams: PromptParamsType;
    log: LogEntryType[];
    gameEnded: boolean;
    winner: number | boolean | null;
  };
  serializeZones(
    playerId: number,
    hideZones?: boolean,
  ): {
    playerHand: ConvertedCard[];
    opponentHand:
      | import("./classes/CardInGame").HiddenConvertedCard[]
      | ConvertedCard[];
    playerDeck:
      | import("./classes/CardInGame").HiddenConvertedCard[]
      | ConvertedCard[];
    opponentDeck:
      | import("./classes/CardInGame").HiddenConvertedCard[]
      | ConvertedCard[];
    playerActiveMagi: ConvertedCard[];
    opponentActiveMagi: ConvertedCard[];
    playerMagiPile: ConvertedCard[];
    opponentMagiPile:
      | import("./classes/CardInGame").HiddenConvertedCard[]
      | ConvertedCard[];
    inPlay: (
      | import("./classes/CardInGame").HiddenConvertedCard
      | ConvertedCard
    )[];
    playerDefeatedMagi: ConvertedCard[];
    opponentDefeatedMagi: ConvertedCard[];
    playerDiscard: ConvertedCard[];
    opponentDiscard: ConvertedCard[];
  };
  setup(): void;
  getOpponent(player: number): number;
  getZone(type: ZoneType, player?: number | null): Zone;
  getCurrentStep(): number | null;
  getActivePlayer(): number;
  getCurrentPriority(): PriorityType;
  addActions(...args: AnyEffectType[]): void;
  transformIntoActions(...args: AnyEffectType[]): void;
  removeDelayedTrigger(triggerId: string): void;
  private getNextAction;
  hasActions(): boolean;
  setSpellMetadata(metadata: any, spellId: string): void;
  getSpellMetadata(spellId: string): MetaDataRecord;
  setSpellMetaDataField(field: string, value: any, spellId: string): void;
  getMetaValue<T>(value: string | T, spellId: string | undefined): T | any;
  /**
   * Same as getMetaValue, but instead of $-variables it uses %-variables
   * $-variables are kept intact, we probably need them
   * %-variables include usual "self": link to trigger source
   */
  prepareMetaValue<T>(
    value: string | T,
    action: AnyEffectType,
    self: CardInGame,
    spellId: string,
  ): T | any;
  selectNthCardOfZone(
    player: number,
    zoneType: ZoneType,
    cardNumber: number,
    restrictions?: RestrictionObjectType[],
  ): CardInGame[];
  useSelector(
    selector: typeof SELECTOR_STATUS,
    player: null,
    argument: StatusType,
  ): CardInGame[];
  useSelector(
    selector: typeof SELECTOR_CREATURES_WITHOUT_STATUS,
    player: null,
    argument: StatusType,
  ): CardInGame[];
  useSelector(selector: typeof SELECTOR_CREATURES, player: null): CardInGame[];
  useSelector(
    selector: typeof SELECTOR_OWN_CREATURES_OF_TYPE,
    player: number,
    argument: string,
  ): CardInGame[];
  useSelector(
    selector: typeof SELECTOR_CREATURES_OF_TYPE,
    player: null,
    argument: string,
  ): CardInGame[];
  useSelector(
    selector: typeof SELECTOR_CREATURES_NOT_OF_TYPE,
    player: null,
    argument: string,
  ): CardInGame[];
  useSelector(
    selector: typeof SELECTOR_CREATURES_NOT_OF_REGION,
    player: number,
    argument: Region,
  ): CardInGame[];
  useSelector(
    selector: typeof SELECTOR_CREATURES_OF_REGION,
    player: number,
    argument: Region,
  ): CardInGame[];
  useSelector(
    selector: typeof SELECTOR_OPPONENT_ID,
    player: number | null,
    argument: number,
  ): number;
  useSelector(
    selector: typeof SELECTOR_TOP_MAGI_OF_PILE,
    player: number,
  ): CardInGame[];
  useSelector(selector: typeof SELECTOR_OWN_MAGI, player: number): CardInGame[];
  useSelector(
    selector: typeof SELECTOR_ENEMY_MAGI,
    player: number,
  ): CardInGame[];
  useSelector(
    selector: typeof SELECTOR_OWN_CREATURES,
    player: number,
  ): CardInGame[];
  useSelector(
    selector: typeof SELECTOR_CREATURES_OF_PLAYER,
    player: number,
  ): CardInGame[];
  useSelector(
    selector: typeof SELECTOR_OWN_CARDS_IN_PLAY,
    player: number,
  ): CardInGame[];
  useSelector(
    selector: typeof SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE,
    player: number,
  ): CardInGame[];
  useSelector(
    selector: typeof SELECTOR_CARDS_WITH_ENERGIZE_RATE,
    player: null,
  ): CardInGame[];
  useSelector(selector: typeof SELECTOR_RELICS, player: null): CardInGame[];
  getByProperty(
    target: CardInGame | CardWithModification,
    property: typeof PROPERTY_ABLE_TO_ATTACK,
  ): boolean;
  getByProperty(
    target: CardInGame | CardWithModification,
    property: typeof PROPERTY_CAN_ATTACK_MAGI_DIRECTLY,
  ): boolean;
  getByProperty(
    target: CardInGame | CardWithModification,
    property: typeof PROPERTY_CAN_BE_ATTACKED,
  ): boolean;
  getByProperty(
    target: CardInGame | CardWithModification,
    property: typeof PROPERTY_ATTACKS_PER_TURN,
  ): number;
  getByProperty(
    target: CardInGame | CardWithModification,
    property: typeof PROPERTY_ENERGIZE,
  ): number;
  getByProperty(
    target: CardInGame | CardWithModification,
    property: typeof PROPERTY_ENERGY_COUNT,
  ): number;
  getByProperty(
    target: CardInGame | CardWithModification,
    property: typeof PROPERTY_POWER_COST,
    subProperty: string,
  ): number;
  getByProperty(
    target: CardInGame | CardWithModification,
    property: typeof PROPERTY_CONTROLLER,
  ): number;
  getByProperty(
    target: CardInGame | CardWithModification,
    property: typeof PROPERTY_PROTECTION,
  ): ProtectionType | undefined;
  getByProperty(
    target: CardInGame | CardWithModification,
    property: typeof PROPERTY_MAGI_NAME,
  ): string;
  getByProperty(
    target: CardInGame | CardWithModification,
    property: typeof PROPERTY_TYPE,
  ): CardType;
  getByProperty(
    target: CardInGame | CardWithModification,
    property: typeof PROPERTY_CREATURE_TYPES,
  ): string[];
  getByProperty(
    target: CardInGame | CardWithModification,
    property: typeof PROPERTY_COST,
  ): CostType;
  getByProperty(
    target: CardInGame | CardWithModification,
    property: typeof PROPERTY_STATUS,
    subProperty: typeof STATUS_BURROWED,
  ): boolean;
  isCardAffectedByEffect(
    card: CardInGame,
    effect: EnrichedAction & EffectType,
  ): boolean;
  isCardAffectedByStaticAbility(
    card: CardInGame | CardWithModification,
    staticAbility: EnrichedStaticAbilityType | GameStaticAbility,
  ): boolean;
  modifyByStaticAbilities(
    target: CardInGame,
    property: PropertyType,
    subProperty?: string | null | undefined,
  ): any;
  layeredDataReducer(
    currentCard: CardWithModification,
    staticAbility: EnrichedStaticAbilityType | GameStaticAbility,
  ): CardWithModification;
  makeChecker(
    restriction: RestrictionType,
    restrictionValue: any,
  ): (card: CardInGame) => boolean;
  checkAnyCardForRestriction(
    cards: CardInGame[],
    restriction: RestrictionType,
    restrictionValue: any,
  ): boolean;
  checkAnyCardForRestrictions(
    cards: CardInGame[],
    restrictions: RestrictionObjectType[],
  ): boolean;
  checkCardsForRestriction(
    cards: CardInGame[],
    restriction: RestrictionType,
    restrictionValue: any,
  ): boolean;
  makeCardFilter(
    restrictions?: RestrictionObjectType[],
  ): (c: CardInGame) => boolean;
  getObjectOrSelf(
    action: AnyEffectType,
    self: CardInGame,
    object: string | number | boolean,
    property: boolean,
  ): any;
  replaceByReplacementEffect(action: AnyEffectType): AnyEffectType[];
  checkCondition(
    action: AnyEffectType,
    self: CardInGame,
    condition: ConditionType,
  ): any;
  matchAction(action: AnyEffectType, find: FindType, self: CardInGame): boolean;
  triggerAbilities(action: AnyEffectType): void;
  performCalculation(
    operator: OperatorType,
    operandOne: number,
    operandTwo: number,
  ): number;
  calculateTotalCost(card: CardInGame): number;
  getAvailableCards(player: number, topMagi: CardInGame): string[];
  checkPrompts(
    source: CardInGame,
    preparedActions: AnyEffectType[],
    isPower?: boolean,
    powerCost?: number,
  ): boolean;
  update(initialAction: AnyEffectType): boolean;
}
export {
  TYPE_CREATURE,
  TYPE_MAGI,
  TYPE_RELIC,
  TYPE_SPELL,
  ACTION_PASS,
  ACTION_PLAY,
  ACTION_POWER,
  ACTION_EFFECT,
  ACTION_SELECT,
  ACTION_CALCULATE,
  ACTION_ENTER_PROMPT,
  ACTION_RESOLVE_PROMPT,
  ACTION_GET_PROPERTY_VALUE,
  ACTION_ATTACK,
  ACTION_PLAYER_WINS,
  PROPERTY_ID,
  PROPERTY_TYPE,
  PROPERTY_CONTROLLER,
  PROPERTY_ENERGY_COUNT,
  PROPERTY_REGION,
  PROPERTY_COST,
  PROPERTY_ENERGIZE,
  PROPERTY_MAGI_STARTING_ENERGY,
  PROPERTY_ATTACKS_PER_TURN,
  PROPERTY_CAN_ATTACK_MAGI_DIRECTLY,
  CALCULATION_SET,
  CALCULATION_DOUBLE,
  CALCULATION_ADD,
  CALCULATION_SUBTRACT,
  CALCULATION_HALVE_ROUND_DOWN,
  CALCULATION_HALVE_ROUND_UP,
  CALCULATION_MIN,
  CALCULATION_MAX,
  CALCULATION_MULTIPLY,
  SELECTOR_CREATURES,
  SELECTOR_CREATURES_AND_MAGI,
  SELECTOR_OWN_MAGI,
  SELECTOR_ENEMY_MAGI,
  SELECTOR_CREATURES_OF_REGION,
  SELECTOR_CREATURES_NOT_OF_REGION,
  SELECTOR_OWN_CREATURES,
  SELECTOR_ENEMY_CREATURES,
  SELECTOR_TOP_MAGI_OF_PILE,
  SELECTOR_MAGI_OF_REGION,
  SELECTOR_OPPONENT_ID,
  SELECTOR_MAGI_NOT_OF_REGION,
  SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE,
  SELECTOR_CARDS_WITH_ENERGIZE_RATE,
  SELECTOR_OWN_CARDS_IN_PLAY,
  NO_PRIORITY,
  PRIORITY_PRS,
  PRIORITY_ATTACK,
  PRIORITY_CREATURES,
  PROMPT_TYPE_NUMBER,
  PROMPT_TYPE_SINGLE_CREATURE,
  PROMPT_TYPE_SINGLE_MAGI,
  PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE,
  PROMPT_TYPE_CHOOSE_CARDS,
  EFFECT_TYPE_DRAW,
  EFFECT_TYPE_RESHUFFLE_DISCARD,
  EFFECT_TYPE_MOVE_ENERGY,
  EFFECT_TYPE_ROLL_DIE,
  EFFECT_TYPE_PLAY_CREATURE,
  EFFECT_TYPE_PLAY_RELIC,
  EFFECT_TYPE_PLAY_SPELL,
  EFFECT_TYPE_CREATURE_ENTERS_PLAY,
  EFFECT_TYPE_RELIC_ENTERS_PLAY,
  EFFECT_TYPE_MAGI_IS_DEFEATED,
  EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
  EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE,
  EFFECT_TYPE_PAYING_ENERGY_FOR_RELIC,
  EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL,
  EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
  EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE,
  EFFECT_TYPE_ADD_ENERGY_TO_CREATURE_OR_MAGI,
  EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
  EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
  EFFECT_TYPE_ENERGIZE,
  EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
  EFFECT_TYPE_DISCARD_CREATURE_OR_RELIC,
  EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
  EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY,
  EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY,
  EFFECT_TYPE_PAYING_ENERGY_FOR_POWER,
  EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI,
  EFFECT_TYPE_CREATURE_DEFEATS_CREATURE,
  EFFECT_TYPE_CREATURE_IS_DEFEATED, // Possibly redundant
  EFFECT_TYPE_BEFORE_DAMAGE,
  EFFECT_TYPE_DEAL_DAMAGE,
  EFFECT_TYPE_AFTER_DAMAGE,
  EFFECT_TYPE_CREATURE_ATTACKS,
  EFFECT_TYPE_CREATURE_IS_ATTACKED,
  EFFECT_TYPE_START_OF_TURN,
  EFFECT_TYPE_END_OF_TURN,
  EFFECT_TYPE_MAGI_FLIPPED,
  EFFECT_TYPE_FIND_STARTING_CARDS,
  EFFECT_TYPE_DRAW_REST_OF_CARDS,
  REGION_UNIVERSAL,
  COST_X,
  COST_X_PLUS_ONE,
  ZONE_TYPE_HAND,
  ZONE_TYPE_IN_PLAY,
  ZONE_TYPE_DISCARD,
  ZONE_TYPE_ACTIVE_MAGI,
  ZONE_TYPE_MAGI_PILE,
  ZONE_TYPE_DECK,
  ZONE_TYPE_DEFEATED_MAGI,
};
