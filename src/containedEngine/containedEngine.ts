import {State} from 'moonlands/dist/esm/index';

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
    attachedTo: {},
    cardsAttached: {}
  };

  const zones: any[] = []; //createZones(1, 2)
  const game = new State({
    ...defaultState,
    zones,
    activePlayer: 1,
  });

  // @ts-ignore
  game.initiatePRNG(Math.floor(Math.random() * 100));

  game.enableDebug();

  return game
}
