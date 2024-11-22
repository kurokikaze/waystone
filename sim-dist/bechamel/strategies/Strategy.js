import { ACTION_PASS } from "moonlands/dist/esm/const";
export class Strategy {
    constructor() { }
    setup(state, playerId) { }
    requestAction() { return { type: ACTION_PASS, player: 1 }; }
    requestHistory() { return []; }
}
