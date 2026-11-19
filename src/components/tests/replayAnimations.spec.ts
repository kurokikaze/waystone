import { BehaviorSubject, Subject } from 'rxjs';
import type { Store } from 'redux';
import {
    ACTION_ATTACK,
    ACTION_EFFECT,
    ACTION_PASS,
    EFFECT_TYPE_START_STEP,
    EFFECT_TYPE_MAGI_IS_DEFEATED,
    EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
} from 'moonlands/dist/esm/const';
import { START_ATTACK_ANIMATION, END_ATTACK_ANIMATION } from '../../actions';
import addAnimations from '../../addAnimations';
import type { ClientCommand } from '../../clientProtocol';

describe('Replay animation playback', () => {
    const store = { getState: () => ({ playerNumber: 1 }) } as unknown as Store;
    const attack = (source: string) => ({
        type: ACTION_ATTACK, player: 2, source, target: 'target',
    } as ClientCommand);
    let actions: Subject<ClientCommand>;
    let breaks: Subject<{}>;
    let playback: BehaviorSubject<boolean>;

    beforeEach(() => {
        jest.useFakeTimers();
        actions = new Subject();
        breaks = new Subject();
        playback = new BehaviorSubject(true);
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.useRealTimers();
    });

    it('finishes the current effect but retains queued actions until Play', () => {
        const emitted: ClientCommand[] = [];
        const subscription = addAnimations(actions, breaks, store, false, playback)
            .subscribe(action => emitted.push(action));
        const first = attack('first');
        const second = attack('second');
        const pass = { type: ACTION_PASS } as ClientCommand;
        actions.next(first);
        actions.next(pass);
        actions.next(second);
        jest.advanceTimersByTime(300);
        playback.next(false);

        jest.advanceTimersByTime(499);
        expect(emitted.map(action => action.type)).toEqual([START_ATTACK_ANIMATION]);
        jest.advanceTimersByTime(1);
        expect(emitted.map(action => action.type)).toEqual([
            START_ATTACK_ANIMATION, END_ATTACK_ANIMATION, ACTION_ATTACK,
        ]);
        expect(emitted[2]).toBe(first);
        jest.advanceTimersByTime(10000);
        expect(emitted).toHaveLength(3);

        playback.next(true);
        expect(emitted[3]).toBe(pass);
        expect(emitted[4].type).toBe(START_ATTACK_ANIMATION);
        jest.advanceTimersByTime(800);
        expect(emitted[6]).toBe(second);
        expect(emitted).toHaveLength(7);
        subscription.unsubscribe();
    });

    it.each([
        [EFFECT_TYPE_START_STEP, 500],
        [EFFECT_TYPE_MAGI_IS_DEFEATED, 1000],
        [EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY, 600],
    ])('finishes %s before pausing, including effects without end events', (effectType, duration) => {
        const emitted: ClientCommand[] = [];
        const subscription = addAnimations(actions, breaks, store, false, playback)
            .subscribe(action => emitted.push(action));
        const effect = { type: ACTION_EFFECT, effectType, target: { id: 'card' } } as ClientCommand;
        const next = attack('next');
        actions.next(effect);
        actions.next(next);
        playback.next(false);
        jest.advanceTimersByTime(Number(duration));
        expect(emitted).toHaveLength(2);
        expect(emitted[1]).toBe(effect);
        expect(jest.getTimerCount()).toBe(0);
        subscription.unsubscribe();
    });

    it('does not start actions while paused and waits to complete until they drain', () => {
        playback.next(false);
        const next = jest.fn();
        const complete = jest.fn();
        addAnimations(actions, breaks, store, false, playback).subscribe({ next, complete });
        actions.next(attack('queued'));
        actions.complete();
        jest.runAllTimers();
        expect(next).not.toHaveBeenCalled();
        expect(complete).not.toHaveBeenCalled();

        playback.next(true);
        jest.runAllTimers();
        expect(next).toHaveBeenCalledTimes(3);
        expect(complete).toHaveBeenCalledTimes(1);
        expect(playback.observed).toBe(false);
    });

    it('does not restart the active animation when Play is pressed early', () => {
        const next = jest.fn();
        const subscription = addAnimations(actions, breaks, store, false, playback).subscribe(next);
        actions.next(attack('first'));
        jest.advanceTimersByTime(300);
        playback.next(false);
        playback.next(true);
        jest.advanceTimersByTime(500);
        expect(next).toHaveBeenCalledTimes(3);
        expect(jest.getTimerCount()).toBe(0);
        subscription.unsubscribe();
    });

    it('skips only the current animation when breaking while paused', () => {
        const emitted: ClientCommand[] = [];
        const subscription = addAnimations(actions, breaks, store, false, playback)
            .subscribe(action => emitted.push(action));
        const first = attack('first');
        actions.next(first);
        actions.next(attack('second'));
        playback.next(false);
        breaks.next({});
        expect(emitted).toHaveLength(3);
        expect(emitted[2]).toBe(first);
        expect(jest.getTimerCount()).toBe(0);
        subscription.unsubscribe();
    });

    it('preserves ungated playback and break behavior for live games', () => {
        const next = jest.fn();
        const complete = jest.fn();
        addAnimations(actions, breaks, store, false).subscribe({ next, complete });
        actions.next(attack('first'));
        actions.next(attack('second'));
        actions.complete();
        breaks.next({});
        expect(next).toHaveBeenCalledTimes(4);
        jest.advanceTimersByTime(800);
        expect(next).toHaveBeenCalledTimes(6);
        expect(complete).toHaveBeenCalledTimes(1);
    });

    it('cleans up its timer and input subscriptions when disposed', () => {
        const next = jest.fn();
        const subscription = addAnimations(actions, breaks, store, false, playback).subscribe(next);
        actions.next(attack('first'));
        subscription.unsubscribe();
        expect(jest.getTimerCount()).toBe(0);
        expect(actions.observed).toBe(false);
        expect(breaks.observed).toBe(false);
        expect(playback.observed).toBe(false);
        jest.runAllTimers();
        expect(next).toHaveBeenCalledTimes(1);
    });
});