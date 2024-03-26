import {State, ZONE_TYPE_ACTIVE_MAGI, ZONE_TYPE_DECK, ZONE_TYPE_DEFEATED_MAGI, ZONE_TYPE_DISCARD, ZONE_TYPE_HAND, ZONE_TYPE_IN_PLAY, ZONE_TYPE_MAGI_PILE} from 'moonlands';

export const createGame = (): State => {
  const defaultState = {
    actions: [],
    savedActions: [],
    delayedTriggers: [],
    mayEffectActions: [],
    fallbackActions: [],
    continuousEffects: [],
    activePlayer: 0,
    prompt: false,
    promptType: null,
    promptParams: {},
    log: [],
    step: 0,
    turn: 0,
    zones: [],
    players: [],
    spellMetaData: {},
  };

  const zones: any[] = []; //createZones(1, 2)
  const game = new State({
    ...defaultState,
    zones,
    activePlayer: 1,
  });

  // @ts-ignore
  game.initiatePRNG(3);

  game.enableDebug();

  return game
}
