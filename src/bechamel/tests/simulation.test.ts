// globals describe, it
import { ACTION_PLAY, ACTION_PLAYER_WINS, State } from 'moonlands/src'
import { byName } from 'moonlands/src/cards';
import Card from 'moonlands/src/classes/Card';
import CardInGame from 'moonlands/src/classes/CardInGame';
import { SimulationStrategy } from '../strategies/SimulationStrategy'
import { GameState } from '../GameState';
import { createZones } from '../strategies/simulationUtils';
import { SerializedClientState } from '../types';
import { ACTION_ATTACK, ACTION_EFFECT, EFFECT_TYPE_DRAW, EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES, ZONE_TYPE_ACTIVE_MAGI, ZONE_TYPE_HAND } from 'moonlands';
import { createGame } from '../../containedEngine/containedEngine';
import { StrategyConnector } from '../StrategyConnector';
import { AnyEffectType } from 'moonlands/dist/types';
import convertClientCommands, { convertServerCommand } from '../../containedEngine/utils';

const STEP_NAME = {
  ENERGIZE: 0,
  PRS1: 1,
  ATTACK: 2,
  CREATURES: 3,
  PRS2: 4,
  DRAW: 5,
}

describe('Simulations', () => {
  it('test', () => {
    const ACTIVE_PLAYER = 422;
    const NON_ACTIVE_PLAYER = 1310;

    const weebo = new CardInGame(byName('Weebo') as Card, ACTIVE_PLAYER).addEnergy(1);
    const timberHyren = new CardInGame(byName('Timber Hyren') as Card, ACTIVE_PLAYER).addEnergy(6);
    const weebo2 = new CardInGame(byName('Weebo') as Card, ACTIVE_PLAYER).addEnergy(1);
    const carillion = new CardInGame(byName('Carillion') as Card, ACTIVE_PLAYER).addEnergy(3);
    const lavaBalamant = new CardInGame(byName('Lava Balamant') as Card, NON_ACTIVE_PLAYER).addEnergy(5);
    const kelthet = new CardInGame(byName('Kelthet') as Card, NON_ACTIVE_PLAYER).addEnergy(4);
    const lavaAq = new CardInGame(byName('Lava Aq') as Card, NON_ACTIVE_PLAYER).addEnergy(2);
    const pruitt = new CardInGame(byName('Pruitt') as Card, ACTIVE_PLAYER).addEnergy(5);
    const magam = new CardInGame(byName('Magam') as Card, ACTIVE_PLAYER).addEnergy(4);
    const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [weebo, timberHyren, weebo2, carillion, lavaBalamant, kelthet, lavaAq]);

    // @ts-ignore
    const gameState = new State({
      zones,
      step: STEP_NAME.PRS1,
      activePlayer: ACTIVE_PLAYER,
    });

    gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

    gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([pruitt]);
    gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([magam]);

    const serializedState = gameState.serializeData(ACTIVE_PLAYER) as SerializedClientState

    const stateRepresentation = new GameState(serializedState)
    stateRepresentation.setPlayerId(ACTIVE_PLAYER)

    const strategy = new SimulationStrategy()

    strategy.setup(stateRepresentation, ACTIVE_PLAYER)

    // console.dir(strategy.requestAction())
  })

  it('Killing Adis', () => {
    const ACTIVE_PLAYER = 422;
    const NON_ACTIVE_PLAYER = 1310;

    const weebo = new CardInGame(byName('Weebo') as Card, ACTIVE_PLAYER).addEnergy(1);
    const timberHyren = new CardInGame(byName('Timber Hyren') as Card, ACTIVE_PLAYER).addEnergy(6);
    const weebo2 = new CardInGame(byName('Weebo') as Card, ACTIVE_PLAYER).addEnergy(1);
    const carillion = new CardInGame(byName('Carillion') as Card, ACTIVE_PLAYER).addEnergy(3);
    // const gumGum = new CardInGame(byName('Gum-Gum') as Card, NON_ACTIVE_PLAYER).addEnergy(4);
    const pruitt = new CardInGame(byName('Pruitt') as Card, ACTIVE_PLAYER).addEnergy(5);
    const adis = new CardInGame(byName('Adis') as Card, NON_ACTIVE_PLAYER).addEnergy(4);
    const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [weebo, timberHyren, weebo2, carillion]);

    // @ts-ignore
    const gameState = new State({
      zones,
      step: STEP_NAME.ATTACK,
      activePlayer: ACTIVE_PLAYER,
    });

    gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

    gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([pruitt]);
    gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([adis]);

    const serializedState = gameState.serializeData(ACTIVE_PLAYER) as SerializedClientState

    // console.dir(serializedState.zones.opponentActiveMagi)
    const stateRepresentation = new GameState(serializedState)
    stateRepresentation.setPlayerId(ACTIVE_PLAYER)

    const strategy = new SimulationStrategy()

    strategy.setup(stateRepresentation, ACTIVE_PLAYER)

    const action = strategy.requestAction();

    expect(action.type).toEqual(ACTION_ATTACK);
    // Not sure why expect does not filter out other C2S actions
    if (action.type === ACTION_ATTACK) {
      expect(action.target).toEqual(adis.id);
    }
  })
})

describe('Simulations', () => {
  it.only('Cald vs Naroom', (done) => {
    const deckOne = [
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
      'Water of Life',
      'Dream Balm',
      'Dream Balm',
      'Magma Armor',
      'Magma Armor',
      'Water of Life',
      'Water of Life'
    ];

    const deckTwo = [
      'Adis',
      'Tryn',
      'Yaki',
      'Bhatar',
      'Timber Hyren',
      'Twee',
      'Balamant Pup',
      'Balamant Pup',
      'Balamant Pup',
      'Rudwot',
      'Rudwot',
      'Arboll',
      'Arboll',
      'Carillion',
      'Carillion',
      'Carillion',
      'Furok',
      'Furok',
      'Leaf Hyren',
      'Leaf Hyren',
      'Plith',
      'Plith',
      'Weebo',
      'Weebo',
      'Ancestral Flute',
      'Ancestral Flute',
      'Ancestral Flute',
      'Robe of Vines',
      'Robe of Vines',
      'Water of Life',
      'Water of Life',
      "Hyren's Call",
      "Orwin's Gaze",
      "Orwin's Gaze",
      'Vortex of Knowledge',
      'Vortex of Knowledge',
      'Grow',
      'Grow',
      'Grow',
      'Giant Carillion',
      'Giant Carillion',
      'Giant Carillion',
      'Weebo'
    ]

    const game = createGame()
    game.setPlayers(1, 2);
    game.setDeck(1, deckOne);
    game.setDeck(2, deckTwo);

    // @ts-ignore
    game.initiatePRNG(12345);
    game.setup();

    // @ts-ignore
    // console.dir(game.twister);
    game.enableDebug();

    let gameDataCallbackOne: Function = () => { };
    let actionCallbackOne: Function = () => { };

    let gameDataCallbackTwo: Function = () => { };
    let actionCallbackTwo: Function = () => { };

    const connectorOne = {
      on: (type: string, callback: Function) => {
        if (type == 'gameData') {
          gameDataCallbackOne = callback;
        } else if (type == 'action') {
          actionCallbackOne = callback;
        }
      },
      emit: (type: string, action: any) => {
        // console.log(`Connector one emitting "${type}"`)
        // console.dir(action);
        if (type === 'clientAction') {
          const convertedCommand = convertClientCommands({
            ...action,
            player: 1,
          }, game);
          if (convertedCommand) {
            if (convertedCommand.type === ACTION_PLAY && 'payload' in convertedCommand && !convertedCommand.payload.card) {
              console.log(`Cannot convert ACTION_PLAY command, source card: ${action.payload.card.name} [${action.payload.card.id}]`)
              console.dir(action?.payload?.card);
              debugger;
              expect(true).toEqual(false);
            }
            game.update(convertedCommand);
            const activePlayer = game.state.prompt ? game.state.promptPlayer : game.state.activePlayer;
            if (activePlayer === 1) {
              // Support bechamel with the priority events
              // setTimeout(() => {
              actionCallbackOne({
                type: 'display/priority',
                player: 1,
              })
              // }, 0);
            } else if (activePlayer === 2) {
              // setTimeout(() => {
              actionCallbackTwo({
                type: 'display/priority',
                player: 2,
              })
              // }, 0);
            }
          }
        }
      },
      close: () => {
        // console.log(`Closing the connection`);
      }
    }

    const connectorTwo = {
      on: (type: string, callback: Function) => {
        if (type == 'gameData') {
          gameDataCallbackTwo = callback;
        } else if (type == 'action') {
          actionCallbackTwo = callback;
        }
      },
      emit: (_type: string, action: any) => {
        const convertedCommand = convertClientCommands({
          ...action,
          player: 2,
        }, game);
        if (convertedCommand) {
          if (convertedCommand.type === ACTION_PLAY && 'payload' in convertedCommand && !convertedCommand.payload.card) {
            console.error(`Cannot convert ACTION_PLAY command, source card: ${action.payload.card.card} [${action.payload.card.id}]`)
            console.log(game.getZone(ZONE_TYPE_HAND, 2).cards.map(card => `[${card.id}] ${card.card.name}`).join(', '))
            console.dir(action?.payload?.card);
            expect(true).toEqual(false);
          }
          game.update(convertedCommand);
          const activePlayer = game.state.prompt ? game.state.promptPlayer : game.state.activePlayer;
          if (activePlayer === 1) {
            // Support bechamel with the priority events
            // setTimeout(() => {
            actionCallbackOne({
              type: 'display/priority',
              player: 1,
            })
            // }, 0);
          } else if (activePlayer === 2) {
            // setTimeout(() => {
            actionCallbackTwo({
              type: 'display/priority',
              player: 2,
            })
            // }, 0)
          }
        }
      },
      close: () => {
        // console.log(`Closing the connection`);
      }
    }

    const strategyConnectorOne = new StrategyConnector(connectorOne);
    strategyConnectorOne.connect(new SimulationStrategy())
    const strategyConnectorTwo = new StrategyConnector(connectorTwo);
    strategyConnectorTwo.connect(new SimulationStrategy())

    game.debug = false;
    game.setOnAction((action: AnyEffectType) => {
      // console.log(`Action from an engine`);
      // console.dir(action);

      if (action.type === ACTION_EFFECT && action.effectType === EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES && action.destinationZone === ZONE_TYPE_HAND) {
        // @ts-ignore
        // if (typeof action.target == 'string') {
        //   console.log(`Drawing a card "${action.target}"`);
        // } else {
        //   console.log(`Drawing a card ${action.target.card.name} [${action.target.id}]`);
        // }
      }
      // try {
      const commandForBotOne = convertServerCommand(action, game, 1);
      actionCallbackOne(commandForBotOne);
      // } catch(e) {
      //   console.log(`Error converting command`)
      //   console.dir(action);
      //   throw e;
      // }

      try {
        const commandForBotTwo = convertServerCommand(action, game, 2);
        actionCallbackTwo(commandForBotTwo);
      } catch (e) {
        console.log(`Error converting command`)
        console.dir(action);
        throw e;
      }

      if (action.type === ACTION_PLAYER_WINS) {
        done();
      }
    });

    gameDataCallbackOne({ playerId: 1, state: game.serializeData(1) })
    gameDataCallbackTwo({ playerId: 2, state: game.serializeData(2) })
  });

  it('Cald vs GumGums', (done) => {
    const deckOne = [
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
      'Water of Life',
      'Dream Balm',
      'Dream Balm',
      'Magma Armor',
      'Magma Armor',
      'Water of Life',
      'Water of Life'
    ];

    const deckTwo = [
      'Evu',
      'Tryn',
      'Yaki',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      "Gum-Gum",
      "Gum-Gum",
      "Gum-Gum",
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum'
    ]

    const game = createGame()
    game.setPlayers(1, 2);
    game.setDeck(1, deckOne);
    game.setDeck(2, deckTwo);

    // @ts-ignore
    game.initiatePRNG(2);
    game.setup();

    let gameDataCallbackOne: Function = () => { };
    let actionCallbackOne: Function = () => { };

    let gameDataCallbackTwo: Function = () => { };
    let actionCallbackTwo: Function = () => { };

    const connectorOne = {
      on: (type: string, callback: Function) => {
        if (type == 'gameData') {
          gameDataCallbackOne = callback;
        } else if (type == 'action') {
          actionCallbackOne = callback;
        }
      },
      emit: (type: string, action: any) => {
        // console.log(`Connector one emitting "${type}"`)
        // console.dir(action);
        if (type === 'clientAction') {
          const convertedCommand = convertClientCommands({
            ...action,
            player: 1,
          }, game);
          if (convertedCommand) {
            if (convertedCommand.type === ACTION_PLAY && 'payload' in convertedCommand && !convertedCommand.payload.card) {
              console.log(`Cannot convert ACTION_PLAY command, source card: ${action.payload.card.name} [${action.payload.card.id}]`)
              console.dir(action?.payload?.card);
              debugger;
              expect(true).toEqual(false);
            }

            game.update(convertedCommand);
            const activePlayer = game.state.prompt ? game.state.promptPlayer : game.state.activePlayer;
            if (activePlayer === 1) {
              // Support bechamel with the priority events
              // setTimeout(() => {
              actionCallbackOne({
                type: 'display/priority',
                player: 1,
              })
              // }, 0);
            } else if (activePlayer === 2) {
              // setTimeout(() => {
              actionCallbackTwo({
                type: 'display/priority',
                player: 2,
              })
              // }, 0);
            }
          }
        }
      },
      close: () => {
        // console.log(`Closing the connection`);
      }
    }

    const connectorTwo = {
      on: (type: string, callback: Function) => {
        if (type == 'gameData') {
          gameDataCallbackTwo = callback;
        } else if (type == 'action') {
          actionCallbackTwo = callback;
        }
      },
      emit: (_type: string, action: any) => {
        const convertedCommand = convertClientCommands({
          ...action,
          player: 2,
        }, game);
        if (convertedCommand) {
          if (convertedCommand.type === ACTION_PLAY && 'payload' in convertedCommand && !convertedCommand.payload.card) {
            console.error(`Cannot convert ACTION_PLAY command, source card: ${action.payload.card.card} [${action.payload.card.id}]`)
            console.log(game.getZone(ZONE_TYPE_HAND, 2).cards.map(card => `[${card.id}] ${card.card.name}`).join(', '))
            console.dir(action?.payload?.card);
            expect(true).toEqual(false);
          }
          game.update(convertedCommand);
          const activePlayer = game.state.prompt ? game.state.promptPlayer : game.state.activePlayer;
          if (activePlayer === 1) {
            // Support bechamel with the priority events
            // setTimeout(() => {
            actionCallbackOne({
              type: 'display/priority',
              player: 1,
            })
            // }, 0);
          } else if (activePlayer === 2) {
            // setTimeout(() => {
            actionCallbackTwo({
              type: 'display/priority',
              player: 2,
            })
            // }, 0)
          }
        }
      },
      close: () => {
        // console.log(`Closing the connection`);
      }
    }

    const strategyConnectorOne = new StrategyConnector(connectorOne);
    strategyConnectorOne.connect(new SimulationStrategy())
    const strategyConnectorTwo = new StrategyConnector(connectorTwo);
    strategyConnectorTwo.connect(new SimulationStrategy())

    game.debug = true;
    game.setOnAction((action: AnyEffectType) => {
      // console.log(`Action from an engine`);
      // console.dir(action);

      // if (action.type === ACTION_EFFECT && action.effectType === EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES && action.destinationZone === ZONE_TYPE_HAND) {
        // @ts-ignore
        // if (typeof action.target == 'string') {
        //   console.log(`Drawing a card "${action.target}"`);
        // } else {
        //   console.log(`Drawing a card ${action.target.card.name} [${action.target.id}]`);
        // }
      // }
      // try {
      const commandForBotOne = convertServerCommand(action, game, 1);
      actionCallbackOne(commandForBotOne);
      // } catch(e) {
      //   console.log(`Error converting command`)
      //   console.dir(action);
      //   throw e;
      // }

      try {
        const commandForBotTwo = convertServerCommand(action, game, 2);
        actionCallbackTwo(commandForBotTwo);
      } catch (e) {
        console.log(`Error converting command`)
        console.dir(action);
        throw e;
      }

      if (action.type === ACTION_PLAYER_WINS) {
        done();
      }
    });

    gameDataCallbackOne({ playerId: 1, state: game.serializeData(1) })
    gameDataCallbackTwo({ playerId: 2, state: game.serializeData(2) })
  });
})

