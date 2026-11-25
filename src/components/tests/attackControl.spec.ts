import { byName } from 'moonlands/dist/esm/cards';
import { State as EngineState } from 'moonlands/dist/esm/index';
import * as C from 'moonlands/dist/esm/const';
import { tickDownContinuousEffects } from 'duel-protocol/effects';
import { getAttackControllingPlayer, isAttackAvailable, isAttackingWithOpponent, isOurAction, canPass, isPRSAvailable } from '../../selectors';
import { STEP_ATTACK, STEP_PRS_FIRST, STEP_CREATURES } from '../../const';
import { State, DraggedItem, SecondCard } from '../../types';
import { canFirstAttackSecond, canPackHuntWith } from '../helpers';

function setup(caster = 1) {
  const opponent = caster === 1 ? 2 : 1;
  const definition = byName('Will of Orothe')!.data.effects!.find((effect: any) =>
    effect.staticAbilities?.some((ability: any) => ability.property === C.PROPERTY_CONTROLLING_PLAYER)) as any;
  const effect = {
    ...definition, player: caster, generatedBy: 'will', id: 'will',
    expiration: { ...definition.expiration, turnPlayer: opponent, active: false },
    staticAbilities: definition.staticAbilities.map((ability: any) => ({
      ...ability, selectorParameter: opponent, modifier: { ...ability.modifier, operandOne: caster },
    })),
  };
  return { caster, opponent, state: { activePlayer: opponent, playerNumber: caster, step: STEP_ATTACK,
    continuousEffects: tickDownContinuousEffects([effect], true, opponent), prompt: false, gameEnded: false } as State };
}

describe('Will of Orothe attack controls', () => {
  it.each([1, 2])('matches engine attack priority for caster %i as steps and activation change', caster => {
    const { state, opponent } = setup(caster);
    for (const active of [false, true]) {
      const effects = state.continuousEffects.map(effect => ({ ...effect, expiration: { ...effect.expiration, active } }));
      for (const step of [STEP_PRS_FIRST, STEP_ATTACK, STEP_CREATURES]) {
        const engine = new EngineState({ activePlayer: opponent, controllingPlayer: opponent, zones: [], step, continuousEffects: effects } as any);
        engine.setPlayers(caster, opponent);
        expect(getAttackControllingPlayer({ ...state, step, continuousEffects: effects })).toBe(engine.getControllingPlayer());
      }
    }
  });
  it.each([1, 2])('allows caster %i to attack with opponent creatures and pass, but blocks the turn owner', caster => {
    const { state, opponent } = setup(caster);
    expect(getAttackControllingPlayer(state)).toBe(caster);
    expect(isAttackAvailable(state)).toBe(true);
    expect(isAttackingWithOpponent(state)).toBe(true);
    expect(canPass(state)).toBe(true);
    expect(isPRSAvailable(state)).toBe(false);
    const opponentView = { ...state, playerNumber: opponent };
    expect(isAttackAvailable(opponentView)).toBe(false);
    expect(canPass(opponentView)).toBe(false);
  });

  it.each([STEP_PRS_FIRST, STEP_CREATURES])('does not transfer control of step %i', step => {
    const { state, opponent } = setup();
    state.step = step;
    expect(getAttackControllingPlayer(state)).toBe(opponent);
    expect(isOurAction(state)).toBe(false);
    expect(isAttackAvailable(state)).toBe(false);
  });

  it('does not activate a waiting effect and returns control when it expires', () => {
    const { state, opponent } = setup();
    const activeEffects = state.continuousEffects;
    state.continuousEffects = activeEffects.map(effect => ({ ...effect, expiration: { ...effect.expiration, active: false } }));
    expect(getAttackControllingPlayer(state)).toBe(opponent);
    state.continuousEffects = tickDownContinuousEffects(activeEffects, false, opponent);
    expect(state.continuousEffects).toEqual([]);
    expect(getAttackControllingPlayer(state)).toBe(opponent);
  });

  it('ignores control of another player and blocks dragging and passing during a prompt or after game end', () => {
    const { state, caster, opponent } = setup();
    state.activePlayer = caster;
    expect(getAttackControllingPlayer(state)).toBe(caster);
    expect(isAttackingWithOpponent(state)).toBe(false);
    state.activePlayer = opponent;
    for (const block of [{ prompt: true }, { gameEnded: true }]) {
      expect(isAttackAvailable({ ...state, ...block })).toBe(false);
      expect(canPass({ ...state, ...block })).toBe(false);
    }
  });

  it('preserves normal attack control without the effect', () => {
    const { state } = setup();
    state.continuousEffects = [];
    state.activePlayer = state.playerNumber;
    expect(isAttackAvailable(state)).toBe(true);
    expect(isAttackingWithOpponent(state)).toBe(false);
  });
});

describe('attack drop targets', () => {
  const creature = (controller: number, name = 'Weebo') => ({ card: byName(name)!, data: { controller, attacked: 0 }, id: String(controller), guarded: false } as DraggedItem & SecondCard);
  const magi = (controller: number, guarded: boolean) => ({ card: byName('Grega')!, data: { controller }, id: 'magi', guarded } as SecondCard);

  it('allows dragging opponent creatures onto our creatures and unguarded Magi', () => {
    expect(canFirstAttackSecond(creature(2), creature(1))).toBe(true);
    expect(canFirstAttackSecond(creature(2), magi(1, false))).toBe(true);
    expect(canFirstAttackSecond(creature(2), magi(1, true))).toBe(false);
    expect(canFirstAttackSecond(creature(2, 'Stagadan'), magi(1, true))).toBe(true);
  });

  it('rejects friendly attacks and pack hunts with opposing creatures', () => {
    expect(canFirstAttackSecond(creature(2), creature(2))).toBe(false);
    expect(canFirstAttackSecond(creature(2), magi(2, false))).toBe(false);
    expect(canPackHuntWith(creature(2, 'Gum-Gum'), creature(1))).toBe(false);
  });
});
