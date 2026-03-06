import { ZONE_TYPE_ACTIVE_MAGI, ZONE_TYPE_HAND, State } from "moonlands/dist/esm/index";
import { byName } from "moonlands/dist/esm/cards";
import Card from "moonlands/dist/esm/classes/Card";
import CardInGame from "moonlands/dist/esm/classes/CardInGame";
import { createZones } from "../strategies/simulationUtils";

const STEP_NAME = {
    ENERGIZE: 0,
    PRS1: 1,
    ATTACK: 2,
    CREATURES: 3,
    PRS2: 4,
    DRAW: 5,
}

export function getStandardState(ACTIVE_PLAYER: number, NON_ACTIVE_PLAYER: number): State {
    const weebo = new CardInGame(byName('Weebo') as Card, ACTIVE_PLAYER).addEnergy(1);
    weebo.setActionUsed('Vitalize')
    const timberHyren = new CardInGame(byName('Timber Hyren') as Card, ACTIVE_PLAYER).addEnergy(6);
    timberHyren.setActionUsed("Tribute")
    const weebo2 = new CardInGame(byName('Weebo') as Card, ACTIVE_PLAYER);
    const fireball = new CardInGame(byName('Fire Ball') as Card, ACTIVE_PLAYER);
    const carillion = new CardInGame(byName('Carillion') as Card, ACTIVE_PLAYER).addEnergy(3);
    const fireChogo = new CardInGame(byName('Fire Chogo') as Card, ACTIVE_PLAYER).addEnergy(3);
    const lavaBalamant = new CardInGame(byName('Lava Balamant') as Card, NON_ACTIVE_PLAYER).addEnergy(5);
    const kelthet = new CardInGame(byName('Kelthet') as Card, NON_ACTIVE_PLAYER).addEnergy(4);
    const lavaAq = new CardInGame(byName('Lava Aq') as Card, NON_ACTIVE_PLAYER).addEnergy(2);
    const pruitt = new CardInGame(byName('Pruitt') as Card, ACTIVE_PLAYER).addEnergy(5);
    const magam = new CardInGame(byName('Magam') as Card, ACTIVE_PLAYER).addEnergy(4);
    // pruitt.setActionUsed('Refresh')
    const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [weebo, timberHyren, /*fireChogo, weebo2, carillion,*/ kelthet, lavaBalamant, lavaAq]);
    
    // @ts-ignore
    const gameState = new State({
        zones,
        step: STEP_NAME.PRS1,
        activePlayer: ACTIVE_PLAYER,
    });

    gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

    gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([pruitt]);
    gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([magam]);

    gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).add([fireball])

    gameState.enableDebug()

    return gameState
}