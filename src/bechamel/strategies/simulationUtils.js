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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStateScore = exports.CARD_SCORE = exports.STEP_ATTACK = exports.createZones = exports.booleanGuard = void 0;
exports.createState = createState;
var cards_1 = require("moonlands/dist/esm/cards");
var esm_1 = require("moonlands/dist/esm");
var CardInGame_1 = require("moonlands/dist/esm/classes/CardInGame");
var Zone_1 = require("moonlands/dist/esm/classes/Zone");
var const_1 = require("../const");
var addCardData = function (card) { return (__assign(__assign({}, card), { _card: (0, cards_1.byName)(card.card) })); };
exports.booleanGuard = Boolean;
var createZones = function (player1, player2, creatures, activeMagi) {
    if (creatures === void 0) { creatures = []; }
    if (activeMagi === void 0) { activeMagi = []; }
    return [
        new Zone_1.default('Player 1 hand', const_1.ZONE_TYPE_HAND, player1),
        new Zone_1.default('Player 2 hand', const_1.ZONE_TYPE_HAND, player2),
        new Zone_1.default('Player 1 deck', const_1.ZONE_TYPE_DECK, player1),
        new Zone_1.default('Player 2 deck', const_1.ZONE_TYPE_DECK, player2),
        new Zone_1.default('Player 1 discard', const_1.ZONE_TYPE_DISCARD, player1),
        new Zone_1.default('Player 2 discard', const_1.ZONE_TYPE_DISCARD, player2),
        new Zone_1.default('Player 1 active magi', const_1.ZONE_TYPE_ACTIVE_MAGI, player1).add(activeMagi),
        new Zone_1.default('Player 2 active magi', const_1.ZONE_TYPE_ACTIVE_MAGI, player2),
        new Zone_1.default('Player 1 Magi pile', const_1.ZONE_TYPE_MAGI_PILE, player1),
        new Zone_1.default('Player 2 Magi pile', const_1.ZONE_TYPE_MAGI_PILE, player2),
        new Zone_1.default('Player 1 defeated Magi', const_1.ZONE_TYPE_DEFEATED_MAGI, player1),
        new Zone_1.default('Player 2 defeated Magi', const_1.ZONE_TYPE_DEFEATED_MAGI, player2),
        new Zone_1.default('In play', const_1.ZONE_TYPE_IN_PLAY, null).add(creatures),
    ];
};
exports.createZones = createZones;
var defaultState = {
    actions: [],
    savedActions: [],
    delayedTriggers: [],
    mayEffectActions: [],
    fallbackActions: [],
    continuousEffects: [],
    activePlayer: 0,
    prompt: false,
    promptType: null,
    promptParams: {},
    log: [],
    step: 0,
    turn: 0,
    zones: [],
    players: [],
    spellMetaData: {},
    attachedTo: {},
    cardsAttached: {}
};
exports.STEP_ATTACK = 2;
function createState(gameState, playerId, opponentId) {
    var myMagi = gameState.getMyMagi();
    var myCreatures = gameState.getMyCreaturesInPlay();
    var myMagiPile = gameState.getMyMagiPile();
    var myRelics = gameState.getMyRelicsInPlay();
    var opponentMagi = gameState.getOpponentMagi();
    var enemyCreatures = gameState.getEnemyCreaturesInPlay();
    var enemyRelics = gameState.getEnemyRelicsInPlay();
    var myCreaturesCards = __spreadArray(__spreadArray([], myCreatures, true), myRelics, true).map(function (card) {
        var creatureCard = (0, cards_1.byName)(card.card.name);
        if (!creatureCard) {
            return false;
        }
        var cardInGame = new CardInGame_1.default(creatureCard, playerId).addEnergy(card.data.energy);
        cardInGame.data.attacked = card.data.attacked;
        cardInGame.data.wasAttacked = card.data.wasAttacked;
        cardInGame.data.hasAttacked = card.data.hasAttacked;
        cardInGame.data.controller = card.data.controller;
        cardInGame.data.actionsUsed = __spreadArray([], card.data.actionsUsed, true);
        cardInGame.id = card.id;
        return cardInGame;
    }).filter(exports.booleanGuard);
    var enemyCreaturesCards = __spreadArray(__spreadArray([], enemyCreatures, true), enemyRelics, true).map(function (card) {
        var creatureCard = (0, cards_1.byName)(card.card.name);
        if (!creatureCard) {
            return false;
        }
        var cardInGame = new CardInGame_1.default(creatureCard, opponentId).addEnergy(card.data.energy);
        cardInGame.data.attacked = card.data.attacked;
        cardInGame.data.wasAttacked = card.data.wasAttacked;
        cardInGame.data.hasAttacked = card.data.hasAttacked;
        cardInGame.data.controller = card.data.controller;
        cardInGame.data.actionsUsed = __spreadArray([], card.data.actionsUsed, true);
        cardInGame.id = card.id;
        return cardInGame;
    }).filter(exports.booleanGuard);
    var zones = (0, exports.createZones)(playerId, opponentId, __spreadArray(__spreadArray([], myCreaturesCards, true), enemyCreaturesCards, true), []);
    var sim = new esm_1.State(__assign(__assign({}, defaultState), { zones: zones, step: exports.STEP_ATTACK, activePlayer: playerId, prompt: false, promptParams: {}, log: [] }));
    sim.setPlayers(playerId, opponentId);
    var myMagiActualCard = (0, cards_1.byName)(myMagi === null || myMagi === void 0 ? void 0 : myMagi.card);
    if (myMagi && myMagiActualCard) {
        if (!myMagi.data.actionsUsed) {
            console.log('Found the case with missing actionsUsed');
            console.dir(myMagi);
            console.log('data:');
            console.dir(myMagi.data);
        }
        var myMagiCard = new CardInGame_1.default(myMagiActualCard, playerId).addEnergy(myMagi.data.energy);
        myMagiCard.data.actionsUsed = __spreadArray([], myMagi.data.actionsUsed, true);
        myMagiCard.id = myMagi.id;
        sim.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, playerId).add([myMagiCard]);
    }
    sim.getZone(const_1.ZONE_TYPE_MAGI_PILE, playerId).add(myMagiPile.map(function (magi) {
        var baseCard = (0, cards_1.byName)(magi.card);
        if (!baseCard)
            return false;
        var card = new CardInGame_1.default(baseCard, playerId);
        card.id = magi.id;
        return card;
    }).filter(function (a) { return a instanceof CardInGame_1.default; }));
    var enemyMagiRealCard = (0, cards_1.byName)(opponentMagi === null || opponentMagi === void 0 ? void 0 : opponentMagi.card);
    if (opponentMagi && enemyMagiRealCard) {
        var enemyMagiCard = new CardInGame_1.default(enemyMagiRealCard, opponentId).addEnergy(opponentMagi.data.energy);
        enemyMagiCard.data.actionsUsed = __spreadArray([], opponentMagi.data.actionsUsed, true);
        enemyMagiCard.id = opponentMagi.id;
        sim.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, opponentId).add([enemyMagiCard]);
    }
    var playableEnrichedCards = gameState.getPlayableCards()
        .map(addCardData).filter(function (card) { return card._card.type !== esm_1.TYPE_RELIC; });
    sim.getZone(const_1.ZONE_TYPE_HAND, playerId).add(playableEnrichedCards.map(function (card) {
        var baseCard = (0, cards_1.byName)(card.card);
        if (!baseCard)
            return false;
        var gameCard = new CardInGame_1.default(baseCard, playerId);
        gameCard.id = card.id;
        return gameCard;
    }).filter(function (a) { return a instanceof CardInGame_1.default; }));
    var myDeckCardIds = gameState.getMyDeckCards();
    // stuff the deck with the wild cards
    sim.getZone(const_1.ZONE_TYPE_DECK, playerId).add(myDeckCardIds.map(function (id) {
        var card = new CardInGame_1.default((0, cards_1.byName)('Grega'), playerId);
        card.id = id;
        return card;
    }));
    sim.state.continuousEffects = gameState.getContinuousEffects();
    sim.state.step = gameState.getStep();
    var seed = gameState.getTurn() * 100 + gameState.getStep() * 10 + gameState.playerId;
    sim.initiatePRNG(seed);
    return sim;
}
exports.CARD_SCORE = 0.1;
var getStateScore = function (state, attacker, opponent) {
    var myScore = 0;
    var enemyScore = 0;
    var creatures = state.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.filter(function (card) { return card.card.type === const_1.TYPE_CREATURE; });
    creatures.forEach(function (creature) {
        if (creature.owner === attacker) {
            myScore += creature.data.energy + exports.CARD_SCORE;
        }
        else {
            enemyScore += creature.data.energy + exports.CARD_SCORE;
        }
    });
    var myMagi = state.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, attacker).card;
    if (myMagi) {
        myScore += myMagi.data.energy;
    }
    var enemyMagi = state.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, opponent).card;
    if (enemyMagi) {
        enemyScore += enemyMagi.data.energy;
    }
    if (state.hasWinner()) {
        if (state.winner === opponent) {
            enemyScore += 1000;
        }
        else {
            myScore += 1000;
        }
    }
    return myScore - enemyScore;
};
exports.getStateScore = getStateScore;
