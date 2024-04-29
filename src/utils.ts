/* global window */
import { byName } from "moonlands/dist/cards.js";
import Card from "moonlands/dist/classes/Card";
import { ConvertedCard } from "moonlands/dist/classes/CardInGame";
import {
  PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES,
  PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES,
  PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES,
  TYPE_CREATURE,
} from "moonlands/dist/const";
import { ExtendedCard, State } from "./types";

export function camelCase(str: string): string {
  return str
    .replace(/'/g, "")
    .split(" ")
    .map(function (word, index) {
      // If it is the first word make sure to lowercase all the chars.
      if (index == 0) {
        return word.toLowerCase();
      }
      // If it is not the first word only upper case the first char and lowercase the rest.
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join("");
}

const onlyCardsWithStaticAbilities = (card: ConvertedCard) =>
  byName(card.card)?.data.staticAbilities;
const addCardData = (card: ConvertedCard): ExtendedCard => ({
  ...card,
  card: byName(card.card) as Card,
});

export function enrichState(state: State, playerId: number): State {
  const result = {
    ...state,
    staticAbilities: [
      ...state.zones.inPlay
        .filter(onlyCardsWithStaticAbilities)
        .map(addCardData),
      ...state.zones.playerActiveMagi
        .filter(onlyCardsWithStaticAbilities)
        .map(addCardData),
      ...state.zones.opponentActiveMagi
        .filter(onlyCardsWithStaticAbilities)
        .map(addCardData),
    ],
    packs: [],
    playerId,
  };

  const isOnRearrangeEnergyPrompt =
    state.prompt &&
    state.promptType === PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES;
  if (isOnRearrangeEnergyPrompt) {
    result.energyPrompt = {
      freeEnergy: 0,
      cards: Object.fromEntries(
        state.zones.inPlay
          .filter(
            ({ card, data }) =>
              data.controller === 1 && byName(card)?.type === TYPE_CREATURE,
          )
          .map(({ id, data }) => [id, data.energy]),
      ),
    };
  }
  const isOnDistributeEnergyPrompt =
    state.prompt &&
    state.promptType === PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES;
  if (isOnDistributeEnergyPrompt) {
    result.energyPrompt = {
      freeEnergy:
        typeof state.promptParams?.amount == "number"
          ? state.promptParams?.amount
          : 0,
      cards: Object.fromEntries(
        state.zones.inPlay
          .filter(
            ({ card, data }) =>
              data.controller === 1 && byName(card)?.type === TYPE_CREATURE,
          )
          .map(({ id }) => [id, 0]),
      ),
    };
  }
  const isOnDistributeDamagePrompt =
    state.prompt &&
    state.promptType === PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES;
  if (isOnDistributeDamagePrompt) {
    result.energyPrompt = {
      freeEnergy:
        typeof state.promptParams?.amount == "number"
          ? state.promptParams?.amount
          : 0,
      cards: Object.fromEntries(
        state.zones.inPlay
          .filter(({ card }) => byName(card)?.type === TYPE_CREATURE)
          .map(({ id }) => [id, 0]),
      ),
    };
  }
  return result;
}
