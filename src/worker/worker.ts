// @/src/worker/worker.ts

/// <reference lib="webworker" />
declare const self: DedicatedWorkerGlobalScope;

import { State } from 'moonlands';
import { AnyEffectType } from 'moonlands/dist/types';
import { COMMAND_START } from '../const';
import { createGame } from '../containedEngine/containedEngine';
import convertClientCommands, { convertServerCommand } from '../containedEngine/utils';
const caldDeck = [
	'Grega',
	'Magam',
	'Sinder',
	'Fire Chogo',
	'Fire Chogo',
	'Fire Chogo',
	'Fire Grag',
	'Fire Grag',
	'Fire Grag',
	'Arbolit',
	'Arbolit',
	'Arbolit',
	'Magma Hyren',
	'Magma Hyren',
	'Magma Hyren',
	'Quor',
	'Quor',
	'Quor',
	'Lava Aq',
	'Lava Aq',
	'Lava Aq',
	'Lava Arboll',
	'Lava Arboll',
	'Lava Arboll',
	'Diobor',
	'Diobor',
	'Diobor',
	'Drakan',
	'Drakan',
	'Drakan',
	'Thermal Blast',
	'Thermal Blast',
	'Thermal Blast',
	'Flame Geyser',
	'Flame Geyser',
	'Flame Geyser',
	'Cave Hyren',
	'Cave Hyren',
	'Cave Hyren',
	'Magma Armor',
	'Magma Armor',
	'Fire Flow',
	'Fire Flow',
];

const naroomDeck =[
	'Pruitt',
	'Poad',
	'Yaki',
	'Leaf Hyren',
	'Leaf Hyren',
	'Leaf Hyren',
	'Weebo',
	'Weebo',
	'Weebo',
	'Arboll',
	'Arboll',
	'Arboll',
	'Giant Carillion',
	'Giant Carillion',
	'Giant Carillion',
	'Giant Parathin',
	'Giant Parathin',
	'Giant Parathin',
	'Balamant',
	'Balamant',
	'Balamant',
	'Grow',
	'Grow',
	'Grow',
	'Giant Parathin',
	'Giant Parathin',
	'Giant Parathin',
	'Syphon Stone',
	'Syphon Stone',
	'Syphon Stone',
	'Carillion',
	'Carillion',
	'Carillion',
	'Rudwot',
	'Rudwot',
	'Rudwot',
	'Stagadan',
	'Stagadan',
	'Stagadan',
	'Robe of Vines',
	'Robe of Vines',
	'Robe of Vines',
	'Sea Barl',
];

var game: State | null = null;
onmessage = (event) => {
  if (event.data && event.data.type === COMMAND_START) {
    game = createGame();
    game.setPlayers(1,2);
    game.setDeck(1, event.data.playerDeck);
    game.setDeck(2, event.data.opponentDeck);
    game.setup();

    game.enableDebug();

    const actionCallback = (action: AnyEffectType) => {
      if (game) {
        const commandPlayerOne = convertServerCommand(action, game, 1);
        // console.log(JSON.parse(JSON.stringify(command)))
        if (commandPlayerOne) {
          try {
            postMessage({
              for: 1,
              action: commandPlayerOne,
            });
          } catch(_) {
            console.error('Error converting the server command')
            console.dir(commandPlayerOne)
          }
        }
        const commandPlayerTwo = convertServerCommand(action, game, 2);
        // console.log(JSON.parse(JSON.stringify(command)))
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
  } else if (event.data.special === 'refresh') {
    if (game) {
    const serializedState = game.serializeData(1);
      postMessage({
        for: 1,
        state: serializedState,
      });
    }
  } else if (event.data && 'type' in event.data) {
    if (game) {
      const convertedCommand = convertClientCommands({
        ...event.data,
        player: event.data.player,
      }, game);
      if (convertedCommand) {
        game?.update(convertedCommand);
        if (game.state.activePlayer === 2) {
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
