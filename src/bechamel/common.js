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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCardDetails = exports.getPromptFilter = exports.UNFILTERED_RELIC_PROMPTS = exports.FILTERED_CREATURE_PROMPTS = exports.UNFILTERED_CREATURE_PROMPTS = exports.useCardData = exports.transformCard = exports.performCalculation = exports.cardMatchesSelector = void 0;
exports.mapCardDataFromProps = mapCardDataFromProps;
/* global window */
// @ts-nocheck
var cards_1 = require("moonlands/dist/esm/cards");
var clone_1 = require("moonlands/dist/esm/clone");
var const_1 = require("moonlands/dist/esm/const");
var cardMatchesSelector = function (card, selector, selectorParameter, source) {
    if (selectorParameter === void 0) { selectorParameter = null; }
    switch (selector) {
        case const_1.SELECTOR_OWN_CREATURES: {
            return (card.card.type === const_1.TYPE_CREATURE && card.data.controller === source.data.controller);
        }
        case const_1.SELECTOR_OWN_MAGI: {
            return (card.card.type === const_1.TYPE_MAGI && card.data.controller === source.data.controller);
        }
        case const_1.SELECTOR_CREATURES_OF_PLAYER: {
            return (card.card.type === const_1.TYPE_CREATURE && card.data.controller === selectorParameter);
        }
        case const_1.SELECTOR_ID: {
            return (card.id === selectorParameter);
        }
        case const_1.SELECTOR_OWN_CREATURES_WITH_STATUS: {
            switch (selectorParameter) {
                case const_1.STATUS_BURROWED:
                    return card.data.burrowed && card.data.controller === source.data.controller;
            }
            return false;
        }
        case const_1.SELECTOR_STATUS: {
            switch (selectorParameter) {
                case const_1.STATUS_BURROWED:
                    return card.data.burrowed;
            }
            return false;
        }
    }
    return false;
};
exports.cardMatchesSelector = cardMatchesSelector;
var performCalculation = function (operator, operandOne, operandTwo) {
    var result;
    switch (operator) {
        case const_1.CALCULATION_SET: {
            result = operandOne;
            break;
        }
        case const_1.CALCULATION_DOUBLE: {
            result = operandOne * 2;
            break;
        }
        case const_1.CALCULATION_ADD: {
            result = operandOne + operandTwo;
            break;
        }
        case const_1.CALCULATION_SUBTRACT: {
            result = operandOne - operandTwo;
            break;
        }
        case const_1.CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE: {
            result = Math.max(operandOne - operandTwo, 1);
            break;
        }
        case const_1.CALCULATION_HALVE_ROUND_DOWN: {
            result = Math.floor(operandOne / 2);
            break;
        }
        case const_1.CALCULATION_HALVE_ROUND_UP: {
            result = Math.ceil(operandOne / 2);
            break;
        }
        case const_1.CALCULATION_MIN: {
            result = Math.min(operandOne, operandTwo);
            break;
        }
        case const_1.CALCULATION_MAX: {
            result = Math.max(operandOne, operandTwo);
            break;
        }
    }
    return result;
};
exports.performCalculation = performCalculation;
var transformCard = function (staticAbilityCards) { return function (cardData) {
    var card = cardData.card ? (0, cards_1.byName)(cardData.card) : null;
    if (card) {
        var result_1 = __assign(__assign({}, cardData), { card: card, modifiedData: __assign({}, card.data) });
        staticAbilityCards.forEach(function (staticAbilityCard) {
            staticAbilityCard.card.data.staticAbilities.forEach(function (staticAbility) {
                if ((0, exports.cardMatchesSelector)(result_1, staticAbility.selector, staticAbility.selectorParameter, staticAbilityCard)) {
                    var modifierFunction_1 = function (initialValue) {
                        var _a = staticAbility.modifier, operator = _a.operator, operandOne = _a.operandOne;
                        // For specifying value to subtract in modifiers as positive ("CALCULATION_SUBTRACT, 1")
                        if (operator === const_1.CALCULATION_SUBTRACT || operator === const_1.CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE) {
                            return (0, exports.performCalculation)(operator, initialValue, operandOne);
                        }
                        else {
                            return (0, exports.performCalculation)(operator, operandOne, initialValue);
                        }
                    };
                    switch (staticAbility.property) {
                        case const_1.PROPERTY_POWER_COST: {
                            if ('powers' in result_1.modifiedData) {
                                result_1.modifiedData.powers = result_1.modifiedData.powers.map(function (power) { return (__assign(__assign({}, power), { cost: modifierFunction_1(power.cost) })); });
                            }
                            break;
                        }
                        case const_1.PROPERTY_ATTACKS_PER_TURN: {
                            result_1.modifiedData.attacksPerTurn = modifierFunction_1(result_1.modifiedData.attacksPerTurn);
                            break;
                        }
                        case const_1.PROPERTY_ENERGIZE: {
                            result_1.modifiedData.energize = modifierFunction_1(result_1.modifiedData.energize || 0);
                            break;
                        }
                    }
                }
            });
        });
        return result_1;
    }
    return __assign(__assign({}, cardData), { card: card });
}; };
exports.transformCard = transformCard;
var useCardData = function (content) {
    var staticAbilities = useSelector(function (state) { return state.staticAbilities; }) || [];
    return content.map((0, exports.transformCard)(staticAbilities));
};
exports.useCardData = useCardData;
function mapCardDataFromProps(state, _a) {
    var id = _a.id;
    var filter = function (card) { return card.id === id; };
    var foundZone = Object.values(state.zones).find(function (zone) { return zone.find(filter); });
    return {
        card: foundZone ? foundZone.find(filter) : null,
    };
}
// export const withSingleCardData = connect(mapCardDataFromProps);
// export const useZoneContent = (zoneId: string) => useSelector(getZoneContent(zoneId));
exports.UNFILTERED_CREATURE_PROMPTS = [
    const_1.PROMPT_TYPE_SINGLE_CREATURE,
];
exports.FILTERED_CREATURE_PROMPTS = [
    const_1.PROMPT_TYPE_SINGLE_CREATURE,
    const_1.PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI,
    const_1.PROMPT_TYPE_OWN_SINGLE_CREATURE,
    const_1.PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE,
    const_1.PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
];
exports.UNFILTERED_RELIC_PROMPTS = [
    const_1.PROMPT_TYPE_RELIC,
];
var getRestrictionFilter = function (restriction, value) {
    switch (restriction) {
        case const_1.RESTRICTION_TYPE:
            return function (card) { return card.card.type === value; };
        case const_1.RESTRICTION_REGION:
            return function (card) { return card.card.region === value; };
        case const_1.RESTRICTION_CREATURE_TYPE:
            return function (card) { return (card.card.type === const_1.TYPE_CREATURE && card.card.name.split(' ').includes(value)); };
        case const_1.RESTRICTION_ENERGY_EQUALS:
            return function (card) { return (card.card.type === const_1.TYPE_CREATURE && card.data.energy === value); };
        case const_1.RESTRICTION_ENERGY_LESS_THAN:
            return function (card) { return (card.card.type === const_1.TYPE_CREATURE && card.data.energy < value); };
        case const_1.RESTRICTION_ENERGY_LESS_THAN_STARTING:
            return function (card) { return (card.card.type === const_1.TYPE_CREATURE && card.data.energy < card.card.cost); };
        case const_1.RESTRICTION_OWN_CREATURE:
            return function (card) { return (card.card.type === const_1.TYPE_CREATURE && (card.data.controller || card.owner) === 1); };
        case const_1.RESTRICTION_OPPONENT_CREATURE:
            return function (card) { return (card.card.type === const_1.TYPE_CREATURE && (card.data.controller || card.owner) !== 1); };
        case const_1.RESTRICTION_CREATURE_WAS_ATTACKED:
            return function (card) { return (card.card.type === const_1.TYPE_CREATURE && card.data.wasAttacked === true); };
    }
};
// @deprecated Probably not used inside the Bechamel, user ids are hardcoded inside `getRestrictionFilter`
var getPromptFilter = function (promptType, promptParams) {
    switch (promptType) {
        case const_1.PROMPT_TYPE_RELIC:
            return function (card) { return card.card.type === const_1.TYPE_RELIC; };
        case const_1.PROMPT_TYPE_SINGLE_CREATURE:
            return function (card) { return card.card.type === const_1.TYPE_CREATURE; };
        case const_1.PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI:
            return function (card) { return (card.card.type === const_1.TYPE_MAGI || card.card.type === const_1.TYPE_CREATURE); };
        case const_1.PROMPT_TYPE_OWN_SINGLE_CREATURE:
            return function (card) { return (card.data.controller || card.owner) === 1 && card.card.type === const_1.TYPE_CREATURE; };
        case const_1.PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE:
            return function (card) { return card.id !== promptParams.source; };
        case const_1.PROMPT_TYPE_SINGLE_CREATURE_FILTERED:
            if (promptParams) {
                if (promptParams.restrictions && promptParams.restrictions.length) {
                    var checkers_1 = promptParams.restrictions.map(function (_a) {
                        var type = _a.type, value = _a.value;
                        return getRestrictionFilter(type, value);
                    });
                    return function (card) {
                        return checkers_1.map(function (checker) { return checker(card); }).every(function (a) { return a === true; });
                    }; // combine checkers
                }
                else {
                    return getRestrictionFilter(promptParams.restriction, promptParams.restrictionValue);
                }
            }
            else {
                return function () { return true; };
            }
        default:
            return function () { return true; };
    }
};
exports.getPromptFilter = getPromptFilter;
var propertyLayers = (_a = {},
    _a[const_1.PROPERTY_CONTROLLER] = 0,
    _a[const_1.PROPERTY_COST] = 1,
    _a[const_1.PROPERTY_ENERGIZE] = 2,
    _a[const_1.PROPERTY_STATUS] = 3,
    _a[const_1.PROPERTY_ATTACKS_PER_TURN] = 4,
    _a[const_1.PROPERTY_CAN_ATTACK_MAGI_DIRECTLY] = 5,
    _a[const_1.PROPERTY_ENERGY_LOSS_THRESHOLD] = 6,
    _a[const_1.PROPERTY_ABLE_TO_ATTACK] = 7,
    _a);
function getByProperty(target, property, subProperty) {
    if (subProperty === void 0) { subProperty = null; }
    switch (property) {
        case const_1.PROPERTY_ID:
            return target.id;
        case const_1.PROPERTY_TYPE:
            return target.card.type;
        case const_1.PROPERTY_CREATURE_TYPES:
            return target.card.name.split(' ');
        case const_1.PROPERTY_MAGI_NAME:
            return target.card.name;
        case const_1.PROPERTY_CONTROLLER:
            return target.data.controller;
        case const_1.PROPERTY_ENERGY_COUNT:
            return target.data.energy;
        case const_1.PROPERTY_ATTACKS_PER_TURN:
            return target.card.data.attacksPerTurn;
        case const_1.PROPERTY_COST:
            return target.card.cost;
        case const_1.PROPERTY_ENERGIZE:
            return target.card.data.energize;
        case const_1.PROPERTY_REGION:
            return target.card.region;
        case const_1.PROPERTY_CAN_ATTACK_MAGI_DIRECTLY:
            return target.card.data.canAttackMagiDirectly;
        case const_1.PROPERTY_MAGI_STARTING_ENERGY:
            return target.card.data.startingEnergy;
        case const_1.PROPERTY_POWER_COST:
            return target.card.data.powers.find(function (_a) {
                var name = _a.name;
                return name === subProperty;
            }).cost;
        case const_1.PROPERTY_STATUS_WAS_ATTACKED:
            return target.data.wasAttacked || false;
        case const_1.PROPERTY_CAN_BE_ATTACKED:
            return target.card.data.canBeAttacked || true;
        case const_1.PROPERTY_STATUS_DEFEATED_CREATURE:
            return target.data.defeatedCreature || false;
        case const_1.PROPERTY_STATUS: {
            switch (subProperty) {
                case const_1.STATUS_BURROWED:
                    return Object.hasOwnProperty.call(target.data, 'burrowed') ?
                        target.data.burrowed :
                        target.card.data.burrowed;
                default:
                    return false;
            }
        }
        // These properties can only be modified by static abilities / continuous effects
        case const_1.PROPERTY_ENERGY_LOSS_THRESHOLD:
            return target.card.data.energyLossThreshold || 0;
        case const_1.PROPERTY_ABLE_TO_ATTACK:
            return target.card.data.ableToAttack || true;
    }
}
var gameStaticAbilities = [
    {
        name: 'Burrowed - Energy loss',
        text: 'Your burrowed creatures cannot lose more than 2 energy each turn',
        selector: const_1.SELECTOR_STATUS,
        selectorParameter: const_1.STATUS_BURROWED,
        property: const_1.PROPERTY_ENERGY_LOSS_THRESHOLD,
        modifier: {
            operator: const_1.CALCULATION_SET,
            operandOne: 2,
        },
    },
    {
        name: 'Burrowed - Ability to attack',
        text: 'Your burrowed creatures cannot attack',
        selector: const_1.SELECTOR_STATUS,
        selectorParameter: const_1.STATUS_BURROWED,
        property: const_1.PROPERTY_ABLE_TO_ATTACK,
        modifier: {
            operator: const_1.CALCULATION_SET,
            operandOne: false,
        },
    },
];
var getCardDetails = function (state) {
    var baseCards = state.zones.inPlay;
    var allZonesCards = {
        inPlay: __spreadArray([], baseCards, true).map(function (card) { return (__assign(__assign({}, card), { card: (0, cards_1.byName)(card.card), originalCard: (0, cards_1.byName)(card.card) })); }),
        playerActiveMagi: __spreadArray([], (state.zones.playerActiveMagi || []), true).map(function (card) { return (__assign(__assign({}, card), { card: (0, cards_1.byName)(card.card), originalCard: (0, cards_1.byName)(card.card) })); }),
        opponentActiveMagi: __spreadArray([], (state.zones.opponentActiveMagi || []), true).map(function (card) { return (__assign(__assign({}, card), { card: (0, cards_1.byName)(card.card), originalCard: (0, cards_1.byName)(card.card) })); }),
    };
    var continuousStaticAbilities = state.continuousEffects.map(function (effect) { return effect.staticAbilities; }).flat();
    var zoneAbilities = __spreadArray(__spreadArray(__spreadArray([], allZonesCards.inPlay, true), allZonesCards.playerActiveMagi, true), allZonesCards.opponentActiveMagi, true).reduce(function (acc, cardInPlay) { return cardInPlay.card.data.staticAbilities ? __spreadArray(__spreadArray([], acc, true), (cardInPlay.card.data.staticAbilities.map(function (a) { return (__assign(__assign({}, a), { player: cardInPlay.data.controller })); })), true) : acc; }, []);
    var staticAbilities = __spreadArray(__spreadArray(__spreadArray([], gameStaticAbilities, true), zoneAbilities, true), continuousStaticAbilities, true).sort(function (a, b) { return propertyLayers[a.property] - propertyLayers[b.property]; });
    var resultingZones = staticAbilities.reduce(function (oldState, staticAbility) {
        var name = staticAbility.name, text = staticAbility.text, selector = staticAbility.selector, selectorParameter = staticAbility.selectorParameter, property = staticAbility.property, subProperty = staticAbility.subProperty, modifier = staticAbility.modifier;
        var operator = modifier.operator, operandOne = modifier.operandOne;
        var newState = (0, clone_1.default)(oldState);
        for (var cardId in newState.inPlay) {
            var currentCard = newState.inPlay[cardId];
            if ((0, exports.cardMatchesSelector)(currentCard, selector, selectorParameter, { data: { controller: staticAbility.player || null } })) {
                if (!newState.inPlay[cardId].data.affectedBy) {
                    newState.inPlay[cardId].data.affectedBy = [];
                }
                newState.inPlay[cardId].data.affectedBy = __spreadArray(__spreadArray([], newState.inPlay[cardId].data.affectedBy, true), [{ name: name, text: text }], false);
                var initialValue = (property !== const_1.PROPERTY_POWER_COST) ? getByProperty(currentCard, property, subProperty) : null;
                switch (property) {
                    case const_1.PROPERTY_ENERGIZE: {
                        var resultValue = (operator === const_1.CALCULATION_SUBTRACT || operator === const_1.CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE) ?
                            (0, exports.performCalculation)(operator, initialValue, (typeof operandOne === 'number') ? operandOne : 0) :
                            (0, exports.performCalculation)(operator, (typeof operandOne === 'number') ? operandOne : 0, initialValue);
                        newState.inPlay[cardId].card.data.energize = resultValue;
                        break;
                    }
                    case const_1.PROPERTY_ATTACKS_PER_TURN: {
                        var initialValue_1 = getByProperty(currentCard, const_1.PROPERTY_ATTACKS_PER_TURN);
                        var _a = staticAbility.modifier, operator_1 = _a.operator, operandOne_1 = _a.operandOne;
                        var resultValue = (operator_1 === const_1.CALCULATION_SUBTRACT || operator_1 === const_1.CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE) ?
                            (0, exports.performCalculation)(operator_1, initialValue_1, (typeof operandOne_1 === 'number') ? operandOne_1 : 0) :
                            (0, exports.performCalculation)(operator_1, (typeof operandOne_1 === 'number') ? operandOne_1 : 0, initialValue_1);
                        newState.inPlay[cardId].card.data.attacksPerTurn = resultValue;
                        break;
                    }
                    case const_1.PROPERTY_ENERGY_LOSS_THRESHOLD: {
                        var initialValue_2 = getByProperty(currentCard, const_1.PROPERTY_ENERGIZE);
                        var resultValue = (operator === const_1.CALCULATION_SUBTRACT || operator === const_1.CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE) ?
                            (0, exports.performCalculation)(operator, initialValue_2, (typeof operandOne === 'number') ? operandOne : 0) :
                            (0, exports.performCalculation)(operator, (typeof operandOne === 'number') ? operandOne : 0, initialValue_2);
                        newState.inPlay[cardId].card.data.energyLossThreshold = resultValue;
                        break;
                    }
                    case const_1.PROPERTY_ABLE_TO_ATTACK: {
                        var initialValue_3 = getByProperty(currentCard, const_1.PROPERTY_ABLE_TO_ATTACK);
                        var resultValue = (operator === const_1.CALCULATION_SET) ? operandOne : initialValue_3;
                        newState.inPlay[cardId].card.data.ableToAttack = resultValue;
                        break;
                    }
                    case const_1.PROPERTY_CAN_BE_ATTACKED: {
                        var initialValue_4 = getByProperty(currentCard, const_1.PROPERTY_CAN_BE_ATTACKED);
                        var resultValue = (operator === const_1.CALCULATION_SET) ? operandOne : initialValue_4;
                        newState.inPlay[cardId].card.data.canBeAttacked = resultValue;
                        break;
                    }
                    case const_1.PROPERTY_CONTROLLER: {
                        var initialValue_5 = getByProperty(currentCard, const_1.PROPERTY_CONTROLLER);
                        var resultValue = (operator === const_1.CALCULATION_SET) ? operandOne : initialValue_5;
                        newState.inPlay[cardId].data.controller = resultValue;
                        break;
                    }
                    case const_1.PROPERTY_STATUS: {
                        var initialValue_6 = getByProperty(currentCard, const_1.PROPERTY_STATUS, staticAbility.subProperty);
                        var resultValue = (operator === const_1.CALCULATION_SET) ? operandOne : initialValue_6;
                        switch (staticAbility.subProperty) {
                            case const_1.STATUS_BURROWED: {
                                newState.inPlay[cardId].data.burrowed = resultValue;
                            }
                        }
                        break;
                    }
                    case const_1.PROPERTY_POWER_COST: {
                        if (currentCard.card.data.powers) {
                            for (var powerId in currentCard.card.data.powers) {
                                var currentPower = currentCard.card.data.powers[powerId];
                                var initialValue_7 = getByProperty(currentCard, const_1.PROPERTY_POWER_COST, currentPower.name);
                                var resultValue = (operator === const_1.CALCULATION_SUBTRACT || operator === const_1.CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE) ?
                                    (0, exports.performCalculation)(operator, initialValue_7, (typeof operandOne === 'number') ? operandOne : 0) :
                                    (0, exports.performCalculation)(operator, (typeof operandOne === 'number') ? operandOne : 0, initialValue_7);
                                newState.inPlay[cardId].card.data.powers[powerId].cost = resultValue;
                            }
                        }
                        break;
                    }
                }
            }
        }
        return newState;
    }, allZonesCards);
    return resultingZones;
};
exports.getCardDetails = getCardDetails;
