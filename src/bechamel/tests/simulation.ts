import { ACTION_PLAY, ACTION_PLAYER_WINS, State } from 'moonlands/dist/esm/index'
import { SimulationStrategy } from '../strategies/SimulationStrategy'
import { EFFECT_TYPE_START_OF_TURN, ACTION_EFFECT, ZONE_TYPE_ACTIVE_MAGI, ZONE_TYPE_HAND, ZONE_TYPE_IN_PLAY, ZONE_TYPE_MAGI_PILE } from 'moonlands/dist/esm/const';
import { createGame } from '../../containedEngine/containedEngine';
import { StrategyConnector } from '../StrategyConnector';
import { AnyEffectType } from 'moonlands/dist/esm/types';
import convertClientCommands, { convertServerCommand } from '../../containedEngine/utils';
import { Socket } from 'socket.io-client';

import * as fs from 'node:fs';

const deckOne = [
    'Whall',
    'Orlon',
    'Ebylon',
    'Giant Parathin',
    'Giant Parathin',
    'Water of Life',
    'Sphor',
    'Sphor',
    'Sphor',
    'Sphor',
    'Sphor',
    'Bwill',
    'Bwill',
    'Bwill',
    'Dream Balm',
    'Dream Balm',
    'Dream Balm',
    'Dream Balm',
    'Paralit',
    'Wellisk Pup',
    'Wellisk Pup',
    'Wellisk Pup',
    'Wellisk Pup',
    'Weebo',
    'Weebo',
    'Undertow',
    'Undertow',
    'Corf',
    'Corf',
    'Submerge',
    'Submerge',
    'Submerge',
    'Sea Barl',
    'Sea Barl',
    'Sea Barl',
    'Sea Barl',
    'Sea Barl',
    'Sea Barl',
    'Orathan',
    'Orathan',
    'Ancestral Flute',
    'Warrior\'s Boots',
    'Dream Balm'
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
// @ts-ignore
game.initiatePRNG(2021);
game.setPlayers(1, 2);
game.setDeck(1, deckOne);
game.setDeck(2, deckTwo);

game.setup();

const gameLog: any[] = [];

let gameDataCallbackOne: Function = () => { };
let actionCallbackOne: Function = () => { };

let gameDataCallbackTwo: Function = () => { };
let actionCallbackTwo: Function = () => { };

let turn = 0;
let priorityNumber = 1;

const queue: AnyEffectType[] = []
let intervalTimer = setInterval(() => {
    if (queue.length) {
        const action = queue.shift()
        if (action) {
            game.update(action)

            if (turn == 27 && (priorityNumber == 5 || priorityNumber == 6)) {
                console.log(`Inner state`)
                console.dir({
                    prompt: game.state.prompt,
                    promptType: game.state.promptType,
                    promptPlayer: game.state.promptPlayer,
                    promptGeneratedBy: game.state.promptGeneratedBy,
                })
            }

            const activePlayer = game.state.prompt ? game.state.promptPlayer : game.state.activePlayer;

            if (activePlayer == 1) {
                console.log(`Priority player 1: ${priorityNumber}`)
                actionCallbackOne({
                    type: 'display/priority',
                    player: activePlayer,
                })
            } else {
                console.log(`Priority player 2: ${priorityNumber}`)
                actionCallbackTwo({
                    type: 'display/priority',
                    player: activePlayer,
                })
            }
            priorityNumber++
        }
    }
}, 10)

let strat1 = new SimulationStrategy()
const connectorOne = {
    gameLog: [] as any[],
    commands: [] as any[],
    states: [] as any[],
    commandCount: 0,
    on: function (type: string, callback: Function) {
        if (type == 'gameData') {
            const wrappedCallback = (state: any) => {
                this.gameLog.push({
                    for: 1,
                    state,
                })
                callback(state)
            }
            gameDataCallbackOne = wrappedCallback;
        } else if (type == 'action') {
            const wrappedCallback = (action: any) => {
                console.dir(action)
                this.gameLog.push({
                    for: 1,
                    action,
                })
                callback(action)
            }
            actionCallbackOne = wrappedCallback;
        }
    },
    emit: function (type: string, action: any, state: any) {
        if (type === 'clientAction') {
            this.gameLog.push({
                from: 1,
                count: this.commandCount,
                action,
            })

            // if (turn == 27) {
            //     console.log(`Turn ${turn}, priority number ${priorityNumber}`)
            //     console.dir(action)
            //     console.log(JSON.stringify(state))
            //     console.dir(strat1.getHeldActions())
            // }
            this.commandCount++;
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
                    // game.update(convertedCommand);
                    queue.push(convertedCommand)
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
                // const activePlayer = game.state.prompt ? game.state.promptPlayer : game.state.activePlayer;

                // if (activePlayer == 1) {
                //     actionCallbackOne({
                //         type: 'display/priority',
                //         player: activePlayer,
                //     })
                // } else {
                //     actionCallbackTwo({
                //         type: 'display/priority',
                //         player: activePlayer,
                //     })
                // }
            }
        }
    },
    close: function () {
        fs.writeFileSync('./replayPlayerOne-node.json', JSON.stringify(this.gameLog, null, 2));
        fs.writeFileSync('./commandsPlayerOne-node.json', JSON.stringify(this.commands, null, 2));
        // console.log(`Closing the connection`);
    }
}

const connectorTwo = {
    gameLog: [] as any[],
    commands: [] as any[],
    states: [] as any[],
    commandCount: 0,
    on: function (type: string, callback: Function) {
        if (type == 'gameData') {
            const wrappedCallback = (state: any) => {
                this.gameLog.push({
                    for: 2,
                    state,
                })
                callback(state)
            }
            gameDataCallbackTwo = wrappedCallback;
        } else if (type == 'action') {
            const wrappedCallback = (action: any) => {
                this.gameLog.push({
                    for: 2,
                    action,
                })
                callback(action)
            }
            actionCallbackTwo = wrappedCallback;
        }
        // if (type == 'gameData') {
        //     gameDataCallbackTwo = callback;
        // } else if (type == 'action') {
        //     actionCallbackTwo = callback;
        // }
    },
    emit: function (_type: string, action: any, state: any) {
        const convertedCommand = convertClientCommands({
            ...action,
            player: 2,
        }, game);
        this.gameLog.push({
            from: 2,
            count: this.commandCount,
            action,
        })
        this.commandCount++
        if (convertedCommand) {
            if (convertedCommand.type === ACTION_PLAY && 'payload' in convertedCommand && !convertedCommand.payload.card) {
                console.error(`Cannot convert ACTION_PLAY command, source card: ${action.payload.card.card} [${action.payload.card.id}]`)
                console.log(game.getZone(ZONE_TYPE_HAND, 2).cards.map(card => `[${card.id}] ${card.card.name}`).join(', '))
                console.dir(action?.payload?.card);
            }
            try {
                // game.update(convertedCommand);
                queue.push(convertedCommand)
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

            // if (activePlayer == 1) {
            //     actionCallbackOne({
            //         type: 'display/priority',
            //         player: activePlayer,
            //     })
            // } else {
            //     actionCallbackTwo({
            //         type: 'display/priority',
            //         player: activePlayer,
            //     })
            // }
        } else {
            console.log(`Fail to convert command, oh my`)
            console.dir(action)
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
    close: function () {
        fs.writeFileSync('./replayPlayerTwo-node.json', JSON.stringify(this.gameLog, null, 2));
        fs.writeFileSync('./commandsPlayerTwo-node.json', JSON.stringify(this.commands, null, 2));

        // fs.writeFileSync('./replayPlayerTwo.json', JSON.stringify(gameLog, null, 2));
        // console.log(`Closing the connection`);
    }
}

console.log(`Connecting strategies to game`)
const strategyConnectorOne = new StrategyConnector(connectorOne as unknown as Socket);

strategyConnectorOne.connect(strat1)
const strategyConnectorTwo = new StrategyConnector(connectorTwo as unknown as Socket);
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
    if (action.type == ACTION_EFFECT && action.effectType == EFFECT_TYPE_START_OF_TURN) {
        turn++
        priorityNumber = 1
        console.log(`Start of turn ${turn}`)
    }
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
            console.log('Orothe Draft won')
        } else {
            console.log('Naroom Default won')
        }
        clearInterval(intervalTimer)

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