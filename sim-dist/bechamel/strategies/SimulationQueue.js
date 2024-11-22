import { ActionExtractor } from "./ActionExtractor.js";
// This is for easier moving to the heap later
export class SimulationQueue {
    queueStart = null;
    addFromSim(sim, playerId, opponentId, actionLog, previousHash, hashBuilder) {
        this.push(...ActionExtractor.extractActions(sim, playerId, opponentId, actionLog, previousHash, hashBuilder));
    }
    push(...args) {
        for (let arg of args) {
            const newEntry = {
                entry: arg,
                next: this.queueStart
            };
            this.queueStart = newEntry;
        }
    }
    hasItems() {
        return this.queueStart !== null;
    }
    shift() {
        if (this.queueStart == null)
            return null;
        const { entry, next } = this.queueStart;
        this.queueStart = next;
        return entry;
    }
}
