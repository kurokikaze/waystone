declare module '@moonlands_old/dist/const' {
  export declare const ACTION_PASS = "actions/pass";
  export declare const ACTION_PLAY = "actions/play";
  export declare const ACTION_POWER = "actions/power";
  export declare const ACTION_EFFECT = "actions/effect";
  export declare const ACTION_SELECT = "actions/select";
  export declare const ACTION_CALCULATE = "actions/calculate";
  export declare const ACTION_ENTER_PROMPT = "actions/enter_prompt";
  export declare const ACTION_RESOLVE_PROMPT = "actions/resolve_prompt";
  export declare const ACTION_GET_PROPERTY_VALUE = "actions/get_property_value";
  export declare const ACTION_ATTACK = "actions/attack";
  export declare const ACTION_CONCEDE = "actions/concede";
  export declare const ACTION_PLAYER_WINS = "actions/player_wins";
  export declare const ACTION_NONE = "actions/none";
  export declare const ACTION_TIME_NOTIFICATION = "actions/time_notification";
  export declare const ACTION_EXIT_PROMPTS = "actions/exit_prompts";
  export declare const ACTION_CREATE_CONTINOUS_EFFECT = "actions/create_continuous_effect";
  export declare const ACTION_PROPERTY = "special_properties/action_property";
  export declare const CARD_COUNT = "special_properties/card_count";
  export declare const PROPERTY_ID = "properties/id";
  export declare const PROPERTY_TYPE = "properties/type";
  export declare const PROPERTY_ENERGY_COUNT = "properties/energy_count";
  export declare const PROPERTY_CONTROLLER = "properties/controller";
  export declare const PROPERTY_REGION = "properties/region";
  export declare const PROPERTY_COST = "properties/cost";
  export declare const PROPERTY_ENERGIZE = "properties/energize";
  export declare const PROPERTY_CREATURE_TYPES = "properties/creature_types";
  export declare const PROPERTY_MAGI_NAME = "properties/magi_name";
  export declare const PROPERTY_MAGI_STARTING_ENERGY = "properties/magi_starting_energy";
  export declare const PROPERTY_ATTACKS_PER_TURN = "properties/attacks_per_turn";
  export declare const PROPERTY_ABLE_TO_ATTACK = "properties/able_to_attack";
  export declare const PROPERTY_CAN_BE_ATTACKED = "properties/can_be_attacked";
  export declare const PROPERTY_CAN_ATTACK_MAGI_DIRECTLY = "properties/can_attack_magi_directly";
  export declare const PROPERTY_POWER_COST = "properties/power_cost";
  export declare const PROPERTY_ENERGY_LOSS_THRESHOLD = "properties/energy_loss_threshold";
  export declare const PROPERTY_PROTECTION = "properties/protection";
  export declare const PROPERTY_STATUS_DEFEATED_CREATURE = "properties/status/defeated_creature";
  export declare const PROPERTY_STATUS_WAS_ATTACKED = "properties/status/was_attacked";
  export declare const PROPERTY_STATUS = "properties/status";
  export declare const SELECTOR_OPPONENT_ID = "selectors/opponent_id";
  export declare const SELECTOR_CREATURES = "selectors/creatures";
  export declare const SELECTOR_CREATURES_OF_PLAYER = "selectors/creatures_of_player";
  export declare const SELECTOR_MAGI = "selectors/magi";
  export declare const SELECTOR_CREATURES_AND_MAGI = "selectors/creatures_and_magi";
  export declare const SELECTOR_OWN_MAGI = "selectors/own_magi";
  export declare const SELECTOR_OWN_MAGI_SINGLE = "selectors/own_magi_single";
  export declare const SELECTOR_TOP_MAGI_OF_PILE = "selectors/top_magi_of_pile";
  export declare const SELECTOR_ENEMY_MAGI = "selectors/enemy_magi";
  export declare const SELECTOR_CREATURES_OF_REGION = "selectors/creatures_of_region";
  export declare const SELECTOR_CREATURES_NOT_OF_REGION = "selectors/creatures_not_of_region";
  export declare const SELECTOR_MAGI_OF_REGION = "selectors/magi_of_region";
  export declare const SELECTOR_MAGI_NOT_OF_REGION = "selectors/magi_not_of_region";
  export declare const SELECTOR_OWN_CREATURES = "selectors/own_creatures";
  export declare const SELECTOR_ENEMY_CREATURES = "selectors/enemy_creatures";
  export declare const SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE = "selectors/own_cards_with_energize_rate";
  export declare const SELECTOR_CARDS_WITH_ENERGIZE_RATE = "selectors/cards_with_energize_rate";
  export declare const SELECTOR_OWN_CARDS_IN_PLAY = "selectors/own_cards_in_play";
  export declare const SELECTOR_CREATURES_OF_TYPE = "selectors/creatures_of_type";
  export declare const SELECTOR_CREATURES_NOT_OF_TYPE = "selectors/creatures_not_of_type";
  export declare const SELECTOR_OWN_CREATURES_OF_TYPE = "selectors/own_creatures_of_type";
  export declare const SELECTOR_OTHER_CREATURES_OF_TYPE = "selectors/other_creatures_of_type";
  export declare const SELECTOR_RELICS = "selectors/relics";
  export declare const SELECTOR_OWN_SPELLS_IN_HAND = "selectors/own_spells_in_hand";
  export declare const SELECTOR_OWN_CREATURES_WITH_STATUS = "selectors/own_creatures_with_status";
  export declare const SELECTOR_CREATURES_WITHOUT_STATUS = "selectors/creatures_without_status";
  export declare const SELECTOR_STATUS = "selectors/status";
  export declare const SELECTOR_ID = "selectors/id";
  export declare const SELECTOR_OWN_CREATURE_WITH_LEAST_ENERGY = "selectors/own_creature_with_least_energy";
  export declare const STATUS_BURROWED = "status/burrowed";
  export declare const STATUS_FROZEN = "status/frozen";
  export declare const CALCULATION_SET = "calculations/set";
  export declare const CALCULATION_DOUBLE = "calculations/double";
  export declare const CALCULATION_ADD = "calculations/add";
  export declare const CALCULATION_SUBTRACT = "calculations/subtract";
  export declare const CALCULATION_MULTIPLY = "calculations/multiply";
  export declare const CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE = "calculations/subtract_to_minimum_of_one";
  export declare const CALCULATION_HALVE_ROUND_DOWN = "calculations/halve_round_down";
  export declare const CALCULATION_HALVE_ROUND_UP = "calculations/halve_round_up";
  export declare const CALCULATION_MIN = "calculations/min";
  export declare const CALCULATION_MAX = "calculations/max";
  export declare const REGION_ARDERIAL = "regions/arderial";
  export declare const REGION_CALD = "regions/cald";
  export declare const REGION_NAROOM = "regions/naroom";
  export declare const REGION_OROTHE = "regions/orothe";
  export declare const REGION_UNDERNEATH = "regions/underneath";
  export declare const REGION_BOGRATH = "regions/bograth";
  export declare const REGION_UNIVERSAL = "regions/universal";
  export declare const PROTECTION_FROM_SPELLS = "protection/from/spells";
  export declare const PROTECTION_FROM_EFFECTS = "protection/from/effects";
  export declare const PROTECTION_FROM_POWERS = "protection/from/powers";
  export declare const PROTECTION_FROM_ATTACKS = "protection/from/attacks";
  export declare const PROTECTION_TYPE_ENERGY_GAIN = "protection/type/energy_gain";
  export declare const PROTECTION_TYPE_ENERGY_LOSS = "protection/type/energy_loss";
  export declare const PROTECTION_TYPE_DISCARDING_FROM_PLAY = "protection/type/discarding_from_play";
  export declare const PROTECTION_TYPE_GENERAL = "protection/type/general";
  export declare const EFFECT_TYPE_NONE = "effects/none";
  export declare const EFFECT_TYPE_DRAW = "effects/draw";
  export declare const EFFECT_TYPE_DRAW_N_CARDS = "effects/draw_n_cards";
  export declare const EFFECT_TYPE_START_STEP = "effects/start_step";
  export declare const EFFECT_TYPE_START_TURN = "effects/start_turn";
  export declare const EFFECT_TYPE_RESHUFFLE_DISCARD = "effects/reshuffle_discard";
  export declare const EFFECT_TYPE_ATTACK = "effects/attack";
  export declare const EFFECT_TYPE_BEFORE_DAMAGE = "effects/before_damage";
  export declare const EFFECT_TYPE_ATTACKER_DEALS_DAMAGE = "effects/attacker_deals_damage";
  export declare const EFFECT_TYPE_DEFENDER_DEALS_DAMAGE = "effects/defender_deals_damage";
  export declare const EFFECT_TYPE_DEAL_DAMAGE = "effects/deal_damage";
  export declare const EFFECT_TYPE_AFTER_DAMAGE = "effects/after_damage";
  export declare const EFFECT_TYPE_CREATURE_DEFEATS_CREATURE = "effects/creature_defeats_creature";
  export declare const EFFECT_TYPE_CREATURE_IS_DEFEATED = "effects/creature_is_defeated";
  export declare const EFFECT_TYPE_DEFEAT_MAGI = "effects/defeat_magi";
  export declare const EFFECT_TYPE_MAGI_IS_DEFEATED = "effects/magi_is_defeated";
  export declare const EFFECT_TYPE_ROLL_DIE = "effects/roll_die";
  export declare const EFFECT_TYPE_MOVE_ENERGY = "effects/move_energy";
  export declare const EFFECT_TYPE_PLAY_CREATURE = "effects/play_creature";
  export declare const EFFECT_TYPE_PLAY_RELIC = "effects/play_relic";
  export declare const EFFECT_TYPE_PLAY_SPELL = "effects/play_spell";
  export declare const EFFECT_TYPE_CREATURE_ENTERS_PLAY = "effects/creature_enters_play";
  export declare const EFFECT_TYPE_RELIC_ENTERS_PLAY = "effects/relic_enters_play";
  export declare const EFFECT_TYPE_PAYING_ENERGY_FOR_RELIC = "effects/paying_energy_for_relic";
  export declare const EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL = "effects/paying_energy_for_spell";
  export declare const EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE = "effects/paying_energy_for_creature";
  export declare const EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE = "effects/starting_energy_on_creature";
  export declare const EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES = "effects/move_card_between_zones";
  export declare const EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES = "effects/move_cards_between_zones";
  export declare const EFFECT_TYPE_CARD_MOVED_BETWEEN_ZONES = "effects/card_moved_between_zones";
  export declare const EFFECT_TYPE_CONDITIONAL = "effects/conditional";
  export declare const EFFECT_TYPE_ADD_ENERGY_TO_CREATURE_OR_MAGI = "effects/add_energy_to_creature_or_magi";
  export declare const EFFECT_TYPE_ADD_ENERGY_TO_CREATURE = "effects/add_energy_to_creature";
  export declare const EFFECT_TYPE_ADD_ENERGY_TO_MAGI = "effects/add_energy_to_magi";
  export declare const EFFECT_TYPE_ADD_STARTING_ENERGY_TO_MAGI = "effects/add_starting_energy_to_magi";
  export declare const EFFECT_TYPE_ENERGIZE = "effects/energize";
  export declare const EFFECT_TYPE_DAMAGE_STEP = "effects/damage_step";
  export declare const EFFECT_TYPE_RETURN_CREATURE_DISCARDING_ENERGY = "effects/return_creature_discarding_energy";
  export declare const EFFECT_TYPE_RETURN_CREATURE_RETURNING_ENERGY = "effects/return_creature_returning_energy";
  export declare const EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE = "effects/discard_energy_from_creature";
  export declare const EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURES = "effects/discard_energy_from_creatures";
  export declare const EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI = "effects/discard_energy_from_magi";
  export declare const EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY = "effects/discard_creature_from_play";
  export declare const EFFECT_TYPE_DISCARD_CREATURE_OR_RELIC = "effects/discard_creature_or_relic";
  export declare const EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI = "effects/discard_energy_from_creature_or_magi";
  export declare const EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY = "effects/restore_creature_to_starting_energy";
  export declare const EFFECT_TYPE_PAYING_ENERGY_FOR_POWER = "effects/paying_energy_for_power";
  export declare const EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY = "effects/discard_relic_from_play";
  export declare const EFFECT_TYPE_CREATURE_ATTACKS = "effects/creature_attacks";
  export declare const EFFECT_TYPE_CREATURE_IS_ATTACKED = "effects/creature_is_attacked";
  export declare const EFFECT_TYPE_BEFORE_DRAWING_CARDS_IN_DRAW_STEP = "effects/before_drawing_cards_in_draw_step";
  export declare const EFFECT_TYPE_DRAW_CARDS_IN_DRAW_STEP = "effects/draw_cards_in_draw_step";
  export declare const EFFECT_TYPE_START_OF_TURN = "effects/start_of_turn";
  export declare const EFFECT_TYPE_END_OF_TURN = "effects/end_of_turn";
  export declare const EFFECT_TYPE_MAGI_FLIPPED = "effects/magi_flipped";
  export declare const EFFECT_TYPE_FIND_STARTING_CARDS = "effects/find_starting_cards";
  export declare const EFFECT_TYPE_DRAW_REST_OF_CARDS = "effects/draw_rest_of_cards";
  export declare const EFFECT_TYPE_DISCARD_CARDS_FROM_HAND = "effects/discard_cards_from_hand";
  export declare const EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE = "effects/forbid_attack_to_creature";
  export declare const EFFECT_TYPE_ADD_DELAYED_TRIGGER = "effects/add_delayed_trigger";
  export declare const EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT = "effects/create_continuous_effect";
  export declare const EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES = "effects/rearrange_energy_on_creatures";
  export declare const EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES = "effects/distribute_energy_on_creatures";
  export declare const EFFECT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES = "effects/distribute_damage_on_creatures";
  export declare const EXPIRATION_OPPONENT_TURNS = "expiration/opponents_turns";
  export declare const EXPIRATION_PLAYER_TURNS = "expirations/players_turns";
  export declare const EXPIRATION_ANY_TURNS = "expirations/any_turns";
  export declare const EXPIRATION_CREATURE_LEAVES_PLAY = "expirations/creature_leaves_play";
  export declare const EXPIRATION_NEVER = "expirations/never";
  export declare const NO_PRIORITY = 0;
  export declare const PRIORITY_PRS = 1;
  export declare const PRIORITY_ATTACK = 2;
  export declare const PRIORITY_CREATURES = 3;
  export declare const PROMPT_TYPE_CHOOSE_CARDS = "prompt/choose_cards";
  export declare const PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE = "prompt/choose_n_cards_from_zone";
  export declare const PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE = "prompt/choose_up_to_n_cards_from_zone";
  export declare const PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE = "prompt/any_creature_except_source";
  export declare const PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI = "prompt/creature_or_magi";
  export declare const PROMPT_TYPE_SINGLE_CREATURE = "prompt/creature";
  export declare const PROMPT_TYPE_OWN_SINGLE_CREATURE = "prompt/own_creature";
  export declare const PROMPT_TYPE_SINGLE_CREATURE_FILTERED = "prompt/creature_filtered";
  export declare const PROMPT_TYPE_NUMBER_OF_CREATURES = "prompt/number_of_creatures";
  export declare const PROMPT_TYPE_NUMBER_OF_CREATURES_FILTERED = "prompt/number_of_creatures_filtered";
  export declare const PROMPT_TYPE_SINGLE_MAGI = "prompt/magi";
  export declare const PROMPT_TYPE_RELIC = "prompt/relic";
  export declare const PROMPT_TYPE_NUMBER = "prompt/number";
  export declare const PROMPT_TYPE_MAY_ABILITY = "prompt/may_ability";
  export declare const PROMPT_TYPE_MAGI_WITHOUT_CREATURES = "prompt/magi_without_creatures";
  export declare const PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES = "prompt/rearrange_energy_on_creatures";
  export declare const PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES = "prompt/distribute_energy_on_creatures";
  export declare const PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES = "prompt/distribute_damage_on_creatures";
  export declare const PROMPT_TYPE_PLAYER = "prompt/player";
  export declare const RESTRICTION_TYPE = "restrictions/type";
  export declare const RESTRICTION_ENERGY_LESS_THAN_STARTING = "restrictions/energy_less_than_starting";
  export declare const RESTRICTION_ENERGY_LESS_THAN = "restrictions/energy_less_than";
  export declare const RESTRICTION_OWN_CREATURE = "restrictions/own_creature";
  export declare const RESTRICTION_OPPONENT_CREATURE = "restrictions/opponent_creature";
  export declare const RESTRICTION_REGION = "restrictions/region";
  export declare const RESTRICTION_REGION_IS_NOT = "restrictions/region_is_not";
  export declare const RESTRICTION_CREATURE_TYPE = "restrictions/creature_type";
  export declare const RESTRICTION_PLAYABLE = "restrictions/card_playable";
  export declare const RESTRICTION_CREATURE_WAS_ATTACKED = "restrictions/creature_was_attacked";
  export declare const RESTRICTION_MAGI_WITHOUT_CREATURES = "restrictions/magi_without_creatures";
  export declare const RESTRICTION_STATUS = "restrictions/status";
  export declare const RESTRICTION_EXCEPT_SOURCE = "restrictions/except_source";
  export declare const RESTRICTION_ENERGY_EQUALS = "restrictions/energy_equals";
  export declare const TYPE_CREATURE = "types/creature";
  export declare const TYPE_MAGI = "types/magi";
  export declare const TYPE_RELIC = "types/relic";
  export declare const TYPE_SPELL = "types/spell";
  export declare const COST_X = "X";
  export declare const COST_X_PLUS_ONE = "X_PLUS_ONE";
  export declare const ZONE_TYPE_ACTIVE_MAGI = "zones/active_magi";
  export declare const ZONE_TYPE_MAGI_PILE = "zones/magi_pile";
  export declare const ZONE_TYPE_DEFEATED_MAGI = "zones/defeated_magi";
  export declare const ZONE_TYPE_DECK = "zones/deck";
  export declare const ZONE_TYPE_IN_PLAY = "zones/in_play";
  export declare const ZONE_TYPE_DISCARD = "zones/discard";
  export declare const ZONE_TYPE_HAND = "zones/hand";
  export declare const LOG_ENTRY_PLAY = "log_entry/play";
  export declare const LOG_ENTRY_DRAW = "log_entry/draw";
  export declare const LOG_ENTRY_CHOOSES_STARTING_CARDS = "log_entry/choose_starting_cards";
  export declare const LOG_ENTRY_POWER_ACTIVATION = "log_entry/power_activation";
  export declare const LOG_ENTRY_CREATURE_DISCARDED_FROM_PLAY = "log_entry/creature_discarded_from_play";
  export declare const LOG_ENTRY_RELIC_DISCARDED_FROM_PLAY = "log_entry/relic_discarded_from_play";
  export declare const LOG_ENTRY_TARGETING = "log_entry/targeting";
  export declare const LOG_ENTRY_NUMBER_CHOICE = "log_entry/number_choice";
  export declare const LOG_ENTRY_ATTACK = "log_entry/attack";
  export declare const LOG_ENTRY_CREATURE_ENERGY_LOSS = "log_entry/creature_energy_loss";
  export declare const LOG_ENTRY_MAGI_ENERGY_LOSS = "log_entry/magi_energy_loss";
  export declare const LOG_ENTRY_CREATURE_ENERGY_GAIN = "log_entry/creature_energy_gain";
  export declare const LOG_ENTRY_MAGI_ENERGY_GAIN = "log_entry/magi_energy_gain";
  export declare const LOG_ENTRY_MAGI_DEFEATED = "log_entry/magi_defeated";
}
