import { EventEmitter } from 'node:events';
import { io } from 'socket.io-client';
import CardInGame from 'moonlands/dist/esm/classes/CardInGame';
import { byName } from 'moonlands/dist/esm/cards';
import * as C from 'moonlands/dist/esm/const';
import { GameConnectionService } from '../GameConnectionService';
import { createGameStore } from '../../store/createGameStore';
import { createInitialState } from '../../reducers/initialState';
import { getPromptInstanceKey, getPromptMagi } from '../../selectors';
import type { State } from '../../types';

jest.mock('socket.io-client', () => ({ io: jest.fn() }));

class FakeSocket extends EventEmitter {
    connected = false;
    emit = jest.fn((_event: string, ..._args: unknown[]) => true);
    send = jest.fn();
    fire(event: string, value?: unknown) { super.emit(event, value); }
    connect = jest.fn(() => { this.connected = true; this.fire('connect'); return this; });
    close = jest.fn(() => { this.connected = false; this.fire('disconnect'); return this; });
}

const card = (name: string, owner: number, energy: number) => new CardInGame(byName(name)!, owner).addEnergy(energy).serialize();
const own = card('Weebo', 2, 3), enemy = card('Arbolit', 1, 1);
const ownMagi = card('Grega', 2, 10), enemyMagi = card('Ora', 1, 10);
const snapshot = (extra: Partial<State> = {}): Partial<State> => ({
    playerNumber: 2, activePlayer: 2, step: 1, prompt: false, promptType: null, promptParams: {},
    zones: { ...createInitialState().zones, inPlay: [own, enemy],
        playerActiveMagi: [ownMagi], opponentActiveMagi: [enemyMagi] },
    ...extra,
});

describe('network game snapshots and match lifecycle', () => {
    let socket: FakeSocket;
    beforeEach(() => {
        jest.useFakeTimers(); socket = new FakeSocket();
        jest.mocked(io).mockReturnValue(socket as unknown as ReturnType<typeof io>);
    });
    afterEach(() => { jest.clearAllTimers(); jest.useRealTimers(); });

    it('creates independent stores with no shared arrays or animation sets', () => {
        const first = createGameStore(), second = createGameStore();
        expect(first.getState().zones.inPlay).not.toBe(second.getState().zones.inPlay);
        expect(first.getState().energyAnimationsShown).not.toBe(second.getState().energyAnimationsShown);
        first.getState().energyAnimationsShown.add(7);
        expect(second.getState().energyAnimationsShown.has(7)).toBe(false);
        expect(second.getState().message).toBeNull();
    });

    it('replaces old UI state rather than merging it into a new game', () => {
        const store = createGameStore();
        store.dispatch({ type: 'setInitialState', state: { ...snapshot(), animation: { type: 'attack', source: 'old', target: 'old' },
            packs: [{ leader: 'old', hunters: ['old-hunter'] }], energyPrompt: { freeEnergy: 9, cards: { old: 2 } },
            energyLosses: [{ card: 'old', value: -1, ttl: 2, id: 0 }], lastPositions: { old: [1, 2] }, energyAnimationsShown: new Set([7]) } });
        store.dispatch({ type: 'setInitialState', state: snapshot() });
        expect(store.getState()).toMatchObject({ animation: null, message: null, packs: [], energyLosses: [], lastPositions: {},
            energyPrompt: { freeEnergy: 0, cards: {} }, playerNumber: 2 });
        expect(store.getState().energyAnimationsShown.size).toBe(0);
    });

    it.each([
        [C.PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES, {}, 0, { [own.id]: 3 }],
        [C.PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES, { amount: 4 }, 4, { [own.id]: 0 }],
        [C.PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES, { amount: 5 }, 5, { [own.id]: 0, [enemy.id]: 0 }],
    ])('restores UI allocations for %s from a server snapshot', (promptType, promptParams, freeEnergy, cards) => {
        const store = createGameStore();
        const [, , dispose] = new GameConnectionService().connectToGame(store, 'test-secret');
        socket.fire('message', { type: 'setInitialState', state: snapshot({ prompt: true, promptPlayer: 2, promptType, promptParams, promptGeneratedBy: 'source' } as Partial<State>) });
        expect(store.getState().energyPrompt).toEqual({ freeEnergy, cards });
        expect(store.getState().promptGeneratedBy).toBe('source');
        expect(store.getState().playerNumber).toBe(2);
        dispose();
    });

    it('keeps number/card prompt parameters and remounts choices after a new snapshot', () => {
        const store = createGameStore();
        for (const params of [{ min: 0, max: 4 }, { cards: [own], zone: C.ZONE_TYPE_HAND as typeof C.ZONE_TYPE_HAND, zoneOwner: 2, numberOfCards: 1 }]) {
            const state = snapshot({ prompt: true, promptPlayer: 2, promptGeneratedBy: 'same-source',
                promptType: 'min' in params ? C.PROMPT_TYPE_NUMBER : C.PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE, promptParams: params });
            store.dispatch({ type: 'setInitialState', state });
            const key = getPromptInstanceKey(store.getState());
            store.dispatch({ type: 'setInitialState', state });
            expect(getPromptInstanceKey(store.getState())).not.toBe(key);
            expect(store.getState().promptParams).toEqual(params);
        }
    });

    it('normalizes raw engine references in a restored Mirror Pendant or except-source prompt', () => {
        const store = createGameStore();
        const magi = snapshot().zones!.playerActiveMagi[0];
        store.dispatch({ type: 'setInitialState', state: snapshot({ prompt: true, promptPlayer: 2,
            promptType: C.PROMPT_TYPE_POWER_ON_MAGI, promptParams: { magi: [{ id: magi.id, _card: { name: magi.card } }] } as any }) });
        expect(getPromptMagi(store.getState())).toEqual(magi);
        store.dispatch({ type: 'setInitialState', state: snapshot({ prompt: true, promptPlayer: 2,
            promptType: C.PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE, promptParams: { source: { id: own.id } } as any }) });
        expect(store.getState().promptParams?.source).toBe(own.id);
    });

    it('does not initialize allocations for the opponent prompt', () => {
        const store = createGameStore();
        store.dispatch({ type: 'setInitialState', state: snapshot({ prompt: true, promptPlayer: 1,
            promptType: C.PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES, promptParams: { amount: 5 } }) });
        expect(store.getState().energyPrompt).toEqual({ freeEnergy: 0, cards: {} });
    });

    it('discards queued old actions and timers when a fresh snapshot arrives', () => {
        const store = createGameStore();
        const [, , dispose] = new GameConnectionService().connectToGame(store, 'test-secret');
        socket.fire('message', { type: 'setInitialState', state: snapshot() });
        socket.fire('message', { type: C.ACTION_ATTACK, source: enemy.id, target: own.id, player: 1 });
        socket.fire('message', { type: C.ACTION_PASS, newStep: 4 });
        expect(store.getState().animation).not.toBeNull();
        socket.fire('message', { type: 'setInitialState', state: snapshot() });
        jest.runAllTimers();
        expect(store.getState().animation).toBeNull();
        expect(store.getState().step).toBe(1);
        socket.fire('message', { type: C.ACTION_PASS, newStep: 3 });
        expect(store.getState().step).toBe(3);
        dispose(); expect(jest.getTimerCount()).toBe(0);
    });

    it('waits for authentication snapshots after reconnect and never buffers offline actions', () => {
        const store = createGameStore();
        const [connector, , dispose] = new GameConnectionService().connectToGame(store, 'test-secret');
        const pass = { type: C.ACTION_PASS, player: 2 } as const;
        connector.emit(pass); expect(socket.send).not.toHaveBeenCalled();
        socket.fire('message', { type: 'setInitialState', state: snapshot() });
        connector.emit(pass); expect(socket.send).toHaveBeenCalledTimes(1);
        socket.connected = false; socket.fire('disconnect');
        connector.emit(pass); expect(socket.send).toHaveBeenCalledTimes(1);
        socket.connect();
        expect(socket.emit).toHaveBeenCalledTimes(2);
        connector.emit(pass); expect(socket.send).toHaveBeenCalledTimes(1);
        socket.fire('message', { type: C.ACTION_PASS, newStep: 4 });
        expect(store.getState().step).toBe(1);
        socket.fire('message', { type: 'setInitialState', state: snapshot({ step: 2 }) });
        expect(store.getState().step).toBe(2);
        connector.emit(pass); expect(socket.send).toHaveBeenCalledTimes(2);
        dispose(); dispose();
        socket.fire('message', { type: C.ACTION_PASS, newStep: 4 });
        expect(store.getState().step).toBe(2);
        expect(socket.listenerCount('message')).toBe(0);
    });
});
