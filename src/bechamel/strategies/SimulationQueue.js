"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimulationQueue = void 0;
var ActionExtractor_1 = require("./ActionExtractor");
// This is for easier moving to the heap later
var SimulationQueue = /** @class */ (function () {
    function SimulationQueue() {
        this.queueStart = null;
    }
    SimulationQueue.prototype.addFromSim = function (sim, playerId, opponentId, actionLog, previousHash, hashBuilder) {
        this.push.apply(this, ActionExtractor_1.ActionExtractor.extractActions(sim, playerId, opponentId, actionLog, previousHash, hashBuilder));
    };
    SimulationQueue.prototype.push = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        for (var _a = 0, args_1 = args; _a < args_1.length; _a++) {
            var arg = args_1[_a];
            var newEntry = {
                entry: arg,
                next: this.queueStart
            };
            this.queueStart = newEntry;
        }
    };
    SimulationQueue.prototype.hasItems = function () {
        return this.queueStart !== null;
    };
    SimulationQueue.prototype.shift = function () {
        if (this.queueStart == null)
            return null;
        var _a = this.queueStart, entry = _a.entry, next = _a.next;
        this.queueStart = next;
        return entry;
    };
    return SimulationQueue;
}());
exports.SimulationQueue = SimulationQueue;
