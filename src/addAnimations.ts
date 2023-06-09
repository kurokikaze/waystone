/* global window */
// @ts-nocheck

import {Observable} from 'rxjs';

import {
	ACTION_POWER,
	ACTION_ATTACK,
	ACTION_EFFECT,
	EFFECT_TYPE_START_STEP,
	EFFECT_TYPE_PLAY_RELIC,
	EFFECT_TYPE_PLAY_SPELL,
	ACTION_RESOLVE_PROMPT,
  EFFECT_TYPE_PLAY_CREATURE,
  EFFECT_TYPE_MAGI_IS_DEFEATED,
} from 'moonlands/dist/const';

import { 
	startPowerAnimation,
	endPowerAnimation,
	startAttackAnimation,
	endAttackAnimation,
	startRelicAnimation,
	endRelicAnimation,
	startSpellAnimation,
	endSpellAnimation,
  startCreatureAnimation,
	endCreatureAnimation,
	endStepAnimation,
	startPromptResolutionAnimation,
	endPromptResolutionAnimation,
	START_POWER_ANIMATION,
	START_RELIC_ANIMATION,
	START_SPELL_ANIMATION,
	START_ATTACK_ANIMATION,
	START_PROMPT_RESOLUTION_ANIMATION,
	END_STEP_ANIMATION,
  START_CREATURE_ANIMATION,
  startMagiDefeatAnimation,
  START_MAGI_DEFEAT_ANIMATION,
} from './actions';
import { ClientCommand } from './clientProtocol';
import { Action, Store } from 'redux';
import { getPowerSource } from './selectors/index';

const MAGI_DEFEATED_TIMEOUT = 1000;
const POWER_MESSAGE_TIMEOUT = 10000;
const RELIC_MESSAGE_TIMEOUT = 3000;
const CREATURE_MESSAGE_TIMEOUT = 1000;
const SPELL_MESSAGE_TIMEOUT = 2000;
const ATTACK_MESSAGE_TIMEOUT = 800;
const PROMPT_RESOLUTION_TIMEOUT = 600;
const STEP_TIMEOUT = 500;

const convertAction = (action: ClientCommand, store: Store<any, Action<any>>) => {
	if (!('type' in action)) {
		return action;
	}
	switch(action.type) {
		case ACTION_RESOLVE_PROMPT:
      const state = store.getState();
      if (!action.target) {
        return [action]
      }
      const card = getPowerSource(action.target)(state);
      if (!card) {
        return [action]
      }
			return (action.player !== 1) ? [
				startPromptResolutionAnimation(action.target ? (getPowerSource(action.target)(state)?.card || '') : (action.number || 0).toString()),
				endPromptResolutionAnimation(),
				action,
			] : [action];
		case ACTION_POWER:
			return (action.source.owner !== 1) ? [
				startPowerAnimation(action.source.id, action.power, action.player), 
				endPowerAnimation(action.power),
				action,
			] : [action];
		case ACTION_ATTACK: {
			return (action.player === 2) ? [
				startAttackAnimation(action.source, action.target, (action.additionalAttackers && action.additionalAttackers.length) ? action.additionalAttackers[0] : null, 2), 
				endAttackAnimation(action.source),
				action,
			] : [action];
		}
		case ACTION_EFFECT: {
			switch(action.effectType) {
				case EFFECT_TYPE_PLAY_RELIC:
					return (action.player !== 1) ? [
						startRelicAnimation(action.card, action.player), 
						endRelicAnimation(),
						action,
					] : [action];
        case EFFECT_TYPE_PLAY_CREATURE:
          return (action.player !== 1) ? [
            startCreatureAnimation(action.card, action.player), 
            endCreatureAnimation(),
            action,
          ] : [action];
				case EFFECT_TYPE_PLAY_SPELL:
					return (action.player !== 1) ? [
						startSpellAnimation(action.card, action.player), 
						endSpellAnimation(),
						action,
					] : [action];
				case EFFECT_TYPE_START_STEP:
					return [
						endStepAnimation(),
						action,
					];
        case EFFECT_TYPE_MAGI_IS_DEFEATED: {
          return [
            startMagiDefeatAnimation(action.target.id),
            action,
          ];
        }
			}
			return [action];
		}
		default:
			return [action];
	}
};

const TIMERS_BY_EVENT = {
  [START_MAGI_DEFEAT_ANIMATION]: MAGI_DEFEATED_TIMEOUT,
	[START_PROMPT_RESOLUTION_ANIMATION]: PROMPT_RESOLUTION_TIMEOUT,
	[START_POWER_ANIMATION]: POWER_MESSAGE_TIMEOUT,
	[START_RELIC_ANIMATION]: RELIC_MESSAGE_TIMEOUT,
	[START_SPELL_ANIMATION]: SPELL_MESSAGE_TIMEOUT,
	[START_CREATURE_ANIMATION]: CREATURE_MESSAGE_TIMEOUT,
	[START_ATTACK_ANIMATION]: ATTACK_MESSAGE_TIMEOUT,
	[END_STEP_ANIMATION]: STEP_TIMEOUT,
};

const convertTimer = (type: any) => {
	return TIMERS_BY_EVENT[type] || 0;
};

export default function addAnimationsNew(action$: Observable<ClientCommand>, break$: Observable<{}>, store: Store<any, Action<any>>) {
  const actionsStorage: ClientCommand[] = []
  let delaying: boolean = false;
  let timeout: ReturnType<typeof setTimeout> = 0;
  let finished = false;

  const actionDelayed = new Observable<ClientCommand>(observer => {
    const streamActions = () => {
      while (actionsStorage.length) {
        const action = actionsStorage.shift();
        const delayBy = convertTimer(action.type)
        observer.next(action);
        if (delayBy > 0) {
          timeout = setTimeout(() => {
            delaying = false;
            streamActions();
          }, delayBy);
          delaying = true;
          return;
        }
      }
      if (finished) {
        observer.complete();
      }
    }

    break$.subscribe({
      next: () => {
        if (delaying) {
          console.log('Break applied');
          clearTimeout(timeout);
          delaying = false;
          streamActions();
        }
      }
    });

    action$.subscribe({
      next: (action) => {
        const convertedActions = convertAction(action, store);
        actionsStorage.push(...convertedActions);
        if (!delaying) {
          streamActions()
        }
      },
      complete: () => {
        if (!delaying && actionsStorage.length == 0) {
          observer.complete()
        } else {
          finished = true;
        }
      }
    })
  })

  return actionDelayed;
}
