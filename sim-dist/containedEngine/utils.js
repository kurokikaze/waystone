import { ACTION_ATTACK, ACTION_EFFECT, ACTION_ENTER_PROMPT, ACTION_PASS, ACTION_PLAY, ACTION_PLAYER_WINS, ACTION_POWER, ACTION_RESOLVE_PROMPT, EFFECT_TYPE_ADD_ENERGY_TO_CREATURE, EFFECT_TYPE_ADD_ENERGY_TO_MAGI, EFFECT_TYPE_ATTACH_CARD_TO_CARD, EFFECT_TYPE_ATTACK, EFFECT_TYPE_ATTACKER_DEALS_DAMAGE, EFFECT_TYPE_BEFORE_DAMAGE, EFFECT_TYPE_CARD_MOVED_BETWEEN_ZONES, EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT, EFFECT_TYPE_CREATURE_ATTACKS, EFFECT_TYPE_CREATURE_DEFEATS_CREATURE, EFFECT_TYPE_CREATURE_IS_DEFEATED, EFFECT_TYPE_DAMAGE_STEP, EFFECT_TYPE_DEAL_DAMAGE, EFFECT_TYPE_DEFENDER_DEALS_DAMAGE, EFFECT_TYPE_DIE_ROLLED, EFFECT_TYPE_DISCARD_CARD_FROM_HAND, EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY, EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI, EFFECT_TYPE_DISCARD_RESHUFFLED, EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES, EFFECT_TYPE_DRAW, EFFECT_TYPE_END_OF_TURN, EFFECT_TYPE_ENERGY_DISCARDED_FROM_CREATURE, EFFECT_TYPE_ENERGY_DISCARDED_FROM_MAGI, EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE, EFFECT_TYPE_MAGI_IS_DEFEATED, EFFECT_TYPE_MOVE_ENERGY, EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE, EFFECT_TYPE_PAYING_ENERGY_FOR_POWER, EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL, EFFECT_TYPE_PLAY_CREATURE, EFFECT_TYPE_PLAY_SPELL, EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE, EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES, EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE, EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI, EFFECT_TYPE_RETURN_CREATURE_RETURNING_ENERGY, EFFECT_TYPE_START_OF_TURN, EFFECT_TYPE_START_STEP, PROMPT_TYPE_ALTERNATIVE, PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE, PROMPT_TYPE_CHOOSE_CARDS, PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE, PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE, PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES, PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES, PROMPT_TYPE_MAGI_WITHOUT_CREATURES, PROMPT_TYPE_MAY_ABILITY, PROMPT_TYPE_NUMBER, PROMPT_TYPE_OWN_SINGLE_CREATURE, PROMPT_TYPE_PAYMENT_SOURCE, PROMPT_TYPE_PLAYER, PROMPT_TYPE_POWER_ON_MAGI, PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE, PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES, PROMPT_TYPE_RELIC, PROMPT_TYPE_SINGLE_CREATURE_FILTERED, PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI, PROMPT_TYPE_SINGLE_CREATURE, PROMPT_TYPE_SINGLE_MAGI, PROMPT_TYPE_DISTRUBUTE_CARDS_IN_ZONES, PROPERTY_CONTROLLER, ZONE_TYPE_ACTIVE_MAGI, ZONE_TYPE_DECK, ZONE_TYPE_DEFEATED_MAGI, ZONE_TYPE_DISCARD, ZONE_TYPE_HAND, ZONE_TYPE_IN_PLAY, ZONE_TYPE_MAGI_PILE, } from 'moonlands/dist/esm/const.js';
import clone from 'moonlands/dist/esm/clone.js';
const hiddenZonesHash = {
    [ZONE_TYPE_DECK]: true,
    [ZONE_TYPE_MAGI_PILE]: true,
    [ZONE_TYPE_HAND]: true,
    [ZONE_TYPE_ACTIVE_MAGI]: false,
    [ZONE_TYPE_DISCARD]: false,
    [ZONE_TYPE_DEFEATED_MAGI]: false,
    [ZONE_TYPE_IN_PLAY]: false,
};
const NUMBER_OF_STEPS = 6;
const index = (obj, is, value = '') => {
    // Stupid temporary guard
    if (is === '') {
        return obj.toString();
    }
    const correctIs = (typeof is == 'string') ? is.split('.') : is;
    if (is.length == 1 && value !== undefined)
        return obj[correctIs[0]].toString(); // = value;
    else if (correctIs.length == 0)
        return obj.toString();
    else
        return index(obj[correctIs[0]], correctIs.slice(1).join('.'), value);
};
const templateMessage = (message, metadata) => {
    return message.replace(/\$\{(.+?)\}/g, (_match, p1) => index(metadata, p1));
};
const convertCard = (cardInGame, hidden = false) => {
    return cardInGame.serialize(hidden);
    /*if (!cardInGame.card) {
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
    }*/
};
const convertCardMinimal = (cardInGame) => ({
    id: cardInGame.id,
});
const hidingNecessary = (targetZone, isOpponent) => {
    return hiddenZonesHash[targetZone] && isOpponent;
};
export const hideIfNecessary = (card, targetZone, isOpponent) => {
    if (hiddenZonesHash[targetZone] && isOpponent) {
        return {
            ...card,
            card: null,
            data: {},
        };
    }
    else {
        return card;
    }
};
export function convertServerCommand(initialAction, game, playerId, overrideHiding = false) {
    try {
        var action = clone(initialAction);
    }
    catch (e) {
        console.log(`Error converting command`);
        console.dir(initialAction);
        throw new Error();
    }
    switch (action.type) {
        case ACTION_PASS: {
            const step = game.state.step;
            const newStep = (step === null) ? 0 : (step + 1) % NUMBER_OF_STEPS;
            return {
                ...action,
                newStep,
            };
        }
        case ACTION_PLAY: {
            const cardPlayed = 'card' in action ? game.getMetaValue(action.card, action.generatedBy) : action.payload.card; // ? action.payload.card : metaCard;
            return {
                ...action,
                payload: {
                    ...('payload' in action ? action.payload : {}),
                    card: convertCard(cardPlayed),
                }
            };
        }
        case ACTION_PLAYER_WINS: {
            return {
                type: action.type,
                player: action.player,
            };
        }
        case ACTION_ATTACK: {
            const attackSource = game.getMetaValue(action.source, action.generatedBy);
            const attackTarget = game.getMetaValue(action.target, action.generatedBy);
            const convertedAction = {
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
            switch (action.promptType) {
                case PROMPT_TYPE_NUMBER: {
                    return {
                        type: action.type,
                        promptType: action.promptType,
                        min: parseInt(game.getMetaValue(action.min, action.generatedBy), 10),
                        max: parseInt(game.getMetaValue(action.max, action.generatedBy), 10),
                        ...(action.message ? { message: action.message } : {}),
                        player: action.player,
                    };
                }
                case PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES: {
                    return {
                        type: action.type,
                        promptType: action.promptType,
                        ...(action.message ? { message: action.message } : {}),
                        amount: parseInt(game.getMetaValue(action.amount, action.generatedBy), 10),
                        player: action.player,
                    };
                }
                case PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES: {
                    return {
                        type: action.type,
                        promptType: action.promptType,
                        ...(action.message ? { message: action.message } : {}),
                        amount: parseInt(game.getMetaValue(action.amount, action.generatedBy), 10),
                        player: action.player,
                    };
                }
                case PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES: {
                    return {
                        type: action.type,
                        promptType: action.promptType,
                        ...(action.message ? { message: action.message } : {}),
                        player: action.player,
                    };
                }
                case PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE: {
                    debugger;
                    const restrictions = action.restrictions || (action.restriction ? [
                        {
                            type: game.getMetaValue(action.restriction, action.generatedBy),
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
                        cards: cards.map(card => convertCard(card)),
                        zoneOwner,
                        ...(action.message ? { message: action.message } : {}),
                        numberOfCards,
                    };
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
                        ...(action.message ? { message: action.message } : {}),
                        cards: cards.map(card => convertCard(card)),
                        zoneOwner,
                        numberOfCards,
                    };
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
                        ...(action.message ? { message: action.message } : {}),
                        cards: cards.map(card => convertCard(card)),
                        zoneOwner,
                        numberOfCards,
                    };
                }
                case PROMPT_TYPE_DISTRUBUTE_CARDS_IN_ZONES: {
                    const sourceZone = game.getMetaValue(action.sourceZone, action.generatedBy);
                    const zoneOwner = game.getMetaValue(action.sourceZoneOwner, action.generatedBy);
                    const numberOfCards = game.getMetaValue(action.numberOfCards, action.generatedBy);
                    // targetZones cannot be metadata values because you cannot store set of zones in a value for now
                    const zoneContent = game.getZone(sourceZone, zoneOwner).cards;
                    const cards = zoneContent.slice(0, parseInt(numberOfCards, 10));
                    const player = game.getMetaValue(action.player || 1, action.generatedBy);
                    const result = {
                        type: ACTION_ENTER_PROMPT,
                        promptType: PROMPT_TYPE_DISTRUBUTE_CARDS_IN_ZONES,
                        player,
                        sourceZone,
                        ...(action.message ? { message: action.message } : {}),
                        cards: cards.map(card => convertCard(card)), // These are never hidden
                        zoneOwner,
                        targetZones: action.targetZones,
                        numberOfCards,
                    };
                    return result;
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
                    };
                }
                case PROMPT_TYPE_SINGLE_CREATURE: {
                    return {
                        type: action.type,
                        promptType: action.promptType,
                        promptParams: action.promptParams,
                        generatedBy: action.generatedBy,
                        ...(action.message ? { message: action.message } : {}),
                        player: action.player,
                    };
                }
                case PROMPT_TYPE_SINGLE_CREATURE_FILTERED: {
                    return {
                        type: action.type,
                        promptType: action.promptType,
                        restrictions: action.restrictions,
                        restriction: action.restriction,
                        ...(action.message ? { message: action.message } : {}),
                        restrictionValue: action.restrictionValue,
                        player: action.player,
                    };
                }
                case PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE: {
                    const actionSource = game.getMetaValue(action.source, action.generatedBy);
                    return {
                        type: action.type,
                        promptType: action.promptType,
                        source: convertCard(actionSource),
                        promptParams: action.promptParams,
                        ...(action.message ? { message: action.message } : {}),
                        generatedBy: action.generatedBy,
                        player: action.player,
                    };
                }
                case PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI: {
                    const actionSource = game.getMetaValue(action.source, action.generatedBy);
                    const promptPlayer = action.player || actionSource.owner;
                    return {
                        type: action.type,
                        promptType: action.promptType,
                        promptParams: action.promptParams,
                        ...(action.message ? { message: action.message } : {}),
                        generatedBy: action.generatedBy,
                        player: promptPlayer,
                    };
                }
                case PROMPT_TYPE_POWER_ON_MAGI: {
                    const magi = game.getMetaValue(action?.magi, action.generatedBy);
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
                    const result = {
                        type: action.type,
                        promptType: action.promptType,
                        paymentType: action.paymentType,
                        cards: action.cards.map(convertCardMinimal),
                        amount: action.amount,
                        generatedBy: action.generatedBy,
                        player: parseInt(game.getMetaValue(action.player, action.generatedBy), 10),
                    };
                    return result;
                }
                default: {
                    // @ts-ignore
                    return {
                        type: action.type,
                        promptType: action.promptType,
                        promptParams: 'promptParams' in action ? action.promptParams : {},
                        ...(action.message ? { message: action.message } : {}),
                        generatedBy: action.generatedBy,
                        player: action.player,
                    };
                }
            }
        }
        case ACTION_RESOLVE_PROMPT: {
            const promptAction = {
                type: action.type,
                player: action.player,
            };
            if ('target' in action && action.target) {
                promptAction.targetCard = convertCard(action.target);
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
            };
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
                        sourceCard: convertCard(action.sourceCard, hidingNecessary(action.sourceZone, overrideHiding ? false : sourceCardOwner !== playerId)),
                        // sourceCard: convertCard(hideIfNecessary(
                        //   action.sourceCard,
                        //   action.sourceZone,
                        //   overrideHiding ? false : sourceCardOwner !== playerId
                        // )),
                        sourceZone: action.sourceZone,
                        destinationCard: convertCard(action.destinationCard, hidingNecessary(action.destinationZone, overrideHiding ? false : destinationCardOwner !== playerId)),
                        // destinationCard: convertCard(hideIfNecessary(
                        //   action.destinationCard,
                        //   action.destinationZone,
                        //   overrideHiding ? false : destinationCardOwner !== playerId
                        // )),
                        destinationZone: action.destinationZone,
                        convertedFor: playerId,
                        destOwner: destinationCardOwner,
                        player: action.player,
                        generatedBy: action.generatedBy,
                    };
                }
                case EFFECT_TYPE_PLAY_SPELL: {
                    return {
                        type: action.type,
                        effectType: action.effectType,
                        player: action.player,
                        card: convertCard(action.card),
                        generatedBy: action.generatedBy,
                    };
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
                    };
                }
                case EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE: {
                    const cards = (typeof action.cards == 'string') ?
                        game.getMetaValue(action.cards, action.generatedBy) :
                        action.cards;
                    const zone = game.getMetaValue(action.zone, action.generatedBy);
                    const zoneOwner = game.getMetaValue(action.zoneOwner, action.generatedBy);
                    return {
                        ...action,
                        cards,
                        zone,
                        zoneOwner,
                    };
                }
                case EFFECT_TYPE_PAYING_ENERGY_FOR_POWER: {
                    const targetCard = (typeof action.target == 'string') ?
                        game.getMetaValue(action.target, action.generatedBy) :
                        action.target;
                    const amount = (typeof action.amount == 'string') ?
                        parseInt(game.getMetaValue(action.amount, action.generatedBy), 10) :
                        action.amount;
                    const target = (targetCard.length) ? targetCard[0] : targetCard;
                    return {
                        ...action,
                        target: convertCard(target),
                        amount,
                    };
                }
                case EFFECT_TYPE_MAGI_IS_DEFEATED: {
                    return {
                        type: action.type,
                        effectType: action.effectType,
                        target: convertCard(action.target),
                        generatedBy: action.generatedBy,
                    };
                }
                case EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES: {
                    const energyOnCreatures = game.getMetaValue(action.energyOnCreatures, action.generatedBy) || {};
                    return {
                        type: action.type,
                        effectType: action.effectType,
                        energyOnCreatures,
                        player: action.player,
                    };
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
                    if (!fromCard) {
                        if (typeof action.from == 'string') {
                            console.log(`fromCard: ${action.from}`);
                            console.dir(game.getSpellMetadata(action.generatedBy));
                        }
                        else {
                            console.log(`fromCard`);
                            console.dir(action.from);
                        }
                        console.dir(fromCard);
                    }
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
                // case EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI: {
                // 	const targetCard = (typeof action.target == 'string') ?
                // 		game.getMetaValue(action.target, action.generatedBy) :
                // 		action.target;
                // 	const amount = (typeof action.amount == 'string') ?
                // 		parseInt(game.getMetaValue(action.amount, action.generatedBy), 10) :
                // 		action.amount;
                // 	const target = (targetCard.length) ? targetCard[0] : targetCard;
                // 	return {
                // 		type: action.type,
                // 		effectType: action.effectType,
                // 		target: convertCard(target),
                // 		source: action.source ? convertCard(action.source) : null,
                // 		amount,
                // 		generatedBy: action.generatedBy,
                // 	} as ClientEffectDiscardEnergyFromMagi;
                // }
                case EFFECT_TYPE_ENERGY_DISCARDED_FROM_MAGI: {
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
                        target: convertCardMinimal(target),
                        source: action.source ? convertCardMinimal(action.source) : null,
                        amount,
                        generatedBy: action.generatedBy,
                    };
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
                    };
                }
                case EFFECT_TYPE_ATTACK: {
                    const attackSource = game.getMetaValue(action.source, action.generatedBy);
                    const attackTarget = game.getMetaValue(action.target, action.generatedBy);
                    const additionalAttackers = game.getMetaValue(action.additionalAttackers, action.generatedBy) || [];
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
                    };
                }
                case EFFECT_TYPE_PLAY_CREATURE: {
                    const result = {
                        ...action,
                        card: convertCard(action.card),
                    };
                    return result;
                }
                // case EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES: {
                // 	const targetCards = (typeof action.target == 'string') ?
                // 		game.getMetaValue(action.target, action.generatedBy) :
                // 		action.target;
                // 	const clientAction: ClientEffectMoveCardsBetweenZones = {
                // 		type: action.type,
                // 		effectType: action.effectType,
                // 		sourceZone: action.sourceZone,
                // 		destinationZone: action.destinationZone,
                // 		target: targetCards.map(convertCardMinimal),
                // 		generatedBy: action.generatedBy,
                // 		player: action.player || 1000, // no idea why player may be missing here
                // 	}
                // 	return clientAction;
                // }
                case EFFECT_TYPE_MAGI_IS_DEFEATED: {
                    action;
                    const clientAction = {
                        type: action.type,
                        effectType: action.effectType,
                        target: convertCardMinimal(action.target),
                        generatedBy: action.generatedBy,
                    };
                    return clientAction;
                }
                // case EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES: {
                // 	const targetCard = (typeof action.target === 'string') ?
                // 		game.getMetaValue(action.target, action.generatedBy) :
                // 		action.target;
                // 	// This is sometimes generated by Twee. Will be fixed with the addition of EFFECT_TYPE_CARD_MOVED_BETWEEN_ZONES
                // 	if (targetCard instanceof Array && targetCard.length == 0) {
                // 		return {
                // 			type: 'ACTION_NONE',
                // 			generatedBy: action.generatedBy,
                // 			player: action.player || 1000, // no idea why player may be missing here
                // 		}
                // 	}
                // 	if ((!(targetCard instanceof Array)) && (!targetCard.id && !targetCard.length)) {
                // 		console.dir(`Error getting the card from ${action.target}`);
                // 		console.dir(targetCard)
                // 		console.log('Action')
                // 		console.dir(action);
                // 		console.log('Metadata:');
                // 		console.dir(game.getSpellMetadata(action.generatedBy));
                // 	}
                // 	const clientAction: ClientEffectMoveCardBetweenZones = {
                // 		type: action.type,
                // 		effectType: action.effectType,
                // 		sourceZone: action.sourceZone,
                // 		destinationZone: action.destinationZone,
                // 		target: targetCard instanceof Array ? convertCardMinimal(targetCard[0]) : convertCardMinimal(targetCard),
                // 		generatedBy: action.generatedBy,
                // 		player: action.player || 1000, // no idea why player may be missing here
                // 	}
                // 	return clientAction;
                // }
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
                    };
                }
                case EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY: {
                    const targetCard = (typeof action.target == 'string') ?
                        game.getMetaValue(action.target, action.generatedBy) :
                        action.target;
                    const target = ('length' in targetCard && targetCard.length) ? targetCard[0] : targetCard;
                    // @ts-ignore will be fixed in a future moonlands update
                    const sourceCard = (typeof action?.source == 'string') ?
                        // @ts-ignore will be fixed in a future moonlands update
                        game.getMetaValue(action?.source, action.generatedBy) :
                        action.source;
                    return {
                        type: action.type,
                        effectType: action.effectType,
                        source: sourceCard ? convertCard(sourceCard) : null,
                        target: convertCard(target),
                        generatedBy: action.generatedBy,
                        player: action.player,
                    };
                }
                case EFFECT_TYPE_ENERGY_DISCARDED_FROM_CREATURE: {
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
                    };
                }
                case EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE: {
                    const targetCard = (typeof action.target == 'string') ?
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
                    };
                }
                case EFFECT_TYPE_DISCARD_CARD_FROM_HAND: {
                    return {
                        type: ACTION_EFFECT,
                        effectType: EFFECT_TYPE_DISCARD_CARD_FROM_HAND,
                        target: convertCard(game.getMetaValue(action.target, action.generatedBy)),
                        player: action.player,
                    };
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
                    };
                }
                case EFFECT_TYPE_ADD_ENERGY_TO_MAGI: {
                    const targetCard = (typeof action.target == 'string') ?
                        game.getMetaValue(action.target, action.generatedBy) :
                        action.target;
                    // @ts-ignore
                    const sourceCard = (typeof action.source == 'string') ?
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
                        ...(sourceCard ? { source: convertCardMinimal(sourceCard) } : {}),
                        target: convertCardMinimal(target),
                        amount,
                    };
                }
                case EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES: {
                    const energyOnCreatures = game.getMetaValue(action.energyOnCreatures, action.generatedBy);
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
                    };
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
                    };
                }
                case EFFECT_TYPE_END_OF_TURN: {
                    return {
                        type: action.type,
                        effectType: action.effectType,
                        player: action.player,
                    };
                }
                // This one is needed only for the log entry
                case EFFECT_TYPE_DRAW: {
                    return {
                        type: action.type,
                        effectType: action.effectType,
                        player: action.player,
                    };
                }
                case EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT: {
                    const staticAbilities = (action.staticAbilities || []).map(ability => Object.fromEntries(Object.entries(ability).map(([k, v]) => [k, game.getMetaValue(v, action.generatedBy)])));
                    return {
                        type: action.type,
                        effectType: action.effectType,
                        generatedBy: action.generatedBy,
                        expiration: {
                            ...action.expiration,
                            turns: typeof action.expiration.turns == 'string' ? game.getMetaValue(action.expiration.turns, action.generatedBy) : action.expiration.turns,
                        },
                        staticAbilities,
                        triggerEffects: action.triggerEffects || [],
                        player: action.player,
                    };
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
                        action.target;
                    const source = (sourceCard && 'length' in sourceCard && sourceCard.length) ? sourceCard[0] : sourceCard;
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
                    const convertedAction = {
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
                case EFFECT_TYPE_ATTACH_CARD_TO_CARD: {
                    const target = (typeof action.target == 'string') ?
                        game.getMetaValue(action.target, action.generatedBy) :
                        action.target;
                    const attachmentTarget = (typeof action.attachmentTarget == 'string') ?
                        game.getMetaValue(action.attachmentTarget, action.generatedBy) :
                        action.attachmentTarget;
                    const convertedAction = {
                        type: ACTION_EFFECT,
                        effectType: EFFECT_TYPE_ATTACH_CARD_TO_CARD,
                        target: convertCardMinimal(target),
                        attachmentTarget: convertCardMinimal(attachmentTarget),
                        player: action.player || 0,
                        generatedBy: action.generatedBy,
                    };
                    return convertedAction;
                }
            }
        }
    }
    return null;
}
export function convertClientCommands(action, game) {
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
                        };
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
                            const cards = zoneContent.filter(card => (actionCards instanceof Array && actionCards.includes(card.id)));
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
                    const zone = game.state.promptParams.zone === ZONE_TYPE_IN_PLAY ? game.getZone(ZONE_TYPE_IN_PLAY) : game.getZone(game.state.promptParams.zone || ZONE_TYPE_HAND, game.state.promptParams.zoneOwner || 0);
                    const zoneContent = zone.cards;
                    const actionCards = action.cards;
                    if (actionCards) {
                        const cards = zoneContent.filter(card => (actionCards instanceof Array && actionCards.includes(card.id)));
                        return {
                            type: action.type,
                            // @ts-ignore for now
                            zone: game.state.promptParams.zone,
                            zoneOwner: game.state.promptParams.zoneOwner,
                            cards,
                            player: action.player,
                        };
                    }
                    else {
                        throw new Error(`Unknown zone ${action.zone} or cards.`);
                    }
                }
                case PROMPT_TYPE_CHOOSE_CARDS: {
                    // Will do for now
                    return action;
                }
                case PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES: {
                    // Will do for now
                    return action;
                }
                case PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES: {
                    // Will do for now
                    return action;
                }
                case PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES: {
                    // Will do for now
                    return action;
                }
                case PROMPT_TYPE_NUMBER: {
                    return action;
                }
                case PROMPT_TYPE_MAY_ABILITY: {
                    return action;
                }
                case PROMPT_TYPE_PLAYER: {
                    return action;
                }
                case PROMPT_TYPE_ALTERNATIVE: {
                    return action;
                }
                case PROMPT_TYPE_PAYMENT_SOURCE: {
                    if (!action.target)
                        return action;
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
                    };
                }
                case PROMPT_TYPE_DISTRUBUTE_CARDS_IN_ZONES: {
                    if ('sourceZone' in game.state.promptParams &&
                        game.state.promptParams.sourceZone &&
                        typeof action.cards == 'object') {
                        const sourceZone = game.getZone(game.state.promptParams.sourceZone, game.state.promptParams.sourceZoneOwner);
                        const cards = {};
                        const booleanGuard = Boolean;
                        for (const [targetZone, zoneCards] of Object.entries(action.cards)) {
                            cards[targetZone] = zoneCards.map(zoneCardId => sourceZone.byId(zoneCardId)).filter(booleanGuard);
                        }
                        return {
                            ...action,
                            cards,
                        };
                    }
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
                }
                else if (!powerSource.card.data.powers) {
                    console.log('Activating power of the source with no powers');
                    return null;
                }
                const power = powerSource.card.data.powers.find(power => power.name === action.power);
                const player = powerSource.data.controller;
                if (!power) {
                    return null;
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
                };
            }
            break;
        }
        case ACTION_ATTACK: {
            const attackSource = game.getZone(ZONE_TYPE_IN_PLAY, null).byId(action.source);
            if (!attackSource) {
                return null;
            }
            let attackTarget = game.getZone(ZONE_TYPE_IN_PLAY, null).byId(action.target);
            let additionalAttackers = [];
            if (action.additionalAttackers) {
                additionalAttackers = action.additionalAttackers.map(id => game.getZone(ZONE_TYPE_IN_PLAY, null).byId(id));
            }
            if (!attackTarget) {
                const controller = game.modifyByStaticAbilities(attackSource, PROPERTY_CONTROLLER);
                const opponentId = game.getOpponent(controller);
                attackTarget = game.getZone(ZONE_TYPE_ACTIVE_MAGI, opponentId).byId(action.target);
            }
            if (!attackTarget) {
                return null;
            }
            const finalAction = {
                type: action.type,
                source: attackSource,
                sourceAtStart: attackSource,
                target: attackTarget,
                targetAtStart: attackTarget,
                player: action.player,
            };
            if (additionalAttackers.length) {
                finalAction.additionalAttackers = additionalAttackers;
            }
            return finalAction;
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
            };
        }
        case ACTION_PASS: {
            return action;
        }
    }
    return null;
}
export default convertClientCommands;
