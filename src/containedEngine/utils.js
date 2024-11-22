"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.hideIfNecessary = void 0;
exports.convertServerCommand = convertServerCommand;
exports.convertClientCommands = convertClientCommands;
var const_1 = require("moonlands/dist/esm/const");
var clone_1 = require("moonlands/dist/esm/clone");
var hiddenZonesHash = (_a = {},
    _a[const_1.ZONE_TYPE_DECK] = true,
    _a[const_1.ZONE_TYPE_MAGI_PILE] = true,
    _a[const_1.ZONE_TYPE_HAND] = true,
    _a[const_1.ZONE_TYPE_ACTIVE_MAGI] = false,
    _a[const_1.ZONE_TYPE_DISCARD] = false,
    _a[const_1.ZONE_TYPE_DEFEATED_MAGI] = false,
    _a[const_1.ZONE_TYPE_IN_PLAY] = false,
    _a);
var NUMBER_OF_STEPS = 6;
var index = function (obj, is, value) {
    if (value === void 0) { value = ''; }
    // Stupid temporary guard
    if (is === '') {
        return obj.toString();
    }
    var correctIs = (typeof is == 'string') ? is.split('.') : is;
    if (is.length == 1 && value !== undefined)
        return obj[correctIs[0]].toString(); // = value;
    else if (correctIs.length == 0)
        return obj.toString();
    else
        return index(obj[correctIs[0]], correctIs.slice(1).join('.'), value);
};
var templateMessage = function (message, metadata) {
    return message.replace(/\$\{(.+?)\}/g, function (_match, p1) { return index(metadata, p1); });
};
var convertCard = function (cardInGame, hidden) {
    if (hidden === void 0) { hidden = false; }
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
var convertCardMinimal = function (cardInGame) { return ({
    id: cardInGame.id,
}); };
var hidingNecessary = function (targetZone, isOpponent) {
    return hiddenZonesHash[targetZone] && isOpponent;
};
var hideIfNecessary = function (card, targetZone, isOpponent) {
    if (hiddenZonesHash[targetZone] && isOpponent) {
        return __assign(__assign({}, card), { card: null, data: {} });
    }
    else {
        return card;
    }
};
exports.hideIfNecessary = hideIfNecessary;
function convertServerCommand(initialAction, game, playerId, overrideHiding) {
    if (overrideHiding === void 0) { overrideHiding = false; }
    try {
        var action = (0, clone_1.default)(initialAction);
    }
    catch (e) {
        console.log("Error converting command");
        console.dir(initialAction);
        throw new Error();
    }
    switch (action.type) {
        case const_1.ACTION_PASS: {
            var step = game.state.step;
            var newStep = (step === null) ? 0 : (step + 1) % NUMBER_OF_STEPS;
            return __assign(__assign({}, action), { newStep: newStep });
        }
        case const_1.ACTION_PLAY: {
            var cardPlayed = 'card' in action ? game.getMetaValue(action.card, action.generatedBy) : action.payload.card; // ? action.payload.card : metaCard;
            return __assign(__assign({}, action), { payload: __assign(__assign({}, ('payload' in action ? action.payload : {})), { card: convertCard(cardPlayed) }) });
        }
        case const_1.ACTION_PLAYER_WINS: {
            return {
                type: action.type,
                player: action.player,
            };
        }
        case const_1.ACTION_ATTACK: {
            var attackSource = game.getMetaValue(action.source, action.generatedBy);
            var attackTarget = game.getMetaValue(action.target, action.generatedBy);
            var convertedAction = {
                type: action.type,
                source: attackSource.id,
                target: attackTarget.id,
                player: attackSource.owner,
            };
            if ('additionalAttackers' in action && action.additionalAttackers) {
                convertedAction.additionalAttackers = action.additionalAttackers.map(function (card) { return card.id; });
            }
            return convertedAction;
        }
        case const_1.ACTION_ENTER_PROMPT: {
            if (action.message && action.generatedBy) {
                var metaData = game.getSpellMetadata(action.generatedBy);
                action.message = templateMessage(action.message, metaData);
            }
            switch (action.promptType) {
                case const_1.PROMPT_TYPE_NUMBER: {
                    return __assign(__assign({ type: action.type, promptType: action.promptType, min: parseInt(game.getMetaValue(action.min, action.generatedBy), 10), max: parseInt(game.getMetaValue(action.max, action.generatedBy), 10) }, (action.message ? { message: action.message } : {})), { player: action.player });
                }
                case const_1.PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES: {
                    return __assign(__assign({ type: action.type, promptType: action.promptType }, (action.message ? { message: action.message } : {})), { amount: parseInt(game.getMetaValue(action.amount, action.generatedBy), 10), player: action.player });
                }
                case const_1.PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES: {
                    return __assign(__assign({ type: action.type, promptType: action.promptType }, (action.message ? { message: action.message } : {})), { amount: parseInt(game.getMetaValue(action.amount, action.generatedBy), 10), player: action.player });
                }
                case const_1.PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES: {
                    return __assign(__assign({ type: action.type, promptType: action.promptType }, (action.message ? { message: action.message } : {})), { player: action.player });
                }
                case const_1.PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE: {
                    debugger;
                    var restrictions = action.restrictions || (action.restriction ? [
                        {
                            type: game.getMetaValue(action.restriction, action.generatedBy),
                            value: game.getMetaValue(action.restrictionValue, action.generatedBy),
                        },
                    ] : null);
                    var zone = game.getMetaValue(action.zone, action.generatedBy);
                    var zoneOwner = game.getMetaValue(action.zoneOwner, action.generatedBy);
                    var numberOfCards = game.getMetaValue(action.numberOfCards, action.generatedBy);
                    var cardFilter = game.makeCardFilter(restrictions || []);
                    var zoneContent = game.getZone(zone, zoneOwner).cards;
                    var cards = restrictions ? zoneContent.filter(cardFilter) : zoneContent;
                    var promptPlayer = game.getMetaValue(action.player, action.generatedBy);
                    return __assign(__assign({ type: const_1.ACTION_ENTER_PROMPT, promptType: const_1.PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE, player: promptPlayer, zone: zone, restrictions: restrictions, cards: cards.map(function (card) { return convertCard(card); }), zoneOwner: zoneOwner }, (action.message ? { message: action.message } : {})), { numberOfCards: numberOfCards });
                }
                case const_1.PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE: {
                    var restrictions = action.restrictions || (action.restriction ? [
                        {
                            type: game.getMetaValue(action.restriction, action.generatedBy),
                            value: game.getMetaValue(action.restrictionValue, action.generatedBy),
                        },
                    ] : null);
                    var zone = game.getMetaValue(action.zone, action.generatedBy);
                    var zoneOwner = game.getMetaValue(action.zoneOwner, action.generatedBy);
                    var numberOfCards = game.getMetaValue(action.numberOfCards, action.generatedBy);
                    var promptPlayer = game.getMetaValue(action.player, action.generatedBy);
                    var cardFilter = game.makeCardFilter(restrictions || []);
                    var zoneContent = game.getZone(zone, zoneOwner).cards;
                    var cards = restrictions ? zoneContent.filter(cardFilter) : zoneContent;
                    return __assign(__assign({ type: const_1.ACTION_ENTER_PROMPT, promptType: const_1.PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE, player: promptPlayer, zone: zone, restrictions: restrictions }, (action.message ? { message: action.message } : {})), { cards: cards.map(function (card) { return convertCard(card); }), zoneOwner: zoneOwner, numberOfCards: numberOfCards });
                }
                case const_1.PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE: {
                    var zone = game.getMetaValue(action.promptParams.zone, action.generatedBy);
                    var zoneOwner = game.getMetaValue(action.promptParams.zoneOwner, action.generatedBy);
                    var numberOfCards = game.getMetaValue(action.promptParams.numberOfCards, action.generatedBy);
                    var zoneContent = game.getZone(zone, zoneOwner).cards;
                    var cards = zoneContent.slice(0, parseInt(numberOfCards, 10));
                    return __assign(__assign({ type: const_1.ACTION_ENTER_PROMPT, promptType: const_1.PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE, player: action.player, zone: zone }, (action.message ? { message: action.message } : {})), { cards: cards.map(function (card) { return convertCard(card); }), zoneOwner: zoneOwner, numberOfCards: numberOfCards });
                }
                case const_1.PROMPT_TYPE_DISTRUBUTE_CARDS_IN_ZONES: {
                    var sourceZone = game.getMetaValue(action.sourceZone, action.generatedBy);
                    var zoneOwner = game.getMetaValue(action.sourceZoneOwner, action.generatedBy);
                    var numberOfCards = game.getMetaValue(action.numberOfCards, action.generatedBy);
                    // targetZones cannot be metadata values because you cannot store set of zones in a value for now
                    var zoneContent = game.getZone(sourceZone, zoneOwner).cards;
                    var cards = zoneContent.slice(0, parseInt(numberOfCards, 10));
                    var player = game.getMetaValue(action.player || 1, action.generatedBy);
                    var result = __assign(__assign({ type: const_1.ACTION_ENTER_PROMPT, promptType: const_1.PROMPT_TYPE_DISTRUBUTE_CARDS_IN_ZONES, player: player, sourceZone: sourceZone }, (action.message ? { message: action.message } : {})), { cards: cards.map(function (card) { return convertCard(card); }), // These are never hidden
                        zoneOwner: zoneOwner, targetZones: action.targetZones, numberOfCards: numberOfCards });
                    return result;
                }
                case const_1.PROMPT_TYPE_CHOOSE_CARDS: {
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
                case const_1.PROMPT_TYPE_SINGLE_CREATURE: {
                    return __assign(__assign({ type: action.type, promptType: action.promptType, promptParams: action.promptParams, generatedBy: action.generatedBy }, (action.message ? { message: action.message } : {})), { player: action.player });
                }
                case const_1.PROMPT_TYPE_SINGLE_CREATURE_FILTERED: {
                    return __assign(__assign({ type: action.type, promptType: action.promptType, restrictions: action.restrictions, restriction: action.restriction }, (action.message ? { message: action.message } : {})), { restrictionValue: action.restrictionValue, player: action.player });
                }
                case const_1.PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE: {
                    var actionSource = game.getMetaValue(action.source, action.generatedBy);
                    return __assign(__assign({ type: action.type, promptType: action.promptType, source: convertCard(actionSource), promptParams: action.promptParams }, (action.message ? { message: action.message } : {})), { generatedBy: action.generatedBy, player: action.player });
                }
                case const_1.PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI: {
                    var actionSource = game.getMetaValue(action.source, action.generatedBy);
                    var promptPlayer = action.player || actionSource.owner;
                    return __assign(__assign({ type: action.type, promptType: action.promptType, promptParams: action.promptParams }, (action.message ? { message: action.message } : {})), { generatedBy: action.generatedBy, player: promptPlayer });
                }
                case const_1.PROMPT_TYPE_POWER_ON_MAGI: {
                    var magi = game.getMetaValue(action === null || action === void 0 ? void 0 : action.magi, action.generatedBy);
                    return {
                        type: action.type,
                        promptType: action.promptType,
                        magi: convertCard(magi[0]),
                        generatedBy: action.generatedBy,
                        player: action.player,
                    };
                }
                case const_1.PROMPT_TYPE_ALTERNATIVE: {
                    return {
                        type: action.type,
                        promptType: action.promptType,
                        alternatives: action.alternatives,
                        generatedBy: action.generatedBy,
                        player: parseInt(game.getMetaValue(action.player, action.generatedBy), 10),
                    };
                }
                case const_1.PROMPT_TYPE_PAYMENT_SOURCE: {
                    var result = {
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
                    return __assign(__assign({ type: action.type, promptType: action.promptType, promptParams: 'promptParams' in action ? action.promptParams : {} }, (action.message ? { message: action.message } : {})), { generatedBy: action.generatedBy, player: action.player });
                }
            }
        }
        case const_1.ACTION_RESOLVE_PROMPT: {
            var promptAction = {
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
        case const_1.ACTION_POWER: {
            var actionSource = game.getMetaValue(action.source, action.generatedBy);
            return __assign(__assign({}, action), { source: convertCard(actionSource), power: action.power.name });
        }
        case const_1.ACTION_EFFECT: {
            switch (action.effectType) {
                case const_1.EFFECT_TYPE_CARD_MOVED_BETWEEN_ZONES: {
                    var sourceCardOwner = action.sourceCard.owner;
                    var destinationCardOwner = action.destinationCard.owner;
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
                case const_1.EFFECT_TYPE_PLAY_SPELL: {
                    return {
                        type: action.type,
                        effectType: action.effectType,
                        player: action.player,
                        card: convertCard(action.card),
                        generatedBy: action.generatedBy,
                    };
                }
                case const_1.EFFECT_TYPE_DIE_ROLLED: {
                    return {
                        type: action.type,
                        effectType: action.effectType,
                        result: action.result,
                        generatedBy: action.generatedBy,
                        player: action.player,
                    };
                }
                case const_1.EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE: {
                    if (!action.target) {
                        return null;
                    }
                    var actionTarget = game.getMetaValue(action.target, action.generatedBy);
                    return {
                        type: action.type,
                        effectType: action.effectType,
                        target: convertCardMinimal(actionTarget),
                        player: action.player,
                    };
                }
                case const_1.EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE: {
                    var cards = (typeof action.cards == 'string') ?
                        game.getMetaValue(action.cards, action.generatedBy) :
                        action.cards;
                    var zone = game.getMetaValue(action.zone, action.generatedBy);
                    var zoneOwner = game.getMetaValue(action.zoneOwner, action.generatedBy);
                    return __assign(__assign({}, action), { cards: cards, zone: zone, zoneOwner: zoneOwner });
                }
                case const_1.EFFECT_TYPE_PAYING_ENERGY_FOR_POWER: {
                    var targetCard = (typeof action.target == 'string') ?
                        game.getMetaValue(action.target, action.generatedBy) :
                        action.target;
                    var amount = (typeof action.amount == 'string') ?
                        parseInt(game.getMetaValue(action.amount, action.generatedBy), 10) :
                        action.amount;
                    var target = (targetCard.length) ? targetCard[0] : targetCard;
                    return __assign(__assign({}, action), { target: convertCard(target), amount: amount });
                }
                case const_1.EFFECT_TYPE_MAGI_IS_DEFEATED: {
                    return {
                        type: action.type,
                        effectType: action.effectType,
                        target: convertCard(action.target),
                        generatedBy: action.generatedBy,
                    };
                }
                case const_1.EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES: {
                    var energyOnCreatures = game.getMetaValue(action.energyOnCreatures, action.generatedBy) || {};
                    return {
                        type: action.type,
                        effectType: action.effectType,
                        energyOnCreatures: energyOnCreatures,
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
                case const_1.EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE: {
                    var fromCard = (typeof action.from == 'string') ?
                        game.getMetaValue(action.from, action.generatedBy) :
                        action.from;
                    if (!fromCard) {
                        if (typeof action.from == 'string') {
                            console.log("fromCard: ".concat(action.from));
                            console.dir(game.getSpellMetadata(action.generatedBy));
                        }
                        else {
                            console.log("fromCard");
                            console.dir(action.from);
                        }
                        console.dir(fromCard);
                    }
                    var from = (fromCard.length) ? fromCard[0] : fromCard;
                    return __assign(__assign({}, action), { from: convertCardMinimal(from) });
                }
                case const_1.EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE: {
                    var targetCard = (typeof action.target == 'string') ?
                        game.getMetaValue(action.target, action.generatedBy) :
                        action.target;
                    return __assign(__assign({}, action), { target: convertCard(targetCard) });
                }
                case const_1.EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL: {
                    var fromCard = (typeof action.from == 'string') ?
                        game.getMetaValue(action.from, action.generatedBy) :
                        action.from;
                    var from = (fromCard.length) ? fromCard[0] : fromCard;
                    return __assign(__assign({}, action), { from: convertCardMinimal(from) });
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
                case const_1.EFFECT_TYPE_ENERGY_DISCARDED_FROM_MAGI: {
                    var targetCard = (typeof action.target == 'string') ?
                        game.getMetaValue(action.target, action.generatedBy) :
                        action.target;
                    var amount = (typeof action.amount == 'string') ?
                        parseInt(game.getMetaValue(action.amount, action.generatedBy), 10) :
                        action.amount;
                    var target = (targetCard.length) ? targetCard[0] : targetCard;
                    return {
                        type: action.type,
                        effectType: action.effectType,
                        target: convertCardMinimal(target),
                        source: action.source ? convertCardMinimal(action.source) : null,
                        amount: amount,
                        generatedBy: action.generatedBy,
                    };
                }
                case const_1.EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI: {
                    var targetCard = (typeof action.target == 'string') ?
                        game.getMetaValue(action.target, action.generatedBy) :
                        action.target;
                    var amount = (typeof action.amount == 'string') ?
                        parseInt(game.getMetaValue(action.amount, action.generatedBy), 10) :
                        action.amount;
                    var target = (targetCard.length) ? targetCard[0] : targetCard;
                    return {
                        type: action.type,
                        effectType: action.effectType,
                        target: convertCard(target),
                        amount: amount,
                        generatedBy: action.generatedBy,
                        player: action.player,
                    };
                }
                case const_1.EFFECT_TYPE_ATTACK: {
                    var attackSource = game.getMetaValue(action.source, action.generatedBy);
                    var attackTarget = game.getMetaValue(action.target, action.generatedBy);
                    var additionalAttackers = game.getMetaValue(action.additionalAttackers, action.generatedBy) || [];
                    return __assign(__assign({}, action), { source: attackSource.id, target: attackTarget.id, additionalAttackers: additionalAttackers.map(function (card) { return card.id; }), generatedBy: action.generatedBy, player: action.player });
                }
                case const_1.EFFECT_TYPE_CREATURE_ATTACKS: {
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
                case const_1.EFFECT_TYPE_PLAY_CREATURE: {
                    var result = __assign(__assign({}, action), { card: convertCard(action.card) });
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
                case const_1.EFFECT_TYPE_MAGI_IS_DEFEATED: {
                    action;
                    var clientAction = {
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
                case const_1.EFFECT_TYPE_MOVE_ENERGY: {
                    var targetCard = (typeof action.target == 'string') ?
                        game.getMetaValue(action.target, action.generatedBy) :
                        action.target;
                    var target = (targetCard.length) ? targetCard[0] : targetCard;
                    var sourceCard = (typeof action.source == 'string') ?
                        game.getMetaValue(action.source, action.generatedBy) :
                        action.source;
                    var source = (sourceCard.length) ? sourceCard[0] : sourceCard;
                    var amount = (typeof action.amount == 'string') ?
                        parseInt(game.getMetaValue(action.amount, action.generatedBy), 10) :
                        action.amount;
                    return {
                        type: action.type,
                        effectType: action.effectType,
                        target: convertCard(target),
                        source: convertCard(source),
                        amount: amount,
                        generatedBy: action.generatedBy,
                        player: action.player,
                    };
                }
                case const_1.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY: {
                    var targetCard = (typeof action.target == 'string') ?
                        game.getMetaValue(action.target, action.generatedBy) :
                        action.target;
                    var target = ('length' in targetCard && targetCard.length) ? targetCard[0] : targetCard;
                    // @ts-ignore will be fixed in a future moonlands update
                    var sourceCard = (typeof (action === null || action === void 0 ? void 0 : action.source) == 'string') ?
                        // @ts-ignore will be fixed in a future moonlands update
                        game.getMetaValue(action === null || action === void 0 ? void 0 : action.source, action.generatedBy) :
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
                case const_1.EFFECT_TYPE_ENERGY_DISCARDED_FROM_CREATURE: {
                    var targetCard = (typeof action.target == 'string') ?
                        game.getMetaValue(action.target, action.generatedBy) :
                        action.target;
                    var amount = (typeof action.amount == 'string') ?
                        parseInt(game.getMetaValue(action.amount, action.generatedBy), 10) :
                        action.amount;
                    var target = (targetCard instanceof Array) ? targetCard.map(convertCardMinimal) : convertCardMinimal(targetCard);
                    return __assign(__assign({}, action), { target: target, source: action.source ? convertCardMinimal(action.source) : action.source, triggerSource: action.triggerSource ? convertCardMinimal(action.triggerSource) : action.triggerSource, amount: amount });
                }
                case const_1.EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE: {
                    var targetCard = (typeof action.target == 'string') ?
                        game.getMetaValue(action.target, action.generatedBy) :
                        action.target;
                    var amount = (typeof action.amount == 'string') ?
                        parseInt(game.getMetaValue(action.amount, action.generatedBy), 10) :
                        action.amount;
                    var target = (targetCard instanceof Array) ? targetCard.map(convertCardMinimal) : convertCardMinimal(targetCard);
                    return {
                        type: const_1.ACTION_EFFECT,
                        effectType: const_1.EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE,
                        // ...action,
                        target: target,
                        amount: amount,
                    };
                }
                case const_1.EFFECT_TYPE_DISCARD_CARD_FROM_HAND: {
                    return {
                        type: const_1.ACTION_EFFECT,
                        effectType: const_1.EFFECT_TYPE_DISCARD_CARD_FROM_HAND,
                        target: convertCard(game.getMetaValue(action.target, action.generatedBy)),
                        player: action.player,
                    };
                }
                case const_1.EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI: {
                    var targetCard = (typeof action.target == 'string') ?
                        game.getMetaValue(action.target, action.generatedBy) :
                        action.target;
                    var amount = (typeof action.amount == 'string') ?
                        parseInt(game.getMetaValue(action.amount, action.generatedBy), 10) :
                        action.amount;
                    var target = (targetCard instanceof Array) ? targetCard.map(convertCardMinimal) : convertCardMinimal(targetCard);
                    return __assign(__assign({}, action), { target: target, 
                        // source: action.source ? convertCardMinimal(action.source) : action.source,
                        amount: amount });
                }
                case const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE: {
                    var targetCard = (typeof action.target == 'string') ?
                        game.getMetaValue(action.target, action.generatedBy) :
                        action.target;
                    if (!(targetCard instanceof Array) && (!('_card' in targetCard) || !targetCard._card)) {
                        throw new Error('Card action without the card!');
                    }
                    var target = (targetCard instanceof Array) ? targetCard.map(convertCardMinimal) : convertCardMinimal(targetCard);
                    var amount = (typeof action.amount == 'string') ?
                        parseInt(game.getMetaValue(action.amount, action.generatedBy), 10) :
                        action.amount;
                    return {
                        type: action.type,
                        effectType: action.effectType,
                        target: target,
                        source: action.source ? convertCardMinimal(action.source) : false,
                        amount: amount,
                        generatedBy: action.generatedBy,
                        player: action.player,
                    };
                }
                case const_1.EFFECT_TYPE_START_STEP: {
                    return {
                        type: action.type,
                        effectType: action.effectType,
                        player: action.player,
                    };
                }
                case const_1.EFFECT_TYPE_ADD_ENERGY_TO_MAGI: {
                    var targetCard = (typeof action.target == 'string') ?
                        game.getMetaValue(action.target, action.generatedBy) :
                        action.target;
                    // @ts-ignore
                    var sourceCard = (typeof action.source == 'string') ?
                        // @ts-ignore
                        game.getMetaValue(action.source, action.generatedBy) :
                        action.target;
                    var target = (targetCard.length) ? targetCard[0] : targetCard;
                    var amount = (typeof action.amount == 'string') ?
                        parseInt(game.getMetaValue(action.amount, action.generatedBy), 10) :
                        action.amount;
                    return __assign(__assign({ type: action.type, effectType: action.effectType }, (sourceCard ? { source: convertCardMinimal(sourceCard) } : {})), { target: convertCardMinimal(target), amount: amount });
                }
                case const_1.EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES: {
                    var energyOnCreatures = game.getMetaValue(action.energyOnCreatures, action.generatedBy);
                    return {
                        type: const_1.ACTION_EFFECT,
                        effectType: const_1.EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES,
                        // @ts-ignore
                        source: action.source ? convertCardMinimal(action.source) : action.source,
                        energyOnCreatures: energyOnCreatures,
                        // @ts-ignore
                        power: action === null || action === void 0 ? void 0 : action.power,
                        generatedBy: action.generatedBy,
                        player: action.player,
                    };
                }
                case const_1.EFFECT_TYPE_DISCARD_RESHUFFLED: {
                    return __assign({}, action);
                }
                case const_1.EFFECT_TYPE_START_OF_TURN: {
                    return {
                        type: action.type,
                        effectType: action.effectType,
                        player: action.player,
                    };
                }
                case const_1.EFFECT_TYPE_END_OF_TURN: {
                    return {
                        type: action.type,
                        effectType: action.effectType,
                        player: action.player,
                    };
                }
                // This one is needed only for the log entry
                case const_1.EFFECT_TYPE_DRAW: {
                    return {
                        type: action.type,
                        effectType: action.effectType,
                        player: action.player,
                    };
                }
                case const_1.EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT: {
                    var staticAbilities = (action.staticAbilities || []).map(function (ability) {
                        return Object.fromEntries(Object.entries(ability).map(function (_a) {
                            var k = _a[0], v = _a[1];
                            return [k, game.getMetaValue(v, action.generatedBy)];
                        }));
                    });
                    return {
                        type: action.type,
                        effectType: action.effectType,
                        generatedBy: action.generatedBy,
                        expiration: __assign(__assign({}, action.expiration), { turns: typeof action.expiration.turns == 'string' ? game.getMetaValue(action.expiration.turns, action.generatedBy) : action.expiration.turns }),
                        staticAbilities: staticAbilities,
                        triggerEffects: action.triggerEffects || [],
                        player: action.player,
                    };
                }
                // Log size optimization
                case const_1.EFFECT_TYPE_DEAL_DAMAGE: {
                    return {
                        type: action.type,
                        effectType: action.effectType,
                        source: action.source.id,
                        target: action.target.id,
                        amount: action.amount,
                        generatedBy: action.generatedBy,
                    };
                }
                case const_1.EFFECT_TYPE_DAMAGE_STEP: {
                    return {
                        type: action.type,
                        effectType: action.effectType,
                        source: action.source.id,
                        target: action.target.id,
                        packHuntAttack: action.packHuntAttack,
                        generatedBy: action.generatedBy,
                    };
                }
                case const_1.EFFECT_TYPE_ATTACKER_DEALS_DAMAGE: {
                    return {
                        type: action.type,
                        effectType: action.effectType,
                        source: action.source.id,
                        target: action.target.id,
                        amount: action.amount,
                        generatedBy: action.generatedBy,
                    };
                }
                case const_1.EFFECT_TYPE_DEFENDER_DEALS_DAMAGE: {
                    return {
                        type: action.type,
                        effectType: action.effectType,
                        source: action.source.id,
                        target: action.target.id,
                        amount: action.amount,
                        generatedBy: action.generatedBy,
                    };
                }
                case const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI: {
                    var sourceCard = (typeof action.source == 'string') ?
                        game.getMetaValue(action.source, action.generatedBy) :
                        action.source;
                    var targetCard = (typeof action.target == 'string') ?
                        game.getMetaValue(action.target, action.generatedBy) :
                        action.target;
                    var source = (sourceCard && 'length' in sourceCard && sourceCard.length) ? sourceCard[0] : sourceCard;
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
                case const_1.EFFECT_TYPE_BEFORE_DAMAGE: {
                    return {
                        type: action.type,
                        effectType: action.effectType,
                        source: action.source.id,
                        target: action.target.id,
                        generatedBy: action.generatedBy,
                    };
                }
                case const_1.EFFECT_TYPE_CREATURE_DEFEATS_CREATURE: {
                    return {
                        type: action.type,
                        effectType: action.effectType,
                        source: action.source.id,
                        target: action.target.id,
                        attack: action.attack,
                        generatedBy: action.generatedBy,
                    };
                }
                case const_1.EFFECT_TYPE_CREATURE_IS_DEFEATED: {
                    return {
                        type: action.type,
                        effectType: action.effectType,
                        target: action.target.id,
                        generatedBy: action.generatedBy,
                    };
                }
                case const_1.EFFECT_TYPE_RETURN_CREATURE_RETURNING_ENERGY: {
                    var targetCard = (typeof action.target == 'string') ?
                        game.getMetaValue(action.target, action.generatedBy) :
                        action.target;
                    var target = (targetCard instanceof Array) ? targetCard.map(convertCardMinimal) : convertCardMinimal(targetCard);
                    var convertedAction = {
                        type: action.type,
                        effectType: action.effectType,
                        target: target,
                        // power: action.power,
                        generatedBy: action.generatedBy,
                    };
                    // if ('source' in action) {
                    // 	convertedAction.source = convertCardMinimal(action.source);
                    // }
                    return convertedAction;
                }
                case const_1.EFFECT_TYPE_ATTACH_CARD_TO_CARD: {
                    var target = (typeof action.target == 'string') ?
                        game.getMetaValue(action.target, action.generatedBy) :
                        action.target;
                    var attachmentTarget = (typeof action.attachmentTarget == 'string') ?
                        game.getMetaValue(action.attachmentTarget, action.generatedBy) :
                        action.attachmentTarget;
                    var convertedAction = {
                        type: const_1.ACTION_EFFECT,
                        effectType: const_1.EFFECT_TYPE_ATTACH_CARD_TO_CARD,
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
function convertClientCommands(action, game) {
    var _a, _b, _c, _d, _e;
    switch (action.type) {
        case const_1.ACTION_RESOLVE_PROMPT: {
            switch (game.state.promptType) {
                case const_1.PROMPT_TYPE_RELIC: {
                    if (action.target) {
                        return {
                            type: action.type,
                            target: game.getZone(const_1.ZONE_TYPE_IN_PLAY, null).byId(action.target),
                            player: action.player,
                        };
                    }
                    return null;
                }
                case const_1.PROMPT_TYPE_OWN_SINGLE_CREATURE: {
                    if (action.target) {
                        return {
                            type: action.type,
                            target: game.getZone(const_1.ZONE_TYPE_IN_PLAY, null).byId(action.target),
                            player: action.player,
                        };
                    }
                    return null;
                }
                case const_1.PROMPT_TYPE_SINGLE_CREATURE: {
                    if (action.target) {
                        return {
                            type: action.type,
                            target: game.getZone(const_1.ZONE_TYPE_IN_PLAY, null).byId(action.target),
                            player: action.player,
                        };
                    }
                    return null;
                }
                case const_1.PROMPT_TYPE_SINGLE_CREATURE_FILTERED: {
                    if (action.target) {
                        return {
                            type: action.type,
                            target: game.getZone(const_1.ZONE_TYPE_IN_PLAY, null).byId(action.target),
                            player: action.player,
                        };
                    }
                    return null;
                }
                case const_1.PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE: {
                    if (action.target) {
                        return {
                            type: action.type,
                            target: game.getZone(const_1.ZONE_TYPE_IN_PLAY, null).byId(action.target),
                            player: action.player,
                        };
                    }
                    return null;
                }
                case const_1.PROMPT_TYPE_POWER_ON_MAGI: {
                    if (action.power && ((_a = game.state.promptParams) === null || _a === void 0 ? void 0 : _a.magi) && ((_b = game.state.promptParams) === null || _b === void 0 ? void 0 : _b.magi.length)) {
                        return {
                            type: action.type,
                            power: (_d = (_c = game.state.promptParams) === null || _c === void 0 ? void 0 : _c.magi[0].card.data.powers) === null || _d === void 0 ? void 0 : _d.find(function (power) { return power.name === action.power; }),
                            source: (_e = game.state.promptParams) === null || _e === void 0 ? void 0 : _e.magi[0],
                            player: action.player,
                        };
                    }
                }
                case const_1.PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI: {
                    if (action.target) {
                        var target = game.getZone(const_1.ZONE_TYPE_IN_PLAY, null).byId(action.target);
                        if (!target) {
                            target = game.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, game.players[0]).byId(action.target);
                        }
                        if (!target) {
                            target = game.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, game.players[1]).byId(action.target);
                        }
                        if (target) {
                            return {
                                type: action.type,
                                target: target,
                                player: action.player,
                            };
                        }
                    }
                    return null;
                }
                case const_1.PROMPT_TYPE_SINGLE_MAGI: {
                    if (action.target) {
                        var target = game.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, game.players[0]).byId(action.target);
                        if (!target) {
                            target = game.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, game.players[1]).byId(action.target);
                        }
                        if (target) {
                            return {
                                type: action.type,
                                target: target,
                                player: action.player,
                            };
                        }
                    }
                    return null;
                }
                case const_1.PROMPT_TYPE_MAGI_WITHOUT_CREATURES: {
                    if (action.target) {
                        var target = game.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, game.players[0]).byId(action.target);
                        if (!target) {
                            target = game.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, game.players[1]).byId(action.target);
                        }
                        if (target) {
                            return {
                                type: action.type,
                                target: target,
                                player: action.player,
                            };
                        }
                    }
                    return null;
                }
                case const_1.PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE: {
                    if (action.zone) {
                        var zone = action.zone === const_1.ZONE_TYPE_IN_PLAY ? game.getZone(const_1.ZONE_TYPE_IN_PLAY) : game.getZone(action.zone, action.zoneOwner);
                        var zoneContent = zone.cards;
                        var actionCards_1 = action.cards;
                        if (actionCards_1) {
                            var cards = zoneContent.filter(function (card) { return (actionCards_1 instanceof Array && actionCards_1.includes(card.id)); });
                            return {
                                type: action.type,
                                cards: cards,
                                player: action.player,
                            };
                        }
                    }
                    return null;
                }
                case const_1.PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE: {
                    var zone = game.state.promptParams.zone === const_1.ZONE_TYPE_IN_PLAY ? game.getZone(const_1.ZONE_TYPE_IN_PLAY) : game.getZone(game.state.promptParams.zone || const_1.ZONE_TYPE_HAND, game.state.promptParams.zoneOwner || 0);
                    var zoneContent = zone.cards;
                    var actionCards_2 = action.cards;
                    if (actionCards_2) {
                        var cards = zoneContent.filter(function (card) { return (actionCards_2 instanceof Array && actionCards_2.includes(card.id)); });
                        return {
                            type: action.type,
                            // @ts-ignore for now
                            zone: game.state.promptParams.zone,
                            zoneOwner: game.state.promptParams.zoneOwner,
                            cards: cards,
                            player: action.player,
                        };
                    }
                    else {
                        throw new Error("Unknown zone ".concat(action.zone, " or cards."));
                    }
                }
                case const_1.PROMPT_TYPE_CHOOSE_CARDS: {
                    // Will do for now
                    return action;
                }
                case const_1.PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES: {
                    // Will do for now
                    return action;
                }
                case const_1.PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES: {
                    // Will do for now
                    return action;
                }
                case const_1.PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES: {
                    // Will do for now
                    return action;
                }
                case const_1.PROMPT_TYPE_NUMBER: {
                    return action;
                }
                case const_1.PROMPT_TYPE_MAY_ABILITY: {
                    return action;
                }
                case const_1.PROMPT_TYPE_PLAYER: {
                    return action;
                }
                case const_1.PROMPT_TYPE_ALTERNATIVE: {
                    return action;
                }
                case const_1.PROMPT_TYPE_PAYMENT_SOURCE: {
                    if (!action.target)
                        return action;
                    var target = game.getZone(const_1.ZONE_TYPE_IN_PLAY, null).byId(action.target);
                    if (!target) {
                        target = game.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, game.players[0]).byId(action.target);
                    }
                    if (!target) {
                        target = game.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, game.players[1]).byId(action.target);
                    }
                    return __assign(__assign({}, action), { target: target });
                }
                case const_1.PROMPT_TYPE_DISTRUBUTE_CARDS_IN_ZONES: {
                    if ('sourceZone' in game.state.promptParams &&
                        game.state.promptParams.sourceZone &&
                        typeof action.cards == 'object') {
                        var sourceZone_1 = game.getZone(game.state.promptParams.sourceZone, game.state.promptParams.sourceZoneOwner);
                        var cards = {};
                        var booleanGuard = Boolean;
                        for (var _i = 0, _f = Object.entries(action.cards); _i < _f.length; _i++) {
                            var _g = _f[_i], targetZone = _g[0], zoneCards = _g[1];
                            cards[targetZone] = zoneCards.map(function (zoneCardId) { return sourceZone_1.byId(zoneCardId); }).filter(booleanGuard);
                        }
                        return __assign(__assign({}, action), { cards: cards });
                    }
                }
            }
            // change target string to CardInGame
            break;
        }
        case const_1.ACTION_POWER: {
            if (action.source && action.power && typeof action.source === 'string') {
                var powerSource = game.getZone(const_1.ZONE_TYPE_IN_PLAY, null).byId(action.source);
                if (!powerSource) {
                    powerSource = game.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, game.players[0]).byId(action.source);
                }
                if (!powerSource) {
                    powerSource = game.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, game.players[1]).byId(action.source);
                }
                if (!powerSource || !powerSource.card) {
                    console.log('Card not found in expanded action');
                    console.log("Type of card object: ".concat(typeof powerSource));
                    return null;
                }
                else if (!powerSource.card.data.powers) {
                    console.log('Activating power of the source with no powers');
                    return null;
                }
                var power = powerSource.card.data.powers.find(function (power) { return power.name === action.power; });
                var player = powerSource.data.controller;
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
                    power: power,
                    source: powerSource,
                    player: player,
                };
            }
            break;
        }
        case const_1.ACTION_ATTACK: {
            var attackSource = game.getZone(const_1.ZONE_TYPE_IN_PLAY, null).byId(action.source);
            if (!attackSource) {
                return null;
            }
            var attackTarget = game.getZone(const_1.ZONE_TYPE_IN_PLAY, null).byId(action.target);
            var additionalAttackers = [];
            if (action.additionalAttackers) {
                additionalAttackers = action.additionalAttackers.map(function (id) { return game.getZone(const_1.ZONE_TYPE_IN_PLAY, null).byId(id); });
            }
            if (!attackTarget) {
                var controller = game.modifyByStaticAbilities(attackSource, const_1.PROPERTY_CONTROLLER);
                var opponentId = game.getOpponent(controller);
                attackTarget = game.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, opponentId).byId(action.target);
            }
            if (!attackTarget) {
                return null;
            }
            var finalAction = {
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
        case const_1.ACTION_PLAY: {
            var player = action.player;
            var cardInHand = game.getZone(const_1.ZONE_TYPE_HAND, player).byId(action.payload.card.id);
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
        case const_1.ACTION_PASS: {
            return action;
        }
    }
    return null;
}
exports.default = convertClientCommands;
