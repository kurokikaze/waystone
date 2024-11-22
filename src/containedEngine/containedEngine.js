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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGame = void 0;
var index_1 = require("moonlands/dist/esm/index");
var createGame = function () {
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
    var zones = []; //createZones(1, 2)
    var game = new index_1.State(__assign(__assign({}, defaultState), { zones: zones, activePlayer: 1 }));
    // @ts-ignore
    game.initiatePRNG(Math.floor(Math.random() * 100));
    game.enableDebug();
    return game;
};
exports.createGame = createGame;
