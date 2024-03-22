import {State, ZONE_TYPE_ACTIVE_MAGI, ZONE_TYPE_DECK, ZONE_TYPE_DEFEATED_MAGI, ZONE_TYPE_DISCARD, ZONE_TYPE_HAND, ZONE_TYPE_IN_PLAY, ZONE_TYPE_MAGI_PILE} from 'moonlands';
import Zone from 'moonlands/dist/classes/Zone';

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

  const createZones = (player1: number, player2: number) => [
    new Zone('Player 1 hand', ZONE_TYPE_HAND, player1),
    new Zone('Player 2 hand', ZONE_TYPE_HAND, player2),
    new Zone('Player 1 deck', ZONE_TYPE_DECK, player1),
    new Zone('Player 2 deck', ZONE_TYPE_DECK, player2),
    new Zone('Player 1 discard', ZONE_TYPE_DISCARD, player1),
    new Zone('Player 2 discard', ZONE_TYPE_DISCARD, player2),
    new Zone('Player 1 active magi', ZONE_TYPE_ACTIVE_MAGI, player1),
    new Zone('Player 2 active magi', ZONE_TYPE_ACTIVE_MAGI, player2),
    new Zone('Player 1 Magi pile', ZONE_TYPE_MAGI_PILE, player1),
    new Zone('Player 2 Magi pile', ZONE_TYPE_MAGI_PILE, player2),
    new Zone('Player 1 defeated Magi', ZONE_TYPE_DEFEATED_MAGI, player1),
    new Zone('Player 2 defeated Magi', ZONE_TYPE_DEFEATED_MAGI, player2),
    new Zone('In play', ZONE_TYPE_IN_PLAY, null),
  ];

  const zones: any[] = []; //createZones(1, 2)
  const game = new State({
    ...defaultState,
    zones,
    activePlayer: 1,
  });

  // @ts-ignore
  game.initiatePRNG(12345);
  // game.setPlayers(1, 2);
  // game.setup();
  game.enableDebug();

  return game
}
