"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HashBuilder = void 0;
var const_1 = require("../const");
var HashBuilder = /** @class */ (function () {
    function HashBuilder() {
        this.ids = new Map();
        this.comesFrom = new Map();
        this.childIds = new Map();
    }
    HashBuilder.prototype.makeHash = function (sim) {
        var _this = this;
        var _a;
        var battlefieldCards = sim.getZone(const_1.ZONE_TYPE_IN_PLAY).cards;
        var cardHashes = [];
        for (var _i = 0, battlefieldCards_1 = battlefieldCards; _i < battlefieldCards_1.length; _i++) {
            var card = battlefieldCards_1[_i];
            var attacks = sim.modifyByStaticAbilities(card, const_1.PROPERTY_ATTACKS_PER_TURN);
            var attacked = card.data.attacked;
            var attackPart = (card.card.type === const_1.TYPE_CREATURE && card.data.controller == sim.getActivePlayer()) ? "(".concat(attacked, "/").concat(attacks, ")") : '';
            var energyPart = card.card.type === const_1.TYPE_CREATURE ? card.data.energy : '*';
            var powersPart = '';
            if (card.data.actionsUsed && card.data.actionsUsed.length) {
                powersPart = "[".concat(card.data.actionsUsed.map(function (action) { return _this.convertHash(action); }).join(','), "]");
            }
            cardHashes.push("#".concat(this.convertHash(card.id)).concat(attackPart).concat(powersPart, ":").concat(energyPart));
        }
        var handCards = sim.getZone(const_1.ZONE_TYPE_HAND, sim.players[0]).cards;
        var handHashes = [];
        for (var _b = 0, handCards_1 = handCards; _b < handCards_1.length; _b++) {
            var card = handCards_1[_b];
            handHashes.push(this.convertHash(card.id).toString());
        }
        var ourMagi = sim.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, sim.players[0]).card;
        var ourMagiHash = ourMagi ? "@".concat(ourMagi.data.energy, "[").concat(ourMagi.data.actionsUsed.map(function (action) { return _this.convertHash(action); }).join(','), "]") : 'X';
        var enemyMagi = sim.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, sim.players[1]).card;
        var enemyMagiHash = enemyMagi ? "@".concat(enemyMagi.data.energy) : 'X';
        return (sim.state.activePlayer === sim.players[0] ? '*' : 'v') + ((_a = sim.state.step) === null || _a === void 0 ? void 0 : _a.toString()) + '{' + handHashes.join(',') + '}' + ourMagiHash + '|' + cardHashes.join('|') + '|' + enemyMagiHash + (sim.state.prompt ? '?' + this.convertHash(sim.state.promptGeneratedBy || '') : '');
    };
    HashBuilder.prototype.convertHash = function (hash) {
        if (this.ids.has(hash)) {
            return this.ids.get(hash) || 999;
        }
        var nextId = this.ids.size + 1;
        if (this.comesFrom.has(hash)) {
            // Okay, we've either already seen this pair...
            if (this.childIds.has(hash)) {
                return this.childIds.get(hash);
            }
            else {
                // ...or it's our first time.
                this.childIds.set(hash, nextId);
                return nextId;
            }
        }
        this.ids.set(hash, nextId);
        return nextId;
    };
    HashBuilder.prototype.registerChildHash = function (parent, child) {
        this.comesFrom.set(child, parent);
    };
    return HashBuilder;
}());
exports.HashBuilder = HashBuilder;
