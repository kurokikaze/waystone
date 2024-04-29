/* global window */
import {
  ACTION_PLAY,
  ACTION_EFFECT,
  ACTION_PASS,
  ACTION_ATTACK,
  ACTION_ENTER_PROMPT,
  ACTION_RESOLVE_PROMPT,
  ACTION_PLAYER_WINS,
  ACTION_POWER,
  TYPE_CREATURE,
  PROMPT_TYPE_NUMBER,
  PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE,
  PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
  PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
  PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE,
  PROMPT_TYPE_SINGLE_CREATURE,
  PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI,
  PROMPT_TYPE_OWN_SINGLE_CREATURE,
  PROMPT_TYPE_SINGLE_MAGI,
  PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES,
  PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES,
  PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE,
  LOG_ENTRY_POWER_ACTIVATION,
  LOG_ENTRY_TARGETING,
  LOG_ENTRY_NUMBER_CHOICE,
  LOG_ENTRY_PLAY,
  PROMPT_TYPE_CHOOSE_CARDS,
  PROMPT_TYPE_ALTERNATIVE,
  PROMPT_TYPE_PAYMENT_SOURCE,
} from "moonlands/dist/const";
import { byName } from "moonlands/dist/cards";

import {
  START_POWER_ANIMATION,
  END_POWER_ANIMATION,
  START_ATTACK_ANIMATION,
  END_ATTACK_ANIMATION,
  START_RELIC_ANIMATION,
  END_RELIC_ANIMATION,
  START_SPELL_ANIMATION,
  END_SPELL_ANIMATION,
  START_PROMPT_RESOLUTION_ANIMATION,
  END_PROMPT_RESOLUTION_ANIMATION,
  ADD_TO_PACK,
  DISMISS_PACK,
  PLUS_ENERGY_ON_CREATURE,
  MINUS_ENERGY_ON_CREATURE,
  StartPowerAnimationAction,
  EndAttackAnimationAction,
  EndPowerAnimationAction,
  EndRelicAnimationAction,
  StartAttackAnimationAction,
  StartRelicAnimationAction,
  EndSpellAnimationAction,
  StartSpellAnimationAction,
  StartPromptResolutionAnimationAction,
  EndPromptResolutionAnimationAction,
  EndAnimationAction,
  START_CREATURE_ANIMATION,
  EndCreatureAnimationAction,
  END_CREATURE_ANIMATION,
  StartCreatureAnimationAction,
  CLEAR_ENTRY_ANIMATION,
  ClearEntryAnimationAction,
  MinusEnergyOnCreatureAction,
  PlusEnergyOnCreatureAction,
  START_MAGI_DEFEAT_ANIMATION,
  StartMagiDefeatAnimationAction,
  MARK_ENERGY_ANIMATION_AS_DONE,
  MarkEnergyAnimationAction,
  START_CREATURE_DISCARD_ANIMATION,
  StartCreatureDiscardAnimationAction,
} from "../actions";

import {
  MESSAGE_TYPE_POWER,
  MESSAGE_TYPE_RELIC,
  MESSAGE_TYPE_SPELL,
  MESSAGE_TYPE_PROMPT_RESOLUTION,
  MESSAGE_TYPE_CREATURE,
  ANIMATION_MAGI_DEFEATED,
  ANIMATION_CREATURE_DISCARDED,
} from "../const";

import { applyEffect } from "./applyEffect";
import { findInPlay } from "./utils";
import { ClientAction } from "../clientProtocol";
import { LogEntryType } from "moonlands/dist/types";
import { ExpandedPromptParams, MessageType, State } from "../types";
import { PROMPT_TYPE_POWER_ON_MAGI } from "moonlands/src/const";

const INITIAL_STATE = "setInitialState";

export const defaultState: State = {
  zones: {
    playerHand: [],
    playerDeck: [],
    playerDiscard: [],
    playerActiveMagi: [],
    playerMagiPile: [],
    playerDefeatedMagi: [],
    inPlay: [],
    opponentHand: [],
    opponentDeck: [],
    opponentDiscard: [],
    opponentActiveMagi: [],
    opponentMagiPile: [],
    opponentDefeatedMagi: [],
  },
  continuousEffects: [],
  staticAbilities: [],
  animation: null,
  message: {
    type: "power",
    source: "TestSource",
    power: "Power Name",
  },
  step: null,
  log: [],
  turnTimer: false,
  turnSecondsLeft: null,
  gameEnded: false,
  winner: null,
  packs: [],
  energyLosses: [],
  energyLossId: 0,
  energyPrompt: {
    freeEnergy: 0,
    cards: {},
  },
  prompt: false,
  promptPlayer: null,
  promptType: null,
  promptMessage: null,
  promptParams: null,
  promptGeneratedBy: null,
  promptAvailableCards: [],
  activePlayer: 0,
  lastPositions: {},
  energyAnimationsShown: new Set<number>(),
};

type InitialStateAction = {
  type: typeof INITIAL_STATE;
  state: State;
};

type AnimationAction =
  | StartPowerAnimationAction
  | EndPowerAnimationAction
  | StartAttackAnimationAction
  | EndAttackAnimationAction
  | StartSpellAnimationAction
  | EndSpellAnimationAction
  | StartRelicAnimationAction
  | EndRelicAnimationAction
  | StartCreatureAnimationAction
  | EndCreatureAnimationAction
  | StartPromptResolutionAnimationAction
  | EndPromptResolutionAnimationAction
  | ClearEntryAnimationAction
  | StartMagiDefeatAnimationAction
  | StartCreatureDiscardAnimationAction
  | MarkEnergyAnimationAction
  | EndAnimationAction;

type AddToPackAction = {
  type: typeof ADD_TO_PACK;
  leader: string;
  hunter: string;
};

type DismissPackAction = {
  type: typeof DISMISS_PACK;
  leader: string;
};

type InternalAction = /*TimeNotificationAction | TimerTickAction |*/
  | InitialStateAction
  | AnimationAction
  | AddToPackAction
  | DismissPackAction
  | PlusEnergyOnCreatureAction
  | MinusEnergyOnCreatureAction;

type ReducerAction = ClientAction | InternalAction;

const reducer = (state = defaultState, action: ReducerAction): State => {
  switch (action.type) {
    case INITIAL_STATE: {
      return {
        ...state,
        ...action.state,
      };
    }
    // case ACTION_TIME_NOTIFICATION: {
    // 	return {
    // 		...state,
    // 		turnTimer: true,
    // 		turnSecondsLeft: 20,
    // 	};
    // }
    // case ACTION_TIMER_TICK: {
    // 	return {
    // 		...state,
    // 		turnSecondsLeft: typeof state.turnSecondsLeft === 'number' ? Math.max(state.turnSecondsLeft - 1, 0) : null,
    // 	};
    // }
    case ACTION_PLAY: {
      const newLogEntry: LogEntryType = {
        type: LOG_ENTRY_PLAY,
        card: action.payload.card.card,
        player: action.player,
      };

      return {
        ...state,
        log: [...state.log, newLogEntry],
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
      return {
        ...state,
        step: action.newStep,
        packs: [],
        energyLosses: state.energyLosses
          .map((loss) => ({ ...loss, ttl: loss.ttl - 1 }))
          .filter((loss) => loss.ttl > 0),
      };
    }
    /* Animations */
    case START_POWER_ANIMATION: {
      return {
        ...state,
        message: {
          type: MESSAGE_TYPE_POWER,
          source: action.source,
          power: action.power,
        },
      };
    }
    case END_POWER_ANIMATION: {
      return {
        ...state,
        message: null,
      };
    }
    case START_ATTACK_ANIMATION: {
      console.log("Start attack animation");
      console.dir(action);
      return {
        ...state,
        animation: {
          type: "attack",
          source: action.source,
          target: action.target,
          additionalAttacker: action.additionalAttacker,
        },
      };
    }
    case END_ATTACK_ANIMATION: {
      return {
        ...state,
        animation: null,
      };
    }
    case START_RELIC_ANIMATION: {
      return {
        ...state,
        message: {
          type: MESSAGE_TYPE_RELIC,
          card: action.card,
          player: action.player,
        },
      };
    }
    case END_RELIC_ANIMATION: {
      return {
        ...state,
        message: null,
      };
    }
    case START_SPELL_ANIMATION: {
      return {
        ...state,
        message: {
          type: MESSAGE_TYPE_SPELL,
          card: action.card,
          player: action.player,
        },
      };
    }
    case END_SPELL_ANIMATION: {
      return {
        ...state,
        message: null,
      };
    }
    case START_CREATURE_ANIMATION: {
      return {
        ...state,
        message: {
          type: MESSAGE_TYPE_CREATURE,
          card: action.card,
          player: action.player,
        },
      };
    }
    case END_CREATURE_ANIMATION: {
      return {
        ...state,
        message: null,
      };
    }
    /* End Animations */
    case ADD_TO_PACK: {
      return {
        ...state,
        packs: state.packs.some((pack) => pack.leader === action.leader)
          ? state.packs.map((pack) =>
              pack.leader === action.leader
                ? { ...pack, hunters: [...pack.hunters, action.hunter] }
                : pack,
            )
          : [
              ...state.packs,
              { leader: action.leader, hunters: [action.hunter] },
            ],
      };
    }
    case DISMISS_PACK: {
      return {
        ...state,
        packs: state.packs.filter((pack) => pack.leader !== action.leader),
      };
    }
    case ACTION_POWER: {
      const sourceId = action.source.id;
      const sourceName = action.power;
      var newLogEntry: LogEntryType | null = null;

      const card = findInPlay(state, sourceId);

      if (card) {
        newLogEntry = {
          type: LOG_ENTRY_POWER_ACTIVATION,
          card: card.card,
          name: sourceName,
          player: action.player,
        };
      }

      return {
        ...state,
        zones: {
          ...state.zones,
          inPlay: state.zones.inPlay.map((card) =>
            card.id === sourceId
              ? {
                  ...card,
                  data: {
                    ...card.data,
                    actionsUsed: [...card.data.actionsUsed, sourceName],
                  },
                }
              : card,
          ),
          playerActiveMagi: state.zones.playerActiveMagi.map((card) =>
            card.id === sourceId
              ? {
                  ...card,
                  data: {
                    ...card.data,
                    actionsUsed: [...card.data.actionsUsed, sourceName],
                  },
                }
              : card,
          ),
          opponentActiveMagi: state.zones.opponentActiveMagi.map((card) =>
            card.id === sourceId
              ? {
                  ...card,
                  data: {
                    ...card.data,
                    actionsUsed: [...card.data.actionsUsed, sourceName],
                  },
                }
              : card,
          ),
        },
        log: newLogEntry ? [...state.log, newLogEntry] : state.log,
      };
    }
    case ACTION_ENTER_PROMPT: {
      var promptParams: ExpandedPromptParams | null =
        "promptParams" in action
          ? (action.promptParams as ExpandedPromptParams)
          : null;
      var energyPrompt = state.energyPrompt;

      switch (action.promptType) {
        case PROMPT_TYPE_NUMBER: {
          promptParams = {
            min: action.min,
            max: action.max,
          };
          break;
        }
        case PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE: {
          promptParams = {
            source: action.source.id,
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
        case PROMPT_TYPE_CHOOSE_CARDS: {
          promptParams = {
            startingCards: action?.promptParams.startingCards,
            availableCards: action?.promptParams.availableCards,
          };
          break;
        }
        case PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE: {
          const realNumberOfCards = Math.min(
            action.cards.length,
            action.numberOfCards,
          );
          if (realNumberOfCards === 0) {
            return state;
          }
          promptParams = {
            zone: action.zone,
            ...(action.restrictions
              ? { restrictions: action.restrictions }
              : {}),
            cards: action.cards,
            zoneOwner: action.zoneOwner,
            numberOfCards: realNumberOfCards,
          };
          console.dir(promptParams);
          break;
        }
        case PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE: {
          promptParams = {
            zone: action.zone,
            cards: action.cards,
            zoneOwner: action.zoneOwner,
            numberOfCards: action.numberOfCards,
          };
          break;
        }
        case PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE: {
          const realNumberOfCards = Math.min(
            action.cards.length,
            action.numberOfCards,
          );
          if (realNumberOfCards === 0) {
            return state;
          }
          promptParams = {
            zone: action.zone,
            ...(action.restrictions
              ? { restrictions: action.restrictions }
              : {}),
            cards: action.cards,
            zoneOwner: action.zoneOwner,
            numberOfCards: realNumberOfCards,
          };
          break;
        }
        case PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES: {
          energyPrompt = {
            freeEnergy: 0,
            cards: Object.fromEntries(
              state.zones.inPlay
                .filter(
                  ({ card, data }) =>
                    data.controller === 1 &&
                    byName(card)?.type === TYPE_CREATURE,
                )
                .map(({ id, data }) => [id, data.energy]),
            ),
          };
          promptParams = promptParams || {};
          break;
        }
        case PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES: {
          energyPrompt = {
            freeEnergy: action.amount,
            cards: Object.fromEntries(
              state.zones.inPlay
                .filter(
                  ({ card, data }) =>
                    data.controller === 1 &&
                    byName(card)?.type === TYPE_CREATURE,
                )
                .map(({ id }) => [id, 0]),
            ),
          };
          break;
        }
        case PROMPT_TYPE_POWER_ON_MAGI: {
          promptParams = {
            magi: action?.magi,
          };
          break;
        }
        case PROMPT_TYPE_ALTERNATIVE: {
          promptParams = {
            alternatives: action.alternatives,
          };
          break;
        }
        case PROMPT_TYPE_PAYMENT_SOURCE: {
          // A bit of a hack
          action.message = `Select who should pay ${action.amount} energy for a creature`;
          promptParams = {
            paymentType: action.paymentType,
            paymentAmount: action.amount,
          };
        }
      }

      return {
        ...state,
        prompt: true,
        promptPlayer: action.player,
        promptType: action.promptType,
        promptMessage: action?.message || null,
        promptParams,
        // promptGeneratedBy: (action?.generatedBy || ''),
        promptAvailableCards:
          "availableCards" in action
            ? (action.availableCards as string[])
            : null,
        energyPrompt,
      };
    }
    case START_PROMPT_RESOLUTION_ANIMATION: {
      var messageData: MessageType | null = state.message
        ? { ...state.message }
        : state.message;
      if (typeof action.target === "number") {
        messageData = {
          type: MESSAGE_TYPE_PROMPT_RESOLUTION,
          chosenNumber: action.target,
        };
      } else {
        messageData = {
          type: MESSAGE_TYPE_PROMPT_RESOLUTION,
          chosenTarget: action.target,
        };
      }

      return {
        ...state,
        message: messageData,
      };
    }
    case END_PROMPT_RESOLUTION_ANIMATION: {
      return {
        ...state,
        message: null,
      };
    }
    case ACTION_RESOLVE_PROMPT: {
      var promptLogEntry: LogEntryType | null = null;

      if (
        action.target &&
        (state.promptType === PROMPT_TYPE_SINGLE_CREATURE ||
          state.promptType === PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE ||
          state.promptType === PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI ||
          state.promptType === PROMPT_TYPE_OWN_SINGLE_CREATURE ||
          state.promptType === PROMPT_TYPE_SINGLE_MAGI)
      ) {
        const target = findInPlay(state, action.target);
        if (target) {
          promptLogEntry = {
            type: LOG_ENTRY_TARGETING,
            card: target.card,
            player: action.player,
          };
        }
      } else if (state.promptType === PROMPT_TYPE_NUMBER) {
        promptLogEntry = {
          type: LOG_ENTRY_NUMBER_CHOICE,
          number: action?.number || 0,
          player: action.player,
        };
      }

      return {
        ...state,
        prompt: false,
        promptPlayer: null,
        promptType: null,
        promptParams: null,
        promptGeneratedBy: null,
        promptAvailableCards: null,
        log: promptLogEntry ? [...state.log, promptLogEntry] : state.log,
      };
    }
    case ACTION_ATTACK: {
      const attackerIds = [
        action.source,
        ...(action.additionalAttackers || []),
      ];
      return {
        ...state,
        zones: {
          ...state.zones,
          inPlay: state.zones.inPlay.map((card) => {
            if (attackerIds.includes(card.id)) {
              return {
                ...card,
                data: {
                  ...card.data,
                  attacked: card.data.attacked + 1,
                  hasAttacked: true,
                },
              };
            }
            if (card.id === action.target) {
              return {
                ...card,
                data: {
                  ...card.data,
                  wasAttacked: true,
                },
              };
            }
            return card;
          }),
        },
      };
    }
    case ACTION_EFFECT: {
      return applyEffect(state, action);
    }
    case PLUS_ENERGY_ON_CREATURE: {
      return {
        ...state,
        energyPrompt: {
          freeEnergy: state.energyPrompt.freeEnergy - 1,
          cards: {
            ...state.energyPrompt.cards,
            [action.cardId]: state.energyPrompt.cards[action.cardId] + 1,
          },
        },
      };
    }
    case MINUS_ENERGY_ON_CREATURE: {
      return {
        ...state,
        energyPrompt: {
          freeEnergy: state.energyPrompt.freeEnergy + 1,
          cards: {
            ...state.energyPrompt.cards,
            [action.cardId]: state.energyPrompt.cards[action.cardId] - 1,
          },
        },
      };
    }
    case CLEAR_ENTRY_ANIMATION: {
      const {
        [action.id]: [],
        ...positions
      } = state.lastPositions;
      return {
        ...state,
        lastPositions: positions,
      };
    }
    case MARK_ENERGY_ANIMATION_AS_DONE: {
      // This is stupid, but should work
      // Maybe it is better to move this in a context
      state.energyAnimationsShown.add(action.id);
      return state;
    }
    case START_MAGI_DEFEAT_ANIMATION: {
      return {
        ...state,
        animation: {
          type: ANIMATION_MAGI_DEFEATED,
          source: "",
          target: action.id,
        },
      };
    }
    case START_CREATURE_DISCARD_ANIMATION: {
      return {
        ...state,
        animation: {
          type: ANIMATION_CREATURE_DISCARDED,
          source: "",
          target: action.id,
        },
      };
    }
    default: {
      return state;
    }
  }
};

export default reducer;
