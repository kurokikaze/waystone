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
exports.SimulationStrategy = void 0;
var cards_1 = require("moonlands/dist/esm/cards");
var CardInGame_1 = require("moonlands/dist/esm/classes/CardInGame");
var const_1 = require("../const");
var simulationUtils_1 = require("./simulationUtils");
var HashBuilder_1 = require("./HashBuilder");
var ActionExtractor_1 = require("./ActionExtractor");
var const_2 = require("moonlands/dist/esm/const");
var SimulationQueue_1 = require("./SimulationQueue");
var STEP_NAME = {
    ENERGIZE: 0,
    PRS1: 1,
    ATTACK: 2,
    CREATURES: 3,
    PRS2: 4,
    DRAW: 5,
};
var addCardData = function (card) { return (__assign(__assign({}, card), { _card: card.card === '<Wild>' ? null : (0, cards_1.byName)(card.card) })); };
var SimulationStrategy = /** @class */ (function () {
    function SimulationStrategy() {
        this.leaves = new Map();
        this.history = [];
        this.historyLength = 15;
        this.actionCameFromHold = false;
        this.graph = '';
        this.actionsOnHold = [];
        this.StoredTree = [];
        this.hashBuilder = new HashBuilder_1.HashBuilder();
    }
    SimulationStrategy.prototype.setup = function (state, playerId) {
        this.gameState = state;
        this.playerId = playerId;
    };
    SimulationStrategy.prototype.pass = function () {
        return {
            type: const_1.ACTION_PASS,
            player: this.playerId || 0,
        };
    };
    SimulationStrategy.prototype.play = function (cardId, comment) {
        return {
            type: const_1.ACTION_PLAY,
            payload: {
                card: {
                    id: cardId,
                    // @ts-ignore
                    comment: comment,
                },
            },
            player: this.playerId || 0,
        };
    };
    SimulationStrategy.prototype.attack = function (from, to, add) {
        return add ? {
            type: const_1.ACTION_ATTACK,
            source: from,
            additionalAttackers: [add],
            target: to,
            player: this.playerId || 2,
        } : {
            type: const_1.ACTION_ATTACK,
            source: from,
            target: to,
            player: this.playerId || 2,
        };
    };
    SimulationStrategy.prototype.power = function (source, power) {
        return {
            type: const_1.ACTION_POWER,
            source: source,
            power: power,
            player: this.playerId || 0,
        };
    };
    SimulationStrategy.prototype.resolveTargetPrompt = function (target, targetName) {
        var _a;
        return __assign(__assign({ type: const_1.ACTION_RESOLVE_PROMPT, promptType: (_a = this.gameState) === null || _a === void 0 ? void 0 : _a.getPromptType(), target: target }, (targetName ? { targetName: targetName } : {})), { player: this.playerId });
    };
    SimulationStrategy.prototype.resolveNumberPrompt = function (number, type) {
        var _a;
        return {
            type: const_1.ACTION_RESOLVE_PROMPT,
            promptType: type || ((_a = this.gameState) === null || _a === void 0 ? void 0 : _a.getPromptType()),
            number: number,
            player: this.playerId,
        };
    };
    SimulationStrategy.prototype.resolveCardsPrompt = function (cards, type, zone, zoneOwner) {
        var _a;
        return {
            type: const_1.ACTION_RESOLVE_PROMPT,
            promptType: type || ((_a = this.gameState) === null || _a === void 0 ? void 0 : _a.getPromptType()),
            zone: zone,
            zoneOwner: zoneOwner,
            cards: cards.map(function (_a) {
                var id = _a.id;
                return id;
            }),
            // This is needed so we know which cards we selected if ids change (from inside the sim to the outside)
            cardNames: cards.map(function (_a) {
                var card = _a.card;
                return card;
            }),
            player: this.playerId,
        };
    };
    SimulationStrategy.prototype.simulationActionToClientAction = function (simAction) {
        var _a;
        switch (simAction.type) {
            case const_1.ACTION_PLAY: {
                if ('payload' in simAction) {
                    return this.play(simAction.payload.card.id, "Play the card ".concat(simAction.payload.card.card.name));
                }
                break;
            }
            case const_1.ACTION_POWER: {
                if (simAction.source && simAction.power && 'name' in simAction.power) {
                    return this.power(simAction.source.id, simAction.power.name);
                }
                break;
            }
            case const_1.ACTION_ATTACK: {
                var add = simAction.additionalAttackers ? (_a = simAction.additionalAttackers[0]) === null || _a === void 0 ? void 0 : _a.id : '';
                if (simAction.source instanceof CardInGame_1.default && simAction.target instanceof CardInGame_1.default) {
                    return this.attack(simAction.source.id, simAction.target.id, add);
                }
                break;
            }
            case const_1.ACTION_RESOLVE_PROMPT: {
                if ('target' in simAction && simAction.target && simAction.target instanceof CardInGame_1.default) {
                    // console.log(`SimAction path`)
                    return this.resolveTargetPrompt(simAction.target.id, simAction.target.card.name);
                }
                if ('number' in simAction && typeof simAction.number == 'number') {
                    return this.resolveNumberPrompt(simAction.number);
                }
                if ('cards' in simAction && simAction.cards instanceof Array) {
                    // @ts-ignore
                    return this.resolveCardsPrompt(simAction.cards, '', simAction.zone, simAction.zoneOwner);
                }
                console.log('No transformer for ACTION_RESOLVE_PROMPT action');
                console.dir(simAction);
                break;
            }
            case const_1.ACTION_PASS: {
                return this.pass();
            }
            default: {
                console.log('No transformer for sim action');
                console.dir(simAction);
                return this.pass();
            }
        }
        return this.pass();
    };
    SimulationStrategy.prototype.simulateAttacksQueue = function (simulationQueue, initialScore, opponentId) {
        var hashes = new Set();
        var bestAction = {
            score: initialScore,
            action: [this.pass()]
        };
        if (!this.playerId) {
            return this.pass();
        }
        // Simulation itself
        var failsafe = SimulationStrategy.failsafe;
        var counter = 0;
        while (simulationQueue.hasItems() && failsafe > 0) {
            failsafe -= 1;
            counter += 1;
            var workEntity = simulationQueue.shift();
            if (workEntity) {
                try {
                    workEntity.sim.update(workEntity.action);
                }
                catch (e) {
                    debugger;
                    console.error('Error applying action');
                    if ('payload' in workEntity.action) {
                        console.dir(workEntity.action.payload.card);
                    }
                    console.dir(workEntity);
                    console.dir(e.stack);
                    throw new Error('Away!');
                }
                var score = (0, simulationUtils_1.getStateScore)(workEntity.sim, this.playerId, opponentId);
                if (score > bestAction.score) {
                    bestAction.score = score;
                    bestAction.action = (workEntity === null || workEntity === void 0 ? void 0 : workEntity.actionLog.map(function (_a) {
                        var action = _a.action;
                        return action;
                    })) || [];
                }
                var hash = this.hashBuilder.makeHash(workEntity.sim);
                if (hashes.has(hash)) {
                    continue;
                }
                hashes.add(hash);
                simulationQueue.push.apply(simulationQueue, ActionExtractor_1.ActionExtractor.extractActions(workEntity.sim, this.playerId, opponentId, workEntity.actionLog, hash, this.hashBuilder));
            }
        }
        return bestAction.action[0];
    };
    SimulationStrategy.prototype.actionToLabel = function (action) {
        switch (action.type) {
            case const_1.ACTION_PLAY: {
                return "PLAY ".concat(action.payload.card.card.name);
            }
            case const_1.ACTION_POWER: {
                return "POWER ".concat(action.source.card.name, " ").concat(action.power.name);
            }
            case const_1.ACTION_RESOLVE_PROMPT: {
                if ('target' in action && 'card' in action.target) {
                    return "RESOLVE_PROMPT ".concat(action.target.card.name);
                }
                if ('number' in action) {
                    return "RESOLVE_PROMPT ".concat(action.number);
                }
                if ('useEffect' in action) {
                    return "RESOLVE_PROMPT ".concat(action.useEffect ? '' : 'don\'t ', "use effect (player ").concat(action.player, ")");
                }
                return "RESOLVE_PROMPT other (player ".concat(action.player, ")");
            }
            case const_1.ACTION_ATTACK: {
                return "ATTACK ".concat(action.source.card.name, " -> ").concat(action.target.card.name, " (player ").concat(action.player, ")");
            }
            case const_1.ACTION_PASS: {
                return 'PASS';
            }
        }
        return "Unknown action: ".concat(action.type);
    };
    SimulationStrategy.prototype.simulateActionsQueue = function (simulationQueue, initialScore, opponentId) {
        var hashes = new Set();
        if (!this.playerId) {
            return [{
                    action: this.pass(),
                    hash: '*',
                }];
        }
        // Simulation itself
        var counter = 0;
        this.leaves.clear();
        while (simulationQueue.hasItems() && counter <= SimulationStrategy.failsafe) {
            counter += 1;
            var workEntity = simulationQueue.shift();
            if (workEntity && workEntity.action) {
                try {
                    workEntity.sim.update(workEntity.action);
                }
                catch (e) {
                    console.log('Error applying action');
                    console.dir(workEntity.action);
                    console.log("Message: ".concat(e.message));
                    console.dir(e.stack);
                }
                var score = (0, simulationUtils_1.getStateScore)(workEntity.sim, this.playerId, opponentId);
                var hash = this.hashBuilder.makeHash(workEntity.sim);
                try {
                    this.graph = this.graph + "  \"".concat(workEntity.previousHash, "\" -> \"").concat(hash, "\" [label=\"").concat(this.actionToLabel(workEntity.action), "\"]\n");
                }
                catch (_e) {
                    console.error('Error generating label perhaps');
                    console.dir(_e);
                }
                if (hashes.has(hash)) {
                    continue;
                }
                hashes.add(hash);
                this.leaves.delete(workEntity.previousHash);
                this.leaves.set(hash, {
                    hash: hash,
                    parentHash: hash,
                    score: score,
                    actionLog: workEntity.actionLog,
                    isPrompt: Boolean(workEntity.sim.state.prompt),
                });
                simulationQueue.push.apply(simulationQueue, ActionExtractor_1.ActionExtractor.extractActions(workEntity.sim, this.playerId, opponentId, workEntity.actionLog, hash, this.hashBuilder));
                // delete workEntity.sim;
            }
        }
        var bestAction = {
            score: initialScore,
            actions: []
        };
        this.leaves.forEach(function (value) {
            if (!value.isPrompt && (value.score > bestAction.score) || (value.score == bestAction.score && value.actionLog.length < bestAction.actions.length)) {
                bestAction.score = value.score;
                bestAction.actions = value.actionLog;
            }
        });
        // console.log(`
        // digraph sim {
        //   ${this.graph}
        // }
        // `)
        // console.log(`Done ${counter} power simulations. Leaves reached: ${this.leaves.size}`)
        // console.log(`Best found score is ${bestAction.score} (initial is ${initialScore})`)
        return bestAction.actions;
    };
    SimulationStrategy.prototype.shouldClearHeldActions = function () {
        if (!this.actionsOnHold.length)
            return false;
        if (!this.gameState)
            return false;
        var action = this.actionsOnHold[0].action;
        if (this.gameState.getStep() === STEP_NAME.CREATURES) {
            var playableCards = this.gameState.getPlayableCards();
            var ids = new Set(playableCards.map(function (_a) {
                var id = _a.id;
                return id;
            }));
            if (action.type === const_1.ACTION_PLAY &&
                'payload' in action &&
                !ids.has(action.payload.card.id)) {
                console.log("Failed summon, passing. Dropping ".concat(this.actionsOnHold.length, " actions on hold."));
                return true;
            }
        }
        else if (this.gameState.getStep() === STEP_NAME.PRS1 || this.gameState.getStep() === STEP_NAME.PRS2) {
            var creaturesRelicsAndMagi = __spreadArray(__spreadArray([], this.gameState.getMyCreaturesInPlay(), true), this.gameState.getMyRelicsInPlay(), true);
            var myMagi = this.gameState.getMyMagi();
            if (myMagi) {
                creaturesRelicsAndMagi.push(myMagi);
            }
            var ids = new Set(creaturesRelicsAndMagi.map(function (_a) {
                var id = _a.id;
                return id;
            }));
            if (action.type === const_1.ACTION_POWER &&
                !ids.has(action.source)) {
                console.log("Failed power activation, no card with id ".concat(action.source, " (power to be activated is ").concat(action.power, "). Dropping ").concat(this.actionsOnHold.length, " actions on hold."));
                return true;
            }
        }
        else if (this.gameState.getStep() === STEP_NAME.ATTACK) {
            if (!(action.type === const_1.ACTION_PASS || action.type === const_1.ACTION_ATTACK)) {
                console.log('Non-attack action in the attack step');
                return true;
            }
            if (action.type === const_1.ACTION_ATTACK && !this.gameState.getMyCreaturesInPlay().some(function (pcc) { return pcc.id == action.source; })) {
                console.log("Unknown attacker, probably killed by a unforeseen effect?");
                return true;
            }
        }
        if (this.gameState.isInMyPromptState() && action.type !== const_1.ACTION_RESOLVE_PROMPT) {
            console.log('Non-prompt action in the prompt state');
            return true;
        }
        return false;
    };
    SimulationStrategy.prototype.fixTargetPromptResolution = function (action) {
        var _a, _b, _c;
        var promptAvailableCards = (_b = (_a = this.gameState) === null || _a === void 0 ? void 0 : _a.state.promptParams.cards) === null || _b === void 0 ? void 0 : _b.map(function (_a) {
            var id = _a.id;
            return id;
        });
        console.log("Searching for the ".concat(action.targetName));
        if ('target' in action && typeof action.target == 'string' && promptAvailableCards) {
            var cards = (_c = this.gameState) === null || _c === void 0 ? void 0 : _c.getMyCreaturesInPlay();
            var _loop_1 = function (cardId) {
                var card = cards === null || cards === void 0 ? void 0 : cards.find(function (card) { return card.id === cardId; });
                if (card && card.card.name === action.targetName) {
                    return { value: __assign(__assign({}, action), { target: card.id }) };
                }
            };
            for (var _i = 0, promptAvailableCards_1 = promptAvailableCards; _i < promptAvailableCards_1.length; _i++) {
                var cardId = promptAvailableCards_1[_i];
                var state_1 = _loop_1(cardId);
                if (typeof state_1 === "object")
                    return state_1.value;
            }
        }
        console.log("Fixing the target prompt failed");
        return action;
    };
    SimulationStrategy.prototype.fixCardPromptResolution = function (action) {
        var _a, _b, _c;
        var promptAvailableCards = (_b = (_a = this.gameState) === null || _a === void 0 ? void 0 : _a.state.promptParams.cards) === null || _b === void 0 ? void 0 : _b.map(function (_a) {
            var id = _a.id;
            return id;
        });
        // @ts-ignore
        if ('cards' in action && action.cards && action.cards instanceof Array && action.cards.some(function (card) { return !(promptAvailableCards === null || promptAvailableCards === void 0 ? void 0 : promptAvailableCards.includes(card)); })) {
            var availableCardPairs = {};
            // console.dir(this.gameState?.state.promptParams.cards)
            for (var _i = 0, _d = (_c = this.gameState) === null || _c === void 0 ? void 0 : _c.state.promptParams.cards; _i < _d.length; _i++) {
                var card = _d[_i];
                if (!(card.card in availableCardPairs)) {
                    availableCardPairs[card.card] = [];
                }
                availableCardPairs[card.card].push(card.id);
            }
            var newCards = [];
            // @ts-ignore
            for (var _f = 0, _g = action.cardNames; _f < _g.length; _f++) {
                var cardName = _g[_f];
                if (!(cardName.name in availableCardPairs) || availableCardPairs[cardName.name].length == 0) {
                    // console.dir(action)
                    // console.dir(cardName)
                    throw new Error("Cannot find ".concat(cardName.name, " in the prompt zone"));
                }
                var newId = availableCardPairs[cardName.name].pop();
                newCards.push(newId);
            }
            return __assign(__assign({}, action), { cards: newCards });
        }
        return action;
    };
    SimulationStrategy.prototype.requestAction = function () {
        var action = this.generateAction();
        if (this.gameState) {
            var historyEntry = {
                state: JSON.stringify(this.gameState.state),
                action: action,
                fromHold: this.actionCameFromHold,
            };
            this.history.push(historyEntry);
            if (this.history.length > this.historyLength) {
                this.history = this.history.slice(0, this.historyLength);
            }
        }
        return action;
    };
    SimulationStrategy.prototype.requestHistory = function () {
        return this.history;
    };
    SimulationStrategy.prototype.generateAction = function () {
        var _this = this;
        var _a;
        this.actionCameFromHold = false;
        if (this.shouldClearHeldActions()) {
            this.actionsOnHold = [];
        }
        if (!this.gameState) {
            return this.pass();
        }
        if (this.actionsOnHold.length) {
            this.actionCameFromHold = true;
            var _b = this.actionsOnHold.shift(), action_1 = _b.action, hash = _b.hash;
            // const testSim = createState(
            //   this.gameState,
            //   this.playerId || 2,
            //   this.gameState.getOpponentId(),
            // )
            // const checkHash = this.hashBuilder.makeHash(testSim);
            // If we are passing at the creatures step, clear the actions on hold
            if (action_1 && action_1.type === const_1.ACTION_PASS && this.gameState.getStep() === STEP_NAME.CREATURES) {
                this.actionsOnHold = [];
            }
            // if (checkHash !== hash) {
            //   console.error(`Hashes do not match. Probably something strange has happened.`)
            //   console.error(`Action hash: ${hash}, state hash: ${checkHash}`);
            // }
            if (action_1.type == const_1.ACTION_RESOLVE_PROMPT && (this.gameState.getPromptType() == const_2.PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE)) {
                return this.fixCardPromptResolution(action_1);
            }
            if (action_1.type == const_1.ACTION_RESOLVE_PROMPT &&
                this.gameState.getPromptType() == const_2.PROMPT_TYPE_PAYMENT_SOURCE &&
                !((_a = this.gameState.state.promptParams.cards) === null || _a === void 0 ? void 0 : _a.some(function (_a) {
                    var id = _a.id;
                    return id == action_1.target;
                }))) {
                // console.log(`Target is ${action.target}`)
                // console.dir(this.gameState.state.promptParams.cards)
                // const cardIsIn = this.gameState.state.promptParams.cards?.some(card => card.card == action.target)
                return this.fixTargetPromptResolution(action_1);
            }
            return action_1;
        }
        if (this.gameState && this.playerId) {
            if (this.gameState.waitingForCardSelection()) {
                return {
                    type: const_1.ACTION_RESOLVE_PROMPT,
                    // promptType: PROMPT_TYPE_CHOOSE_CARDS,
                    cards: this.gameState.getStartingCards(),
                    player: this.playerId,
                };
            }
            if (this.gameState.waitingForPaymentSourceSelection()) {
                return {
                    type: const_1.ACTION_RESOLVE_PROMPT,
                    // promptType: PROMPT_TYPE_CHOOSE_CARDS,
                    target: this.gameState.getPaymentSourceCards()[0],
                    player: this.playerId,
                };
            }
            if (this.gameState.isInPromptState(this.playerId) && this.gameState.getPromptType() === const_1.PROMPT_TYPE_MAY_ABILITY) {
                var myMagi = this.gameState.getMyMagi();
                if (myMagi.card === 'Stradus' && this.gameState.state.promptGeneratedBy === myMagi.id) {
                    return {
                        type: const_1.ACTION_RESOLVE_PROMPT,
                        // promptType: PROMPT_TYPE_MAY_ABILITY,
                        useEffect: true,
                        player: this.playerId,
                    };
                }
                return {
                    type: const_1.ACTION_RESOLVE_PROMPT,
                    // promptType: PROMPT_TYPE_MAY_ABILITY,
                    useEffect: false,
                    player: this.playerId,
                };
            }
            if (this.waitingTarget && this.gameState.waitingForTarget(this.waitingTarget.source, this.playerId)) {
                // console.log(`Waiting for target resolve path`)
                // console.dir(this.waitingTarget)
                return this.resolveTargetPrompt(this.waitingTarget.target, 'waitingTarget');
            }
            if (this.gameState.playerPriority(this.playerId)) {
                var step = this.gameState.getStep();
                switch (step) {
                    case STEP_NAME.ENERGIZE: {
                        //   if (this.gameState.isInMyPromptState()) {
                        //     if (this.gameState.getPromptType() == PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE) {
                        //       console.log(`Game makes us choose N cards from the zone on Energize step`)
                        //       console.dir(this.gameState.state.promptParams)
                        //     }
                        //   }
                    }
                    case STEP_NAME.PRS1:
                    case STEP_NAME.PRS2: {
                        if (this.gameState.isInMyPromptState()) {
                            if (this.gameState.getPromptType() === const_2.PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE ||
                                this.gameState.getPromptType() === const_1.PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE) {
                                return this.resolveChooseCardsPrompt();
                            }
                            // console.log(`Prompt state without previous action: ${this.gameState.getPromptType()}`)
                        }
                        var playable = this.gameState.getPlayableCards()
                            .map(addCardData)
                            .filter(function (card) { return card._card.type === const_1.TYPE_RELIC; });
                        var relics_1 = this.gameState.getMyRelicsInPlay().map(function (card) { var _a; return (_a = card._card) === null || _a === void 0 ? void 0 : _a.name; });
                        if (playable.some(function (card) { return !relics_1.includes(card._card.name); })) {
                            var playableRelic = playable.find(function (card) { return !relics_1.includes(card._card.name); });
                            if (playableRelic) {
                                if (!playableRelic.id) {
                                    console.error("Non-playable relic chosen somehow");
                                }
                                return this.play(playableRelic === null || playableRelic === void 0 ? void 0 : playableRelic.id);
                            }
                        }
                        // We need to preserve opponent id because some static effects depend on it
                        var TEMPORARY_OPPONENT_ID = this.gameState.getOpponentId();
                        this.graph = '';
                        var outerSim = (0, simulationUtils_1.createState)(this.gameState, this.playerId || 2, TEMPORARY_OPPONENT_ID);
                        var hash = this.hashBuilder.makeHash(outerSim);
                        var initialScore = (0, simulationUtils_1.getStateScore)(outerSim, this.playerId, TEMPORARY_OPPONENT_ID);
                        var simulationQueue = new SimulationQueue_1.SimulationQueue();
                        simulationQueue.addFromSim(outerSim, this.playerId, TEMPORARY_OPPONENT_ID, [], hash, this.hashBuilder);
                        //const simulationQueue: SimulationEntity[] = ActionExtractor.extractActions(outerSim, this.playerId, TEMPORARY_OPPONENT_ID, [], hash, this.hashBuilder)
                        var bestActions = this.simulateActionsQueue(simulationQueue, initialScore, TEMPORARY_OPPONENT_ID);
                        var finalHash = this.hashBuilder.makeHash(outerSim);
                        if (finalHash !== hash) {
                            console.log("Change leak! hashes mismatch: ".concat(hash, " => ").concat(finalHash));
                        }
                        if (!bestActions[0]) {
                            return this.pass();
                        }
                        this.actionsOnHold = bestActions.slice(1).filter(function (_a) {
                            var action = _a.action;
                            return (action.type === const_1.ACTION_PLAY && 'payload' in action && action.payload.player === _this.playerId) ||
                                ('player' in action && action.player === _this.playerId);
                        }).map(function (_a) {
                            var action = _a.action, hash = _a.hash;
                            return ({
                                action: _this.simulationActionToClientAction(action),
                                hash: hash,
                            });
                        });
                        // console.log('Saving the graph data as ' + finalHash);
                        // console.log(btoa(this.graph));
                        // if (this.actionsOnHold.length) {
                        // console.log(`Stored ${this.actionsOnHold.length} actions on hold`)
                        // console.dir(this.actionsOnHold)
                        // }
                        var bestAction = bestActions[0];
                        // if (bestAction.type === ACTION_PLAY) {
                        //   // console.error(`Playing the card`);
                        //   // console.dir(bestAction.payload.card);
                        // }
                        return this.simulationActionToClientAction(bestAction.action);
                    }
                    case STEP_NAME.CREATURES: {
                        var myMagiCard = this.gameState.getMyMagi();
                        if (!myMagiCard) {
                            return this.pass();
                        }
                        var magiBaseCard = (0, cards_1.byName)(myMagiCard.card);
                        if (!magiBaseCard) {
                            return this.pass();
                        }
                        var myMagi_1 = __assign(__assign({}, myMagiCard), { _card: magiBaseCard });
                        var availableEnergy_1 = myMagi_1.data.energy;
                        var playable = this.gameState.getPlayableCards()
                            .map(addCardData)
                            .filter(function (card) {
                            var regionTax = (myMagi_1._card.region === card._card.region) ? 0 : 1;
                            return card._card.type === const_1.TYPE_CREATURE && card._card.cost && (card._card.cost + regionTax) <= availableEnergy_1;
                        });
                        if (playable.length) {
                            var playableCreature = playable[0];
                            return this.play(playableCreature.id);
                        }
                        return this.pass();
                    }
                    case STEP_NAME.ATTACK: {
                        var opponentMagi = this.gameState.getOpponentMagi();
                        if (opponentMagi) {
                            var TEMPORARY_OPPONENT_ID = this.gameState.getOpponentId();
                            var myCreatures = this.gameState.getMyCreaturesInPlay();
                            if (myCreatures.length == 0) {
                                return this.pass();
                            }
                            var outerSim = (0, simulationUtils_1.createState)(this.gameState, this.playerId || 2, TEMPORARY_OPPONENT_ID);
                            var hash = this.hashBuilder.makeHash(outerSim);
                            var simulationQueue = new SimulationQueue_1.SimulationQueue();
                            simulationQueue.addFromSim(outerSim, this.playerId, TEMPORARY_OPPONENT_ID, [], hash, this.hashBuilder);
                            // const simulationQueue = ActionExtractor.extractActions(outerSim, this.playerId, TEMPORARY_OPPONENT_ID, [], hash, this.hashBuilder)
                            var initialScore = (0, simulationUtils_1.getStateScore)(outerSim, this.playerId, TEMPORARY_OPPONENT_ID);
                            var bestAction = this.simulateAttacksQueue(simulationQueue, initialScore, TEMPORARY_OPPONENT_ID);
                            if (!bestAction) {
                                console.error("Some strange actions encountered");
                                console.dir(bestAction);
                            }
                            if (bestAction.type === const_1.ACTION_ATTACK || bestAction.type === const_1.ACTION_RESOLVE_PROMPT) {
                                return this.simulationActionToClientAction(bestAction);
                            }
                        }
                        // We get here if we accidentally (yeah) killed opposing Adis. It's ATTACK step, we're in the prompt state.
                        // Or it's someone like Gum-Gum.
                        if (this.gameState.isInMyPromptState()) {
                            if (this.gameState.getPromptType() == const_2.PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE) {
                                return this.resolveChooseCardsPrompt();
                            }
                            throw new Error("Unexpected prompt type in ATTACK step: ".concat(this.gameState.getPromptType()));
                        }
                        return this.pass();
                    }
                    default:
                        return this.pass();
                }
            }
        }
        return this.pass();
    };
    SimulationStrategy.prototype.resolveChooseCardsPrompt = function () {
        if (!this.gameState) {
            throw new Error('Trying to resolve prompt without gameState present');
        }
        var availableCards = this.gameState.state.promptParams.cards || [];
        if (this.gameState.getPromptType() == const_1.PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE) {
            // console.log('Resolving choose up to N cards prompt');
            // console.dir(this.resolveCardsPrompt(
            //   availableCards.slice(0, this.gameState.state.promptParams.numberOfCards || 0)
            //     .map(card => card as unknown as CardInGame),
            //   this.gameState.state.promptType || '',
            //   this.gameState.state.promptParams.zone || ZONE_TYPE_IN_PLAY,
            //   this.gameState.state.promptParams.zoneOwner || 0,
            // ))
        }
        // The conversion to CardInGame is OK because resolveCardPrompt only cares about card ids
        return this.resolveCardsPrompt(availableCards.slice(0, this.gameState.state.promptParams.numberOfCards || 0)
            .map(function (card) { return card; }), this.gameState.state.promptType || '', this.gameState.state.promptParams.zone || const_2.ZONE_TYPE_IN_PLAY, this.gameState.state.promptParams.zoneOwner || 0);
    };
    // public static deckId = '62ed47ae99dd0db04e9f657b' // Online deck
    // public static deckId = '5f60e45e11283f7c98d9259b' // Local deck (Naroom)
    SimulationStrategy.deckId = '5f60e45e11283f7c98d9259c'; // Local deck (Arderial)
    // public static deckId = '6305ec3aa14ce19348dfd7f9' // Local deck (Underneath/Naroom)
    SimulationStrategy.failsafe = 500;
    return SimulationStrategy;
}());
exports.SimulationStrategy = SimulationStrategy;
