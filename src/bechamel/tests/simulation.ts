import { ACTION_PLAY, ACTION_PLAYER_WINS } from 'moonlands/dist/esm/index'
import { SimulationStrategy } from '../strategies/SimulationStrategy.js'
import { EFFECT_TYPE_START_OF_TURN, ACTION_EFFECT, ZONE_TYPE_ACTIVE_MAGI, ZONE_TYPE_HAND, ZONE_TYPE_IN_PLAY, ZONE_TYPE_MAGI_PILE } from 'moonlands/dist/esm/const';
import { createGame } from '../../containedEngine/containedEngine.js';
import { StrategyConnector } from '../StrategyConnector.js';
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

function simulateGame(deck1: string[], deck1name: string, deck2: string[], deck2name: string, rng: number) {
    const game = createGame()
    // @ts-ignore
    game.initiatePRNG(rng);
    game.setPlayers(1, 2);
    game.setDeck(1, deck1);
    game.setDeck(2, deck2);

    game.setup();

    const gameLog: any[] = [];

    let gameDataCallbackOne: Function = () => { };
    let actionCallbackOne: Function = () => { };

    let gameDataCallbackTwo: Function = () => { };
    let actionCallbackTwo: Function = () => { };

    let turn = 0;

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
                            throw new Error(`Strange error: ${e?.message}`)
                        }
                        throw e;
                    }
                }
            }
        },
        close: function () {
            fs.writeFileSync('./replayPlayerOne-node.json', JSON.stringify(this.gameLog, null, 2));
            fs.writeFileSync('./commandsPlayerOne-node.json', JSON.stringify(this.commands, null, 2));
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
                    game.update(convertedCommand)
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
            } else {
                console.log(`Fail to convert command, oh my`)
                console.dir(action)
                console.log(JSON.stringify(game.serializeData(2)))

                fs.writeFileSync('./replayPlayerTwo.json', JSON.stringify(gameLog, null, 2));

                throw new Error('Conversion error')
            }
        },
        close: function () {
            console.log('Writing out the logs')
            fs.writeFileSync('./replayPlayerTwo-node.json', JSON.stringify(this.gameLog, null, 2));
            fs.writeFileSync('./commandsPlayerTwo-node.json', JSON.stringify(this.commands, null, 2));
        }
    }

    // console.log(`Connecting strategies to game`)
    const strategyConnectorOne = new StrategyConnector(connectorOne as unknown as Socket);

    strategyConnectorOne.connect(strat1)
    const strategyConnectorTwo = new StrategyConnector(connectorTwo as unknown as Socket);
    strategyConnectorTwo.connect(new SimulationStrategy())

    game.debug = false;

    game.setOnAction((action: AnyEffectType) => {
        // if (action.type == ACTION_EFFECT && action.effectType == EFFECT_TYPE_START_OF_TURN) {
        //     turn++
        //     console.log(`Start of turn ${turn}`)
        // }
        const commandForBotOne = convertServerCommand(action, game, 1);
        actionCallbackOne(commandForBotOne);

        // if (commandForBotOne) {
        //     gameLog.push({ for: 1, action: commandForBotOne })
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
                console.log(`${deck1name} won`)
            } else {
                console.log(`${deck2name} won`)
            }

            const magiLeft = game.getZone(ZONE_TYPE_MAGI_PILE, action.player).cards.length + 1 // plus active magi
            const energyLeft = game.getZone(ZONE_TYPE_ACTIVE_MAGI, action.player).card?.data.energy
            const creaturesLeft = game.getZone(ZONE_TYPE_IN_PLAY).cards.filter(card => card.data.controller == action.player).length
            console.log(`Winning player has ${magiLeft} Magi left with ${energyLeft} energy on active Magi and ${creaturesLeft} creatures`)
        }
    });

    gameLog.push({ for: 2, state: game.serializeData(2) });
    try {
        gameDataCallbackOne({ playerId: 1, state: game.serializeData(1) })
        gameDataCallbackTwo({ playerId: 2, state: game.serializeData(2) })
    } catch (e) {
        console.log('Game data calllbaack fail')
        fs.writeFileSync('./replayPlayerTwo-node.json', JSON.stringify(gameLog, null, 2));
        // fs.writeFileSync('./commandsPlayerTwo-node.json', JSON.stringify(this.commands, null, 2));
    }
    while (!game.hasWinner()) {
        const activePlayer = game.state.prompt ? game.state.promptPlayer : game.state.activePlayer;
        if (activePlayer == 1) {
            strategyConnectorOne.requestAndSendAction()
        } else {
            try {
                strategyConnectorTwo.requestAndSendAction()
            } catch (e) {
                fs.writeFileSync('./replayPlayerTwo-node.json', JSON.stringify(gameLog, null, 2));
                // fs.writeFileSync('./commandsPlayerTwo-node.json', JSON.stringify(this.commands, null, 2));
                throw new Error('Game data calllbaack fail')
            }

        }
    }
}

simulateGame(deckOne, 'Orothe Draft', deckTwo, 'Naroom Default', 2000)