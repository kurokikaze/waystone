import { ACTION_PLAY, ACTION_PLAYER_WINS, State } from 'moonlands/dist/esm/index'
import { SimulationStrategy } from '../strategies/SimulationStrategy'
import { ZONE_TYPE_ACTIVE_MAGI, ZONE_TYPE_HAND, ZONE_TYPE_IN_PLAY, ZONE_TYPE_MAGI_PILE } from 'moonlands/dist/esm/const';
import { createGame } from '../../containedEngine/containedEngine';
import { StrategyConnector } from '../StrategyConnector';
import { AnyEffectType } from 'moonlands/dist/esm/types';
import convertClientCommands, { convertServerCommand } from '../../containedEngine/utils';
import { Socket } from 'socket.io-client';

import * as fs from 'node:fs';

const deckOne = [
    'Motash',
    'Strag',
    'Ulk',
    'Water of Life',
    'Water of Life',
    'Water of Life',
    'Dream Balm',
    'Dream Balm',
    'Dream Balm',
    'Korrit',
    'Korrit',
    'Korrit',
    'Giant Korrit',
    'Giant Korrit',
    'Giant Korrit',
    'Pack Korrit',
    'Pack Korrit',
    'Pack Korrit',
    'Staff of Korrits',
    'Staff of Korrits',
    'Staff of Korrits',
    'Crystal Arboll',
    'Crystal Arboll',
    'Crystal Arboll',
    'Bottomless Pit',
    'Bottomless Pit',
    'Bottomless Pit',
    'Pharan',
    'Pharan',
    'Pharan',
    'Cloud Narth',
    'Cloud Narth',
    'Cloud Narth',
    'Cave Rudwot',
    'Cave Rudwot',
    'Cave Rudwot',
    'Agovo',
    'Agovo',
    'Agovo',
    'Giant Parmalag',
    'Giant Parmalag',
    'Giant Parmalag',
    'Motash\'s Staff'
];

const deckTwo = [
    'Poad',
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
game.initiatePRNG(2029);
game.setup();

const gameLog: any[] = [];

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
        if (type === 'clientAction') {
            const convertedCommand = convertClientCommands({
                ...action,
                player: 1,
            }, game);
            if (convertedCommand) {
                if (convertedCommand.type === ACTION_PLAY && 'payload' in convertedCommand && !convertedCommand.payload.card) {
                    console.log(`Cannot convert ACTION_PLAY command, source card: ${action.payload.card.name} [${action.payload.card.id}]`)
                    console.dir(action?.payload?.card);
                    throw new Error(`Cannot convert ACTION_PLAY command, source card: ${action.payload.card.name} [${action.payload.card.id}]`)
                }
                try {
                    game.update(convertedCommand);
                } catch (e: any) {
                    if (e && 'message' in e && e.message == 'Non-prompt action in the prompt state') {
                        actionCallbackOne({
                            type: 'display/status',
                        })
                        actionCallbackTwo({
                            type: 'display/status',
                        })
                    } else {
                        console.log(`Strange error: ${e?.message}`)
                    }
                    throw e;
                }
                const activePlayer = game.state.prompt ? game.state.promptPlayer : game.state.activePlayer;

                if (activePlayer == 1) {
                    actionCallbackOne({
                        type: 'display/priority',
                        player: activePlayer,
                    })
                } else {
                    actionCallbackTwo({
                        type: 'display/priority',
                        player: activePlayer,
                    })
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
            try {
                game.update(convertedCommand);
            } catch (e: any) {
                if (e && 'message' in e && e.message == 'Non-prompt action in the prompt state') {
                    actionCallbackOne({
                        type: 'display/status',
                    })
                    actionCallbackTwo({
                        type: 'display/status',
                    })
                } else {
                    console.log(`Strange error: ${e?.message}`)
                }
                throw e;
            }
            const activePlayer = game.state.prompt ? game.state.promptPlayer : game.state.activePlayer;
            // if (game.state.prompt) {
            //   console.log(`Game is in prompt state, prompt is ${game.state.promptType}`)
            // }
            // console.log(`Sending out priority display for player ${activePlayer}`);

            if (activePlayer == 1) {
                actionCallbackOne({
                    type: 'display/priority',
                    player: activePlayer,
                })
            } else {
                actionCallbackTwo({
                    type: 'display/priority',
                    player: activePlayer,
                })
            }
        } else {
            console.log(`Fail to convert command, oh my`)
            console.log(JSON.stringify(game.serializeData(2)))

            // if (action.type !== 'display/dump') {
            //   actionCallbackTwo({
            //     type: 'display/status',
            //   })
            // }
            fs.writeFileSync('./replayPlayerTwo.json', JSON.stringify(gameLog, null, 2));

            throw new Error('Conversion error')
        }
    },
    close: () => {
        // console.log(`Closing the connection`);
    }
}

console.log(`Connecting strategies to game`)
const strategyConnectorOne = new StrategyConnector(connectorOne as Socket);
strategyConnectorOne.connect(new SimulationStrategy())
const strategyConnectorTwo = new StrategyConnector(connectorTwo as Socket);
strategyConnectorTwo.connect(new SimulationStrategy())

// console.log(`Turning off debug`)
game.debug = false;
// let turnNumber = 0;

game.setOnAction((action: AnyEffectType) => {
    // console.log(`Action from an engine`);
    // console.dir(action);

    //if (action.type === ACTION_EFFECT && action.effectType === EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES && action.destinationZone === ZONE_TYPE_HAND) {
    // @ts-ignore
    // if (typeof action.target == 'string') {
    //   console.log(`Drawing a card "${action.target}"`);
    // } else {
    //   console.log(`Drawing a card ${action.target.card.name} [${action.target.id}]`);
    // }
    //}
    // try {
    const commandForBotOne = convertServerCommand(action, game, 1);
    actionCallbackOne(commandForBotOne);

    if (commandForBotOne) {
        gameLog.push({ for: 1, action: commandForBotOne })
    }
    // } catch(e) {
    //   console.log(`Error converting command`)
    //   console.dir(action);
    //   throw e;
    // }
    // if (action.type === ACTION_EFFECT) {
    //   if (action.effectType === EFFECT_TYPE_START_OF_TURN) {
    //     console.log(`Start of turn ${turnNumber}`)
    //     turnNumber++;
    //   }

    //   if (action.effectType === EFFECT_TYPE_START_STEP) {
    //     console.log(`Start of step ${STEP_NAMES[action.step]}`)
    //   }
    // }

    try {
        const commandForBotTwo = convertServerCommand(action, game, 2);

        if (commandForBotTwo) {
            gameLog.push({ for: 2, action: commandForBotTwo })
        }
        actionCallbackTwo(commandForBotTwo);
    } catch (e) {
        console.log(`Error converting command`)
        console.dir(action);
        throw e;
    }

    if (action.type === ACTION_PLAYER_WINS) {
        if (action.player === 1) {
            console.log('Arderial Energy won')
        } else {
            console.log('Naroom Default won')
        }

        const magiLeft = game.getZone(ZONE_TYPE_MAGI_PILE, action.player).cards.length + 1 // plus active magi
        const energyLeft = game.getZone(ZONE_TYPE_ACTIVE_MAGI, action.player).card?.data.energy
        const creaturesLeft = game.getZone(ZONE_TYPE_IN_PLAY).cards.filter(card => card.data.controller == action.player).length
        console.log(`Winning player has ${magiLeft} Magi left with ${energyLeft} energy on active Magi and ${creaturesLeft} creatures`)
    }
});

console.log(`Sending state data to log`)
gameLog.push({ for: 2, state: game.serializeData(2) });
console.log(`Sending state data to players`)
gameDataCallbackOne({ playerId: 1, state: game.serializeData(1) })
gameDataCallbackTwo({ playerId: 2, state: game.serializeData(2) })