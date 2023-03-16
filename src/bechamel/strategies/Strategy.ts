import { GameState } from "../GameState";

export abstract class Strategy {
  constructor() {}
  public setup(state: GameState, playerId: number) {}
  public requestAction(): any {}
}