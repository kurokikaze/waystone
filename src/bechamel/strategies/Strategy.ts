import { ACTION_PASS } from "moonlands/dist/esm/const";
import { C2SAction } from "../../clientProtocol";
import { GameState } from "../GameState";

export abstract class Strategy {
  constructor() {}
  public setup(state: GameState, playerId: number) {}
  public requestAction(): C2SAction { return {type: ACTION_PASS, player: 1}}
  public requestHistory(): any[] { return [] }
}