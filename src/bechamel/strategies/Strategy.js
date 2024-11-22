"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Strategy = void 0;
var const_1 = require("moonlands/dist/esm/const");
var Strategy = /** @class */ (function () {
    function Strategy() {
    }
    Strategy.prototype.setup = function (state, playerId) { };
    Strategy.prototype.requestAction = function () { return { type: const_1.ACTION_PASS, player: 1 }; };
    Strategy.prototype.requestHistory = function () { return []; };
    return Strategy;
}());
exports.Strategy = Strategy;
