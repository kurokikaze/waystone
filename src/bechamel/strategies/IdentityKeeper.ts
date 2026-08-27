import { ACTION_EFFECT, State } from "moonlands/dist/esm";
import {EFFECT_TYPE_CARD_MOVED_BETWEEN_ZONES, ZONE_TYPE_HAND, ZONE_TYPE_IN_PLAY} from "moonlands/dist/esm/const";
export class IdentityKeeper {
  private creaturePlays: Record<string, string>
  constructor(sim: State) {
    this.creaturePlays = {};
    sim.setOnAction(action => {
      if (action.type === ACTION_EFFECT &&
        action.effectType === EFFECT_TYPE_CARD_MOVED_BETWEEN_ZONES &&
        action.sourceZone === ZONE_TYPE_HAND &&
        action.destinationZone === ZONE_TYPE_IN_PLAY
        ) {
          this.creaturePlays[action.sourceCard.id] = action.destinationCard.id;
      }
    });
  }
}
