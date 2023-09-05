import { MetaDataRecord, State } from 'moonlands';
import CardInGame from 'moonlands/dist/classes/CardInGame.js';
import {
	ACTION_PASS,
	ACTION_PLAY,
	ACTION_ENTER_PROMPT,
	ACTION_EFFECT,
	ACTION_POWER,
	ACTION_ATTACK,
	ACTION_PLAYER_WINS,

	PROMPT_TYPE_NUMBER,
	PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
	PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE,
	PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES,
	PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES,
	PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE,
	PROMPT_TYPE_CHOOSE_CARDS,

	EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
	EFFECT_TYPE_PAYING_ENERGY_FOR_POWER,
	EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE,
	EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL,
	EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
	EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
	EFFECT_TYPE_MOVE_ENERGY,
	EFFECT_TYPE_CARD_MOVED_BETWEEN_ZONES,
	EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
	EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
	EFFECT_TYPE_ATTACK,
	EFFECT_TYPE_CREATURE_ATTACKS,
	EFFECT_TYPE_MAGI_IS_DEFEATED,
	EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE,
	EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES,
	EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES,
	EFFECT_TYPE_PLAY_CREATURE,
	EFFECT_TYPE_DISCARD_RESHUFFLED,
	EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE,
	EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
	EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES,
	EFFECT_TYPE_DAMAGE_STEP,
	EFFECT_TYPE_DEAL_DAMAGE,
	EFFECT_TYPE_DEFENDER_DEALS_DAMAGE,
	EFFECT_TYPE_DIE_ROLLED,

	ZONE_TYPE_DECK,
	ZONE_TYPE_MAGI_PILE,
	ZONE_TYPE_HAND,
	EFFECT_TYPE_ATTACKER_DEALS_DAMAGE,
	EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI,
	EFFECT_TYPE_BEFORE_DAMAGE,
	EFFECT_TYPE_CREATURE_DEFEATS_CREATURE,
	EFFECT_TYPE_CREATURE_IS_DEFEATED,
	EFFECT_TYPE_RETURN_CREATURE_RETURNING_ENERGY,
	EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE,
	EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI,
	EFFECT_TYPE_END_OF_TURN,
	EFFECT_TYPE_START_OF_TURN,
	ZONE_TYPE_ACTIVE_MAGI,
	ZONE_TYPE_DEFEATED_MAGI,
	ZONE_TYPE_DISCARD,
	ZONE_TYPE_IN_PLAY,
	EFFECT_TYPE_DRAW,
	ACTION_RESOLVE_PROMPT,
	PROMPT_TYPE_OWN_SINGLE_CREATURE,
	PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE,
	PROMPT_TYPE_MAGI_WITHOUT_CREATURES,
	PROMPT_TYPE_RELIC,
	PROMPT_TYPE_SINGLE_CREATURE,
	PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
	PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI,
	PROMPT_TYPE_SINGLE_MAGI,
	PROPERTY_CONTROLLER,
	PROMPT_TYPE_MAY_ABILITY,
	EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT,
	EFFECT_TYPE_START_STEP,
	PROMPT_TYPE_PLAYER,
	EFFECT_TYPE_PLAY_SPELL,
	PROMPT_TYPE_POWER_ON_MAGI,
	PROMPT_TYPE_PAYMENT_SOURCE,
} from 'moonlands/dist/const.js';
import { ZoneType } from 'moonlands/dist/types/common.js';
import { AnyEffectType, NormalPlayType } from 'moonlands/dist/types/index.js';

import clone from 'moonlands/dist/clone';
import { ConvertedCard } from 'moonlands/dist/classes/CardInGame';
import { RestrictionType } from 'moonlands/dist/types';
import { ClientAction, ClientAttackAction, ClientCommand, ClientEffectCardMovedBetweenZones, ClientEffectCreateContinuousEffect, ClientEffectCreatureAttacks, ClientEffectDiscardEnergyFromCreature, ClientEffectDiscardEnergyFromMagi, ClientEffectDraw, ClientEffectEndOfTurn, ClientEffectMagiIsDefeated, ClientEffectMoveCardBetweenZones, ClientEffectMoveCardsBetweenZones, ClientEffectMoveEnergy, ClientEffectPayingEnergyForPower, ClientEffectPlaySpell, ClientEffectRearrangeCardsOfZone, ClientEffectRearrangeEnergyOnCreatures, ClientEffectRemoveEnergyFromCreature, ClientEffectRemoveEnergyFromMagi, ClientEffectReturnCreatureReturningEnergy, ClientEffectStartOfTurn, ClientEnterPromptAlternatives, ClientEnterPromptAnyCreatureExceptSource, ClientEnterPromptChooseCards, ClientEnterPromptChooseNCardsFromZone, ClientEnterPromptChooseUpToNCardsFromZone, ClientEnterPromptDistributeEnergyOnCreatures, ClientEnterPromptNumber, ClientEnterPromptRearrangeCardsOfZone, ClientEnterPromptRearrangeEnergyOnCreatures, ClientEnterPromptSingleCreatureFiltered, ClientPassAction, ClientPlayAction, ClientPowerAction, ClientResolvePromptAction, ConvertedCardMinimal, HiddenConvertedCard } from '../clientProtocol';
import { PROMPT_TYPE_ALTERNATIVE } from 'moonlands/src/const';

const hiddenZonesHash: Record<ZoneType, boolean> = {
	[ZONE_TYPE_DECK]: true,
	[ZONE_TYPE_MAGI_PILE]: true,
	[ZONE_TYPE_HAND]: true,
	[ZONE_TYPE_ACTIVE_MAGI]: false,
	[ZONE_TYPE_DISCARD]: false,
	[ZONE_TYPE_DEFEATED_MAGI]: false,
	[ZONE_TYPE_IN_PLAY]: false,
};

const NUMBER_OF_STEPS = 6;

const index = (obj: MetaDataRecord, is: string|[string,string], value = ''): string => {
	// Stupid temporary guard
	if (is === '') {
		return obj.toString(); 
	}
	const correctIs = (typeof is == 'string') ? is.split('.') : is;
	if (is.length == 1 && value !== undefined)
		return obj[correctIs[0]].toString()// = value;
	else if (correctIs.length == 0)
		return obj.toString();
	else
		return index(obj[correctIs[0]] as unknown as MetaDataRecord, correctIs.slice(1).join('.'), value);
};

const templateMessage = (message: string, metadata: MetaDataRecord) => {
	return message.replace(/\$\{(.+?)\}/g, (_match, p1) => index(metadata, p1));
};

type HiddenCardInGame = CardInGame & {card: null, data: null}

const convertCard = (cardInGame: CardInGame): ConvertedCard | HiddenConvertedCard => {
	if (!cardInGame.card) {
		return {
			id: cardInGame.id,
			owner: cardInGame.owner,
			card: null,
			data: null,
		}
	}	
	return {
		id: cardInGame.id,
		owner: cardInGame.owner,
		card: cardInGame.card.name,
		data: cardInGame.data,
	}
};

const convertCardMinimal = (cardInGame: CardInGame): ConvertedCardMinimal => ({
	id: cardInGame.id,
});

export const hideIfNecessary = (card: CardInGame, targetZone: ZoneType, isOpponent: boolean) : CardInGame | HiddenCardInGame => {
	if (hiddenZonesHash[targetZone] && isOpponent) {
		return {
			...card,
			card: null,
			data: null,
		} as HiddenCardInGame;
	} else {
		return card;
	}
};

export function convertServerCommand(initialAction: AnyEffectType, game: State, playerId: number, overrideHiding = false): ClientCommand | any | null {
	var action: AnyEffectType = clone(initialAction);
	switch(action.type) {
		case ACTION_PASS: {
			const step = game.state.step;

			const newStep: number = (step === null) ? 0 : (step + 1) % NUMBER_OF_STEPS;

			return {
				...action,
				newStep,
			} as ClientPassAction;
		}
		case ACTION_PLAY: {
			// const metaValue = game.getMetaValue(action.card, action.generatedBy);
			// const metaCard = Array.isArray(metaValue) ? metaValue[0] : metaValue;

			const cardPlayed = 'card' in action ? game.getMetaValue(action.card, action.generatedBy) : action.payload.card;// ? action.payload.card : metaCard;

			return {
				...action,
				payload: {
					...('payload' in action ? action.payload : {}),
					card: convertCard(cardPlayed),
				}
			} as ClientPlayAction;
		}
		case ACTION_PLAYER_WINS: {
			return {
				type: action.type,
				player: action.player,
			}
		}
		case ACTION_ATTACK: {
			const attackSource: CardInGame = game.getMetaValue(action.source, action.generatedBy);
			const attackTarget: CardInGame = game.getMetaValue(action.target, action.generatedBy);
			const convertedAction: ClientAttackAction = {
				type: action.type,
				source: attackSource.id,
				target: attackTarget.id,
				player: attackSource.owner,
			};

			if ('additionalAttackers' in action && action.additionalAttackers) {
				convertedAction.additionalAttackers = action.additionalAttackers.map(card => card.id);
			}
			return convertedAction;
		}
		case ACTION_ENTER_PROMPT: {
			if (action.message && action.generatedBy) {
				const metaData = game.getSpellMetadata(action.generatedBy);
				action.message = templateMessage(action.message, metaData);
			}

			switch(action.promptType) {
				case PROMPT_TYPE_NUMBER: {
					return {
						type: action.type,
						promptType: action.promptType,
						min: parseInt(game.getMetaValue(action.min, action.generatedBy), 10),
						max: parseInt(game.getMetaValue(action.max, action.generatedBy), 10),
						...(action.message ? {message: action.message} : {}),
						player: action.player,
					} as ClientEnterPromptNumber;
				}
				case PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES: {
					return {
						type: action.type,
						promptType: action.promptType,
						...(action.message ? {message: action.message} : {}),
						amount: parseInt(game.getMetaValue(action.amount, action.generatedBy), 10),
						player: action.player,
					} as ClientEnterPromptDistributeEnergyOnCreatures;
				}
				case PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES: {
					return {
						type: action.type,
						promptType: action.promptType,
						...(action.message ? {message: action.message} : {}),
						player: action.player,
					} as ClientEnterPromptRearrangeEnergyOnCreatures;
				}
				case PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE: {
					const restrictions = action.restrictions || (action.restriction ? [
						{
							type: game.getMetaValue(action.restriction, action.generatedBy) as RestrictionType,
							value: game.getMetaValue(action.restrictionValue, action.generatedBy),
						},
					] : null);

					const zone = game.getMetaValue(action.zone, action.generatedBy);
					const zoneOwner = game.getMetaValue(action.zoneOwner, action.generatedBy);
					const numberOfCards = game.getMetaValue(action.numberOfCards, action.generatedBy);
					const cardFilter = game.makeCardFilter(restrictions || []);
					const zoneContent = game.getZone(zone, zoneOwner).cards;
					const cards = restrictions ? zoneContent.filter(cardFilter) : zoneContent;
					const promptPlayer = game.getMetaValue(action.player, action.generatedBy);

					return {
						type: ACTION_ENTER_PROMPT,
						promptType: PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE,
						player: promptPlayer,
						zone,
						restrictions,
						cards: cards.map(convertCard),
						zoneOwner,
						...(action.message ? {message: action.message} : {}),
						numberOfCards,
					} as ClientEnterPromptChooseUpToNCardsFromZone;
				}
				case PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE: {
					const restrictions = action.restrictions || (action.restriction ? [
						{
							type: game.getMetaValue(action.restriction, action.generatedBy),
							value: game.getMetaValue(action.restrictionValue, action.generatedBy),
						},
					] : null);

					const zone = game.getMetaValue(action.zone, action.generatedBy);
					const zoneOwner = game.getMetaValue(action.zoneOwner, action.generatedBy);
					const numberOfCards = game.getMetaValue(action.numberOfCards, action.generatedBy);
					const promptPlayer = game.getMetaValue(action.player, action.generatedBy);
					const cardFilter = game.makeCardFilter(restrictions || []);
					const zoneContent = game.getZone(zone, zoneOwner).cards;
					const cards = restrictions ? zoneContent.filter(cardFilter) : zoneContent;

					return {
						type: ACTION_ENTER_PROMPT,
						promptType: PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
						player: promptPlayer,
						zone,
						restrictions,
						...(action.message ? {message: action.message} : {}),
						cards: cards.map(convertCard),
						zoneOwner,
						numberOfCards,
					} as ClientEnterPromptChooseNCardsFromZone;
				}
				case PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE: {
					const zone = game.getMetaValue(action.promptParams.zone, action.generatedBy);
					const zoneOwner = game.getMetaValue(action.promptParams.zoneOwner, action.generatedBy);
					const numberOfCards = game.getMetaValue(action.promptParams.numberOfCards, action.generatedBy);
					const zoneContent = game.getZone(zone, zoneOwner).cards;
					const cards = zoneContent.slice(0, parseInt(numberOfCards, 10));

					return {
						type: ACTION_ENTER_PROMPT,
						promptType: PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE,
						player: action.player,
						zone,
						...(action.message ? {message: action.message} : {}),
						cards: cards.map(convertCard),
						zoneOwner,
						numberOfCards,
					} as ClientEnterPromptRearrangeCardsOfZone;
				}
				case PROMPT_TYPE_CHOOSE_CARDS: {
					return {
						type: action.type,
						promptType: action.promptType,
						promptParams: {
							availableCards: action.promptParams.availableCards,
							// @ts-ignore
							startingCards: action.promptParams.startingCards || [],
						},
						generatedBy: action.generatedBy,
						player: action.player,
					} as ClientEnterPromptChooseCards;
				}
				case PROMPT_TYPE_SINGLE_CREATURE: {
					return {
						type: action.type,
						promptType: action.promptType,
						promptParams: action.promptParams,
						generatedBy: action.generatedBy,
						...(action.message ? {message: action.message} : {}),
						player: action.player,
					}
				}
				case PROMPT_TYPE_SINGLE_CREATURE_FILTERED: {
					return {
						type: action.type,
						promptType: action.promptType,
						restrictions: action.restrictions,
						restriction: action.restriction,
						...(action.message ? {message: action.message} : {}),
						restrictionValue: action.restrictionValue,
						player: action.player,
					} as ClientEnterPromptSingleCreatureFiltered;
				}
				case PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE: {
					const actionSource = game.getMetaValue(action.source, action.generatedBy);

					return {
						type: action.type,
						promptType: action.promptType,
						source: convertCard(actionSource),
						promptParams: action.promptParams,
						...(action.message ? {message: action.message} : {}),
						generatedBy: action.generatedBy,
						player: action.player,
					} as ClientEnterPromptAnyCreatureExceptSource;
				} 
				case PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI: {
					const actionSource = game.getMetaValue(action.source, action.generatedBy);
					const promptPlayer = action.player || actionSource.owner;
					return {
						type: action.type,
						promptType: action.promptType,
						promptParams: action.promptParams,
						...(action.message ? {message: action.message} : {}),
						generatedBy: action.generatedBy,
						player: promptPlayer,
					};
				}
				case PROMPT_TYPE_POWER_ON_MAGI: {
					const magi: CardInGame[] = game.getMetaValue(action?.magi, action.generatedBy);
					return {
						type: action.type,
						promptType: action.promptType,
						magi: convertCard(magi[0]),
						generatedBy: action.generatedBy,
						player: action.player,
					};
				}
				case PROMPT_TYPE_ALTERNATIVE: {
					return {
						type: action.type,
						promptType: action.promptType,
						alternatives: action.alternatives,
						generatedBy: action.generatedBy,
						player: parseInt(game.getMetaValue(action.player, action.generatedBy), 10),
					};
				}
				case PROMPT_TYPE_PAYMENT_SOURCE: {
					return {
						type: action.type,
						promptType: action.promptType,
						paymentType: action.paymentType,
						amount: action.amount,
						generatedBy: action.generatedBy,
						player: action.player,
					}
				}
				default: {
					// @ts-ignore
					return {
						type: action.type,
						promptType: action.promptType,
						promptParams: 'promptParams' in action ? action.promptParams : {},
						...(action.message ? {message: action.message} : {}),
						generatedBy: action.generatedBy,
						player: action.player,
					}
				}
			}
		}
		case ACTION_RESOLVE_PROMPT: {
			const promptAction: ClientResolvePromptAction = {
				type: action.type,
				player: action.player,
			};
			if ('target' in action && action.target) {
				promptAction.targetCard = convertCard(action.target) as ConvertedCard | HiddenConvertedCard;
				promptAction.target = promptAction.targetCard.id;
			}
			if ('number' in action) {
				promptAction.number = (typeof action.number == 'string' ? parseInt(action.number, 10) : action.number) || 0;
			}
			return promptAction;
		}
		case ACTION_POWER: {
			const actionSource = game.getMetaValue(action.source, action.generatedBy);
			return {
				...action,
				source: convertCard(actionSource),
				power: action.power.name,
			} as ClientPowerAction;
		}
		case ACTION_EFFECT: {
			switch (action.effectType) {
				case EFFECT_TYPE_CARD_MOVED_BETWEEN_ZONES: {
					const sourceCardOwner = action.sourceCard.owner;
					const destinationCardOwner = action.destinationCard.owner;
					// we hide the card if the source or destination zone is
					// marked as hidden and zone owner is different from player we're doing conversion for 
					return {
						type: action.type,
						effectType: action.effectType,
						sourceCard: convertCard(hideIfNecessary(
							action.sourceCard,
							action.sourceZone,
							overrideHiding ? false : sourceCardOwner !== playerId
						)),
						sourceZone: action.sourceZone,
						destinationCard: convertCard(hideIfNecessary(
							action.destinationCard,
							action.destinationZone,
							overrideHiding ? false : destinationCardOwner !== playerId
						)),
						destinationZone: action.destinationZone,
						convertedFor: playerId,
						destOwner: destinationCardOwner,
						player: action.player,
						generatedBy: action.generatedBy,
					} as ClientEffectCardMovedBetweenZones;
				}
				case EFFECT_TYPE_PLAY_SPELL: {
					return {
						type: action.type,
						effectType: action.effectType,
						player: action.player,
						card: convertCard(action.card),
						generatedBy: action.generatedBy,
					} as ClientEffectPlaySpell;
				}
				case EFFECT_TYPE_DIE_ROLLED: {
					return {
						type: action.type,
						effectType: action.effectType,
						result: action.result,
						generatedBy: action.generatedBy,
						player: action.player,
					};
				}
				case EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE: {
					if (!action.target) {
						return null;
					}
					const actionTarget = game.getMetaValue(action.target, action.generatedBy);
					return {
						type: action.type,
						effectType: action.effectType,
						target: convertCardMinimal(actionTarget),
						player: action.player,
					}
				}
				case EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE: {
					const cards: string[] = (typeof action.cards == 'string') ?
						game.getMetaValue(action.cards, action.generatedBy) :
						action.cards;

					const zone = game.getMetaValue(action.zone, action.generatedBy);
					const zoneOwner = game.getMetaValue(action.zoneOwner, action.generatedBy);
					return {
						...action,
						cards,
						zone,
						zoneOwner,
					} as ClientEffectRearrangeCardsOfZone;
				}
				case EFFECT_TYPE_PAYING_ENERGY_FOR_POWER: {
					const targetCard = (typeof action.target == 'string') ?
						game.getMetaValue(action.target, action.generatedBy) :
						action.target;

					const amount: number = (typeof action.amount == 'string') ?
						parseInt(game.getMetaValue(action.amount, action.generatedBy), 10) :
						action.amount;
										
					const target = (targetCard.length) ? targetCard[0] : targetCard;

					return {
						...action,
						target: convertCard(target),
						amount,
					} as ClientEffectPayingEnergyForPower;
				}
				case EFFECT_TYPE_MAGI_IS_DEFEATED: {
					return {
						type: action.type,
						effectType: action.effectType,
						target: convertCard(action.target),
						generatedBy: action.generatedBy,
					} as ClientEffectMagiIsDefeated;
				}
				case EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES: {
					const energyOnCreatures: Record<string, number> = game.getMetaValue(action.energyOnCreatures, action.generatedBy) || {};
					return {
						type: action.type,
						effectType: action.effectType,
						energyOnCreatures,
						player: action.player,
					} as ClientEffectRearrangeEnergyOnCreatures;
				}
				// case EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES: {
				// 	const energyOnCreatures = game.getMetaValue(action.energyOnCreatures, action.generatedBy) || {};
				// 	return {
				// 		...action,
				// 		source: convertCard(action.source),
				// 		energyOnCreatures,
				// 	};
				// }
				case EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE: {
					const fromCard = (typeof action.from == 'string') ?
						game.getMetaValue(action.from, action.generatedBy) :
						action.from;
					const from = (fromCard.length) ? fromCard[0] : fromCard;

					return {
						...action,
						from: convertCardMinimal(from),
					};
				}
				case EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE: {
					const targetCard = (typeof action.target == 'string') ?
						game.getMetaValue(action.target, action.generatedBy) :
						action.target;

					return {
						...action,
						target: convertCard(targetCard),
					};
				}
				case EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL: {
					const fromCard = (typeof action.from == 'string') ?
						game.getMetaValue(action.from, action.generatedBy) :
						action.from;
					const from = (fromCard.length) ? fromCard[0] : fromCard;

					return {
						...action,
						from: convertCardMinimal(from),
					};
				}
				case EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI: {
					const targetCard = (typeof action.target == 'string') ?
						game.getMetaValue(action.target, action.generatedBy) :
						action.target;

					const amount = (typeof action.amount == 'string') ?
						parseInt(game.getMetaValue(action.amount, action.generatedBy), 10) :
						action.amount;
										
					const target = (targetCard.length) ? targetCard[0] : targetCard;

					return {
						type: action.type,
						effectType: action.effectType,
						target: convertCard(target),
						source: action.source ? convertCard(action.source) : null,
						amount,
						generatedBy: action.generatedBy,
					} as ClientEffectDiscardEnergyFromMagi;
				}
				case EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI: {
					const targetCard = (typeof action.target == 'string') ?
						game.getMetaValue(action.target, action.generatedBy) :
						action.target;

					const amount = (typeof action.amount == 'string') ?
						parseInt(game.getMetaValue(action.amount, action.generatedBy), 10) :
						action.amount;
										
					const target = (targetCard.length) ? targetCard[0] : targetCard;

					return {
						type: action.type,
						effectType: action.effectType,
						target: convertCard(target),
						amount,
						generatedBy: action.generatedBy,
						player: action.player,
					} as ClientEffectRemoveEnergyFromMagi;
				}
				case EFFECT_TYPE_ATTACK: {
					const attackSource: CardInGame = game.getMetaValue(action.source, action.generatedBy);
					const attackTarget: CardInGame = game.getMetaValue(action.target, action.generatedBy);
					const additionalAttackers: CardInGame[] = game.getMetaValue(action.additionalAttackers, action.generatedBy) || [];
					return {
						...action,
						source: attackSource.id,
						target: attackTarget.id,
						additionalAttackers: additionalAttackers.map(card => card.id),
						generatedBy: action.generatedBy,
						player: action.player,
					};
				}
				case EFFECT_TYPE_CREATURE_ATTACKS: {
					return {
						type: action.type,
						effectType: action.effectType,
						// ...action,
						packHuntAttack: action.packHuntAttack,
						source: convertCardMinimal(action.source),
						target: convertCardMinimal(action.target),
						sourceAtStart: convertCardMinimal(action.sourceAtStart),
						targetAtStart: convertCardMinimal(action.targetAtStart),
						player: action.player,
					} as ClientEffectCreatureAttacks;
				}
				case EFFECT_TYPE_PLAY_CREATURE: {
					return {
						...action,
						card: convertCard(action.card),
					};
				}
				case EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES: {
					const targetCards = (typeof action.target == 'string') ?
						game.getMetaValue(action.target, action.generatedBy) :
						action.target;

					const clientAction: ClientEffectMoveCardsBetweenZones = {
						type: action.type,
						effectType: action.effectType,
						sourceZone: action.sourceZone,
						destinationZone: action.destinationZone,
						target: targetCards.map(convertCardMinimal),
						generatedBy: action.generatedBy,
						player: action.player || 1000, // no idea why player may be missing here
					}
					return clientAction;
				}
				case EFFECT_TYPE_MAGI_IS_DEFEATED: {
					action;
					const clientAction = {
						type: action.type,
						effectType: action.effectType,
						target: convertCardMinimal(action.target),
						generatedBy: action.generatedBy,
					}

					return clientAction;
				}
				case EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES: {
					const targetCard = (typeof action.target === 'string') ?
						game.getMetaValue(action.target, action.generatedBy) :
						action.target;

					if (!targetCard || !targetCard.id) {
						console.dir(`Error getting the card from ${action.target}`);
						console.log('Metadata:');
						console.dir(game.getSpellMetadata(action.generatedBy));
					}
					const clientAction: ClientEffectMoveCardBetweenZones = {
						type: action.type,
						effectType: action.effectType,
						sourceZone: action.sourceZone,
						destinationZone: action.destinationZone,
						target: targetCard instanceof Array ? convertCardMinimal(targetCard[0]) : convertCardMinimal(targetCard),
						generatedBy: action.generatedBy,
						player: action.player || 1000, // no idea why player may be missing here
					}
					return clientAction;
				}
				case EFFECT_TYPE_MOVE_ENERGY: {
					const targetCard = (typeof action.target == 'string') ?
						game.getMetaValue(action.target, action.generatedBy) :
						action.target;

					const target = (targetCard.length) ? targetCard[0] : targetCard;

					const sourceCard = (typeof action.source == 'string') ?
						game.getMetaValue(action.source, action.generatedBy) :
						action.source;

					const source = (sourceCard.length) ? sourceCard[0] : sourceCard;

					const amount = (typeof action.amount == 'string') ?
						parseInt(game.getMetaValue(action.amount, action.generatedBy), 10) :
						action.amount;

					return {
						type: action.type,
						effectType: action.effectType,
						target: convertCard(target),
						source: convertCard(source),
						amount,
						generatedBy: action.generatedBy,
						player: action.player,
					} as ClientEffectMoveEnergy;
				}
				case EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY: {
					const targetCard = (typeof action.target == 'string') ?
						game.getMetaValue(action.target, action.generatedBy) :
						action.target;
					const target = (targetCard.length) ? targetCard[0] : targetCard;
					// @ts-ignore will be fixed in a future moonlands update
					const sourceCard: CardInGame | null = (typeof action?.source == 'string') ?
					// @ts-ignore will be fixed in a future moonlands update
						game.getMetaValue(action?.source, action.generatedBy) :
						action.target;

					return {
						type: action.type,
						effectType: action.effectType,
						source: sourceCard ? convertCard(sourceCard) : null,
						target: convertCard(target),
						generatedBy: action.generatedBy,
						player: action.player,
					};
				}
				case EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE: {
					const targetCard = (typeof action.target == 'string') ?
						game.getMetaValue(action.target, action.generatedBy) :
						action.target;

					const amount = (typeof action.amount == 'string') ?
						parseInt(game.getMetaValue(action.amount, action.generatedBy), 10) :
						action.amount;
										
					const target = (targetCard instanceof Array) ? targetCard.map(convertCardMinimal) : convertCardMinimal(targetCard);

					return {
						...action,
						target,
						source: action.source ? convertCardMinimal(action.source) : action.source,
						triggerSource: action.triggerSource ? convertCardMinimal(action.triggerSource) : action.triggerSource,
						amount,
					} as ClientEffectDiscardEnergyFromCreature;
				}
				case EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE: {
					const targetCard: CardInGame | CardInGame[] = (typeof action.target == 'string') ?
						game.getMetaValue(action.target, action.generatedBy) :
						action.target;

					const amount = (typeof action.amount == 'string') ?
						parseInt(game.getMetaValue(action.amount, action.generatedBy), 10) :
						action.amount;
										
					const target = (targetCard instanceof Array) ? targetCard.map(convertCardMinimal) : convertCardMinimal(targetCard);

					return {
						type: ACTION_EFFECT,
						effectType: EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE,
						// ...action,
						target,
						amount,
					} as ClientEffectRemoveEnergyFromCreature;
				}
				case EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI: {
					const targetCard = (typeof action.target == 'string') ?
						game.getMetaValue(action.target, action.generatedBy) :
						action.target;

					const amount = (typeof action.amount == 'string') ?
						parseInt(game.getMetaValue(action.amount, action.generatedBy), 10) :
						action.amount;
										
					const target = (targetCard instanceof Array) ? targetCard.map(convertCardMinimal) : convertCardMinimal(targetCard);

					return {
						...action,
						target,
						// source: action.source ? convertCardMinimal(action.source) : action.source,
						amount,
					};
				}
				case EFFECT_TYPE_ADD_ENERGY_TO_CREATURE: {
					const targetCard = (typeof action.target == 'string') ?
						game.getMetaValue(action.target, action.generatedBy) :
						action.target;

					if (!(targetCard instanceof Array) && (!('_card' in targetCard) || !targetCard._card)) {
						throw new Error('Card action without the card!');
					}

					const target = (targetCard instanceof Array) ? targetCard.map(convertCardMinimal) : convertCardMinimal(targetCard);

					const amount = (typeof action.amount == 'string') ?
						parseInt(game.getMetaValue(action.amount, action.generatedBy), 10) :
						action.amount;

					return {
						type: action.type,
						effectType: action.effectType,
						target,
						source: action.source ? convertCardMinimal(action.source) : false,
						amount,
						generatedBy: action.generatedBy,
						player: action.player,
					};
				}
				case EFFECT_TYPE_START_STEP: {
					return {
						type: action.type,
						effectType: action.effectType,
						player: action.player,
					}
				}
				case EFFECT_TYPE_ADD_ENERGY_TO_MAGI: {
					const targetCard = (typeof action.target == 'string') ?
						game.getMetaValue(action.target, action.generatedBy) :
						action.target;
					// @ts-ignore
					const sourceCard: CardInGame | undefined = (typeof action.source == 'string') ?
					// @ts-ignore
						game.getMetaValue(action.source, action.generatedBy) :
						action.target;
										
					const target = (targetCard.length) ? targetCard[0] : targetCard;

					const amount = (typeof action.amount == 'string') ?
						parseInt(game.getMetaValue(action.amount, action.generatedBy), 10) :
						action.amount;

					return {
						type: action.type,
						effectType: action.effectType,
						...(sourceCard ? {source: convertCardMinimal(sourceCard)} : {}),
						target: convertCardMinimal(target),
						amount,
					};
				}
				case EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES: {
					const energyOnCreatures: Record<string, number> = game.getMetaValue(action.energyOnCreatures, action.generatedBy);
					return {
						type: ACTION_EFFECT,
						effectType: EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES,
						// @ts-ignore
						source: action.source ? convertCardMinimal(action.source) : action.source,
						energyOnCreatures,
						// @ts-ignore
						power: action?.power,
						generatedBy: action.generatedBy,
						player: action.player,
					}
				}
				case EFFECT_TYPE_DISCARD_RESHUFFLED: {
					return {
						...action,
					};
				}
				case EFFECT_TYPE_START_OF_TURN: {
					return {
						type: action.type,
						effectType: action.effectType,
						player: action.player,
					} as ClientEffectStartOfTurn;
				}
				case EFFECT_TYPE_END_OF_TURN: {
					return {
						type: action.type,
						effectType: action.effectType,
						player: action.player,
					} as ClientEffectEndOfTurn;
				}
				// This one is needed only for the log entry
				case EFFECT_TYPE_DRAW: {
					return {
						type: action.type,
						effectType: action.effectType,
						player: action.player,
					} as ClientEffectDraw;
				}
				case EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT: {
					console.dir(action.staticAbilities || []);
					const staticAbilities = (action.staticAbilities || []).map(ability =>
						Object.fromEntries(
							Object.entries(ability).map(([k, v]) => [k, game.getMetaValue(v, action.generatedBy)]),
						),
					)
					// console.dir(staticAbilities);
					return {
						type: action.type,
						effectType: action.effectType,
						generatedBy: action.generatedBy,
						expiration: action.expiration,
						staticAbilities,
						triggerEffects: action.triggerEffects || [],
						player: action.player,
					} as ClientEffectCreateContinuousEffect;
				}
				// Log size optimization
				case EFFECT_TYPE_DEAL_DAMAGE: {
					return {
						type: action.type,
						effectType: action.effectType,
						source: action.source.id,
						target: action.target.id,
						amount: action.amount,
						generatedBy: action.generatedBy,
					};
				}
				case EFFECT_TYPE_DAMAGE_STEP: {
					return {
						type: action.type,
						effectType: action.effectType,
						source: action.source.id,
						target: action.target.id,
						packHuntAttack: action.packHuntAttack,
						generatedBy: action.generatedBy,
					};
				}
				case EFFECT_TYPE_ATTACKER_DEALS_DAMAGE: {
					return {
						type: action.type,
						effectType: action.effectType,
						source: action.source.id,
						target: action.target.id,
						amount: action.amount,
						generatedBy: action.generatedBy,
					};
				}
				case EFFECT_TYPE_DEFENDER_DEALS_DAMAGE: {
					return {
						type: action.type,
						effectType: action.effectType,
						source: action.source.id,
						target: action.target.id,
						amount: action.amount,
						generatedBy: action.generatedBy,
					};
				}
				case EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI: {
					const sourceCard = (typeof action.source == 'string') ?
						game.getMetaValue(action.source, action.generatedBy) :
						action.source;
					const targetCard = (typeof action.target == 'string') ?
						game.getMetaValue(action.target, action.generatedBy) :
						action.source;

					const source = (sourceCard.length) ? sourceCard[0] : sourceCard;
					return {
						type: action.type,
						effectType: action.effectType,
						source: source.id,
						target: targetCard.id,
						attack: action.attack,
						spell: action.spell,
						relic: action.relic,
						amount: action.amount,
						generatedBy: action.generatedBy,
					};
				}
				case EFFECT_TYPE_BEFORE_DAMAGE: {
					return {
						type: action.type,
						effectType: action.effectType,
						source: action.source.id,
						target: action.target.id,
						generatedBy: action.generatedBy,
					};
				}
				case EFFECT_TYPE_CREATURE_DEFEATS_CREATURE: {
					return {
						type: action.type,
						effectType: action.effectType,
						source: action.source.id,
						target: action.target.id,
						attack: action.attack,
						generatedBy: action.generatedBy,
					};
				}
				case EFFECT_TYPE_CREATURE_IS_DEFEATED: {
					return {
						type: action.type,
						effectType: action.effectType,
						target: action.target.id,
						generatedBy: action.generatedBy,
					};
				}
				case EFFECT_TYPE_RETURN_CREATURE_RETURNING_ENERGY: {
					const targetCard = (typeof action.target == 'string') ?
						game.getMetaValue(action.target, action.generatedBy) :
						action.target;
										
					const target = (targetCard instanceof Array) ? targetCard.map(convertCardMinimal) : convertCardMinimal(targetCard);

					const convertedAction: ClientEffectReturnCreatureReturningEnergy = {
						type: action.type,
						effectType: action.effectType,
						target,
						// power: action.power,
						generatedBy: action.generatedBy,
					};
					// if ('source' in action) {
					// 	convertedAction.source = convertCardMinimal(action.source);
					// }
					return convertedAction;
				}
			}
		}
	}

	return null;
}

export function convertClientCommands(action: ClientAction, game: State): AnyEffectType | null {
	switch (action.type) {
		case ACTION_RESOLVE_PROMPT: {
			switch (game.state.promptType) {
				case PROMPT_TYPE_RELIC: {
					if (action.target) {
						return {
							type: action.type,
							target: game.getZone(ZONE_TYPE_IN_PLAY, null).byId(action.target),
							player: action.player,
						};
					}

					return null;
				}
				case PROMPT_TYPE_OWN_SINGLE_CREATURE: {
					if (action.target) {
						return {
							type: action.type,
							target: game.getZone(ZONE_TYPE_IN_PLAY, null).byId(action.target),
							player: action.player,
						};
					}

					return null;
				}
				case PROMPT_TYPE_SINGLE_CREATURE: {
					if (action.target) {
						return {
							type: action.type,
							target: game.getZone(ZONE_TYPE_IN_PLAY, null).byId(action.target),
							player: action.player,
						};
					}

					return null;
				}
				case PROMPT_TYPE_SINGLE_CREATURE_FILTERED: {
					if (action.target) {
						return {
							type: action.type,
							target: game.getZone(ZONE_TYPE_IN_PLAY, null).byId(action.target),
							player: action.player,
						};
					}

					return null;
				}
				case PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE: {
					if (action.target) {
						return {
							type: action.type,
							target: game.getZone(ZONE_TYPE_IN_PLAY, null).byId(action.target),
							player: action.player,
						};
					}

					return null;
				}
				case PROMPT_TYPE_POWER_ON_MAGI: {
					if (action.power && game.state.promptParams?.magi && game.state.promptParams?.magi.length) {
						return {
							type: action.type,
							power: game.state.promptParams?.magi[0].card.data.powers?.find(power => power.name === action.power),
							source: game.state.promptParams?.magi[0],
							player: action.player,
						}
					}
				}
				case PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI: {
					if (action.target) {
						let target = game.getZone(ZONE_TYPE_IN_PLAY, null).byId(action.target);
						if (!target) {
							target = game.getZone(ZONE_TYPE_ACTIVE_MAGI, game.players[0]).byId(action.target);
						}
						if (!target) {
							target = game.getZone(ZONE_TYPE_ACTIVE_MAGI, game.players[1]).byId(action.target);
						}
						if (target) {
							return {
								type: action.type,
								target,
								player: action.player,
							};
						}
					}

					return null;
				}
				case PROMPT_TYPE_SINGLE_MAGI: {
					if (action.target) {
						let target = game.getZone(ZONE_TYPE_ACTIVE_MAGI, game.players[0]).byId(action.target);
						if (!target) {
							target = game.getZone(ZONE_TYPE_ACTIVE_MAGI, game.players[1]).byId(action.target);
						}
						if (target) {
							return {
								type: action.type,
								target,
								player: action.player,
							};
						}
					}

					return null;
				}
				case PROMPT_TYPE_MAGI_WITHOUT_CREATURES: {
					if (action.target) {
						let target = game.getZone(ZONE_TYPE_ACTIVE_MAGI, game.players[0]).byId(action.target);
						if (!target) {
							target = game.getZone(ZONE_TYPE_ACTIVE_MAGI, game.players[1]).byId(action.target);
						}
						if (target) {
							return {
								type: action.type,
								target,
								player: action.player,
							};
						}
					}

					return null;
				}
				case PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE: {
					if (action.zone) {
						const zone = action.zone === ZONE_TYPE_IN_PLAY ? game.getZone(ZONE_TYPE_IN_PLAY) : game.getZone(action.zone, action.zoneOwner);
						const zoneContent = zone.cards;
						const actionCards = action.cards;
						if (actionCards) {
							const cards = zoneContent.filter(card => actionCards.includes(card.id));
							return {
								type: action.type,
								cards,
								player: action.player,
							};
						}
					}
					return null;
				}
				case PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE: {
					const zone = action.zone === ZONE_TYPE_IN_PLAY ? game.getZone(ZONE_TYPE_IN_PLAY) : game.getZone(action.zone || ZONE_TYPE_HAND, action.zoneOwner || 0);
					const zoneContent = zone.cards;
					const actionCards = action.cards;
					if (actionCards && action.zone) {
						const cards = zoneContent.filter(card => actionCards.includes(card.id));
						return {
							type: action.type,
							// @ts-ignore for now
							zone: action.zone,
							zoneOwner: action.zoneOwner,
							cards,
							player: action.player,
						};
					}
				}
				case PROMPT_TYPE_CHOOSE_CARDS: {
					// Will do for now
					return action as AnyEffectType;
				}
				case PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES: {
					// Will do for now
					return action as AnyEffectType;
				}
				case PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES: {
					// Will do for now
					return action as AnyEffectType;
				}
				case PROMPT_TYPE_NUMBER: {
					return action as AnyEffectType;
				}
				case PROMPT_TYPE_MAY_ABILITY: {
					return action as AnyEffectType;
				}
				case PROMPT_TYPE_PLAYER: {
					return action as AnyEffectType;
				}
				case PROMPT_TYPE_ALTERNATIVE: {
					return action as AnyEffectType;
				}
				case PROMPT_TYPE_PAYMENT_SOURCE: {
					if (!action.target) return action as AnyEffectType;

					let target = game.getZone(ZONE_TYPE_IN_PLAY, null).byId(action.target);
					if (!target) {
						target = game.getZone(ZONE_TYPE_ACTIVE_MAGI, game.players[0]).byId(action.target);
					}
					if (!target) {
						target = game.getZone(ZONE_TYPE_ACTIVE_MAGI, game.players[1]).byId(action.target);
					}
					return {
						...action,
						target, 
					} as AnyEffectType;
				}
			}
			// change target string to CardInGame
			break;
		}
		case ACTION_POWER: {
			if (action.source && action.power && typeof action.source === 'string') {
				let powerSource = game.getZone(ZONE_TYPE_IN_PLAY, null).byId(action.source);
				if (!powerSource) {
					powerSource = game.getZone(ZONE_TYPE_ACTIVE_MAGI, game.players[0]).byId(action.source);
				}
				if (!powerSource) {
					powerSource = game.getZone(ZONE_TYPE_ACTIVE_MAGI, game.players[1]).byId(action.source);
				}

				if (!powerSource || !powerSource.card) {
					console.log('Card not found in expanded action');
					console.log(`Type of card object: ${typeof powerSource}`);
					return null;
				} else if (!powerSource.card.data.powers) {
					console.log('Activating power of the source with no powers');
					return null;
				}

				const power = powerSource.card.data.powers.find(power => power.name === action.power);
				const player = powerSource.data.controller;

				if (!power) {
					return null
				}

				/*
				type PowerActionType = EnrichedAction & {
						type: typeof ACTION_POWER;
						power: PowerType;
						source: CardInGame;
						player: number;
						generatedBy?: string;
				}
				*/
				return {
					type: action.type,
					power,
					source: powerSource,
					player,
				} as AnyEffectType;
			}
			break;
		}
		case ACTION_ATTACK: {
			const attackSource = game.getZone(ZONE_TYPE_IN_PLAY, null).byId(action.source);
			if (!attackSource) {
				return null;
			}
			let attackTarget = game.getZone(ZONE_TYPE_IN_PLAY, null).byId(action.target);
			let additionalAttackers: CardInGame[] = [];

			if (action.additionalAttackers) {
				additionalAttackers = action.additionalAttackers.map(id => game.getZone(ZONE_TYPE_IN_PLAY, null).byId(id)) as CardInGame[];
			}

			if (!attackTarget) {
				const controller = game.modifyByStaticAbilities(attackSource, PROPERTY_CONTROLLER);
				const opponentId = game.getOpponent(controller);
				attackTarget = game.getZone(ZONE_TYPE_ACTIVE_MAGI, opponentId).byId(action.target);
			}

			if (!attackTarget) {
				return null;
			}

			type AttackTypeTemp = {
				type: typeof ACTION_ATTACK,
				source: CardInGame,
				sourceAtStart: CardInGame,
				target: CardInGame,
				targetAtStart: CardInGame,
				additionalAttackers?: CardInGame[],
				player: number,
			}

			const finalAction: AttackTypeTemp = {
				type: action.type,
				source: attackSource,
				sourceAtStart: attackSource,
				target: attackTarget,
				targetAtStart: attackTarget,
				player: action.player,
			}
			if (additionalAttackers.length) {
				finalAction.additionalAttackers = additionalAttackers;
			}
			return finalAction as AnyEffectType;
			// break;
		}
		case ACTION_PLAY: {
			const player = action.player;
			const cardInHand = game.getZone(ZONE_TYPE_HAND, player).byId(action.payload.card.id);
			// expandedAction.payload.card = cardInHand;
			// expandedAction.forcePriority = false;
			return {
				type: action.type,
				player: action.player,
				payload: {
					card: cardInHand,
					player: action.player,
				},
				forcePriority: false,
			} as NormalPlayType;
		}
		case ACTION_PASS: {
			return action;
		}
	}

	return null;
}

export default convertClientCommands;
