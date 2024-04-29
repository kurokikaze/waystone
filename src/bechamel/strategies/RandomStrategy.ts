// @ts-nocheck
import { byName } from "moonlands/dist/cards";

import {
  ACTION_ATTACK,
  ACTION_PASS,
  ACTION_PLAY,
  ACTION_POWER,
  ACTION_RESOLVE_PROMPT,
  PROMPT_TYPE_CHOOSE_CARDS,
  TYPE_CREATURE,
  TYPE_RELIC,
} from "../const";
import { GameState } from "../GameState";
import { Strategy } from "./Strategy";

export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  waitFor: number,
) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<F>): Promise<ReturnType<F>> =>
    new Promise((resolve) => {
      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => resolve(func(...args)), waitFor);
    });
};

const STEP_NAME = {
  ENERGIZE: 0,
  PRS1: 1,
  ATTACK: 2,
  CREATURES: 3,
  PRS2: 4,
  DRAW: 5,
};

const addCardData = (card: any) => ({
  ...card,
  _card: byName(card.card),
});

export class RandomStrategy implements Strategy {
  public static deckId = "5f60e45e11283f7c98d9259b";

  private waitingTarget?: {
    source: string;
    target: string;
  };

  private playerId?: number;
  private gameState?: GameState;

  constructor() {}

  public setup(state: GameState, playerId: number) {
    this.gameState = state;
    this.playerId = playerId;
  }

  private pass(): any {
    return {
      type: ACTION_PASS,
      player: this.playerId,
    };
  }

  private play(cardId: string): any {
    return {
      type: ACTION_PLAY,
      payload: {
        card: cardId,
        player: this.playerId,
      },
    };
  }

  private attack(from: string, to: string): any {
    return {
      type: ACTION_ATTACK,
      source: from,
      target: to,
      player: this.playerId,
    };
  }

  private power(source: string, power: string) {
    return {
      type: ACTION_POWER,
      source,
      power,
      player: this.playerId,
    };
  }

  private resolvePrompt(target: string) {
    return {
      type: ACTION_RESOLVE_PROMPT,
      promptType: this.gameState?.getPromptType(),
      target,
      player: this.playerId,
    };
  }

  public requestAction() {
    if (this.gameState && this.playerId) {
      if (this.gameState.waitingForCardSelection()) {
        return {
          type: ACTION_RESOLVE_PROMPT,
          promptType: PROMPT_TYPE_CHOOSE_CARDS,
          cards: this.gameState.getStartingCards(),
          player: this.playerId,
        };
      }

      if (
        this.waitingTarget &&
        this.gameState.waitingForTarget(
          this.waitingTarget.source,
          this.playerId,
        )
      ) {
        return this.resolvePrompt(this.waitingTarget.target);
      }

      if (this.gameState.playerPriority(this.playerId)) {
        const step = this.gameState.getStep();
        switch (step) {
          case STEP_NAME.PRS1: {
            const playable = this.gameState
              .getPlayableCards()
              .map(addCardData)
              .filter((card: any) => card._card.type === TYPE_RELIC);
            const relics = this.gameState
              .getMyRelicsInPlay()
              .map((card) => card._card.name);

            if (playable.some((card) => !relics.includes(card._card.name))) {
              const playableRelic = playable.find(
                (card) => !relics.includes(card._card.name),
              );
              if (playableRelic) {
                this.play(playableRelic?.id);
              }
              return this.pass();
            }
            return this.pass();
          }
          case STEP_NAME.PRS2: {
            const relics = this.gameState.getMyRelicsInPlay();
            const enemyCreatures = this.gameState.getEnemyCreaturesInPlay();

            if (
              relics.some((card) => card.card === "Siphon Stone") &&
              enemyCreatures.some((card) => card.data.energy === 1)
            ) {
              const stone = relics.find((card) => card.card === "Siphon Stone");
              const target = enemyCreatures.find(
                (card) => card.data.energy === 1,
              ) || { id: "wrong target" };
              stone._card = byName("Siphon Stone");

              this.waitingTarget = { source: stone.id, target: target.id };
              return this.power(stone.id, stone._card.data.powers[0].name);
            } else {
              const ourMagi = this.gameState.getMyMagi();
              switch (ourMagi.card) {
                case "Pruitt": {
                  const ourCreatures = [
                    ...this.gameState.getMyCreaturesInPlay(),
                  ];
                  if (
                    ourCreatures.length > 0 &&
                    ourMagi.data.energy >= 2 &&
                    !ourMagi.data.actionsUsed.includes("Refresh")
                  ) {
                    ourCreatures.sort((a, b) => a.data.energy - b.data.energy);
                    this.waitingTarget = {
                      source: ourMagi.id,
                      target: ourCreatures[0].id,
                    };
                    return this.power(ourMagi.id, "Refresh");
                  }
                  return this.pass();
                }
                case "Poad": {
                  const ourCreatures = this.gameState.getMyCreaturesInPlay();
                  if (
                    ourCreatures.length > 2 &&
                    ourMagi.data.energy >= 2 &&
                    !ourMagi.data.actionsUsed.includes("Heroes' Feast")
                  ) {
                    return this.power(ourMagi.id, "Heroes' Feast");
                  }
                  return this.pass();
                }
                default: {
                  return this.pass();
                }
              }
            }
          }
          case STEP_NAME.CREATURES: {
            const myMagi = this.gameState.getMyMagi();
            console.log("myMagi");
            console.dir(myMagi);
            const cardObj = byName(myMagi.card);
            const availableEnergy = myMagi.data.energy;
            const playable = this.gameState
              .getPlayableCards()
              .map(addCardData)
              .filter((card) => {
                const regionTax = cardObj.region === card._card.region ? 0 : 1;
                return (
                  card._card.type === TYPE_CREATURE &&
                  card._card.cost &&
                  card._card.cost + regionTax <= availableEnergy
                );
              });
            if (playable.length) {
              const playableCreature = playable[0];
              return this.play(playableCreature.id);
            }
            return this.pass();
          }
          case STEP_NAME.ATTACK: {
            const myMagi = this.gameState.getMyMagi();
            const myCreatures = this.gameState
              .getMyCreaturesInPlay()
              .filter((creature) => {
                const numberOfAttacks =
                  myMagi.card === "Yaki"
                    ? 2
                    : creature._card.data.attacksPerTurn || 1;
                return creature.data.attacked < numberOfAttacks;
              });
            const enemyCreatures = this.gameState.getEnemyCreaturesInPlay();
            const opponentMagi = this.gameState.getOpponentMagi();
            if (myCreatures.length) {
              const randomValue = 0.5; // Math.random()
              const randomMy =
                myCreatures[Math.floor(randomValue * myCreatures.length)];
              if (enemyCreatures.length) {
                const randomOpponent =
                  enemyCreatures[
                    Math.floor(randomValue * enemyCreatures.length)
                  ];
                if (
                  randomMy._card?.data.canAttackMagiDirectly &&
                  randomMy.data.energy <= opponentMagi.data.energy
                ) {
                  return this.attack(randomMy.id, opponentMagi.id);
                } else {
                  return this.attack(randomMy.id, randomOpponent.id);
                }
              } else if (opponentMagi.id) {
                return this.attack(randomMy.id, opponentMagi.id);
              }
              return this.pass();
            }
            return this.pass();
          }
          default:
            return this.pass();
        }
      }
    }
  }
}
