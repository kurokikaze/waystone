"use strict";
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
exports.ActionExtractor = void 0;
var const_1 = require("../const");
var const_2 = require("moonlands/src/const");
var STEP_NAME = {
    ENERGIZE: 0,
    PRS1: 1,
    ATTACK: 2,
    CREATURES: 3,
    PRS2: 4,
    DRAW: 5,
};
var ActionExtractor = /** @class */ (function () {
    function ActionExtractor() {
    }
    ActionExtractor.extractActions = function (sim, playerId, opponentId, actionLog, previousHash, hashBuilder) {
        if (sim.state.activePlayer !== playerId) {
            return [];
        }
        if (sim.state.prompt) {
            return ActionExtractor.extractPromptAction(sim, playerId, opponentId, actionLog, previousHash);
        }
        var step = sim.state.step;
        switch (step) {
            case STEP_NAME.ENERGIZE: {
                return [];
            }
            // Fall through is intended
            case STEP_NAME.PRS1:
            case STEP_NAME.PRS2: {
                var magiCard_1 = sim.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, playerId).card;
                if (!magiCard_1)
                    return [ActionExtractor.getPassAction(sim, playerId, actionLog, previousHash)];
                var mySimCreatures = sim.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.filter(function (card) { return sim.modifyByStaticAbilities(card, const_1.PROPERTY_CONTROLLER) === playerId; });
                var creaturesWithPowers = mySimCreatures.filter(function (creature) { return creature.card.data.powers && creature.data.actionsUsed.length === 0; });
                var simulationQueue_1 = [];
                simulationQueue_1.push(ActionExtractor.getPassAction(sim, playerId, actionLog, previousHash));
                creaturesWithPowers.forEach(function (card) {
                    var _a, _b;
                    var power = ((_b = (_a = card.card) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.powers) ? card.card.data.powers[0] : null;
                    // Don't forget: Relic powers are paid from the Magi
                    var energyReserve = card.card.type === const_1.TYPE_CREATURE ? card.data.energy : magiCard_1.data.energy;
                    if (power && typeof power.cost == 'number' && power.cost <= energyReserve) {
                        var innerSim = sim.clone();
                        var action = {
                            type: const_1.ACTION_POWER,
                            source: innerSim.getZone(const_1.ZONE_TYPE_IN_PLAY).byId(card.id),
                            power: power,
                            player: playerId,
                        };
                        simulationQueue_1.push({
                            sim: innerSim,
                            action: action,
                            actionLog: __spreadArray(__spreadArray([], actionLog, true), [{
                                    action: action,
                                    hash: previousHash,
                                }], false),
                            previousHash: previousHash,
                        });
                    }
                });
                if (magiCard_1) {
                    if (magiCard_1.card.data.powers && magiCard_1.card.data.powers.length) {
                        magiCard_1.card.data.powers.forEach(function (power) {
                            if (!magiCard_1.data.actionsUsed.includes(power.name) && power.cost <= magiCard_1.data.energy) {
                                var innerSim = sim.clone();
                                var source = innerSim.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, playerId).card;
                                if (source) {
                                    var action = {
                                        type: const_1.ACTION_POWER,
                                        source: source,
                                        power: power,
                                        player: playerId,
                                    };
                                    simulationQueue_1.push({
                                        sim: innerSim,
                                        action: action,
                                        actionLog: __spreadArray(__spreadArray([], actionLog, true), [{
                                                action: action,
                                                hash: previousHash,
                                            }], false),
                                        previousHash: previousHash,
                                    });
                                }
                            }
                        });
                    }
                    // Never try to cast these (for now)
                    var FORBIDDEN_SPELLS_1 = ["Hyren's Call"];
                    var playableSpells = sim.getZone(const_1.ZONE_TYPE_HAND, playerId).cards.filter(function (card) { return card.card.type === const_1.TYPE_SPELL &&
                        typeof card.card.cost == 'number' &&
                        card.card.cost <= magiCard_1.data.energy &&
                        !FORBIDDEN_SPELLS_1.includes(card.card.name); });
                    playableSpells.forEach(function (spell) {
                        var innerSim = sim.clone();
                        var card = innerSim.getZone(const_1.ZONE_TYPE_HAND, playerId).byId(spell.id);
                        if (card && typeof spell.card.cost == 'number' && spell.card.cost <= magiCard_1.data.energy) {
                            var action = {
                                type: const_1.ACTION_PLAY,
                                payload: {
                                    card: card,
                                    player: playerId,
                                },
                                forcePriority: false,
                                player: playerId,
                            };
                            simulationQueue_1.push({
                                sim: innerSim,
                                action: action,
                                actionLog: __spreadArray(__spreadArray([], actionLog, true), [{
                                        action: action,
                                        hash: hashBuilder.makeHash(innerSim),
                                    }], false),
                                previousHash: previousHash,
                            });
                        }
                    });
                }
                return simulationQueue_1;
            }
            case STEP_NAME.ATTACK: {
                var attackPatterns = ActionExtractor.getAllAttackPatterns(sim, playerId, opponentId);
                var workEntities_1 = [ActionExtractor.getPassAction(sim, playerId, actionLog, previousHash)];
                attackPatterns.forEach(function (pattern) {
                    var innerSim = sim.clone();
                    var source = innerSim.getZone(const_1.ZONE_TYPE_IN_PLAY).byId(pattern.from);
                    var target = innerSim.getZone(const_1.ZONE_TYPE_IN_PLAY).byId(pattern.to) || innerSim.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, opponentId).byId(pattern.to);
                    var additionalAttackers = pattern.add ? [innerSim.getZone(const_1.ZONE_TYPE_IN_PLAY).byId(pattern.add)] : [];
                    if (source && target) {
                        var action = additionalAttackers ? {
                            type: const_1.ACTION_ATTACK,
                            source: source,
                            additionalAttackers: additionalAttackers,
                            target: target,
                            player: playerId,
                        } :
                            {
                                type: const_1.ACTION_ATTACK,
                                source: source,
                                target: target,
                                player: playerId,
                            };
                        workEntities_1.push({
                            sim: innerSim,
                            action: action,
                            actionLog: __spreadArray(__spreadArray([], actionLog, true), [{
                                    action: action,
                                    hash: previousHash,
                                }], false),
                            previousHash: previousHash,
                        });
                    }
                });
                return workEntities_1;
            }
            case STEP_NAME.CREATURES: {
                var magiCard_2 = sim.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, playerId).card;
                var simulationQueue_2 = [ActionExtractor.getPassAction(sim, playerId, actionLog, previousHash)];
                if (magiCard_2) {
                    var playableCreatures = sim.getZone(const_1.ZONE_TYPE_HAND, playerId).cards.filter(function (card) { return card.card.type === const_1.TYPE_CREATURE; });
                    playableCreatures.forEach(function (creature) {
                        var regionTax = (creature.card.region === magiCard_2.card.region || creature.card.region === const_1.REGION_UNIVERSAL) ? 0 : 1;
                        if ((typeof creature.card.cost == 'number') && (creature.card.cost + regionTax <= magiCard_2.data.energy)) {
                            var innerSim = sim.clone();
                            innerSim.setOnAction(function (action) {
                                if (action.type === const_1.ACTION_EFFECT &&
                                    action.effectType === const_1.EFFECT_TYPE_CARD_MOVED_BETWEEN_ZONES // &&
                                // action.sourceZone === ZONE_TYPE_HAND &&
                                // action.destinationZone === ZONE_TYPE_IN_PLAY
                                ) {
                                    hashBuilder.registerChildHash(action.sourceCard.id, action.destinationCard.id);
                                }
                            });
                            var card = innerSim.getZone(const_1.ZONE_TYPE_HAND, playerId).byId(creature.id);
                            if (card) {
                                var action = {
                                    type: const_1.ACTION_PLAY,
                                    payload: {
                                        card: card,
                                        player: playerId,
                                    },
                                    forcePriority: false,
                                    player: playerId,
                                };
                                simulationQueue_2.push({
                                    sim: innerSim,
                                    action: action,
                                    actionLog: __spreadArray(__spreadArray([], actionLog, true), [{
                                            action: action,
                                            hash: previousHash,
                                        }], false),
                                    previousHash: previousHash,
                                });
                            }
                        }
                    });
                }
                return simulationQueue_2;
            }
            case STEP_NAME.DRAW: {
                return [];
            }
        }
        return [];
    };
    ActionExtractor.getPassAction = function (sim, playerId, actionLog, previousHash) {
        var innerSim = sim.clone();
        var passAction = {
            type: const_1.ACTION_PASS,
            player: playerId,
        };
        return {
            sim: innerSim,
            action: passAction,
            actionLog: __spreadArray(__spreadArray([], actionLog, true), [{
                    action: passAction,
                    hash: previousHash,
                }], false),
            previousHash: previousHash,
        };
    };
    ActionExtractor.extractPromptAction = function (sim, playerId, opponentId, actionLog, previousHash) {
        var _a, _b, _c, _d, _e, _f;
        switch (sim.state.promptType) {
            case const_1.PROMPT_TYPE_MAY_ABILITY: {
                var actionYes = {
                    type: const_1.ACTION_RESOLVE_PROMPT,
                    // promptType: PROMPT_TYPE_MAY_ABILITY,
                    generatedBy: sim.state.promptGeneratedBy,
                    useEffect: true,
                    player: sim.state.promptPlayer || playerId,
                };
                var actionNo = {
                    type: const_1.ACTION_RESOLVE_PROMPT,
                    // promptType: PROMPT_TYPE_MAY_ABILITY,
                    generatedBy: sim.state.promptGeneratedBy,
                    useEffect: false,
                    player: sim.state.promptPlayer || playerId,
                };
                return [
                    {
                        sim: sim.clone(),
                        action: actionYes,
                        actionLog: __spreadArray(__spreadArray([], actionLog, true), [{
                                action: actionYes,
                                hash: previousHash,
                            }], false),
                        previousHash: previousHash,
                    },
                    {
                        sim: sim.clone(),
                        action: actionNo,
                        actionLog: __spreadArray(__spreadArray([], actionLog, true), [{
                                action: actionNo,
                                hash: previousHash,
                            }], false),
                        previousHash: previousHash,
                    },
                ];
            }
            case const_2.PROMPT_TYPE_ALTERNATIVE: {
                if (sim.state.promptParams.alternatives) {
                    return sim.state.promptParams.alternatives.map(function (alternative) {
                        var action = {
                            type: const_1.ACTION_RESOLVE_PROMPT,
                            // promptType: PROMPT_TYPE_ALTERNATIVE,
                            player: sim.state.promptPlayer,
                            alternative: alternative.value,
                        };
                        return ({
                            sim: sim.clone(),
                            action: action,
                            actionLog: __spreadArray(__spreadArray([], actionLog, true), [{
                                    action: action,
                                    hash: previousHash,
                                }], false),
                            previousHash: previousHash,
                        });
                    });
                }
                return [];
            }
            case const_1.PROMPT_TYPE_SINGLE_CREATURE_FILTERED: {
                var allCreatures = sim.getZone(const_1.ZONE_TYPE_IN_PLAY).cards
                    .filter(function (card) { return card.card.type === const_1.TYPE_CREATURE; });
                var filteredCreatures = allCreatures;
                if (sim.state.promptParams.restrictions) {
                    var filter = sim.makeCardFilter(sim.state.promptParams.restrictions);
                    filteredCreatures = allCreatures.filter(filter);
                }
                var simulationQueue_3 = [];
                filteredCreatures.forEach(function (creature) {
                    var innerSim = sim.clone();
                    var action = {
                        type: const_1.ACTION_RESOLVE_PROMPT,
                        promptType: const_1.PROMPT_TYPE_OWN_SINGLE_CREATURE,
                        target: innerSim.getZone(const_1.ZONE_TYPE_IN_PLAY).byId(creature.id),
                        generatedBy: innerSim.state.promptGeneratedBy,
                        player: innerSim.state.promptPlayer,
                    };
                    simulationQueue_3.push({
                        sim: innerSim,
                        action: action,
                        actionLog: __spreadArray(__spreadArray([], actionLog, true), [{
                                action: action,
                                hash: previousHash,
                            }], false),
                        previousHash: previousHash,
                    });
                });
                return simulationQueue_3;
            }
            case const_1.PROMPT_TYPE_SINGLE_CREATURE: {
                var allCreatures = sim.getZone(const_1.ZONE_TYPE_IN_PLAY).cards
                    .filter(function (card) { return card.card.type === const_1.TYPE_CREATURE; });
                var simulationQueue_4 = [];
                allCreatures.forEach(function (creature) {
                    var innerSim = sim.clone();
                    var action = {
                        type: const_1.ACTION_RESOLVE_PROMPT,
                        promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE,
                        target: innerSim.getZone(const_1.ZONE_TYPE_IN_PLAY).byId(creature.id),
                        generatedBy: innerSim.state.promptGeneratedBy,
                        player: innerSim.state.promptPlayer,
                    };
                    simulationQueue_4.push({
                        sim: innerSim,
                        action: action,
                        actionLog: __spreadArray(__spreadArray([], actionLog, true), [{
                                action: action,
                                hash: previousHash,
                            }], false),
                        previousHash: previousHash,
                    });
                });
                return simulationQueue_4;
            }
            case const_2.PROMPT_TYPE_RELIC: {
                var allRelics = sim.getZone(const_1.ZONE_TYPE_IN_PLAY).cards
                    .filter(function (card) { return card.card.type === const_2.TYPE_RELIC; });
                var simulationQueue_5 = [];
                allRelics.forEach(function (relic) {
                    var innerSim = sim.clone();
                    var action = {
                        type: const_1.ACTION_RESOLVE_PROMPT,
                        promptType: const_2.PROMPT_TYPE_RELIC,
                        target: innerSim.getZone(const_1.ZONE_TYPE_IN_PLAY).byId(relic.id),
                        generatedBy: innerSim.state.promptGeneratedBy,
                        player: innerSim.state.promptPlayer,
                    };
                    simulationQueue_5.push({
                        sim: innerSim,
                        action: action,
                        actionLog: __spreadArray(__spreadArray([], actionLog, true), [{
                                action: action,
                                hash: previousHash,
                            }], false),
                        previousHash: previousHash,
                    });
                });
                return simulationQueue_5;
            }
            case const_2.PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE: {
                var allCreatures = sim.getZone(const_1.ZONE_TYPE_IN_PLAY).cards
                    .filter(function (card) { return card.card.type === const_1.TYPE_CREATURE && card.id !== sim.state.promptGeneratedBy; });
                var simulationQueue_6 = [];
                allCreatures.forEach(function (creature) {
                    var innerSim = sim.clone();
                    var action = {
                        type: const_1.ACTION_RESOLVE_PROMPT,
                        // promptType: PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE,
                        target: innerSim.getZone(const_1.ZONE_TYPE_IN_PLAY).byId(creature.id),
                        generatedBy: innerSim.state.promptGeneratedBy,
                        player: innerSim.state.promptPlayer,
                    };
                    simulationQueue_6.push({
                        sim: innerSim,
                        action: action,
                        actionLog: __spreadArray(__spreadArray([], actionLog, true), [{
                                action: action,
                                hash: previousHash,
                            }], false),
                        previousHash: previousHash,
                    });
                });
                return simulationQueue_6;
            }
            case const_1.PROMPT_TYPE_NUMBER: {
                var min = sim.state.promptParams.min;
                var max = sim.state.promptParams.max;
                var simulationQueue = [];
                if (typeof min === 'number' && typeof max === 'number') {
                    for (var i = min; i < max; i++) {
                        var innerSim = sim.clone();
                        var action = {
                            type: const_1.ACTION_RESOLVE_PROMPT,
                            // promptType: PROMPT_TYPE_NUMBER,
                            number: i,
                            generatedBy: sim.state.promptGeneratedBy,
                            player: sim.state.promptPlayer,
                        };
                        simulationQueue.push({
                            sim: innerSim,
                            action: action,
                            actionLog: __spreadArray(__spreadArray([], actionLog, true), [{
                                    action: action,
                                    hash: previousHash,
                                }], false),
                            previousHash: previousHash,
                        });
                    }
                }
                return simulationQueue;
            }
            case const_1.PROMPT_TYPE_OWN_SINGLE_CREATURE: {
                var promptPlayer_1 = sim.state.promptPlayer;
                var myCreatures = sim.getZone(const_1.ZONE_TYPE_IN_PLAY).cards
                    .filter(function (card) { return card.card.type === const_1.TYPE_CREATURE && sim.modifyByStaticAbilities(card, const_1.PROPERTY_CONTROLLER) === promptPlayer_1; });
                var simulationQueue_7 = [];
                // console.log(`My creatures for the prompt: ${myCreatures.map(creature=>`${creature.card.name}(${creature.id})`).join(' ')}`)
                myCreatures.forEach(function (creature) {
                    var innerSim = sim.clone();
                    var action = {
                        type: const_1.ACTION_RESOLVE_PROMPT,
                        // promptType: PROMPT_TYPE_OWN_SINGLE_CREATURE,
                        target: innerSim.getZone(const_1.ZONE_TYPE_IN_PLAY).byId(creature.id),
                        generatedBy: innerSim.state.promptGeneratedBy,
                        player: innerSim.state.promptPlayer,
                    };
                    simulationQueue_7.push({
                        sim: innerSim,
                        action: action,
                        actionLog: __spreadArray(__spreadArray([], actionLog, true), [{
                                action: action,
                                hash: previousHash,
                            }], false),
                        previousHash: previousHash,
                    });
                });
                return simulationQueue_7;
            }
            case const_1.PROMPT_TYPE_SINGLE_MAGI: {
                var myMagi = sim.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, playerId).card;
                var simulationQueue = [];
                if (myMagi) {
                    var innerSim = sim.clone();
                    var newMyMagi = innerSim.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, playerId).card;
                    if (newMyMagi) {
                        var action = {
                            type: const_1.ACTION_RESOLVE_PROMPT,
                            // promptType: PROMPT_TYPE_SINGLE_MAGI,
                            target: newMyMagi,
                            generatedBy: innerSim.state.promptGeneratedBy,
                            player: innerSim.state.promptPlayer,
                        };
                        simulationQueue.push({
                            sim: innerSim,
                            action: action,
                            actionLog: __spreadArray(__spreadArray([], actionLog, true), [{
                                    action: action,
                                    hash: previousHash,
                                }], false),
                            previousHash: previousHash,
                        });
                    }
                }
                var opponentMagi = sim.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, opponentId).card;
                if (opponentMagi) {
                    var innerSim = sim.clone();
                    var newOpponentMagi = innerSim.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, opponentId).card;
                    if (newOpponentMagi) {
                        var action = {
                            type: const_1.ACTION_RESOLVE_PROMPT,
                            // promptType: PROMPT_TYPE_SINGLE_MAGI,
                            target: newOpponentMagi,
                            generatedBy: innerSim.state.promptGeneratedBy,
                            player: innerSim.state.promptPlayer,
                        };
                        simulationQueue.push({
                            sim: innerSim,
                            action: action,
                            actionLog: __spreadArray(__spreadArray([], actionLog, true), [{
                                    action: action,
                                    hash: previousHash,
                                }], false),
                            previousHash: previousHash,
                        });
                    }
                }
                return simulationQueue;
            }
            // PROMPT_TYPE_POWER_ON_MAGI is not in PromptTypeType yet
            case const_2.PROMPT_TYPE_POWER_ON_MAGI: {
                var myMagi = sim.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, playerId).card;
                var simulationQueue = [];
                if (myMagi && myMagi.card.data.powers && myMagi.card.data.powers.length) {
                    var innerSim = sim.clone();
                    var newMyMagiPowers = (_d = (_c = (_b = (_a = innerSim.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, playerId)) === null || _a === void 0 ? void 0 : _a.card) === null || _b === void 0 ? void 0 : _b.card) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.powers;
                    if (newMyMagiPowers && newMyMagiPowers.length) {
                        var newMyMagiPower = newMyMagiPowers[0];
                        if (newMyMagiPower) {
                            var action = {
                                type: const_1.ACTION_RESOLVE_PROMPT,
                                // promptType: PROMPT_TYPE_MAGI_WITHOUT_CREATURES,
                                // @ts-ignore
                                power: newMyMagiPower,
                                generatedBy: innerSim.state.promptGeneratedBy,
                                player: innerSim.state.promptPlayer,
                            };
                            simulationQueue.push({
                                sim: innerSim,
                                action: action,
                                actionLog: __spreadArray(__spreadArray([], actionLog, true), [{
                                        action: action,
                                        hash: previousHash,
                                    }], false),
                                previousHash: previousHash,
                            });
                        }
                    }
                }
                return simulationQueue;
            }
            // Just so the bot won't stop if it encounters this prompt
            case const_2.PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE: {
                var simulationQueue = [];
                var innerSim = sim.clone();
                var action = {
                    type: const_1.ACTION_RESOLVE_PROMPT,
                    // promptType: PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE,
                    cardsOrder: ((_f = (_e = innerSim.state.promptParams) === null || _e === void 0 ? void 0 : _e.cards) === null || _f === void 0 ? void 0 : _f.map(function (_a) {
                        var id = _a.id;
                        return id;
                    })) || [],
                    generatedBy: innerSim.state.promptGeneratedBy,
                    player: innerSim.state.promptPlayer,
                };
                simulationQueue.push({
                    sim: innerSim,
                    action: action,
                    actionLog: __spreadArray(__spreadArray([], actionLog, true), [{
                            action: action,
                            hash: previousHash,
                        }], false),
                    previousHash: previousHash,
                });
                return simulationQueue;
            }
            case const_2.PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES: {
                var simulationQueue = [];
                var enemyCreatures = sim.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.filter(function (card) { return card.card.type === const_1.TYPE_CREATURE && sim.modifyByStaticAbilities(card, const_1.PROPERTY_CONTROLLER) === opponentId; });
                var ids = enemyCreatures.map(function (card) { return [card.id, card.data.energy]; });
                ids.sort(function (a, b) { return a[1] - b[1]; });
                var damageLeft = sim.state.promptParams.amount;
                if (typeof damageLeft == 'number') {
                    var damageMap = {};
                    var lastDamagedId = null;
                    while (damageLeft > 0 && ids.length) {
                        var creature = ids.shift();
                        var damageWeCanDeal = Math.min(creature[1], damageLeft);
                        lastDamagedId = creature[0];
                        damageMap[lastDamagedId] = damageWeCanDeal;
                        damageLeft -= damageWeCanDeal;
                    }
                    // Maybe we had more than enough damage for everyone?
                    // If so, pile the rest on the last creature
                    if (damageLeft > 0 && lastDamagedId) {
                        damageMap[lastDamagedId] = damageMap[lastDamagedId] + damageLeft;
                    }
                    var innerSim = sim.clone();
                    var action = {
                        type: const_1.ACTION_RESOLVE_PROMPT,
                        // promptType: PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES,
                        damageOnCreatures: damageMap,
                        generatedBy: innerSim.state.promptGeneratedBy,
                        player: innerSim.state.promptPlayer,
                    };
                    simulationQueue.push({
                        sim: innerSim,
                        action: action,
                        actionLog: __spreadArray(__spreadArray([], actionLog, true), [{
                                action: action,
                                hash: previousHash,
                            }], false),
                        previousHash: previousHash,
                    });
                }
                return simulationQueue;
            }
            case const_1.PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES: {
                var simulationQueue = [];
                var enemyCreatures = sim.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.filter(function (card) { return card.card.type === const_1.TYPE_CREATURE && sim.modifyByStaticAbilities(card, const_1.PROPERTY_CONTROLLER) === playerId; });
                var ids = enemyCreatures.map(function (card) { return [card.id, card.data.energy]; });
                ids.sort(function (a, b) { return a[1] - b[1]; });
                var energyLeft = sim.state.promptParams.amount;
                if (typeof energyLeft == 'number') {
                    var energyMap = {};
                    var lastEnergyId = null;
                    while (energyLeft > 0 && ids.length) {
                        var creature = ids.shift();
                        var energyWeCanGive = Math.min(creature[1], energyLeft);
                        lastEnergyId = creature[0];
                        energyMap[lastEnergyId] = energyWeCanGive;
                        energyLeft -= energyWeCanGive;
                    }
                    // Maybe we had more than enough energy for everyone?
                    // If so, pile the rest on the last creature
                    if (energyLeft > 0 && lastEnergyId) {
                        energyMap[lastEnergyId] = energyMap[lastEnergyId] + energyLeft;
                    }
                    var innerSim = sim.clone();
                    var action = {
                        type: const_1.ACTION_RESOLVE_PROMPT,
                        // promptType: PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES,
                        energyOnCreatures: energyMap,
                        generatedBy: innerSim.state.promptGeneratedBy,
                        player: innerSim.state.promptPlayer,
                    };
                    simulationQueue.push({
                        sim: innerSim,
                        action: action,
                        actionLog: __spreadArray(__spreadArray([], actionLog, true), [{
                                action: action,
                                hash: previousHash,
                            }], false),
                        previousHash: previousHash,
                    });
                }
                return simulationQueue;
            }
            case const_1.PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES: {
                var simulationQueue = [];
                var myCreatures = sim.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.filter(function (card) { return card.card.type === const_1.TYPE_CREATURE && sim.modifyByStaticAbilities(card, const_1.PROPERTY_CONTROLLER) === playerId; });
                var ids = myCreatures.map(function (card) { return [card.id, card.data.energy]; });
                var energyDistribution = Object.fromEntries(ids);
                var innerSim = sim.clone();
                var action = {
                    type: const_1.ACTION_RESOLVE_PROMPT,
                    // promptType: PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES,
                    energyOnCreatures: energyDistribution,
                    generatedBy: innerSim.state.promptGeneratedBy,
                    player: innerSim.state.promptPlayer,
                };
                simulationQueue.push({
                    sim: innerSim,
                    action: action,
                    actionLog: __spreadArray(__spreadArray([], actionLog, true), [{
                            action: action,
                            hash: previousHash,
                        }], false),
                    previousHash: previousHash,
                });
                return simulationQueue;
            }
            case const_2.PROMPT_TYPE_MAGI_WITHOUT_CREATURES: {
                var myMagi = sim.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, playerId).card;
                var iHaveCreatures = sim.useSelector(const_2.SELECTOR_CREATURES_OF_PLAYER, playerId).length > 0;
                var simulationQueue = [];
                if (myMagi && !iHaveCreatures) {
                    var innerSim = sim.clone();
                    var newMyMagi = innerSim.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, playerId).card;
                    if (newMyMagi) {
                        var action = {
                            type: const_1.ACTION_RESOLVE_PROMPT,
                            // promptType: PROMPT_TYPE_MAGI_WITHOUT_CREATURES,
                            target: newMyMagi,
                            generatedBy: innerSim.state.promptGeneratedBy,
                            player: innerSim.state.promptPlayer,
                        };
                        simulationQueue.push({
                            sim: innerSim,
                            action: action,
                            actionLog: __spreadArray(__spreadArray([], actionLog, true), [{
                                    action: action,
                                    hash: previousHash,
                                }], false),
                            previousHash: previousHash,
                        });
                    }
                }
                var opponentMagi = sim.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, opponentId).card;
                var opponentHasCreatures = sim.useSelector(const_2.SELECTOR_CREATURES_OF_PLAYER, opponentId).length > 0;
                if (opponentMagi && !opponentHasCreatures) {
                    var innerSim = sim.clone();
                    var newOpponentMagi = innerSim.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, opponentId).card;
                    if (newOpponentMagi) {
                        var action = {
                            type: const_1.ACTION_RESOLVE_PROMPT,
                            // promptType: PROMPT_TYPE_MAGI_WITHOUT_CREATURES,
                            target: newOpponentMagi,
                            generatedBy: innerSim.state.promptGeneratedBy,
                            player: innerSim.state.promptPlayer,
                        };
                        simulationQueue.push({
                            sim: innerSim,
                            action: action,
                            actionLog: __spreadArray(__spreadArray([], actionLog, true), [{
                                    action: action,
                                    hash: previousHash,
                                }], false),
                            previousHash: previousHash,
                        });
                    }
                }
                return simulationQueue;
            }
            case const_2.PROMPT_TYPE_PLAYER: {
                var simulationQueue = [];
                var innerSim = sim.clone();
                var action = {
                    type: const_1.ACTION_RESOLVE_PROMPT,
                    // promptType: PROMPT_TYPE_PLAYER,
                    targetPlayer: playerId,
                    generatedBy: innerSim.state.promptGeneratedBy,
                    player: innerSim.state.promptPlayer,
                };
                simulationQueue.push({
                    sim: innerSim,
                    action: action,
                    actionLog: __spreadArray(__spreadArray([], actionLog, true), [{
                            action: action,
                            hash: previousHash,
                        }], false),
                    previousHash: previousHash,
                });
                var oppInnerSim = sim.clone();
                var oppAction = {
                    type: const_1.ACTION_RESOLVE_PROMPT,
                    // promptType: PROMPT_TYPE_PLAYER,
                    targetPlayer: opponentId,
                    generatedBy: oppInnerSim.state.promptGeneratedBy,
                    player: oppInnerSim.state.promptPlayer,
                };
                simulationQueue.push({
                    sim: oppInnerSim,
                    action: oppAction,
                    actionLog: __spreadArray(__spreadArray([], actionLog, true), [{
                            action: oppAction,
                            hash: previousHash,
                        }], false),
                    previousHash: previousHash,
                });
                return simulationQueue;
            }
            case const_1.PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI: {
                var myMagi = sim.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, playerId).card;
                var simulationQueue_8 = [];
                if (myMagi) {
                    var innerSim = sim.clone();
                    var newMyMagi = innerSim.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, playerId).card;
                    if (newMyMagi) {
                        var action = {
                            type: const_1.ACTION_RESOLVE_PROMPT,
                            // promptType: PROMPT_TYPE_SINGLE_MAGI,
                            target: newMyMagi,
                            generatedBy: innerSim.state.promptGeneratedBy,
                            player: innerSim.state.promptPlayer,
                        };
                        simulationQueue_8.push({
                            sim: innerSim,
                            action: action,
                            actionLog: __spreadArray(__spreadArray([], actionLog, true), [{
                                    action: action,
                                    hash: previousHash,
                                }], false),
                            previousHash: previousHash,
                        });
                    }
                }
                var opponentMagi = sim.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, opponentId).card;
                if (opponentMagi) {
                    var innerSim = sim.clone();
                    var newOpponentMagi = innerSim.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, opponentId).card;
                    if (newOpponentMagi) {
                        var action = {
                            type: const_1.ACTION_RESOLVE_PROMPT,
                            // promptType: PROMPT_TYPE_SINGLE_MAGI,
                            target: newOpponentMagi,
                            generatedBy: innerSim.state.promptGeneratedBy,
                            player: innerSim.state.promptPlayer,
                        };
                        simulationQueue_8.push({
                            sim: innerSim,
                            action: action,
                            actionLog: __spreadArray(__spreadArray([], actionLog, true), [{
                                    action: action,
                                    hash: previousHash,
                                }], false),
                            previousHash: previousHash,
                        });
                    }
                }
                var allCreatures = sim.getZone(const_1.ZONE_TYPE_IN_PLAY).cards
                    .filter(function (card) { return card.card.type === const_1.TYPE_CREATURE; });
                allCreatures.forEach(function (creature) {
                    var innerSim = sim.clone();
                    var action = {
                        type: const_1.ACTION_RESOLVE_PROMPT,
                        // promptType: PROMPT_TYPE_OWN_SINGLE_CREATURE,
                        target: innerSim.getZone(const_1.ZONE_TYPE_IN_PLAY).byId(creature.id),
                        generatedBy: innerSim.state.promptGeneratedBy,
                        player: innerSim.state.promptPlayer,
                    };
                    simulationQueue_8.push({
                        sim: innerSim,
                        action: action,
                        actionLog: __spreadArray(__spreadArray([], actionLog, true), [{
                                action: action,
                                hash: previousHash,
                            }], false),
                        previousHash: previousHash,
                    });
                });
                return simulationQueue_8;
            }
            case const_2.PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE: {
                // const myMagi: CardInGame | null = sim.getZone(ZONE_TYPE_ACTIVE_MAGI, playerId).card
                var simulationQueue = [];
                if (sim.state.promptParams.zone) {
                    var zoneCards = sim.getZone(sim.state.promptParams.zone, sim.state.promptParams.zoneOwner).cards;
                    // console.log('PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE')
                    // We don't want to check all combinations, we can be asked to discard 3 cards from a hand of 13,
                    // and suddenly we're facing 286 branches on this prompt alone
                    // Sure, for more competitive bot I can add this, but for the start this will do
                    var promptCards = (sim.state.promptParams.numberOfCards || 1);
                    var numberOfVariants = Math.floor(zoneCards.length / promptCards);
                    for (var i = 0; i < numberOfVariants; i++) {
                        var innerSim = sim.clone();
                        var cards = innerSim.getZone(sim.state.promptParams.zone, sim.state.promptParams.zoneOwner).cards.slice(i * promptCards, promptCards);
                        var action = {
                            type: const_1.ACTION_RESOLVE_PROMPT,
                            // promptType: PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
                            cards: cards,
                            // @ts-ignore
                            zone: innerSim.state.promptParams.zone,
                            zoneOwner: innerSim.state.promptParams.zoneOwner,
                            generatedBy: innerSim.state.promptGeneratedBy,
                            player: innerSim.state.promptPlayer,
                        };
                        simulationQueue.push({
                            sim: innerSim,
                            action: action,
                            actionLog: __spreadArray(__spreadArray([], actionLog, true), [{
                                    action: action,
                                    hash: previousHash,
                                }], false),
                            previousHash: previousHash,
                        });
                    }
                }
                return simulationQueue;
            }
            case const_1.PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE: {
                var simulationQueue = [];
                if (sim.state.promptParams.zone) {
                    var zoneCards = sim.getZone(sim.state.promptParams.zone, sim.state.promptParams.zoneOwner).cards;
                    // console.log('PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE')
                    var promptCards = (sim.state.promptParams.numberOfCards || 1);
                    // const numberOfVariants = Math.floor(zoneCards.length / promptCards)
                    var upperBound = Math.min(promptCards, zoneCards.length);
                    for (var i = 0; i < upperBound; i++) {
                        var innerSim = sim.clone();
                        var cards = innerSim.getZone(sim.state.promptParams.zone, sim.state.promptParams.zoneOwner).cards.slice(0, i);
                        var action = {
                            type: const_1.ACTION_RESOLVE_PROMPT,
                            // promptType: PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
                            cards: cards,
                            generatedBy: innerSim.state.promptGeneratedBy,
                            player: innerSim.state.promptPlayer,
                        };
                        simulationQueue.push({
                            sim: innerSim,
                            action: action,
                            actionLog: __spreadArray(__spreadArray([], actionLog, true), [{
                                    action: action,
                                    hash: previousHash,
                                }], false),
                            previousHash: previousHash,
                        });
                    }
                }
                return simulationQueue;
            }
            case const_2.PROMPT_TYPE_PAYMENT_SOURCE: {
                var simulationQueue = [];
                if (sim.state.promptParams.cards) {
                    for (var _i = 0, _g = sim.state.promptParams.cards; _i < _g.length; _i++) {
                        var card = _g[_i];
                        var innerSim = sim.clone();
                        var foundCreatureCard = innerSim.getZone(const_1.ZONE_TYPE_IN_PLAY).byId(card.id);
                        var foundMagiCard = innerSim.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, sim.state.promptPlayer).byId(card.id);
                        var foundCard = foundCreatureCard || foundMagiCard;
                        if (foundCard) {
                            var action = {
                                type: const_1.ACTION_RESOLVE_PROMPT,
                                // promptType: PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
                                target: foundCard,
                                player: innerSim.state.promptPlayer,
                            };
                            simulationQueue.push({
                                sim: innerSim,
                                action: action,
                                actionLog: __spreadArray(__spreadArray([], actionLog, true), [{
                                        action: action,
                                        hash: previousHash,
                                    }], false),
                                previousHash: previousHash,
                            });
                        }
                    }
                }
                return simulationQueue;
            }
            default: {
                console.log("No handler for ".concat(sim.state.promptType, " prompt types"));
                return [];
            }
        }
    };
    ActionExtractor.getAllAttackPatterns = function (sim, attacker, opponent) {
        var creatures = sim.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.filter(function (card) { return card.card.type === const_1.TYPE_CREATURE; });
        var attackers = creatures.filter(function (card) { return sim.modifyByStaticAbilities(card, const_1.PROPERTY_CONTROLLER) === attacker && sim.modifyByStaticAbilities(card, const_1.PROPERTY_ABLE_TO_ATTACK) === true; });
        var defenders = creatures.filter(function (card) { return sim.modifyByStaticAbilities(card, const_1.PROPERTY_CONTROLLER) !== attacker && sim.modifyByStaticAbilities(card, const_1.PROPERTY_CAN_BE_ATTACKED) === true; });
        var allOpponentCreatures = creatures.filter(function (card) { return sim.modifyByStaticAbilities(card, const_1.PROPERTY_CONTROLLER) !== attacker; });
        var enemyMagi = sim.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, opponent).cards[0];
        var magiCanBeAttacked = sim.modifyByStaticAbilities(enemyMagi, const_1.PROPERTY_CAN_BE_ATTACKED);
        var result = [];
        var packHunters = attackers.filter(function (card) { return card.card.data.canPackHunt; });
        for (var _i = 0, attackers_1 = attackers; _i < attackers_1.length; _i++) {
            var attacker_1 = attackers_1[_i];
            var numberOfAttacks = sim.modifyByStaticAbilities(attacker_1, const_1.PROPERTY_ATTACKS_PER_TURN);
            if (attacker_1.data.attacked < numberOfAttacks) {
                if ((!allOpponentCreatures.length || attacker_1.card.data.canAttackMagiDirectly) && enemyMagi && enemyMagi.data.energy > 0 && magiCanBeAttacked) {
                    result.push({ from: attacker_1.id, to: enemyMagi.id });
                }
                for (var _a = 0, defenders_1 = defenders; _a < defenders_1.length; _a++) {
                    var defender = defenders_1[_a];
                    result.push({ from: attacker_1.id, to: defender.id });
                    for (var _b = 0, packHunters_1 = packHunters; _b < packHunters_1.length; _b++) {
                        var packHunter = packHunters_1[_b];
                        if (packHunter.id !== attacker_1.id) {
                            result.push({ from: attacker_1.id, add: packHunter.id, to: defender.id });
                        }
                    }
                }
            }
        }
        return result;
    };
    return ActionExtractor;
}());
exports.ActionExtractor = ActionExtractor;
