import { State } from "moonlands/src/index";
import { ActionOnHold, SimulationEntity } from "../types";
import { HashBuilder } from "./HashBuilder";
import { ActionExtractor } from "./ActionExtractor";

// This is for easier moving to the heap later
export class SimulationQueue {
  private queue: Array<SimulationEntity> = [];
  public addFromSim(
    sim: State,
    playerId: number,
    opponentId: number,
    actionLog: ActionOnHold[],
    previousHash: string,
    hashBuilder: HashBuilder,
  ) {
    this.queue.push(
      ...ActionExtractor.extractActions(
        sim,
        playerId,
        opponentId,
        actionLog,
        previousHash,
        hashBuilder,
      ),
    );
  }

  public hasItems(): boolean {
    return this.queue.length > 0;
  }

  public get(): SimulationEntity | null {
    return this.queue.shift() || null;
  }
}
