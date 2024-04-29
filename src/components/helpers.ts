import { ConvertedCard } from "moonlands/dist/classes/CardInGame";
import { TYPE_CREATURE, TYPE_MAGI } from "moonlands/dist/const.js";
import { DraggedItem, SecondCard } from "../types";

export function canFirstAttackSecond(first: DraggedItem, second: SecondCard) {
  return (
    (first.data.controller !== second.data.controller &&
      second.card.type === TYPE_CREATURE) ||
    (second.card.type === TYPE_MAGI && !second.guarded) ||
    (second.card.type === TYPE_MAGI && first.card.data.canAttackMagiDirectly)
  );
}

export function canPackHuntWith(first: DraggedItem, second: SecondCard) {
  return (
    first.card.data.canPackHunt &&
    first.id !== second.id && // sadly being both drop source and target can sometimes cause this
    first.data.attacked < 1 && // actually should be < modifiedData.numberOfAttacks
    second.data.attacked < 1
  ); // actually should be < modifiedData.numberOfAttacks
}
