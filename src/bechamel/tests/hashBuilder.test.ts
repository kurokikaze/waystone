// globals describe, it
import { State, ZONE_TYPE_ACTIVE_MAGI } from 'moonlands/dist/esm/index';
import { HashBuilder } from '../strategies/HashBuilder'
import CardInGame from 'moonlands/dist/esm/classes/CardInGame';
import { byName } from 'moonlands/dist/esm/cards';
import { createState, createZones } from '../strategies/simulationUtils';
import { ACTION_PASS, STEP_CREATURES, STEP_PRS_SECOND } from '../../const';
import Card from 'moonlands/dist/esm/classes/Card';
import { ACTION_EFFECT, ACTION_PLAY, EFFECT_TYPE_CARD_MOVED_BETWEEN_ZONES, ZONE_TYPE_HAND, ZONE_TYPE_IN_PLAY } from '../const';
import { AnyEffectType } from 'moonlands/dist/esm/types';

describe('hashBuilder', () => {
    it('builds hashes', () => {
        const ACTIVE_PLAYER = 422;
        const NON_ACTIVE_PLAYER = 1310;

        const welliskPup = new CardInGame(byName('Wellisk Pup') as Card, ACTIVE_PLAYER).addEnergy(2);
        const seaBarl = new CardInGame(byName('Sea Barl') as Card, ACTIVE_PLAYER).addEnergy(4);

        const orlon = new CardInGame(byName('Orlon') as Card, ACTIVE_PLAYER).addEnergy(7);
        const bwill = new CardInGame(byName('Bwill') as Card, ACTIVE_PLAYER).addEnergy(4);

        const nimbulo = new CardInGame(byName('Nimbulo') as Card, NON_ACTIVE_PLAYER).addEnergy(5);
        const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [welliskPup, seaBarl, bwill], [orlon]);

        const gameState = new State({
            zones,
            step: STEP_PRS_SECOND,
            activePlayer: ACTIVE_PLAYER,
            controllingPlayer: ACTIVE_PLAYER,
            prompt: false,
            promptParams: {},
            promptType: null,
            players: [1, 2],
            log: [],
            actions: [],
            savedActions: [],
            mayEffectActions: [],
            fallbackActions: [],
            continuousEffects: [],
            spellMetaData: {},
            delayedTriggers: [],
            attachedTo: {},
            cardsAttached: {},
        });
        gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

        gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([nimbulo]);

        const builder = new HashBuilder();
        expect(builder.makeHash(gameState)).toEqual('*4{}@7[]|#1(0/1):2|#2(0/1):4|#3(0/1):4|@5');
    });

    it('preserves queued prompt internals when cloning an active prompt state', () => {
        const ACTIVE_PLAYER = 422;
        const NON_ACTIVE_PLAYER = 1310;

        const gameState: any = {
            playerId: ACTIVE_PLAYER,
            state: {
                prompt: true,
                promptPlayer: ACTIVE_PLAYER,
                promptType: 'prompt/relic',
                promptMessage: 'Choose a relic',
                promptGeneratedBy: 'g1',
                promptVariable: 'relicTarget',
                promptParams: { zone: 'zones/in_play' },
                savedActions: [{ type: ACTION_PASS, player: ACTIVE_PLAYER }],
                mayEffectActions: [{ type: ACTION_PASS, player: ACTIVE_PLAYER }],
                fallbackActions: [{ type: ACTION_PASS, player: ACTIVE_PLAYER }],
                continuousEffects: [],
                step: STEP_PRS_SECOND,
                turn: 1,
            },
            getMyMagi: () => ({ card: 'Adis', data: { energy: 5, actionsUsed: [] }, id: 'm1', owner: ACTIVE_PLAYER }),
            getMyCreaturesInPlay: () => [],
            getMyRelicsInPlay: () => [],
            getEnemyCreaturesInPlay: () => [],
            getEnemyRelicsInPlay: () => [],
            getOpponentMagi: () => ({ card: 'Grega', data: { energy: 5, actionsUsed: [] }, id: 'm2', owner: NON_ACTIVE_PLAYER }),
            getPlayableCards: () => [],
            getMyDeckCards: () => [],
            getMyMagiPile: () => [],
            getContinuousEffects: () => [],
            getStep: () => STEP_PRS_SECOND,
            getTurn: () => 1,
            getMyCreaturesInPlay: () => [],
            getEnemyCreaturesInPlay: () => [],
        };

        const sim = createState(gameState, ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

        expect(sim.state.prompt).toBe(true);
        expect(sim.state.promptPlayer).toBe(ACTIVE_PLAYER);
        expect(sim.state.promptType).toBe('prompt/relic');
        expect(sim.state.promptMessage).toBe('Choose a relic');
        expect(sim.state.promptGeneratedBy).toBe('g1');
        expect(sim.state.promptVariable).toBe('relicTarget');
        expect(sim.state.promptParams).toEqual({ zone: 'zones/in_play' });
        expect(sim.state.savedActions).toHaveLength(1);
        expect(sim.state.mayEffectActions).toHaveLength(1);
        expect(sim.state.fallbackActions).toHaveLength(1);
    });

    it('follows summons', () => {
        const ACTIVE_PLAYER = 422;
        const NON_ACTIVE_PLAYER = 1310;

        const welliskPup = new CardInGame(byName('Wellisk Pup') as Card, ACTIVE_PLAYER).addEnergy(2);
        const seaBarl = new CardInGame(byName('Sea Barl') as Card, ACTIVE_PLAYER);
        const seaBarl2 = new CardInGame(byName('Sea Barl') as Card, ACTIVE_PLAYER);
        const orlon = new CardInGame(byName('Orlon') as Card, ACTIVE_PLAYER).addEnergy(7);
        const bwill = new CardInGame(byName('Bwill') as Card, ACTIVE_PLAYER).addEnergy(4);

        const nimbulo = new CardInGame(byName('Nimbulo') as Card, NON_ACTIVE_PLAYER).addEnergy(5);
        const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [welliskPup, bwill], [orlon]);

        const gameState = new State({
            zones,
            step: STEP_CREATURES,
            activePlayer: ACTIVE_PLAYER,
            controllingPlayer: ACTIVE_PLAYER,
            prompt: false,
            promptParams: {},
            promptType: null,
            players: [1, 2],
            log: [],
            actions: [],
            savedActions: [],
            mayEffectActions: [],
            fallbackActions: [],
            continuousEffects: [],
            spellMetaData: {},
            delayedTriggers: [],
            attachedTo: {},
            cardsAttached: {},
        });
        gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

        gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([nimbulo]);
        gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).add([seaBarl, seaBarl2]);

        const builder = new HashBuilder();
        expect(builder.makeHash(gameState)).toEqual("*3{3,4}@7[]|#1(0/1):2|#2(0/1):4|@5");

        gameState.setOnAction(action => {
            if (action.type === ACTION_EFFECT &&
                action.effectType === EFFECT_TYPE_CARD_MOVED_BETWEEN_ZONES &&
                action.sourceZone === ZONE_TYPE_HAND &&
                action.destinationZone === ZONE_TYPE_IN_PLAY
            ) {
                builder.registerChildHash(action.sourceCard.id, action.destinationCard.id);
            }
        });

        const secondSim = gameState.clone();

        const handOne = gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).cards.map(({ id }) => id)
        const handTwo = secondSim.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).cards.map(({ id }) => id)

        console.dir(handOne)
        console.dir(handTwo)

        secondSim.setOnAction(action => {
            if (action.type === ACTION_EFFECT &&
                action.effectType === EFFECT_TYPE_CARD_MOVED_BETWEEN_ZONES &&
                action.sourceZone === ZONE_TYPE_HAND &&
                action.destinationZone === ZONE_TYPE_IN_PLAY
            ) {
                builder.registerChildHash(action.sourceCard.id, action.destinationCard.id);
            }
        });
        console.log(builder.makeHash(gameState));
        const card = gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).cards[0];
        // console.dir(card);
        const playAction = {
            type: ACTION_PLAY,
            payload: {
                card,
                player: ACTIVE_PLAYER,
            },
        }
        gameState.update(playAction as AnyEffectType);
        const hashOne = builder.makeHash(gameState);

        const card2 = secondSim.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).cards[0];
        // console.dir(card);
        const playAction2 = {
            type: ACTION_PLAY,
            payload: {
                card: card2,
                player: ACTIVE_PLAYER,
            },
        }
        secondSim.update(playAction2 as AnyEffectType);
        const hashTwo = builder.makeHash(secondSim);

        const handOneAfter = gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).cards.map(({ id }) => id)
        const handTwoAfter = secondSim.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).cards.map(({ id }) => id)

        console.dir(handOneAfter)
        console.dir(handTwoAfter)
        expect(hashOne).toEqual(hashTwo);
    });

    it.only('diamond-shaped actions', () => {
        const ACTIVE_PLAYER = 422;
        const NON_ACTIVE_PLAYER = 1310;

        const welliskPup = new CardInGame(byName('Wellisk Pup') as Card, ACTIVE_PLAYER).addEnergy(2);
        const seaBarl = new CardInGame(byName('Sea Barl') as Card, ACTIVE_PLAYER);
        const seaBarl2 = new CardInGame(byName('Sea Barl') as Card, ACTIVE_PLAYER);
        const orlon = new CardInGame(byName('Orlon') as Card, ACTIVE_PLAYER).addEnergy(17);
        const bwill = new CardInGame(byName('Bwill') as Card, ACTIVE_PLAYER).addEnergy(4);

        const nimbulo = new CardInGame(byName('Nimbulo') as Card, NON_ACTIVE_PLAYER).addEnergy(5);
        const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [welliskPup, bwill], [orlon]);

        const gameState = new State({
            zones,
            step: STEP_CREATURES,
            activePlayer: ACTIVE_PLAYER,
            controllingPlayer: ACTIVE_PLAYER,
            prompt: false,
            promptParams: {},
            promptType: null,
            players: [1, 2],
            log: [],
            actions: [],
            savedActions: [],
            mayEffectActions: [],
            fallbackActions: [],
            continuousEffects: [],
            spellMetaData: {},
            delayedTriggers: [],
            attachedTo: {},
            cardsAttached: {},
        });
        gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

        gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([nimbulo]);
        gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).add([seaBarl, seaBarl2]);

        const builder = new HashBuilder();
        expect(builder.makeHash(gameState)).toEqual("*3{3,3}@17[]|#1(0/1):2|#2(0/1):4|@5");

        gameState.setOnAction(action => {
            if (action.type === ACTION_EFFECT &&
                action.effectType === EFFECT_TYPE_CARD_MOVED_BETWEEN_ZONES &&
                action.sourceZone === ZONE_TYPE_HAND &&
                action.destinationZone === ZONE_TYPE_IN_PLAY
            ) {
                builder.registerChildHash(action.sourceCard.id, action.destinationCard.id, action.sourceCard.card.name);
            }
        });

        const secondSim = gameState.clone();

        // const handOne = gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).cards.map(({id}) => id)
        // const handTwo = secondSim.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).cards.map(({id}) => id)

        // console.dir(handOne)
        // console.dir(handTwo)

        secondSim.setOnAction(action => {
            if (action.type === ACTION_EFFECT &&
                action.effectType === EFFECT_TYPE_CARD_MOVED_BETWEEN_ZONES &&
                action.sourceZone === ZONE_TYPE_HAND &&
                action.destinationZone === ZONE_TYPE_IN_PLAY
            ) {
                builder.registerChildHash(action.sourceCard.id, action.destinationCard.id, action.sourceCard.card.name);
            }
        });
        // console.log(builder.makeHash(gameState));
        const card = gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).cards[0];
        // console.dir(card);
        const playAction = {
            type: ACTION_PLAY,
            payload: {
                card,
                player: ACTIVE_PLAYER,
            },
        }
        gameState.update(playAction as AnyEffectType);
        const hashOne = builder.makeHash(gameState);

        const card2 = secondSim.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).cards[1];
        // console.dir(card);
        const playAction2 = {
            type: ACTION_PLAY,
            payload: {
                card: card2,
                player: ACTIVE_PLAYER,
            },
        }
        secondSim.update(playAction2 as AnyEffectType);
        const hashTwo = builder.makeHash(secondSim);

        // const handOneAfter = gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).cards.map(({id}) => id)
        // const handTwoAfter = secondSim.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).cards.map(({id}) => id)

        // console.dir(handOneAfter)
        // console.dir(handTwoAfter)
        // With indistinguishable duplicates, intermediate hashes may be the same
        // expect(hashOne).not.toEqual(hashTwo);

        // Okay, now to the final state
        const cardOneTwo = gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).cards[0];
        // console.dir(card);
        const playActionOneTwo = {
            type: ACTION_PLAY,
            payload: {
                card: cardOneTwo,
                player: ACTIVE_PLAYER,
            },
        }
        gameState.update(playActionOneTwo as AnyEffectType);
        const hashFinalOne = builder.makeHash(gameState);

        const cardTwoTwo = secondSim.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).cards[0];
        // console.dir(card);
        const playActionTwoTwo = {
            type: ACTION_PLAY,
            payload: {
                card: cardTwoTwo,
                player: ACTIVE_PLAYER,
            },
        }
        secondSim.update(playActionTwoTwo as AnyEffectType);
        const hashFinalTwo = builder.makeHash(secondSim);

        expect(hashFinalOne).toEqual(hashFinalTwo);
    });
});