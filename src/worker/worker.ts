// @/src/worker/worker.ts

/// <reference lib="webworker" />
declare const self: DedicatedWorkerGlobalScope;

import { ACTION_PLAYER_WINS, State } from 'moonlands/src/index';
import { AnyEffectType } from 'moonlands/src/types';
import { COMMAND_START } from '../const';
import { createGame } from '../containedEngine/containedEngine';
import convertClientCommands, { convertServerCommand } from '../containedEngine/utils';

var game: State | null = null;
onmessage = (event) => {
  if (event.data && event.data.type === COMMAND_START) {
    game = createGame();
    game.setPlayers(1,2);
    game.setDeck(1, event.data.playerDeck);
    game.setDeck(2, event.data.opponentDeck);
    game.setup();

    let closing = false;

    const actionCallback = (action: AnyEffectType) => {
      if (game) {
        const commandPlayerOne = convertServerCommand(action, game, 1);

        if (commandPlayerOne) {
          try {
            postMessage({
              for: 1,
              action: commandPlayerOne,
            });
          } catch(err) {
            console.error('Error converting the server command')
            console.dir(err)
            console.dir(commandPlayerOne)
          }
        }
        const commandPlayerTwo = convertServerCommand(action, game, 2);

        if (commandPlayerTwo) {
          try {
            postMessage({
              for: 2,
              action: commandPlayerTwo,
            });
          } catch (e) {
            console.error('Error converting the server command')
            console.dir(commandPlayerTwo)
          }
        }

        if (action.type === ACTION_PLAYER_WINS && !closing) {
          // Just in case there are additional actions
          setTimeout(() => close(), 500);
          closing = true;
        }
      }
    }
    game.setOnAction(actionCallback);
  
    const serializedState = game.serializeData(1);
    postMessage({
      for: 1,
      state: serializedState,
    });
    const serializedStateTwo = game.serializeData(2);
    postMessage({
      for: 2,
      state: serializedStateTwo,
    });
  } else if (event.data && event.data.special === 'refresh') {
    if (game) {
    const serializedState = game.serializeData(1);
      postMessage({
        for: 1,
        state: serializedState,
      });
    }
  } else if (event.data && event.data.special === 'status') {
    console.log(`Caught status in the worker, re-sending for the bot`)
    console.dir({
      type: 'display/status'
    })
    postMessage({
      for: 2,
      action: {
        type: 'display/status',
        player: 2,
      },
    });
  } else if (event.data && 'type' in event.data) {
    if (game) {
      const convertedCommand = convertClientCommands({
        ...event.data,
        player: event.data.player,
      }, game);
      if (convertedCommand) {
        game?.update(convertedCommand);
        const activePlayer = game.state.prompt ? game.state.promptPlayer : game.state.activePlayer;
        if (activePlayer === 2) {
          // Support bechamel with the priority events
          postMessage({
            for: 2,
            action: {
              type: 'display/priority',
              player: 2,
            },
          })
        }
      }
    }
  }
  return true;
}
