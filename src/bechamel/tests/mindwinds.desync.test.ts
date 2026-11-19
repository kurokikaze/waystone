import { State } from 'moonlands/dist/esm/index';
import { byName } from 'moonlands/dist/esm/cards';
import CardInGame from 'moonlands/dist/esm/classes/CardInGame';
import {
    ZONE_TYPE_ACTIVE_MAGI, ZONE_TYPE_DECK, ZONE_TYPE_DISCARD,
    ZONE_TYPE_HAND, ZONE_TYPE_IN_PLAY,
} from 'moonlands/dist/esm/const';
import { GameState } from '../GameState';
import type { SerializedClientState } from '../types';
import { createState, createZones } from '../strategies/simulationUtils';
import { DirectActionExtractor, type DirectCardsAction } from '../strategies/DirectActionExtractor';

function card(name: string, id: string, owner = 1): CardInGame {
    return new CardInGame(byName(name)!, owner, () => id);
}

// Essential parts of debug_state.json, recreated by activating the real power:
// serializeData alone omits the prompt's continuation and spell metadata.
function mindwindsState(): State {
    const zones = createZones(1, 2, [card('Cloud Sceptre', 'sceptre')]);
    const live = new State({ zones, activePlayer: 1, step: 1 } as State['state']);
    live.setPlayers(1, 2);
    live.getZone(ZONE_TYPE_ACTIVE_MAGI, 1).add([card('Ora', 'ora').addEnergy(33)]);
    live.getZone(ZONE_TYPE_ACTIVE_MAGI, 2).add([card('Pruitt', 'pruitt', 2).addEnergy(3)]);
    live.getZone(ZONE_TYPE_HAND, 1).add([
        ...Array.from({ length: 5 }, (_, index) => card('Grega', `hand-${index}`)),
        card('Xyx Elder', 'elder'),
    ]);
    live.getZone(ZONE_TYPE_DECK, 1).add([card('Grega', 'deck-1'), card('Grega', 'deck-2')]);
    const gameState = new GameState(live.serializeData(1, false) as unknown as SerializedClientState);
    gameState.setPlayerId(1);
    const sim = createState(gameState, 1, 2);
    sim.getZone(ZONE_TYPE_DISCARD, 1).add([card('Storm Cloud', 'storm-cloud')]);
    DirectActionExtractor.applyAction(sim, {
        type: 'POWER', sourceId: 'sceptre', powerName: 'Mindwinds', label: 'Mindwinds',
    }, 1, 2);
    return sim;
}

describe('Mindwinds search reshuffle determinism', () => {
    afterEach(() => jest.restoreAllMocks());

    it('binds reconstructed decks to the RNG that search frames restore', () => {
        const sim = mindwindsState();
        for (const player of [1, 2]) {
            expect((sim.getZone(ZONE_TYPE_DECK, player) as any)._twister).toBe(sim.twister);
        }
    });

    it('resolves the prompt and replays identical redraws after rollback without Math.random', () => {
        const sim = mindwindsState();
        expect(sim.state.prompt).toBe(true);
        const action = DirectActionExtractor.extractActions(sim, 1, 2)
            .find(candidate => candidate.type === 'CARDS' && candidate.cardIds.length === 3) as DirectCardsAction;
        expect(action).toBeDefined();
        const baseline = JSON.stringify(sim.serializeData(1, false));
        const random = jest.spyOn(Math, 'random').mockReturnValue(0);

        function redraw(): string {
            const frame = sim.beginSearchFrame();
            try {
                DirectActionExtractor.applyAction(sim, action, 1, 2);
                expect(sim.state.prompt).toBe(false);
                return JSON.stringify(sim.serializeData(1, false));
            } finally {
                sim.rollback(frame);
            }
        }

        const first = redraw();
        expect(JSON.stringify(sim.serializeData(1, false))).toBe(baseline);
        random.mockReturnValue(0.5);
        const second = redraw();
        expect(second).toBe(first);
        expect(random).not.toHaveBeenCalled();
        expect(JSON.stringify(sim.serializeData(1, false))).toBe(baseline);
        expect(sim.getZone(ZONE_TYPE_IN_PLAY).byId('sceptre')).toBeDefined();
    });
});