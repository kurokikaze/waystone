import { State } from 'moonlands/dist/esm';
import { ActionOnHold, SimulationEntity } from "../types";
import { HashBuilder } from "./HashBuilder";
import { ActionExtractor } from "./ActionExtractor";

type QueueEntry = {
    next: QueueEntry | null
    entry: SimulationEntity
}

// This is for easier moving to the heap later
export class SimulationQueue {
    private queueStart: QueueEntry | null = null;
    public addFromSim(sim: State, playerId: number, opponentId: number, actionLog: ActionOnHold[], previousHash: string, hashBuilder: HashBuilder) {
        this.push(...ActionExtractor.extractActions(sim, playerId, opponentId, actionLog, previousHash, hashBuilder))
    }

    public push(...args: SimulationEntity[]): void {
        for (let arg of args) {
            const newEntry = {
                entry: arg,
                next: this.queueStart
            }
            this.queueStart = newEntry
        }
    }
    public hasItems(): boolean {
        return this.queueStart !== null;
    }

    public shift(): SimulationEntity | null {
        if (this.queueStart == null) return null;
        const {entry, next} = this.queueStart;
        this.queueStart = next;

        return entry;
    }
}