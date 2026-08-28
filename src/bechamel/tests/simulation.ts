import { ACTION_PLAY, ACTION_PLAYER_WINS } from 'moonlands/dist/esm/index'
import { SimulationStrategy } from '../strategies/SimulationStrategy'
import { ReconSimulationStrategy } from '../strategies/ReconSimulationStrategy'
import { ZONE_TYPE_ACTIVE_MAGI, ZONE_TYPE_HAND, ZONE_TYPE_IN_PLAY, ZONE_TYPE_MAGI_PILE } from 'moonlands/dist/esm/const';
import { createGame } from '../../containedEngine/containedEngine';
import { StrategyConnector } from '../StrategyConnector';
import { AnyEffectType } from 'moonlands/dist/esm/types';
import convertClientCommands, { convertServerCommand } from '../../containedEngine/utils';
import { Socket } from 'socket.io-client';

import * as fs from 'node:fs';

export type PlayerId = 1 | 2;

type SimulationEvent = {
    gameLog: any[];
    playerOneLog: any[];
    playerTwoLog: any[];
};

type SimulationSubscriber = {
    next?: (result: SimulationResult) => void;
    error?: (error: Error) => void;
};

export type DeckConfig = {
    name: string;
    cards: string[];
};

export type SimulationOptions = {
    rng: number;
    playerOne: DeckConfig;
    playerTwo: DeckConfig;
    writeLogs?: boolean;
    maxIterations?: number;
    strategy?: 'simulation' | 'recon';
};

type WinnerSummary = {
    magiLeft: number;
    energyLeft: number;
    creaturesLeft: number;
};

export type SimulationResult = {
    winner: PlayerId;
    winnerName: string;
    summary: WinnerSummary;
    logs: SimulationEvent;
};

class SimulationConnector {
    public gameLog: any[] = [];
    public commandCount = 0;
    public isClosed = false;

    private gameDataCallback: (state: any) => void = () => {};
    private actionCallback: (action: any) => void = () => {};

    constructor(
        private readonly playerId: PlayerId,
        private readonly game: any,
        private readonly onPromptStateConflict: () => void,
        private readonly writeLogs: boolean = true,
    ) {}

    public on(type: string, callback: Function) {
        if (type === 'gameData') {
            this.gameDataCallback = (state: any) => {
                if (this.writeLogs) this.gameLog.push({
                    for: this.playerId,
                    state,
                });
                callback(state);
            };
        }

        if (type === 'action') {
            this.actionCallback = (action: any) => {
                if (this.writeLogs) this.gameLog.push({
                    for: this.playerId,
                    action,
                });
                callback(action);
            };
        }
    }

    public emit(type: string, action: any) {
        if (type !== 'clientAction') {
            return;
        }

        if (this.writeLogs) this.gameLog.push({
            from: this.playerId,
            count: this.commandCount,
            action,
        });

        this.commandCount++;
        const convertedCommand = convertClientCommands({
            ...action,
            player: this.playerId,
        }, this.game);

        if (!convertedCommand) {
            throw new Error(`Failed to convert command for player ${this.playerId}`);
        }

        if (convertedCommand.type === ACTION_PLAY && 'payload' in convertedCommand && !convertedCommand.payload.card) {
            const cardName = action?.payload?.card?.name ?? action?.payload?.card?.card ?? 'Unknown card';
            const cardId = action?.payload?.card?.id ?? 'Unknown id';
            throw new Error(`Cannot convert ACTION_PLAY command, source card: ${cardName} [${cardId}]`);
        }

        try {
            this.game.update(convertedCommand);
        } catch (e: any) {
            if (e?.message === 'Non-prompt action in the prompt state') {
                this.onPromptStateConflict();
            }

            throw e;
        }
    }

    public close() {
        this.isClosed = true;
    }

    public writeLog(path: string) {
        fs.writeFileSync(path, JSON.stringify(this.gameLog, null, 2));
    }

    public dispatchGameData(payload: any) {
        this.gameDataCallback(payload);
    }

    public dispatchAction(action: any) {
        this.actionCallback(action);
    }
}

export class Simulation {
    private readonly subscribers = new Set<SimulationSubscriber>();

    constructor(private readonly options: SimulationOptions) {}

    public subscribe(subscriber: SimulationSubscriber | ((result: SimulationResult) => void)) {
        const normalizedSubscriber = typeof subscriber === 'function'
            ? { next: subscriber }
            : subscriber;

        this.subscribers.add(normalizedSubscriber);

        return () => {
            this.subscribers.delete(normalizedSubscriber);
        };
    }

    public run(): SimulationResult {
        try {
            const result = this.execute();
            this.subscribers.forEach(subscriber => subscriber.next?.(result));
            return result;
        } catch (e: unknown) {
            const error = e instanceof Error ? e : new Error(String(e));
            this.subscribers.forEach(subscriber => subscriber.error?.(error));
            throw error;
        }
    }

    private execute(): SimulationResult {
        const game = createGame();
        // @ts-ignore
        game.initiatePRNG(this.options.rng);
        game.setPlayers(1, 2);
        game.setDeck(1, this.options.playerOne.cards);
        game.setDeck(2, this.options.playerTwo.cards);

        game.setup();

        const gameLog: any[] = [];
        const onPromptStateConflict = () => {
            connectorOne.dispatchAction({ type: 'display/status' });
            connectorTwo.dispatchAction({ type: 'display/status' });
        };

        const connectorOne = new SimulationConnector(1, game, onPromptStateConflict, this.options.writeLogs ?? true);
        const connectorTwo = new SimulationConnector(2, game, onPromptStateConflict, this.options.writeLogs ?? true);

        const strategyConnectorOne = new StrategyConnector(connectorOne as unknown as Socket);
        const strategyConnectorTwo = new StrategyConnector(connectorTwo as unknown as Socket);

        const StrategyClass = this.options.strategy === 'recon' ? ReconSimulationStrategy : SimulationStrategy;
        strategyConnectorOne.connect(new StrategyClass());
        strategyConnectorTwo.connect(new StrategyClass());

        let winnerData: SimulationResult | null = null;

        game.debug = true;
        game.setOnAction((action: AnyEffectType) => {
            const commandForBotOne = convertServerCommand(action, game, 1);
            connectorOne.dispatchAction(commandForBotOne);

            const commandForBotTwo = convertServerCommand(action, game, 2);
            connectorTwo.dispatchAction(commandForBotTwo);

            if (commandForBotTwo) {
                if (this.options.writeLogs) gameLog.push({ for: 2, action: commandForBotTwo });
            }

            if (action.type === ACTION_PLAYER_WINS) {
                const winner = action.player as PlayerId;
                const winnerName = winner === 1 ? this.options.playerOne.name : this.options.playerTwo.name;

                const summary: WinnerSummary = {
                    magiLeft: game.getZone(ZONE_TYPE_MAGI_PILE, winner).cards.length + 1,
                    energyLeft: game.getZone(ZONE_TYPE_ACTIVE_MAGI, winner).card?.data.energy ?? 0,
                    creaturesLeft: game.getZone(ZONE_TYPE_IN_PLAY).cards.filter((card: any) => card.data.controller === winner).length,
                };

                winnerData = {
                    winner,
                    winnerName,
                    summary,
                    logs: {
                        gameLog,
                        playerOneLog: connectorOne.gameLog,
                        playerTwoLog: connectorTwo.gameLog,
                    },
                };
            }
        });

        if (this.options.writeLogs) gameLog.push({ for: 2, state: game.serializeData(2) });
        connectorOne.dispatchGameData({ playerId: 1, state: game.serializeData(1) });
        connectorTwo.dispatchGameData({ playerId: 2, state: game.serializeData(2) });

        const maxIterations = this.options.maxIterations ?? 5000;
        let iterations = 0;
        const actionLog: string[] = [];
        const firstLog: string[] = [];
        const ACTION_LOG_SIZE = 30;

        while (!game.hasWinner()) {
            iterations++;
            if (iterations > maxIterations) {
                const step = game.state.step;
                const turn = game.turn;
                const activeP = game.state.activePlayer;
                const inPlay = (game.getZone('zones/in_play', null)?.cards ?? [])
                    .map((c: any) => `${c.card.name}[${c.data.energy}]`).join(', ');
                const prompt = game.state.prompt
                    ? `PROMPT(${game.state.promptType}, player=${game.state.promptPlayer}, generatedBy=${game.state.promptGeneratedBy})`
                    : 'no prompt';
                throw new Error(
                    `Simulation exceeded max iterations (${maxIterations}) ` +
                    `@ turn ${turn} step ${step} activePlayer ${activeP} ${prompt} | in-play: ${inPlay}\n` +
                    `First 10 actions:\n` + firstLog.join('\n') + '\n' +
                    `Last ${ACTION_LOG_SIZE} actions:\n` + actionLog.join('\n')
                );
            }

            const activePlayer = game.state.prompt ? game.state.promptPlayer : game.state.activePlayer;
            const stateBefore = `T${game.turn}S${game.state.step}P${activePlayer}${game.state.prompt ? `(${game.state.promptType?.slice(-20)})` : ''}`;
            if (activePlayer === 1) {
                strategyConnectorOne.requestAndSendAction();
            } else {
                strategyConnectorTwo.requestAndSendAction();
            }
            const lastEntry = (activePlayer === 1 ? connectorOne : connectorTwo).gameLog.slice(-1)[0] as any;
            const lastAction = lastEntry?.action;
            const actionDesc = lastAction?.type === 'actions/play'
                ? `PLAY(${lastAction?.payload?.card?.card ?? lastAction?.payload?.card?.id})`
                : lastAction?.type === 'actions/power'
                ? `POWER(${lastAction?.power})`
                : lastAction?.type ?? '?';
            const stateAfter = `T${game.turn}S${game.state.step}P${game.state.activePlayer}${game.state.prompt ? `(${game.state.promptType?.slice(-20)})` : ''}`;
            if (actionLog.length >= ACTION_LOG_SIZE) actionLog.shift();
            actionLog.push(`#${iterations} ${stateBefore}→${stateAfter} [${actionDesc}]`);
            if (iterations <= 10) firstLog.push(`#${iterations} ${stateBefore}→${stateAfter} [${actionDesc}]`);
        }

        if (this.options.writeLogs) {
            connectorOne.writeLog('./replayPlayerOne-node.json');
            connectorTwo.writeLog('./replayPlayerTwo-node.json');
        }

        if (!winnerData) {
            throw new Error('Simulation finished without winner data');
        }

        return winnerData;
    }
}

