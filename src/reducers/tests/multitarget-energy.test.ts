import { applyEffect } from '../applyEffect';
import { createInitialState } from '../initialState';
import CardInGame from 'moonlands/dist/esm/classes/CardInGame';
import { byName } from 'moonlands/dist/esm/cards';

describe('Magi energy commands with multiple targets', () => {
    for (const effectType of ['effects/add_energy_to_magi', 'effects/remove_energy_from_magi']) {
        for (const count of [0, 1, 2]) {
            it(`${effectType} applies once to each of ${count} targets`, () => {
                const state = createInitialState();
                const targets = [new CardInGame(byName('Whall')!, 1).addEnergy(7).serialize(), new CardInGame(byName('Motash')!, 2).addEnergy(5).serialize()];
                state.zones.playerActiveMagi = [targets[0]];
                state.zones.opponentActiveMagi = [targets[1]];
                const next = applyEffect(state, { type: 'actions/effect', effectType, target: targets.slice(0, count).map(card => ({ id: card.id })), amount: 2 } as any);
                const delta = effectType === 'effects/add_energy_to_magi' ? 2 : -2;
                expect([...next.zones.playerActiveMagi, ...next.zones.opponentActiveMagi].map(card => card.data.energy)).toEqual([7, 5].map((amount, index) => amount + (index < count ? delta : 0)));
                if (delta > 0) {
                    expect(next.log).toHaveLength(count);
                    expect(next.energyLosses.map(entry => entry.card)).toEqual(targets.slice(0, count).map(card => card.id));
                    expect(new Set(next.energyLosses.map(entry => entry.id)).size).toBe(count);
                }
            });
        }
    }
});
