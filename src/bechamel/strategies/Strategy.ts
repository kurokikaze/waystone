import { ACTION_PASS } from "moonlands/dist/const";
import { C2SAction } from "../../clientProtocol";
import { GameState } from "../GameState";

export abstract class Strategy {
  constructor() {}
  public setup(state: GameState, playerId: number) {}
  public requestAction(): C2SAction { return {type: ACTION_PASS, player: 1}}
}