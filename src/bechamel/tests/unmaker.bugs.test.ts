// Tests that isolate the known Unmaker revert bugs.
// Each test: save state → setCheckpoint → sim.update(…) → revertToCheckpoint
// → assert serialized state equals the saved snapshot.
import { State } from 'moonlands/dist/esm/index';
import { byName } from 'moonlands/dist/esm/cards';
import Card from 'moonlands/dist/esm/classes/Card';
import CardInGame from 'moonlands/dist/esm/classes/CardInGame';
import Zone from 'moonlands/dist/esm/classes/Zone';
import { Unmaker } from 'moonlands/dist/esm/unmaker/unmaker';
import {
    ACTION_EFFECT,
    ACTION_PASS,
    ACTION_PLAY,
    ACTION_POWER,
    ACTION_RESOLVE_PROMPT,
    EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
    ZONE_TYPE_ACTIVE_MAGI,
    ZONE_TYPE_HAND,
    ZONE_TYPE_IN_PLAY,
    ZONE_TYPE_DECK,
    ZONE_TYPE_DISCARD,
    ZONE_TYPE_MAGI_PILE,
    ZONE_TYPE_DEFEATED_MAGI,
} from 'moonlands/dist/esm/const';

const PLAYER = 1;
const OPPONENT = 2;
const STEP_PRS1 = 1;

/** Minimal zone set that satisfies State requirements. */
function makeZones(inPlay: CardInGame[] = [], hand: CardInGame[] = [], deck: CardInGame[] = []): Zone[] {
    return [
        new Zone('P1 hand', ZONE_TYPE_HAND, PLAYER),
        new Zone('P2 hand', ZONE_TYPE_HAND, OPPONENT),
        new Zone('P1 deck', ZONE_TYPE_DECK, PLAYER),
        new Zone('P2 deck', ZONE_TYPE_DECK, OPPONENT),
        new Zone('P1 discard', ZONE_TYPE_DISCARD, PLAYER),
        new Zone('P2 discard', ZONE_TYPE_DISCARD, OPPONENT),
        new Zone('P1 magi', ZONE_TYPE_ACTIVE_MAGI, PLAYER),
        new Zone('P2 magi', ZONE_TYPE_ACTIVE_MAGI, OPPONENT),
        new Zone('P1 pile', ZONE_TYPE_MAGI_PILE, PLAYER),
        new Zone('P2 pile', ZONE_TYPE_MAGI_PILE, OPPONENT),
        new Zone('P1 def', ZONE_TYPE_DEFEATED_MAGI, PLAYER),
        new Zone('P2 def', ZONE_TYPE_DEFEATED_MAGI, OPPONENT),
        new Zone('In play', ZONE_TYPE_IN_PLAY, null).add(inPlay),
    ];
}

function makeState(
    step = STEP_PRS1,
    inPlay: CardInGame[] = [],
    hand: CardInGame[] = [],
    deck: CardInGame[] = [],
    activeMagi?: CardInGame,
    opponentMagi?: CardInGame,
): State {
    const zones = makeZones(inPlay);
    // @ts-ignore
    const state = new State({ zones, step, activePlayer: PLAYER });
    state.setPlayers(PLAYER, OPPONENT);

    if (hand.length) state.getZone(ZONE_TYPE_HAND, PLAYER).add(hand);
    if (deck.length) state.getZone(ZONE_TYPE_DECK, PLAYER).add(deck);
    if (activeMagi) state.getZone(ZONE_TYPE_ACTIVE_MAGI, PLAYER).add([activeMagi]);
    if (opponentMagi) state.getZone(ZONE_TYPE_ACTIVE_MAGI, OPPONENT).add([opponentMagi]);

    state.enableDebug();
    return state;
}

function snapshot(state: State): string {
    return JSON.stringify(state.serializeData(PLAYER, false));
}

function promptCycleSignature(state: State, stateHash: string): string {
    const raw = state.state as any;
    return [
        stateHash,
        raw.prompt ? 1 : 0,
        raw.promptType || '',
        raw.promptPlayer ?? '',
        raw.promptGeneratedBy || '',
        raw.promptMessage || '',
        raw.step ?? '',
        raw.activePlayer ?? '',
    ].join('|');
}

function detectPromptCycle(signatures: string[], minConsecutiveRepeats = 3): { detected: boolean; signature: string | null; repeats: number } {
    if (signatures.length === 0) {
        return { detected: false, signature: null, repeats: 0 };
    }

    let previous = signatures[0];
    let currentRun = 1;

    for (let i = 1; i < signatures.length; i++) {
        const current = signatures[i];
        if (current === previous) {
            currentRun++;
            if (currentRun >= minConsecutiveRepeats) {
                return { detected: true, signature: current, repeats: currentRun };
            }
        } else {
            previous = current;
            currentRun = 1;
        }
    }

    return { detected: false, signature: null, repeats: 0 };
}

// ---------------------------------------------------------------------------
// Bug 1 – POWER: Arboll's Life Channel
//   Unmaker.generateUnAction line 658 throws null (reading 'id')
//   because the source creature (Arboll) is referenced after being discarded.
// ---------------------------------------------------------------------------
describe('Unmaker bug – POWER with prompt (Life Channel)', () => {
    it('reverts state correctly after Life Channel power is applied', () => {
        const arboll = new CardInGame(byName('Arboll') as Card, PLAYER).addEnergy(3);
        const grega = new CardInGame(byName('Grega') as Card, PLAYER).addEnergy(8);
        const sinder = new CardInGame(byName('Sinder') as Card, OPPONENT).addEnergy(6);

        const state = makeState(STEP_PRS1, [arboll], [], [], grega, sinder);
        const before = snapshot(state);

        const unmaker = new Unmaker(state);
        unmaker.setCheckpoint();

        const power = (arboll.card.data.powers as any[]).find(p => p.name === 'Life Channel');
        state.update({ type: ACTION_POWER, source: arboll, power, player: PLAYER } as any);

        unmaker.revertToCheckpoint();

        expect(snapshot(state)).toBe(before);
    });
});

// ---------------------------------------------------------------------------
// Bug 2 – CARDS_ORDER: Barak's Prophecy rearrange
//   Unmaker.generateUnAction line 560 throws null (reading 'length')
//   when recording the un-action for effects/rearrange_cards_of_zone.
// ---------------------------------------------------------------------------
describe('Unmaker bug – CARDS_ORDER (Barak Prophecy rearrange)', () => {
    it('reverts state correctly after CARDS_ORDER prompt resolution', () => {
        // Barak's power: look at top 4 cards of deck and rearrange them.
        const barak = new CardInGame(byName('Barak') as Card, PLAYER).addEnergy(10);
        const sinder = new CardInGame(byName('Sinder') as Card, OPPONENT).addEnergy(6);

        // Four deck cards that Prophecy will expose.
        const deckCards = ['Fire Chogo', 'Lava Aq', 'Magma Hyren', 'Diobor'].map(
            name => new CardInGame(byName(name) as Card, PLAYER),
        );

        const state = makeState(STEP_PRS1, [], [], deckCards, barak, sinder);

        // Apply the Prophecy power first (outside the checkpoint under test)
        // so the state is already in the rearrange-prompt.
        const prophecyPower = (barak.card.data.powers as any[]).find(p => p.name === 'Prophecy');
        state.update({ type: ACTION_POWER, source: barak, power: prophecyPower, player: PLAYER } as any);

        const before = snapshot(state);

        // Now test that CARDS_ORDER (resolving the rearrange) can be cleanly reverted.
        const unmaker = new Unmaker(state);
        unmaker.setCheckpoint();

        const topFourIds = state.getZone(ZONE_TYPE_DECK, PLAYER).cards.slice(0, 4).map((c: CardInGame) => c.id);
        state.update({
            type: ACTION_RESOLVE_PROMPT,
            cards: [...topFourIds].reverse(),
            generatedBy: (state.state as any).promptGeneratedBy,
            player: PLAYER,
        } as any);

        unmaker.revertToCheckpoint();

        expect(snapshot(state)).toBe(before);
    });
});

// ---------------------------------------------------------------------------
// Bug 3 – PLAY spell with effects/roll_die (Grow)
//   The game log is not reverted by the Unmaker.
//   PRNG state is already tracked correctly (die roll produces the same result).
// ---------------------------------------------------------------------------
describe('Unmaker bug – PLAY with roll_die (Grow)', () => {
    it('reverts the game log after Grow is played', () => {
        const grow = new CardInGame(byName('Grow') as Card, PLAYER);
        const poad = new CardInGame(byName('Poad') as Card, PLAYER).addEnergy(10);
        const sinder = new CardInGame(byName('Sinder') as Card, OPPONENT).addEnergy(6);
        const furok = new CardInGame(byName('Furok') as Card, PLAYER).addEnergy(3);

        const state = makeState(STEP_PRS1, [furok], [grow], [], poad, sinder);
        const logBefore = (state.serializeData(PLAYER, false) as any).log?.length ?? 0;

        const unmaker = new Unmaker(state);
        unmaker.setCheckpoint();

        const growCard = state.getZone(ZONE_TYPE_HAND, PLAYER).byId(grow.id)!;
        state.update({ type: ACTION_PLAY, payload: { card: growCard, player: PLAYER }, forcePriority: false, player: PLAYER } as any);

        unmaker.revertToCheckpoint();

        const logAfter = (state.serializeData(PLAYER, false) as any).log?.length ?? 0;
        expect(logAfter).toBe(logBefore);
    });

    it('produces the same die roll result after revert (PRNG is tracked)', () => {
        const grow1 = new CardInGame(byName('Grow') as Card, PLAYER);
        const grow2 = new CardInGame(byName('Grow') as Card, PLAYER);
        const poad = new CardInGame(byName('Poad') as Card, PLAYER).addEnergy(10);
        const sinder = new CardInGame(byName('Sinder') as Card, OPPONENT).addEnergy(6);
        const furok = new CardInGame(byName('Furok') as Card, PLAYER).addEnergy(3);

        const state = makeState(STEP_PRS1, [furok], [grow1, grow2], [], poad, sinder);
        state.initiatePRNG(42);
        const getDieRoll = () => {
            const log: any[] = (state.serializeData(PLAYER, false) as any).log ?? [];
            const entry = log.find((e: any) => e.type === 'log_entry/die_rolled');
            return entry?.result ?? null;
        };

        const unmaker = new Unmaker(state);

        unmaker.setCheckpoint();
        const growCard1a = state.getZone(ZONE_TYPE_HAND, PLAYER).byId(grow1.id)!;
        state.update({ type: ACTION_PLAY, payload: { card: growCard1a, player: PLAYER }, forcePriority: false, player: PLAYER } as any);
        const firstRoll = getDieRoll();
        unmaker.revertToCheckpoint();

        unmaker.setCheckpoint();
        const growCard1b = state.getZone(ZONE_TYPE_HAND, PLAYER).byId(grow1.id)!;
        state.update({ type: ACTION_PLAY, payload: { card: growCard1b, player: PLAYER }, forcePriority: false, player: PLAYER } as any);
        const secondRoll = getDieRoll();
        unmaker.revertToCheckpoint();

        expect(secondRoll).toBe(firstRoll);
    });
});

// ---------------------------------------------------------------------------
// Arderial bug A – POWER: Thunder Hyren's Replenish
//   Creature discards itself immediately (no prompt) then adds energy to another.
//   Unmaker.generateUnAction throws null (reading 'id') for the discard effect.
// ---------------------------------------------------------------------------
describe('Unmaker bug – POWER that discards source creature (Thunder Hyren Replenish)', () => {
    it('reverts state correctly after Replenish is applied', () => {
        const thunderHyren = new CardInGame(byName('Thunder Hyren') as Card, PLAYER).addEnergy(5);
        const lovian = new CardInGame(byName('Lovian') as Card, PLAYER).addEnergy(2);
        const adis = new CardInGame(byName('Adis') as Card, PLAYER).addEnergy(10);
        const sinder = new CardInGame(byName('Sinder') as Card, OPPONENT).addEnergy(6);

        const state = makeState(STEP_PRS1, [thunderHyren, lovian], [], [], adis, sinder);
        const before = snapshot(state);

        const power = (thunderHyren.card.data.powers as any[]).find(p => p.name === 'Replenish');
        const unmaker = new Unmaker(state);
        unmaker.setCheckpoint();

        state.update({ type: ACTION_POWER, source: thunderHyren, power, player: PLAYER } as any);

        unmaker.revertToCheckpoint();
        expect(snapshot(state)).toBe(before);
    });
});

// ---------------------------------------------------------------------------
// Arderial bug B – POWER: Alaban's Undream
//   Power enters a prompt, then returns a creature and discards Alaban.
//   Unmaker.generateUnAction throws null (reading 'id') for the discard effect.
// ---------------------------------------------------------------------------
describe('Unmaker bug – POWER that discards source after prompt (Alaban Undream)', () => {
    it('reverts state correctly after Undream power is applied', () => {
        const alaban = new CardInGame(byName('Alaban') as Card, PLAYER).addEnergy(6);
        const lovian = new CardInGame(byName('Lovian') as Card, PLAYER).addEnergy(3);
        const adis = new CardInGame(byName('Adis') as Card, PLAYER).addEnergy(10);
        const sinder = new CardInGame(byName('Sinder') as Card, OPPONENT).addEnergy(6);

        const state = makeState(STEP_PRS1, [alaban, lovian], [], [], adis, sinder);
        const before = snapshot(state);

        const power = (alaban.card.data.powers as any[]).find(p => p.name === 'Undream');
        const unmaker = new Unmaker(state);
        unmaker.setCheckpoint();

        state.update({ type: ACTION_POWER, source: alaban, power, player: PLAYER } as any);

        unmaker.revertToCheckpoint();
        expect(snapshot(state)).toBe(before);
    });
});

// ---------------------------------------------------------------------------
// Arderial bug C – POWER: Xyx Elder's Shockstorm
//   Uses effects/roll_die then selects creatures and discards energy from them.
//   Unmaker.generateUnAction throws undefined (reading 'length') for this effect.
// ---------------------------------------------------------------------------
describe('Unmaker bug – POWER with roll_die and discard_energy_from_creatures (Xyx Elder Shockstorm)', () => {
    it('reverts state correctly after Shockstorm power is applied', () => {
        const xyxElder = new CardInGame(byName('Xyx Elder') as Card, PLAYER).addEnergy(8);
        const lovian = new CardInGame(byName('Lovian') as Card, PLAYER).addEnergy(4);
        const adis = new CardInGame(byName('Adis') as Card, PLAYER).addEnergy(10);
        const sinder = new CardInGame(byName('Sinder') as Card, OPPONENT).addEnergy(6);

        const state = makeState(STEP_PRS1, [xyxElder, lovian], [], [], adis, sinder);
        state.initiatePRNG(99);
        const before = snapshot(state);

        const power = (xyxElder.card.data.powers as any[]).find(p => p.name === 'Shockstorm');
        const unmaker = new Unmaker(state);
        unmaker.setCheckpoint();

        state.update({ type: ACTION_POWER, source: xyxElder, power, player: PLAYER } as any);

        unmaker.revertToCheckpoint();
        expect(snapshot(state)).toBe(before);
    });
});

// ---------------------------------------------------------------------------
// Arderial bug D – POWER: Orish's Hypnotize
//   Moves cards from opponent's hand between zones (move_cards_between_zones).
//   Unmaker.generateUnAction throws undefined (reading 'length') for the zone op.
// ---------------------------------------------------------------------------
describe('Unmaker bug – POWER with move_cards_between_zones (Orish Hypnotize)', () => {
    it('reverts state correctly after Hypnotize power is applied', () => {
        const orish = new CardInGame(byName('Orish') as Card, PLAYER).addEnergy(5);
        const adis = new CardInGame(byName('Adis') as Card, PLAYER).addEnergy(10);
        const sinder = new CardInGame(byName('Sinder') as Card, OPPONENT).addEnergy(6);
        // Give opponent some hand cards to be moved.
        const oppHandCards = ['Leaf Hyren', 'Furok', 'Rudwot'].map(
            name => new CardInGame(byName(name) as Card, OPPONENT),
        );

        const state = makeState(STEP_PRS1, [orish], [], [], adis, sinder);
        state.getZone(ZONE_TYPE_HAND, OPPONENT).add(oppHandCards);

        const before = snapshot(state);

        const power = (orish.card.data.powers as any[]).find(p => p.name === 'Hypnotize');
        const unmaker = new Unmaker(state);
        unmaker.setCheckpoint();

        // Hypnotize enters a prompt/player first.
        state.update({ type: ACTION_POWER, source: orish, power, player: PLAYER } as any);

        unmaker.revertToCheckpoint();
        expect(snapshot(state)).toBe(before);
    });
});

// ---------------------------------------------------------------------------
// Engine bug – PLAY Fog Bank with no own creatures in play
//   Fog Bank uses EFFECT_TYPE_PLAY_ATTACHED_TO_CREATURE with attachmentTarget: '$target'.
//   When the DFS resolves the OWN_SINGLE_CREATURE prompt with no creatures available,
//   '$target' is null → applyPlayAttachedToCreatureEffect passes null to
//   EFFECT_TYPE_ATTACH_CARD_TO_CARD → applyAttachCardToCardEffect throws null (reading 'id').
// ---------------------------------------------------------------------------
describe('Engine bug – PLAY Fog Bank attached to creature when no creatures in play', () => {
    it('does not crash when Fog Bank prompt is resolved with no own creatures', () => {
        const fogBank = new CardInGame(byName('Fog Bank') as Card, PLAYER);
        const adis = new CardInGame(byName('Adis') as Card, PLAYER).addEnergy(15);
        const sinder = new CardInGame(byName('Sinder') as Card, OPPONENT).addEnergy(6);

        // No PLAYER creatures in play – '$target' will be null after prompt resolves.
        const state = makeState(STEP_PRS1, [], [fogBank], [], adis, sinder);

        const fogBankCard = state.getZone(ZONE_TYPE_HAND, PLAYER).byId(fogBank.id)!;
        state.update({ type: ACTION_PLAY, payload: { card: fogBankCard, player: PLAYER }, forcePriority: false, player: PLAYER } as any);

        // Resolving the own_creature prompt with null/empty selection should not crash.
        expect(() => {
            state.update({
                type: ACTION_RESOLVE_PROMPT,
                cards: [],
                generatedBy: (state.state as any).promptGeneratedBy,
                player: PLAYER,
            } as any);
        }).not.toThrow();

        // Fog Bank should NOT be in play (play was aborted due to no valid target).
        const fogBankInPlay = state.getZone(ZONE_TYPE_IN_PLAY).cards.find((c: any) => c.card.name === 'Fog Bank');
        expect(fogBankInPlay).toBeUndefined();
    });
});

// ---------------------------------------------------------------------------
// Arderial bug E – POWER resolve: Alaban's Undream (full resolution)
//   effects/return_creature_discarding_energy is not handled by the Unmaker.
//   After the creature prompt resolves, the Unmaker may crash accessing
//   Alaban's id after it has been discarded (null → 'id').
// ---------------------------------------------------------------------------
describe('Unmaker bug – POWER return_creature_discarding_energy resolved (Alaban Undream)', () => {
    it('reverts state correctly after Undream resolves', () => {
        const alaban = new CardInGame(byName('Alaban') as Card, PLAYER).addEnergy(6);
        const lovian = new CardInGame(byName('Lovian') as Card, PLAYER).addEnergy(3);
        const adis = new CardInGame(byName('Adis') as Card, PLAYER).addEnergy(10);
        const sinder = new CardInGame(byName('Sinder') as Card, OPPONENT).addEnergy(6);

        const state = makeState(STEP_PRS1, [alaban, lovian], [], [], adis, sinder);
        const before = snapshot(state);

        const power = (alaban.card.data.powers as any[]).find(p => p.name === 'Undream');
        const unmaker = new Unmaker(state);
        unmaker.setCheckpoint();

        state.update({ type: ACTION_POWER, source: alaban, power, player: PLAYER } as any);

        // Resolve the creature prompt with Lovian as the return target.
        const target = state.getZone(ZONE_TYPE_IN_PLAY).byId(lovian.id)!;
        state.update({
            type: ACTION_RESOLVE_PROMPT,
            target,
            generatedBy: (state.state as any).promptGeneratedBy,
            player: PLAYER,
        } as any);

        unmaker.revertToCheckpoint();
        expect(snapshot(state)).toBe(before);
    });
});

// ---------------------------------------------------------------------------
// Arderial bug F – PLAY spell: Updraft (return_creature_returning_energy)
//   effects/return_creature_returning_energy is not handled by the Unmaker.
//   Energy is moved from the creature back to the magi, and the creature
//   returns to hand; the Unmaker cannot record/revert this composite effect.
// ---------------------------------------------------------------------------
describe('Unmaker bug – PLAY spell return_creature_returning_energy (Updraft)', () => {
    it('reverts state correctly after Updraft returns a creature', () => {
        const updraft = new CardInGame(byName('Updraft') as Card, PLAYER);
        const lovian = new CardInGame(byName('Lovian') as Card, PLAYER).addEnergy(3);
        const adis = new CardInGame(byName('Adis') as Card, PLAYER).addEnergy(10);
        const sinder = new CardInGame(byName('Sinder') as Card, OPPONENT).addEnergy(6);

        const state = makeState(STEP_PRS1, [lovian], [updraft], [], adis, sinder);
        const before = snapshot(state);

        const unmaker = new Unmaker(state);
        unmaker.setCheckpoint();

        const updraftCard = state.getZone(ZONE_TYPE_HAND, PLAYER).byId(updraft.id)!;
        state.update({ type: ACTION_PLAY, payload: { card: updraftCard, player: PLAYER }, forcePriority: false, player: PLAYER } as any);

        // Resolve own_creature prompt: return Lovian to hand.
        const target = state.getZone(ZONE_TYPE_IN_PLAY).byId(lovian.id)!;
        state.update({
            type: ACTION_RESOLVE_PROMPT,
            target,
            generatedBy: (state.state as any).promptGeneratedBy,
            player: PLAYER,
        } as any);

        unmaker.revertToCheckpoint();
        expect(snapshot(state)).toBe(before);
    });
});

// ---------------------------------------------------------------------------
// Arderial bug G – POWER: Cloud Sceptre's Mindwinds
//   effects/move_cards_between_zones and effects/draw_n_cards — the Unmaker
//   must correctly revert bulk zone moves and card draws from the prompt
//   resolution context.
//   Note: ACTION_RESOLVE_PROMPT.cards must contain CardInGame objects (as the
//   real game provides after convertClientCommands), not bare ID strings.
// ---------------------------------------------------------------------------
describe('Unmaker bug – POWER move_cards_between_zones + draw_n_cards (Cloud Sceptre Mindwinds)', () => {
    it('reverts state correctly after Mindwinds discards and redraws', () => {
        const sceptre = new CardInGame(byName('Cloud Sceptre') as Card, PLAYER);
        const adis = new CardInGame(byName('Adis') as Card, PLAYER).addEnergy(10);
        const sinder = new CardInGame(byName('Sinder') as Card, OPPONENT).addEnergy(6);
        const handCards = ['Lovian', 'Orish', 'Thunder Hyren'].map(
            name => new CardInGame(byName(name) as Card, PLAYER),
        );
        const deckCards = ['Xyx', 'Vellup', 'Ayebaw'].map(
            name => new CardInGame(byName(name) as Card, PLAYER),
        );

        const state = makeState(STEP_PRS1, [sceptre], handCards, deckCards, adis, sinder);
        const before = snapshot(state);

        const power = (sceptre.card.data.powers as any[]).find(p => p.name === 'Mindwinds');
        const unmaker = new Unmaker(state);
        unmaker.setCheckpoint();

        state.update({ type: ACTION_POWER, source: sceptre, power, player: PLAYER, forcePriority: true } as any);

        // Resolve: choose 2 hand cards to discard (pass CardInGame objects as the engine expects).
        const hand = state.getZone(ZONE_TYPE_HAND, PLAYER).cards as CardInGame[];
        state.update({
            type: ACTION_RESOLVE_PROMPT,
            zone: ZONE_TYPE_HAND,
            zoneOwner: PLAYER,
            cards: hand.slice(0, 2),
            generatedBy: (state.state as any).promptGeneratedBy,
            player: PLAYER,
        } as any);

        unmaker.revertToCheckpoint();
        expect(snapshot(state)).toBe(before);
    });
});

// ---------------------------------------------------------------------------
// Arderial bug H – POWER: Eye of the Storm Energy Boost (roll = 1)
//   When the die shows 1, effects/move_cards_between_zones moves the hand to
//   discard.  This effect is not handled by the Unmaker.
//   PRNG seed 7 produces roll = 1 for this power.
// ---------------------------------------------------------------------------
describe('Unmaker bug – POWER with move_cards_between_zones discard hand (Eye of the Storm roll=1)', () => {
    it('reverts state correctly after Energy Boost discards the hand', () => {
        const eye = new CardInGame(byName('Eye of the Storm') as Card, PLAYER);
        const adis = new CardInGame(byName('Adis') as Card, PLAYER).addEnergy(10);
        const sinder = new CardInGame(byName('Sinder') as Card, OPPONENT).addEnergy(6);
        const handCards = ['Lovian', 'Orish', 'Thunder Hyren'].map(
            name => new CardInGame(byName(name) as Card, PLAYER),
        );

        const state = makeState(STEP_PRS1, [eye], handCards, [], adis, sinder);
        state.initiatePRNG(7); // seed 7 → die rolls 1 → discard hand path
        const before = snapshot(state);

        const power = (eye.card.data.powers as any[]).find(p => p.name === 'Energy Boost');
        const unmaker = new Unmaker(state);
        unmaker.setCheckpoint();

        state.update({ type: ACTION_POWER, source: eye, power, player: PLAYER } as any);

        unmaker.revertToCheckpoint();
        expect(snapshot(state)).toBe(before);
    });
});

// ---------------------------------------------------------------------------
// cards.js bug – Cyclone Vashp's Cyclone power
//   The third effect has target: 'ownCreature' (missing '$' prefix) instead of
//   target: '$ownCreature'.  When the engine dispatches DISCARD_CREATURE_FROM_PLAY
//   with this raw string as target, convertServerCommand does:
//     'length' in 'ownCreature'  →  TypeError (cannot use 'in' on primitive).
// ---------------------------------------------------------------------------
describe('cards.js bug – Cyclone Vashp Cyclone: DISCARD_CREATURE_FROM_PLAY with target $ownCreature', () => {
    it('reverts state correctly after Cyclone fully resolves', () => {
        const vashp = new CardInGame(byName('Cyclone Vashp') as Card, PLAYER).addEnergy(5);
        const target = new CardInGame(byName('Furok') as Card, OPPONENT).addEnergy(4);
        const adis = new CardInGame(byName('Adis') as Card, PLAYER).addEnergy(10);
        const sinder = new CardInGame(byName('Sinder') as Card, OPPONENT).addEnergy(6);

        const state = makeState(STEP_PRS1, [vashp, target], [], [], adis, sinder);
        const before = snapshot(state);

        const power = (vashp.card.data.powers as any[]).find(p => p.name === 'Cyclone');
        const unmaker = new Unmaker(state);
        unmaker.setCheckpoint();

        state.update({ type: ACTION_POWER, source: vashp, power, player: PLAYER } as any);

        // Resolve first prompt: choose own creature (Vashp itself)
        const ownTarget = state.getZone(ZONE_TYPE_IN_PLAY).byId(vashp.id)!;
        state.update({
            type: ACTION_RESOLVE_PROMPT,
            target: ownTarget,
            generatedBy: (state.state as any).promptGeneratedBy,
            player: PLAYER,
        } as any);

        // Resolve second prompt: choose opponent's creature
        const oppTarget = state.getZone(ZONE_TYPE_IN_PLAY).byId(target.id)!;
        state.update({
            type: ACTION_RESOLVE_PROMPT,
            target: oppTarget,
            generatedBy: (state.state as any).promptGeneratedBy,
            player: PLAYER,
        } as any);

        unmaker.revertToCheckpoint();
        expect(snapshot(state)).toBe(before);
    });
});

// ---------------------------------------------------------------------------
// Unmaker stream-corruption regression
//   If generateUnAction throws after partially mutating the blob/tag stacks,
//   the next checkpoint revert must still be able to read UnActionType tags.
// ---------------------------------------------------------------------------
describe('Unmaker bug – partial write before saveActionType should not desync later reverts', () => {
    it('restores blob stacks at checkpoint boundary after injected partial write', () => {
        const grega = new CardInGame(byName('Grega') as Card, PLAYER).addEnergy(15);
        const sinder = new CardInGame(byName('Sinder') as Card, OPPONENT).addEnergy(8);
        const arboll = new CardInGame(byName('Arboll') as Card, PLAYER);

        const state = makeState(STEP_PRS1, [], [arboll], [], grega, sinder);
        const before = snapshot(state);

        const unmaker = new Unmaker(state);
        const originalGenerate = (unmaker as any).generateUnAction.bind(unmaker);
        let injected = false;

        (unmaker as any).generateUnAction = function (action: any) {
            if (!injected) {
                injected = true;
                // Simulate a mid-write crash after mutating tag/pointer state.
                this.dataTags.push('EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES/destinationZoneType/strPos');
                this.pointer += 1;
                throw new Error('Injected partial unmake write');
            }

            return originalGenerate(action);
        };

        unmaker.setCheckpoint();
        expect(() => state.update({ type: ACTION_PASS, player: PLAYER } as any)).toThrow('Injected partial unmake write');
        expect(() => unmaker.revertToCheckpoint()).not.toThrow();

        // Restore original generator so the next action produces real unactions.
        (unmaker as any).generateUnAction = originalGenerate;

        const handCard = state.getZone(ZONE_TYPE_HAND, PLAYER).cards[0];
        expect(handCard).toBeTruthy();

        unmaker.setCheckpoint();
        state.update({
            type: ACTION_PLAY,
            payload: { card: handCard, player: PLAYER },
            forcePriority: false,
            player: PLAYER,
        } as any);

        // This revert used to throw "Expected tag UnActionType" before blob snapshots.
        expect(() => unmaker.revertToCheckpoint()).not.toThrow();
        expect(snapshot(state)).toBe(before);
    });
});

// ---------------------------------------------------------------------------
// Prompt-cycle detector regression
//   Distinguishes likely prompt loops (same prompt signature + same state hash
//   repeating) from normal prompt progress.
// ---------------------------------------------------------------------------
describe('Prompt loop signal – repeated prompt signature with unchanged state hash', () => {
    it('flags consecutive repeats of the same prompt signature', () => {
        const grega = new CardInGame(byName('Grega') as Card, PLAYER).addEnergy(10);
        const sinder = new CardInGame(byName('Sinder') as Card, OPPONENT).addEnergy(8);
        const state = makeState(STEP_PRS1, [], [], [], grega, sinder);

        (state.state as any).prompt = true;
        (state.state as any).promptType = 'prompt/creature_filtered';
        (state.state as any).promptPlayer = PLAYER;
        (state.state as any).promptGeneratedBy = 'firegrag';
        (state.state as any).promptMessage = 'Choose your creature';

        const repeated = promptCycleSignature(state, 'same-hash');
        const changing = promptCycleSignature(state, 'new-hash');

        const positive = detectPromptCycle([repeated, repeated, repeated, repeated], 3);
        expect(positive.detected).toBe(true);
        expect(positive.signature).toBe(repeated);
        expect(positive.repeats).toBeGreaterThanOrEqual(3);

        const negative = detectPromptCycle([repeated, changing, repeated, changing], 3);
        expect(negative.detected).toBe(false);
        expect(negative.signature).toBeNull();
    });
});

// ---------------------------------------------------------------------------
// Unmaker overflow regression (engine-facing)
//   Reproduces a partial write caused by blob overflow in a real un-action path
//   (EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES), then ensures subsequent checkpoint
//   reverts remain aligned.
// ---------------------------------------------------------------------------
describe('Unmaker bug – overflow during MOVE_CARD_BETWEEN_ZONES does not desync later reverts', () => {
    it('recovers from partial write and still reverts the next checkpoint', () => {
        const grega = new CardInGame(byName('Grega') as Card, PLAYER).addEnergy(12);
        const sinder = new CardInGame(byName('Sinder') as Card, OPPONENT).addEnergy(8);
        const arboll = new CardInGame(byName('Arboll') as Card, PLAYER).addEnergy(3);

        const state = makeState(STEP_PRS1, [arboll], [], [], grega, sinder);
        const before = snapshot(state);

        // Tiny blob ensures overflow happens mid-write for MOVE_CARD_BETWEEN_ZONES.
        const unmaker = new Unmaker(state, 3);

        unmaker.setCheckpoint();

        const moveAction = {
            type: ACTION_EFFECT,
            effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
            target: arboll,
            sourceZone: ZONE_TYPE_IN_PLAY,
            destinationZone: ZONE_TYPE_DISCARD,
            generatedBy: arboll.id,
            bottom: false,
        } as any;

        console.dir(unmaker.dataBlob, { depth: null });
        expect(() => (unmaker as any).generateUnAction(moveAction)).toThrow('Data blob overflow');
        console.dir(unmaker.dataBlob, { depth: null });

        // Must not throw even though a partial write happened.
        expect(() => unmaker.revertToCheckpoint()).not.toThrow();

        // Next checkpoint/revert should still function (historical failure point).
        unmaker.setCheckpoint();
        state.update({ type: ACTION_PASS, player: PLAYER } as any);
        expect(() => unmaker.revertToCheckpoint()).not.toThrow();

        expect(snapshot(state)).toBe(before);
    });
});

// ---------------------------------------------------------------------------
// Engine regression signal – stale move target id
//   Reproduces the deterministic failure where a move action references a card
//   id that is not present in the declared source zone.
// ---------------------------------------------------------------------------
describe('Engine invariant – MOVE_CARD_BETWEEN_ZONES with stale source id', () => {
    it('throws MOVE_ZONE_MISSING_SOURCE and does not clone card into destination', () => {
        const grega = new CardInGame(byName('Grega') as Card, PLAYER).addEnergy(12);
        const sinder = new CardInGame(byName('Sinder') as Card, OPPONENT).addEnergy(8);

        const handFogBank = new CardInGame(byName('Fog Bank') as Card, PLAYER);
        const staleFogBank = new CardInGame(byName('Fog Bank') as Card, PLAYER);

        const state = makeState(STEP_PRS1, [], [handFogBank], [], grega, sinder);

        const handBefore = state.getZone(ZONE_TYPE_HAND, PLAYER).cards.map((card: CardInGame) => card.id);
        const inPlayBefore = state.getZone(ZONE_TYPE_IN_PLAY).cards.map((card: CardInGame) => card.id);

        expect(() => state.update({
            type: ACTION_EFFECT,
            effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
            target: staleFogBank,
            sourceZone: ZONE_TYPE_HAND,
            destinationZone: ZONE_TYPE_IN_PLAY,
            generatedBy: staleFogBank.id,
            bottom: false,
        } as any)).toThrow('[MOVE_ZONE_MISSING_SOURCE]');

        const handAfter = state.getZone(ZONE_TYPE_HAND, PLAYER).cards.map((card: CardInGame) => card.id);
        const inPlayAfter = state.getZone(ZONE_TYPE_IN_PLAY).cards.map((card: CardInGame) => card.id);

        expect(handAfter).toEqual(handBefore);
        expect(inPlayAfter).toEqual(inPlayBefore);
        expect(state.getZone(ZONE_TYPE_HAND, PLAYER).containsId(handFogBank.id)).toBe(true);
        expect(state.getZone(ZONE_TYPE_IN_PLAY).containsId(staleFogBank.id)).toBe(false);
    });

    it('keeps Unmaker checkpoint revert safe after stale move throw', () => {
        const grega = new CardInGame(byName('Grega') as Card, PLAYER).addEnergy(12);
        const sinder = new CardInGame(byName('Sinder') as Card, OPPONENT).addEnergy(8);

        const handFogBank = new CardInGame(byName('Fog Bank') as Card, PLAYER);
        const staleFogBank = new CardInGame(byName('Fog Bank') as Card, PLAYER);

        const state = makeState(STEP_PRS1, [], [handFogBank], [], grega, sinder);
        const before = snapshot(state);

        const unmaker = new Unmaker(state);
        unmaker.setCheckpoint();

        const checkpointPointer = unmaker.getPointer();
        const checkpointUnActions = unmaker.numberOfUnActions;

        expect(() => state.update({
            type: ACTION_EFFECT,
            effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
            target: staleFogBank,
            sourceZone: ZONE_TYPE_HAND,
            destinationZone: ZONE_TYPE_IN_PLAY,
            generatedBy: staleFogBank.id,
            bottom: false,
        } as any)).toThrow('[MOVE_ZONE_MISSING_SOURCE]');

        expect(() => unmaker.revertToCheckpoint()).not.toThrow();
        expect(unmaker.getPointer()).toBe(checkpointPointer);
        expect(unmaker.numberOfUnActions).toBe(checkpointUnActions);
        expect(snapshot(state)).toBe(before);
    });
});

// ---------------------------------------------------------------------------
// Unmaker regression – Firestorm checkpoint stability
//   Firestorm chains prompt + discard creature + region-based selects and
//   discard energy effects. Repeating this branch many times should not cause
//   pointer/unaction drift after each revert.
// ---------------------------------------------------------------------------
describe('Unmaker bug – Firestorm repeated branch does not leak unmake state', () => {
    it('keeps pointer and unaction counts stable across repeated power+prompt reverts', () => {
        const lavaAq = new CardInGame(byName('Lava Aq') as Card, PLAYER).addEnergy(6);
        const arbolit = new CardInGame(byName('Arbolit') as Card, PLAYER).addEnergy(2);
        const weebo = new CardInGame(byName('Weebo') as Card, OPPONENT).addEnergy(2);
        const arboll = new CardInGame(byName('Arboll') as Card, OPPONENT).addEnergy(2);
        const grega = new CardInGame(byName('Grega') as Card, PLAYER).addEnergy(8);
        const pruitt = new CardInGame(byName('Pruitt') as Card, OPPONENT).addEnergy(8);

        const state = makeState(STEP_PRS1, [lavaAq, arbolit, weebo, arboll], [], [], grega, pruitt);
        const normalizePromptType = (data: any) => {
            if (data && data.promptType === '') {
                data.promptType = null;
            }
            return data;
        };
        const before = normalizePromptType(state.serializeData(PLAYER, false) as any);

        const firestorm = (lavaAq.card.data.powers as any[]).find(p => p.name === 'Firestorm');
        expect(firestorm).toBeTruthy();

        const unmaker = new Unmaker(state);

        for (let i = 0; i < 25; i++) {
            const checkpointPointer = unmaker.getPointer();
            const checkpointUnActions = unmaker.numberOfUnActions;

            unmaker.setCheckpoint();

            state.update({ type: ACTION_POWER, source: lavaAq, power: firestorm, player: PLAYER } as any);

            const target = state.getZone(ZONE_TYPE_IN_PLAY).byId(arbolit.id);
            expect(target).toBeTruthy();
            state.update({
                type: ACTION_RESOLVE_PROMPT,
                target,
                generatedBy: (state.state as any).promptGeneratedBy,
                player: PLAYER,
            } as any);

            const branchExpansion = unmaker.numberOfUnActions - checkpointUnActions;
            expect(branchExpansion).toBeGreaterThan(6);

            unmaker.revertToCheckpoint();

            expect(unmaker.getPointer()).toBe(checkpointPointer);
            expect(unmaker.numberOfUnActions).toBe(checkpointUnActions);
            const after = normalizePromptType(state.serializeData(PLAYER, false) as any);
            expect(after).toEqual(before);
        }
    });

    it('increases unmake expansion as Firestorm hits more non-Cald cards', () => {
        const runScenario = (extraOppCreatures: number) => {
            const lavaAq = new CardInGame(byName('Lava Aq') as Card, PLAYER).addEnergy(6);
            const arbolit = new CardInGame(byName('Arbolit') as Card, PLAYER).addEnergy(2);
            const weebo = new CardInGame(byName('Weebo') as Card, OPPONENT).addEnergy(2);
            const baseInPlay: CardInGame[] = [lavaAq, arbolit, weebo];

            for (let i = 0; i < extraOppCreatures; i++) {
                baseInPlay.push(new CardInGame(byName('Arboll') as Card, OPPONENT).addEnergy(2));
            }

            const grega = new CardInGame(byName('Grega') as Card, PLAYER).addEnergy(8);
            const pruitt = new CardInGame(byName('Pruitt') as Card, OPPONENT).addEnergy(8);

            const state = makeState(STEP_PRS1, baseInPlay, [], [], grega, pruitt);
            const firestorm = (lavaAq.card.data.powers as any[]).find(p => p.name === 'Firestorm');
            expect(firestorm).toBeTruthy();

            const unmaker = new Unmaker(state);
            const beforePointer = unmaker.getPointer();
            const beforeUnActions = unmaker.numberOfUnActions;

            unmaker.setCheckpoint();
            state.update({ type: ACTION_POWER, source: lavaAq, power: firestorm, player: PLAYER } as any);

            const target = state.getZone(ZONE_TYPE_IN_PLAY).byId(arbolit.id);
            expect(target).toBeTruthy();
            state.update({
                type: ACTION_RESOLVE_PROMPT,
                target,
                generatedBy: (state.state as any).promptGeneratedBy,
                player: PLAYER,
            } as any);

            const actionDelta = unmaker.numberOfUnActions - beforeUnActions;
            const pointerDelta = unmaker.getPointer() - beforePointer;

            unmaker.revertToCheckpoint();

            expect(unmaker.getPointer()).toBe(beforePointer);
            expect(unmaker.numberOfUnActions).toBe(beforeUnActions);

            return { actionDelta, pointerDelta };
        };

        const smallBoard = runScenario(0);
        const largeBoard = runScenario(4);

        expect(smallBoard.actionDelta).toBeGreaterThan(0);
        expect(smallBoard.pointerDelta).toBeGreaterThan(0);
        expect(largeBoard.actionDelta).toBeGreaterThan(smallBoard.actionDelta);
        expect(largeBoard.pointerDelta).toBeGreaterThan(smallBoard.pointerDelta);
    });

    it('does not leak unmake storage after revert as Firestorm hits more non-Cald cards', () => {
        const runScenario = (extraOppCreatures: number) => {
            const lavaAq = new CardInGame(byName('Lava Aq') as Card, PLAYER).addEnergy(6);
            const arbolit = new CardInGame(byName('Arbolit') as Card, PLAYER).addEnergy(2);
            const weebo = new CardInGame(byName('Weebo') as Card, OPPONENT).addEnergy(2);
            const baseInPlay: CardInGame[] = [lavaAq, arbolit, weebo];

            for (let i = 0; i < extraOppCreatures; i++) {
                baseInPlay.push(new CardInGame(byName('Arboll') as Card, OPPONENT).addEnergy(2));
            }

            const grega = new CardInGame(byName('Grega') as Card, PLAYER).addEnergy(8);
            const pruitt = new CardInGame(byName('Pruitt') as Card, OPPONENT).addEnergy(8);

            const state = makeState(STEP_PRS1, baseInPlay, [], [], grega, pruitt);
            const firestorm = (lavaAq.card.data.powers as any[]).find(p => p.name === 'Firestorm');
            expect(firestorm).toBeTruthy();

            const unmaker = new Unmaker(state);
            const beforePointer = unmaker.getPointer();
            const beforeUnActions = unmaker.numberOfUnActions;
            const beforeObjects = (unmaker as any).objects.length;
            const beforeStrings = (unmaker as any).strings.length;

            unmaker.setCheckpoint();
            state.update({ type: ACTION_POWER, source: lavaAq, power: firestorm, player: PLAYER } as any);

            const target = state.getZone(ZONE_TYPE_IN_PLAY).byId(arbolit.id);
            expect(target).toBeTruthy();
            state.update({
                type: ACTION_RESOLVE_PROMPT,
                target,
                generatedBy: (state.state as any).promptGeneratedBy,
                player: PLAYER,
            } as any);

            const actionDelta = unmaker.numberOfUnActions - beforeUnActions;
            const pointerDelta = unmaker.getPointer() - beforePointer;

            unmaker.revertToCheckpoint();

            const postRevertPointerDelta = unmaker.getPointer() - beforePointer;
            const postRevertActionDelta = unmaker.numberOfUnActions - beforeUnActions;
            const postRevertObjectDelta = (unmaker as any).objects.length - beforeObjects;
            const postRevertStringDelta = (unmaker as any).strings.length - beforeStrings;

            expect(postRevertPointerDelta).toBe(0);
            expect(postRevertActionDelta).toBe(0);
            expect(postRevertObjectDelta).toBe(0);
            expect(postRevertStringDelta).toBe(0);

            return {
                actionDelta,
                pointerDelta,
                postRevertActionDelta,
                postRevertPointerDelta,
                postRevertObjectDelta,
                postRevertStringDelta,
            };
        };

        const smallBoard = runScenario(0);
        const largeBoard = runScenario(4);

        expect(largeBoard.actionDelta).toBeGreaterThan(smallBoard.actionDelta);
        expect(largeBoard.pointerDelta).toBeGreaterThanOrEqual(smallBoard.pointerDelta);
        expect(largeBoard.postRevertActionDelta).toBe(0);
        expect(largeBoard.postRevertPointerDelta).toBe(0);
        expect(largeBoard.postRevertObjectDelta).toBe(0);
        expect(largeBoard.postRevertStringDelta).toBe(0);
    });

    it('reproduces Firestorm overflow with tiny blob and dumps write frontier', () => {
        const lavaAq = new CardInGame(byName('Lava Aq') as Card, PLAYER).addEnergy(6);
        const arbolit = new CardInGame(byName('Arbolit') as Card, PLAYER).addEnergy(2);
        const weebo = new CardInGame(byName('Weebo') as Card, OPPONENT).addEnergy(2);
        const arboll = new CardInGame(byName('Arboll') as Card, OPPONENT).addEnergy(2);
        const grega = new CardInGame(byName('Grega') as Card, PLAYER).addEnergy(8);
        const pruitt = new CardInGame(byName('Pruitt') as Card, OPPONENT).addEnergy(8);

        const state = makeState(STEP_PRS1, [lavaAq, arbolit, weebo, arboll], [], [], grega, pruitt);
        const firestorm = (lavaAq.card.data.powers as any[]).find(p => p.name === 'Firestorm');
        expect(firestorm).toBeTruthy();

        // Small enough to force a mid-action overflow during Firestorm resolution.
        const unmaker = new Unmaker(state, 24);
        unmaker.setCheckpoint();

        let thrown: Error | null = null;
        try {
            state.update({ type: ACTION_POWER, source: lavaAq, power: firestorm, player: PLAYER } as any);

            const target = state.getZone(ZONE_TYPE_IN_PLAY).byId(arbolit.id);
            expect(target).toBeTruthy();
            state.update({
                type: ACTION_RESOLVE_PROMPT,
                target,
                generatedBy: (state.state as any).promptGeneratedBy,
                player: PLAYER,
            } as any);
        } catch (error) {
            thrown = error as Error;
        }

        expect(thrown).toBeTruthy();
        expect(thrown!.message).toContain('Data blob overflow');

        const ptr = unmaker.getPointer();
        const tags = (unmaker as any).dataTags as string[];
        const blob = (unmaker as any).dataBlob as Uint16Array;
        const ua = unmaker.numberOfUnActions;
        const stringsLen = (unmaker as any).strings.length;
        const objectsLen = (unmaker as any).objects.length;
        const tailStart = Math.max(0, ptr - 12);
        const tailEnd = Math.min(blob.length, ptr + 1);
        const blobTail = Array.from(blob.slice(tailStart, tailEnd));
        const tagTail = tags.slice(Math.max(0, tags.length - 12));

        console.log('[TEST][FIRESTORM_OVERFLOW]', JSON.stringify({
            message: thrown!.message,
            ptr,
            blobSize: blob.length,
            ua,
            tagsLen: tags.length,
            stringsLen,
            objectsLen,
            blobTailStart: tailStart,
            blobTail,
            tagTail,
        }));

        // Even after partial writes, checkpoint revert should remain safe.
        expect(() => unmaker.revertToCheckpoint()).not.toThrow();
    });
});

describe('Diobor unmaker problem', () => {
    it('restores the prompt variable when a resolved power prompt is reverted', () => {
        const ora = new CardInGame(byName('Ora') as Card, PLAYER).addEnergy(12);
        const sinder = new CardInGame(byName('Sinder') as Card, OPPONENT).addEnergy(8);

        const diobor = new CardInGame(byName('Diobor') as Card, PLAYER).addEnergy(6);
        const flameHyren = new CardInGame(byName('Flame Hyren') as Card, OPPONENT).addEnergy(15);
        const vellup = new CardInGame(byName('Vellup') as Card, PLAYER).addEnergy(3);
        vellup.data.energyLostThisTurn = 2;

        const state = makeState(STEP_PRS1, [vellup, flameHyren], [diobor], [], ora, sinder);
        const unmaker = new Unmaker(state);

        const power = diobor.card.data.powers?.find((p: any) => p.name === 'Fireball');
        expect(() => state.update({
            type: ACTION_POWER,
            source: diobor,
            power,
            player: PLAYER,
        } as any)).not.toThrow();

        const generatedBy = (state.state as any).promptGeneratedBy;
        expect(generatedBy).toBeTruthy();
        (state.state as any).promptVariable = 'target';

        unmaker.setCheckpoint();
        const before = snapshot(state);

        expect(() => state.update({
            type: ACTION_RESOLVE_PROMPT,
            target: diobor,
            generatedBy,
            player: PLAYER,
        } as any)).not.toThrow();

        unmaker.revertToCheckpoint();
        expect((state.state as any).promptVariable).toBe('target');
        expect(snapshot(state)).toBe(before);
    });

    it('Fireball targeting Diobor itself', () => {
        const ora = new CardInGame(byName('Ora') as Card, PLAYER).addEnergy(12);
        const sinder = new CardInGame(byName('Sinder') as Card, OPPONENT).addEnergy(8);

        const diobor = new CardInGame(byName('Diobor') as Card, PLAYER).addEnergy(6);
        const flameHyren = new CardInGame(byName('Flame Hyren') as Card, OPPONENT).addEnergy(15);
        const vellup = new CardInGame(byName('Vellup') as Card, PLAYER).addEnergy(3);
        vellup.data.energyLostThisTurn = 2;

        const state = makeState(STEP_PRS1, [vellup, flameHyren], [diobor], [], ora, sinder);

        const unmaker = new Unmaker(state);
        unmaker.setCheckpoint();

        const dioborPower = diobor.card.data.powers?.find((p: any) => p.name === 'Fireball');
        expect(() => state.update({
            type: ACTION_POWER,
            source: diobor,
            power: dioborPower,
            player: PLAYER,
        } as any)).not.toThrow();

        unmaker.setCheckpoint();
        const before = snapshot(state);

        expect(() => state.update({
            type: ACTION_RESOLVE_PROMPT,
            target: diobor,
            generatedBy: (state.state as any).promptGeneratedBy,
            player: PLAYER,
        } as any)).not.toThrow();

        unmaker.revertToCheckpoint();
        expect(snapshot(state)).toBe(before);
    });
});

// ---------------------------------------------------------------------------
// Moonlands regression signal – Raxis relic prompt + Unmaker revert
//   A checkpoint taken before Shatterfire should restore prompt internals.
//   Current behavior leaves stale savedActions / promptPlayer after revert,
//   which can later surface as "Non-prompt action in the prompt state" in
//   deep simulation branches.
// ---------------------------------------------------------------------------
describe('Moonlands regression – prompt internals must be restored after Shatterfire revert', () => {
    it('restores savedActions and promptPlayer after reverting a relic prompt branch', () => {
        const adis = new CardInGame(byName('Adis') as Card, OPPONENT).addEnergy(12);
        const sinder = new CardInGame(byName('Sinder') as Card, PLAYER).addEnergy(12);

        const raxis = new CardInGame(byName('Raxis') as Card, PLAYER).addEnergy(5);
        const magmaArmor = new CardInGame(byName('Magma Armor') as Card, PLAYER);
        const crown = new CardInGame(byName("Arderial's Crown") as Card, OPPONENT);

        const state = makeState(STEP_PRS1, [raxis, magmaArmor, crown], [], [], sinder, adis);
        const unmaker = new Unmaker(state);

        const before = {
            prompt: (state.state as any).prompt,
            promptType: (state.state as any).promptType,
            promptPlayer: (state.state as any).promptPlayer,
            savedActionsLength: ((state.state as any).savedActions ?? []).length,
        };

        const shatterfire = (raxis.card.data.powers as any[]).find((p: any) => p.name === 'Shatterfire');
        expect(shatterfire).toBeTruthy();

        unmaker.setCheckpoint();

        state.update({ type: ACTION_POWER, source: raxis, power: shatterfire, player: PLAYER } as any);
        state.update({
            type: ACTION_RESOLVE_PROMPT,
            target: state.getZone(ZONE_TYPE_IN_PLAY).byId(magmaArmor.id),
            generatedBy: (state.state as any).promptGeneratedBy,
            player: (state.state as any).promptPlayer,
        } as any);

        unmaker.revertToCheckpoint();

        expect((state.state as any).prompt).toBe(before.prompt);
        expect((state.state as any).promptType).toBe(before.promptType);
        expect((state.state as any).promptPlayer).toBe(before.promptPlayer);
        expect(((state.state as any).savedActions ?? []).length).toBe(before.savedActionsLength);
    });

    it('restores savedActions content to the pre-prompt checkpoint baseline', () => {
        const adis = new CardInGame(byName('Adis') as Card, OPPONENT).addEnergy(12);
        const sinder = new CardInGame(byName('Sinder') as Card, PLAYER).addEnergy(12);

        const raxis = new CardInGame(byName('Raxis') as Card, PLAYER).addEnergy(5);
        const magmaArmor = new CardInGame(byName('Magma Armor') as Card, PLAYER);
        const crown = new CardInGame(byName("Arderial's Crown") as Card, OPPONENT);

        const state = makeState(STEP_PRS1, [raxis, magmaArmor, crown], [], [], sinder, adis);
        const unmaker = new Unmaker(state);

        const beforeSavedActions = JSON.parse(JSON.stringify((state.state as any).savedActions ?? []));

        const shatterfire = (raxis.card.data.powers as any[]).find((p: any) => p.name === 'Shatterfire');
        expect(shatterfire).toBeTruthy();

        unmaker.setCheckpoint();

        state.update({ type: ACTION_POWER, source: raxis, power: shatterfire, player: PLAYER } as any);
        state.update({
            type: ACTION_RESOLVE_PROMPT,
            target: state.getZone(ZONE_TYPE_IN_PLAY).byId(magmaArmor.id),
            generatedBy: (state.state as any).promptGeneratedBy,
            player: (state.state as any).promptPlayer,
        } as any);

        unmaker.revertToCheckpoint();

        const afterSavedActions = JSON.parse(JSON.stringify((state.state as any).savedActions ?? []));
        expect(afterSavedActions).toEqual(beforeSavedActions);
    });
});
