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
exports.affectAddEnergy = exports.affectRemoveEnergy = exports.cleanupContinuousEffects = exports.tickDownContinuousEffects = exports.getZoneName = exports.findInPlay = void 0;
var const_1 = require("moonlands/src/const");
var cards_1 = require("moonlands/src/cards");
var clientZoneNames = (_a = {},
    _a[const_1.ZONE_TYPE_DECK] = 'Deck',
    _a[const_1.ZONE_TYPE_HAND] = 'Hand',
    _a[const_1.ZONE_TYPE_DISCARD] = 'Discard',
    _a[const_1.ZONE_TYPE_ACTIVE_MAGI] = 'ActiveMagi',
    _a[const_1.ZONE_TYPE_MAGI_PILE] = 'MagiPile',
    _a[const_1.ZONE_TYPE_DEFEATED_MAGI] = 'DefeatedMagi',
    _a[const_1.ZONE_TYPE_IN_PLAY] = 'InPlay',
    _a);
var findInPlay = function (state, id) {
    var cardPlayerInPlay = state.zones.inPlay.find(function (card) { return card.id === id; });
    if (cardPlayerInPlay)
        return cardPlayerInPlay;
    var cardPlayerMagi = state.zones.playerActiveMagi.find(function (card) { return card.id === id; });
    if (cardPlayerMagi)
        return cardPlayerMagi;
    var cardOpponentMagi = state.zones.opponentActiveMagi.find(function (card) { return card.id === id; });
    if (cardOpponentMagi)
        return cardOpponentMagi;
    return null;
};
exports.findInPlay = findInPlay;
var getZoneName = function (serverZoneType, source, playerId) {
    if (!clientZoneNames[serverZoneType]) {
        throw new Error("Unknown zone: ".concat(serverZoneType));
    }
    if (serverZoneType === const_1.ZONE_TYPE_IN_PLAY) {
        return 'inPlay';
    }
    var zonePrefix = source.owner === playerId ? 'player' : 'opponent';
    var zoneName = clientZoneNames[serverZoneType];
    return "".concat(zonePrefix).concat(zoneName);
};
exports.getZoneName = getZoneName;
var tickDownContinuousEffects = function (effects, opponent) {
    var resultingEffects = [];
    for (var _i = 0, effects_1 = effects; _i < effects_1.length; _i++) {
        var effect = effects_1[_i];
        switch (effect.expiration.type) {
            case const_1.EXPIRATION_NEVER: {
                resultingEffects.push(effect);
                break;
            }
            case const_1.EXPIRATION_ANY_TURNS: {
                var turns = effect.expiration.turns - 1;
                if (turns > 0) {
                    resultingEffects.push(__assign(__assign({}, effect), { expiration: __assign(__assign({}, effect.expiration), { turns: turns }) }));
                }
                break;
            }
            case const_1.EXPIRATION_OPPONENT_TURNS: {
                if (opponent) {
                    var turns = effect.expiration.turns - 1;
                    if (turns >= 0) {
                        resultingEffects.push(__assign(__assign({}, effect), { expiration: __assign(__assign({}, effect.expiration), { turns: turns }) }));
                    }
                }
                else {
                    resultingEffects.push(effect);
                }
                break;
            }
        }
    }
    return resultingEffects;
};
exports.tickDownContinuousEffects = tickDownContinuousEffects;
var cleanupContinuousEffects = function (effects, opponent) {
    var resultingEffects = [];
    for (var _i = 0, effects_2 = effects; _i < effects_2.length; _i++) {
        var effect = effects_2[_i];
        switch (effect.expiration.type) {
            case const_1.EXPIRATION_NEVER: {
                resultingEffects.push(effect);
                break;
            }
            case const_1.EXPIRATION_ANY_TURNS: {
                if (effect.expiration.turns > 0) {
                    resultingEffects.push(effect);
                }
                break;
            }
            case const_1.EXPIRATION_OPPONENT_TURNS: {
                if (opponent) {
                    if (effect.expiration.turns > 0) {
                        resultingEffects.push(effect);
                    }
                }
                else {
                    resultingEffects.push(effect);
                }
                break;
            }
        }
    }
    return resultingEffects;
};
exports.cleanupContinuousEffects = cleanupContinuousEffects;
var affectRemoveEnergy = function (state, card, action) {
    var gameCard = (0, cards_1.byName)(card.card);
    var source = action.source ? (0, exports.findInPlay)(state, action.source.id) : null;
    if (gameCard && gameCard.data.energyStasis && source && source.data.controller === card.data.controller) {
        // For the Colossus
        return card.data.energy;
    }
    var energyLossThreshold = card.data.energyLossThreshold || 0;
    // This is a hacky way to represent burrowing, but will do for now
    if (card.data.burrowed) {
        energyLossThreshold = 2;
    }
    var energyLoss = card.data.energy - action.amount;
    return (energyLossThreshold > 0) ? Math.min(energyLoss, energyLossThreshold) : energyLoss;
};
exports.affectRemoveEnergy = affectRemoveEnergy;
var affectAddEnergy = function (state, card, action) {
    var gameCard = (0, cards_1.byName)(card.card);
    var source = action.source ? (0, exports.findInPlay)(state, action.source.id) : null;
    if (gameCard && gameCard.data.energyStasis && source && source.data.controller === card.data.controller) {
        // For the Colossus
        return card.data.energy;
    }
    return card.data.energy + action.amount;
};
exports.affectAddEnergy = affectAddEnergy;
