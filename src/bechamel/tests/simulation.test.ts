// globals describe, it
import {State} from 'moonlands/src'
import {byName} from 'moonlands/src/cards';
import Card from 'moonlands/src/classes/Card';
import CardInGame from 'moonlands/src/classes/CardInGame';
import {SimulationStrategy} from '../strategies/SimulationStrategy'
import {GameState} from '../GameState';
import {createZones} from '../strategies/simulationUtils';
import {SerializedClientState} from '../types';
import { ZONE_TYPE_ACTIVE_MAGI } from 'moonlands';

const STEP_NAME = {
  ENERGIZE: 0,
  PRS1: 1,
  ATTACK: 2,
  CREATURES: 3,
  PRS2: 4,
  DRAW: 5,
}

describe('Simulations', () => {
  it('test', () => {
    const ACTIVE_PLAYER = 422;
		const NON_ACTIVE_PLAYER = 1310;

		const weebo = new CardInGame(byName('Weebo') as Card, ACTIVE_PLAYER).addEnergy(1);
		const timberHyren = new CardInGame(byName('Timber Hyren') as Card, ACTIVE_PLAYER).addEnergy(6);
		const weebo2 = new CardInGame(byName('Weebo') as Card, ACTIVE_PLAYER).addEnergy(1);
		const carillion = new CardInGame(byName('Carillion') as Card, ACTIVE_PLAYER).addEnergy(3);
		const lavaBalamant = new CardInGame(byName('Lava Balamant') as Card, NON_ACTIVE_PLAYER).addEnergy(5);
		const kelthet = new CardInGame(byName('Kelthet') as Card, NON_ACTIVE_PLAYER).addEnergy(4);
		const lavaAq = new CardInGame(byName('Lava Aq') as Card, NON_ACTIVE_PLAYER).addEnergy(2);
		const pruitt = new CardInGame(byName('Pruitt') as Card, ACTIVE_PLAYER).addEnergy(5);
		const magam = new CardInGame(byName('Magam') as Card, ACTIVE_PLAYER).addEnergy(4);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [weebo, timberHyren, weebo2, carillion, lavaBalamant, kelthet, lavaAq]);

    // @ts-ignore
		const gameState = new State({
			zones,
			step: STEP_NAME.PRS1,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

    gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([pruitt]);
    gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([magam]);

    const serializedState = gameState.serializeData(ACTIVE_PLAYER) as SerializedClientState

    const stateRepresentation = new GameState(serializedState)
    stateRepresentation.setPlayerId(ACTIVE_PLAYER)

    const strategy = new SimulationStrategy()

    strategy.setup(stateRepresentation, ACTIVE_PLAYER)

    console.dir(strategy.requestAction())
  })
})