// globals describe, it
import { ACTION_PLAY, ACTION_PLAYER_WINS, State } from 'moonlands/src'
import { byName } from 'moonlands/src/cards';
import Card from 'moonlands/src/classes/Card';
import CardInGame from 'moonlands/src/classes/CardInGame';
import { SimulationStrategy } from '../strategies/SimulationStrategy'
import { GameState } from '../GameState';
import { createZones } from '../strategies/simulationUtils';
import { SerializedClientState } from '../types';
import { ACTION_ATTACK, ACTION_EFFECT, ACTION_PASS, EFFECT_TYPE_DRAW, EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES, EFFECT_TYPE_START_OF_TURN, ZONE_TYPE_ACTIVE_MAGI, ZONE_TYPE_HAND } from 'moonlands';
import { createGame } from '../../containedEngine/containedEngine';
import { StrategyConnector } from '../StrategyConnector';
import { AnyEffectType } from 'moonlands/dist/types';
import convertClientCommands, { convertServerCommand } from '../../containedEngine/utils';
import { EFFECT_TYPE_START_STEP } from 'moonlands/dist/const';

const STEP_NAME = {
  ENERGIZE: 0,
  PRS1: 1,
  ATTACK: 2,
  CREATURES: 3,
  PRS2: 4,
  DRAW: 5,
}

const STEP_NAMES: Record<number, string> = {
  0: 'Energize',
  1: 'Power/Relic/Spell (1)',
  2: 'Attack',
  3: 'Creatures',
  4: 'Power/Relic/Spell (2)',
  5: 'Draw',
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

    // console.dir(strategy.requestAction())
  })

  it('Killing Adis', () => {
    const ACTIVE_PLAYER = 422;
    const NON_ACTIVE_PLAYER = 1310;

    const weebo = new CardInGame(byName('Weebo') as Card, ACTIVE_PLAYER).addEnergy(1);
    const timberHyren = new CardInGame(byName('Timber Hyren') as Card, ACTIVE_PLAYER).addEnergy(6);
    const weebo2 = new CardInGame(byName('Weebo') as Card, ACTIVE_PLAYER).addEnergy(1);
    const carillion = new CardInGame(byName('Carillion') as Card, ACTIVE_PLAYER).addEnergy(3);
    // const gumGum = new CardInGame(byName('Gum-Gum') as Card, NON_ACTIVE_PLAYER).addEnergy(4);
    const pruitt = new CardInGame(byName('Pruitt') as Card, ACTIVE_PLAYER).addEnergy(5);
    const adis = new CardInGame(byName('Adis') as Card, NON_ACTIVE_PLAYER).addEnergy(4);
    const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [weebo, timberHyren, weebo2, carillion]);

    // @ts-ignore
    const gameState = new State({
      zones,
      step: STEP_NAME.ATTACK,
      activePlayer: ACTIVE_PLAYER,
    });

    gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

    gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([pruitt]);
    gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([adis]);

    const serializedState = gameState.serializeData(ACTIVE_PLAYER) as SerializedClientState

    // console.dir(serializedState.zones.opponentActiveMagi)
    const stateRepresentation = new GameState(serializedState)
    stateRepresentation.setPlayerId(ACTIVE_PLAYER)

    const strategy = new SimulationStrategy()

    strategy.setup(stateRepresentation, ACTIVE_PLAYER)

    const action = strategy.requestAction();

    expect(action.type).toEqual(ACTION_ATTACK);
    // Not sure why expect does not filter out other C2S actions
    if (action.type === ACTION_ATTACK) {
      expect(action.target).toEqual(adis.id);
    }
  })
})


// Public Morozov just for testing
class PublicSimulationStrategy extends SimulationStrategy {
  public getActionsOnHold() {
    return this.actionsOnHold;
  }

  public getGraph() {
    return this.graph;
  }
}

describe('Strange attacks', () => {
  it('Double attack', () => {
    const serializedState = { "staticAbilities": [{ "id": "2yiyZsXwXTqfx6E1iuTMu", "owner": 2, "card": "Water of Life", "data": { "energy": 0, "controller": 2, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false } }], "energyPrompt": false, "turnTimer": false, "turnSecondsLeft": 0, "promptAvailableCards": [], "zones": { "playerHand": [{ "id": "CGNu5DXa1673t2zxa898P", "owner": 2, "card": "Vortex of Knowledge", "data": { "energy": 0, "controller": 2, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false } }, { "id": "ic9bJ523jMo-qGkUaHJHs", "owner": 2, "card": "Hyren's Call", "data": { "energy": 0, "controller": 2, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false } }, { "id": "8gaIztrWN_sE1ki5MwUjk", "owner": 2, "card": "Timber Hyren", "data": { "energy": 0, "controller": 2, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false } }, { "id": "wnC99JUKkVT1EK3PYgNj5", "owner": 2, "card": "Giant Carillion", "data": { "energy": 0, "controller": 2, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false } }], "opponentHand": [{ "id": "pSi8m1-JdNkFeW-oa43G_", "owner": 1, "card": null, "data": null }, { "id": "48wjHspTobH_alQwAKFdA", "owner": 1, "card": null, "data": null }, { "id": "5DVEmT4JwiNcIlUKN8D_9", "owner": 1, "card": null, "data": null }, { "id": "HiuX10f5Rt0nC2eV9B8i_", "owner": 1, "card": null, "data": null }, { "id": "v0kP7ro4eBUlmTMsuOKWU", "owner": 1, "card": null, "data": null }, { "id": "vAruVzDnEFdCV3Ze0mUjv", "owner": 1, "card": null, "data": null }], "playerDeck": [{ "card": null, "data": {}, "owner": 2, "id": "kttlD_gzSFhzJ9VDCkl1C" }, { "card": null, "data": {}, "owner": 2, "id": "dq898gykj9lkykH0CS9Ms" }, { "card": null, "data": {}, "owner": 2, "id": "Rrogbk6VMiJ5zeW8sE1RC" }, { "card": null, "data": {}, "owner": 2, "id": "d56KE8EALzv1_k4-KzScR" }, { "card": null, "data": {}, "owner": 2, "id": "yVJKQCdzadVW_goRiiNX2" }, { "card": null, "data": {}, "owner": 2, "id": "OfiCXAnHPr0d9ChpsCb0n" }, { "card": null, "data": {}, "owner": 2, "id": "hpcWik387uYptUqM2aA2S" }, { "card": null, "data": {}, "owner": 2, "id": "Zs-M5mQMCwTthcgxHNJwj" }, { "card": null, "data": {}, "owner": 2, "id": "n0hGzyAKZyhOmrzhdATDe" }, { "card": null, "data": {}, "owner": 2, "id": "p2TLLIobU2nSzM2C_GrsL" }, { "card": null, "data": {}, "owner": 2, "id": "xaiHpVCM08MrOISB5Bt8s" }, { "card": null, "data": {}, "owner": 2, "id": "n_Fq10krXegLrYDCE6qn8" }, { "card": null, "data": {}, "owner": 2, "id": "sGCPjv9OVQzQ23Ic8kyQX" }, { "card": null, "data": {}, "owner": 2, "id": "I-ZQQOiaZJTf0r3Cz-AUw" }, { "card": null, "data": {}, "owner": 2, "id": "CXdcxLOtKm0EbTQ_5vDk9" }, { "card": null, "data": {}, "owner": 2, "id": "siV4qHWnwG-ERg6YWSIUg" }, { "card": null, "data": {}, "owner": 2, "id": "3yaS5D_qltOlEOfwil2_x" }, { "card": null, "data": {}, "owner": 2, "id": "pKFCg5K78XFL1WyccZ_DR" }, { "card": null, "data": {}, "owner": 2, "id": "Dz51fskXZAbRioK79vBMi" }, { "card": null, "data": {}, "owner": 2, "id": "J1WzkbZ4rwh2dtRuM5xC5" }, { "card": null, "data": {}, "owner": 2, "id": "mXIGjalgCzww-gxvhBP4H" }, { "card": null, "data": {}, "owner": 2, "id": "PZv0ORfp4KOEs6PnFy_zS" }, { "card": null, "data": {}, "owner": 2, "id": "y2qblxEd6X-Xeo2CrZmji" }, { "card": null, "data": {}, "owner": 2, "id": "MK3em6cD_AnzKJSUA3PAn" }, { "card": null, "data": {}, "owner": 2, "id": "L1F4hsHYvmET6-sSU8lxF" }, { "card": null, "data": {}, "owner": 2, "id": "xVsKYnbg3WVTz8geZz0GC" }, { "card": null, "data": {}, "owner": 2, "id": "fi-kwNFOWH1brvXcImwKp" }, { "card": null, "data": {}, "owner": 2, "id": "JdbpwCR0Mnt6_-OdEjnOJ" }, { "card": null, "data": {}, "owner": 2, "id": "PhXhP22ry8IztpoOnxd_v" }, { "card": null, "data": {}, "owner": 2, "id": "_odTQCLqXkLA4ssTGrTfU" }, { "card": null, "data": {}, "owner": 2, "id": "oL2gcveRNoOlQAnf8I4Xu" }, { "card": null, "data": {}, "owner": 2, "id": "KtE1_IkILSwDXBhQ9mdlg" }], "opponentDeck": [{ "card": null, "data": {}, "owner": 1, "id": "yPfPXVVIGaQiV1XTzKKR-" }, { "card": null, "data": {}, "owner": 1, "id": "SUpJ8F5JWYPJwWsTKsIpX" }, { "card": null, "data": {}, "owner": 1, "id": "kdZDrlHIcYhQDmdzp9ZoM" }, { "card": null, "data": {}, "owner": 1, "id": "Uhpuq0J--nSwxaMjXc31y" }, { "card": null, "data": {}, "owner": 1, "id": "TIu8DZEdkUH_DzujObCRg" }, { "card": null, "data": {}, "owner": 1, "id": "SnfKlSRh3CZFq39ppZ1fL" }, { "card": null, "data": {}, "owner": 1, "id": "hMLvapicRh8zVuXS7nOoi" }, { "card": null, "data": {}, "owner": 1, "id": "SffIerohbYz19ExSgRc1b" }, { "card": null, "data": {}, "owner": 1, "id": "Kal8LNy7h3qUU2QT_4lsD" }, { "card": null, "data": {}, "owner": 1, "id": "Vz7iiktRGPWtZY6Qs9WDB" }, { "card": null, "data": {}, "owner": 1, "id": "J4-C-ktHbu4DjTIoh7L46" }, { "card": null, "data": {}, "owner": 1, "id": "sR8XqCMQr9lfMe938KAl7" }, { "card": null, "data": {}, "owner": 1, "id": "jRt090PLRb-vwUR6wWtSb" }, { "card": null, "data": {}, "owner": 1, "id": "WRNOlB52RzPqA25A2Cr1g" }, { "card": null, "data": {}, "owner": 1, "id": "yQ_fM7_f8H4Bs4mX0HWnK" }, { "card": null, "data": {}, "owner": 1, "id": "4jH9Rb8jTLX0k7QAfEiC3" }, { "card": null, "data": {}, "owner": 1, "id": "XPELhOApYdrncdtRHdzS8" }, { "card": null, "data": {}, "owner": 1, "id": "y7ptNaFIznDejm54Wrw6m" }, { "card": null, "data": {}, "owner": 1, "id": "gVx11ZcaJ7FuS_58vCX9H" }, { "card": null, "data": {}, "owner": 1, "id": "zJN7_OKCoZHNzR_5BNCAJ" }, { "card": null, "data": {}, "owner": 1, "id": "VAcx_a_VBfreTEL2SvThq" }, { "card": null, "data": {}, "owner": 1, "id": "YchQ3Y5_L9dpQ7LxBNUUo" }, { "card": null, "data": {}, "owner": 1, "id": "g_eZxTMbAoTP_MZY2mVoZ" }, { "card": null, "data": {}, "owner": 1, "id": "m2cQ_CDH1HBMKo1sYQ6VU" }, { "card": null, "data": {}, "owner": 1, "id": "WMPc1P_yBhUmvl4lFqPwA" }, { "card": null, "data": {}, "owner": 1, "id": "XHeP3uyaZnaf-02ppBXso" }, { "card": null, "data": {}, "owner": 1, "id": "Un7TvBfg3g4pSC2q3PNhf" }, { "card": null, "data": {}, "owner": 1, "id": "8wsaJJd-jL2BhUiQ2GdW_" }, { "card": null, "data": {}, "owner": 1, "id": "VLbemUDoJtveYI6d_g_jB" }, { "card": null, "data": {}, "owner": 1, "id": "X6VcsW8scQYb37GgUDExw" }, { "card": null, "data": {}, "owner": 1, "id": "6VggEuT-NKx3LQwPhD6S-" }, { "card": null, "data": {}, "owner": 1, "id": "cMZd4ubNUF29YXhnQe0cj" }, { "card": null, "data": {}, "owner": 1, "id": "GOHpVOqTwh52_wNPWpHfu" }], "playerActiveMagi": [{ "id": "uKxaRkuhyTfuU3641VnB3", "owner": 2, "card": "Evu", "data": { "energy": 8, "controller": 2, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false } }], "opponentActiveMagi": [{ "id": "4ZJVBFkSH-zw7gMWrNWQ-", "owner": 1, "card": "Stradus", "data": { "energy": 13, "controller": 1, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false } }], "playerMagiPile": [{ "card": "Tryn", "data": { "energy": 0, "controller": 2, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 2, "id": "cndmX3B87hWlWi-2tw1Xs" }, { "card": "Yaki", "data": { "energy": 0, "controller": 2, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 2, "id": "hTAcPBSoJIUqvbmvK-LxA" }], "opponentMagiPile": [{ "card": null, "data": {}, "owner": 1, "id": "AAlJQZlVEfxFLUIHlOsrp" }, { "card": null, "data": {}, "owner": 1, "id": "MV8dw-zEUZqt8HkQBPLaY" }], "inPlay": [{ "id": "6IVDwepRNbUecQlnBi5XD", "owner": 2, "card": "Furok", "data": { "energy": 4, "controller": 2, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false } }, { "id": "gj6nMhuxwlZFQl3cZMSIb", "owner": 2, "card": "Plith", "data": { "energy": 3, "controller": 2, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false } }, { "id": "ZN316V9yCMUMXJbNZWQPu", "owner": 2, "card": "Carillion", "data": { "energy": 4, "controller": 2, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false } }, { "id": "Go0F1VAjesIZd8i62j59A", "owner": 1, "card": "Lovian", "data": { "energy": 4, "controller": 1, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false } }, { "id": "2yiyZsXwXTqfx6E1iuTMu", "owner": 2, "card": "Water of Life", "data": { "energy": 0, "controller": 2, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false } }], "playerDefeatedMagi": [], "opponentDefeatedMagi": [], "playerDiscard": [], "opponentDiscard": [] }, "continuousEffects": [], "step": 1, "turn": 1, "goesFirst": 2, "activePlayer": 2, "prompt": false, "promptType": null, "promptMessage": null, "promptPlayer": null, "promptGeneratedBy": null, "promptParams": {}, "opponentId": 1, "log": [], "gameEnded": false, "winner": null }
    const stateRepresentation = new GameState(serializedState as unknown as SerializedClientState)

    const FUROK_ID = serializedState.zones.inPlay.find(card => card.card === "Furok")?.id
    const PLITH_ID = serializedState.zones.inPlay.find(card => card.card === "Plith")?.id
    const STRADUS_ID = serializedState.zones.opponentActiveMagi.find(card => card.card === "Stradus")?.id
    const LOVIAN_ID = serializedState.zones.inPlay.find(card => card.card === "Lovian")?.id

    const strategy = new PublicSimulationStrategy()
    strategy.setup(stateRepresentation, 2)

    const action = strategy.requestAction()

    expect(action.type).toEqual(ACTION_PASS);
    const actionsOnHold = strategy.getActionsOnHold();
    expect(actionsOnHold).toHaveLength(7)

    expect(actionsOnHold[0].action.type).toEqual(ACTION_ATTACK);
    if ('source' in actionsOnHold[0].action && 'target' in actionsOnHold[0].action) {
      expect(actionsOnHold[0].action.source).toEqual(FUROK_ID);
      expect(actionsOnHold[0].action.target).toEqual(LOVIAN_ID);
    }

    expect(actionsOnHold[1].action.type).toEqual(ACTION_ATTACK);
    if ('source' in actionsOnHold[1].action && 'target' in actionsOnHold[1].action) {
      expect(actionsOnHold[1].action.source).toEqual(PLITH_ID);
      expect(actionsOnHold[1].action.target).toEqual(STRADUS_ID);
    }
  })
});

describe('Simulations', () => {
  it.only('Cald vs Naroom', (done) => {
    const deckOne = [
      'Grega',
      'Magam',
      'Sinder',
      'Fire Chogo',
      'Fire Chogo',
      'Fire Chogo',
      'Fire Grag',
      'Fire Grag',
      'Fire Grag',
      'Arbolit',
      'Arbolit',
      'Arbolit',
      'Magma Hyren',
      'Magma Hyren',
      'Magma Hyren',
      'Quor',
      'Quor',
      'Quor',
      'Lava Aq',
      'Lava Aq',
      'Lava Aq',
      'Lava Arboll',
      'Lava Arboll',
      'Lava Arboll',
      'Diobor',
      'Diobor',
      'Diobor',
      'Drakan',
      'Drakan',
      'Drakan',
      'Thermal Blast',
      'Thermal Blast',
      'Thermal Blast',
      'Flame Geyser',
      'Flame Geyser',
      'Flame Geyser',
      'Water of Life',
      'Dream Balm',
      'Dream Balm',
      'Magma Armor',
      'Magma Armor',
      'Water of Life',
      'Water of Life'
    ];

    const deckTwo = [
      'Adis',
      'Tryn',
      'Yaki',
      'Bhatar',
      'Timber Hyren',
      'Twee',
      'Balamant Pup',
      'Balamant Pup',
      'Balamant Pup',
      'Rudwot',
      'Rudwot',
      'Arboll',
      'Arboll',
      'Carillion',
      'Carillion',
      'Carillion',
      'Furok',
      'Furok',
      'Leaf Hyren',
      'Leaf Hyren',
      'Plith',
      'Plith',
      'Weebo',
      'Weebo',
      'Ancestral Flute',
      'Ancestral Flute',
      'Ancestral Flute',
      'Robe of Vines',
      'Robe of Vines',
      'Water of Life',
      'Water of Life',
      "Hyren's Call",
      "Orwin's Gaze",
      "Orwin's Gaze",
      'Vortex of Knowledge',
      'Vortex of Knowledge',
      'Grow',
      'Grow',
      'Grow',
      'Giant Carillion',
      'Giant Carillion',
      'Giant Carillion',
      'Weebo'
    ]

    const game = createGame()
    game.setPlayers(1, 2);
    game.setDeck(1, deckOne);
    game.setDeck(2, deckTwo);

    // @ts-ignore
    game.initiatePRNG(12345);
    game.setup();

    // @ts-ignore
    // console.dir(game.twister);
    // game.enableDebug();

    let gameDataCallbackOne: Function = () => { };
    let actionCallbackOne: Function = () => { };

    let gameDataCallbackTwo: Function = () => { };
    let actionCallbackTwo: Function = () => { };

    const connectorOne = {
      on: (type: string, callback: Function) => {
        if (type == 'gameData') {
          gameDataCallbackOne = callback;
        } else if (type == 'action') {
          actionCallbackOne = callback;
        }
      },
      emit: (type: string, action: any) => {
        // console.log(`Connector one emitting "${type}"`)
        // console.dir(action);
        if (type === 'clientAction') {
          const convertedCommand = convertClientCommands({
            ...action,
            player: 1,
          }, game);
          if (convertedCommand) {
            if (convertedCommand.type === ACTION_PLAY && 'payload' in convertedCommand && !convertedCommand.payload.card) {
              console.log(`Cannot convert ACTION_PLAY command, source card: ${action.payload.card.name} [${action.payload.card.id}]`)
              console.dir(action?.payload?.card);
              debugger;
              expect(true).toEqual(false);
            }
            game.update(convertedCommand);
            const activePlayer = game.state.prompt ? game.state.promptPlayer : game.state.activePlayer;

            if (activePlayer == 1) {
              actionCallbackOne({
                type: 'display/priority',
                player: activePlayer,
              })
            } else {
              actionCallbackTwo({
                type: 'display/priority',
                player: activePlayer,
              })
            }
          }
        }
      },
      close: () => {
        // console.log(`Closing the connection`);
      }
    }

    const connectorTwo = {
      on: (type: string, callback: Function) => {
        if (type == 'gameData') {
          gameDataCallbackTwo = callback;
        } else if (type == 'action') {
          actionCallbackTwo = callback;
        }
      },
      emit: (_type: string, action: any) => {
        const convertedCommand = convertClientCommands({
          ...action,
          player: 2,
        }, game);
        if (convertedCommand) {
          if (convertedCommand.type === ACTION_PLAY && 'payload' in convertedCommand && !convertedCommand.payload.card) {
            console.error(`Cannot convert ACTION_PLAY command, source card: ${action.payload.card.card} [${action.payload.card.id}]`)
            console.log(game.getZone(ZONE_TYPE_HAND, 2).cards.map(card => `[${card.id}] ${card.card.name}`).join(', '))
            console.dir(action?.payload?.card);
            expect(true).toEqual(false);
          }
          game.update(convertedCommand);
          const activePlayer = game.state.prompt ? game.state.promptPlayer : game.state.activePlayer;
          // console.log(`Sending out priority display for player ${activePlayer}`);

          if (activePlayer == 1) {
            actionCallbackOne({
              type: 'display/priority',
              player: activePlayer,
            })
          } else {
            actionCallbackTwo({
              type: 'display/priority',
              player: activePlayer,
            })
          }
        }
      },
      close: () => {
        // console.log(`Closing the connection`);
      }
    }

    const strategyConnectorOne = new StrategyConnector(connectorOne);
    strategyConnectorOne.connect(new SimulationStrategy())
    const strategyConnectorTwo = new StrategyConnector(connectorTwo);
    strategyConnectorTwo.connect(new SimulationStrategy())

    game.debug = false;
    let turnNumber = 0;
    game.setOnAction((action: AnyEffectType) => {
      // console.log(`Action from an engine`);
      // console.dir(action);

      //if (action.type === ACTION_EFFECT && action.effectType === EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES && action.destinationZone === ZONE_TYPE_HAND) {
      // @ts-ignore
      // if (typeof action.target == 'string') {
      //   console.log(`Drawing a card "${action.target}"`);
      // } else {
      //   console.log(`Drawing a card ${action.target.card.name} [${action.target.id}]`);
      // }
      //}
      // try {
      const commandForBotOne = convertServerCommand(action, game, 1);
      actionCallbackOne(commandForBotOne);
      // } catch(e) {
      //   console.log(`Error converting command`)
      //   console.dir(action);
      //   throw e;
      // }
      // if (action.type === ACTION_EFFECT) {
      //   if (action.effectType === EFFECT_TYPE_START_OF_TURN) {
      //     console.log(`Start of turn ${turnNumber}`)
      //     turnNumber++;
      //   }

      //   if (action.effectType === EFFECT_TYPE_START_STEP) {
      //     console.log(`Start of step ${STEP_NAMES[action.step]}`)
      //   }
      // }

      try {
        const commandForBotTwo = convertServerCommand(action, game, 2);
        actionCallbackTwo(commandForBotTwo);
      } catch (e) {
        console.log(`Error converting command`)
        console.dir(action);
        throw e;
      }

      if (action.type === ACTION_PLAYER_WINS) {
        done();
      }
    });

    gameDataCallbackOne({ playerId: 1, state: game.serializeData(1) })
    gameDataCallbackTwo({ playerId: 2, state: game.serializeData(2) })
  }, 1500000);

  it('Cald vs GumGums', (done) => {
    const deckOne = [
      'Grega',
      'Magam',
      'Sinder',
      'Fire Chogo',
      'Fire Chogo',
      'Fire Chogo',
      'Fire Grag',
      'Fire Grag',
      'Fire Grag',
      'Arbolit',
      'Arbolit',
      'Arbolit',
      'Magma Hyren',
      'Magma Hyren',
      'Magma Hyren',
      'Quor',
      'Quor',
      'Quor',
      'Lava Aq',
      'Lava Aq',
      'Lava Aq',
      'Lava Arboll',
      'Lava Arboll',
      'Lava Arboll',
      'Diobor',
      'Diobor',
      'Diobor',
      'Drakan',
      'Drakan',
      'Drakan',
      'Thermal Blast',
      'Thermal Blast',
      'Thermal Blast',
      'Flame Geyser',
      'Flame Geyser',
      'Flame Geyser',
      'Water of Life',
      'Dream Balm',
      'Dream Balm',
      'Magma Armor',
      'Magma Armor',
      'Water of Life',
      'Water of Life'
    ];

    const deckTwo = [
      'Evu',
      'Tryn',
      'Yaki',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      "Gum-Gum",
      "Gum-Gum",
      "Gum-Gum",
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum',
      'Gum-Gum'
    ]

    const game = createGame()
    game.setPlayers(1, 2);
    game.setDeck(1, deckOne);
    game.setDeck(2, deckTwo);

    // @ts-ignore
    game.initiatePRNG(2);
    game.setup();

    let gameDataCallbackOne: Function = () => { };
    let actionCallbackOne: Function = () => { };

    let gameDataCallbackTwo: Function = () => { };
    let actionCallbackTwo: Function = () => { };

    const connectorOne = {
      on: (type: string, callback: Function) => {
        if (type == 'gameData') {
          gameDataCallbackOne = callback;
        } else if (type == 'action') {
          actionCallbackOne = callback;
        }
      },
      emit: (type: string, action: any) => {
        // console.log(`Connector one emitting "${type}"`)
        // console.dir(action);
        if (type === 'clientAction') {
          const convertedCommand = convertClientCommands({
            ...action,
            player: 1,
          }, game);
          if (convertedCommand) {
            if (convertedCommand.type === ACTION_PLAY && 'payload' in convertedCommand && !convertedCommand.payload.card) {
              console.log(`Cannot convert ACTION_PLAY command, source card: ${action.payload.card.name} [${action.payload.card.id}]`)
              console.dir(action?.payload?.card);
              debugger;
              expect(true).toEqual(false);
            }

            game.update(convertedCommand);
            const activePlayer = game.state.prompt ? game.state.promptPlayer : game.state.activePlayer;
            if (activePlayer === 1) {
              // Support bechamel with the priority events
              // setTimeout(() => {
              actionCallbackOne({
                type: 'display/priority',
                player: 1,
              })
              // }, 0);
            } else if (activePlayer === 2) {
              // setTimeout(() => {
              actionCallbackTwo({
                type: 'display/priority',
                player: 2,
              })
              // }, 0);
            }
          }
        }
      },
      close: () => {
        // console.log(`Closing the connection`);
      }
    }

    const connectorTwo = {
      on: (type: string, callback: Function) => {
        if (type == 'gameData') {
          gameDataCallbackTwo = callback;
        } else if (type == 'action') {
          actionCallbackTwo = callback;
        }
      },
      emit: (_type: string, action: any) => {
        const convertedCommand = convertClientCommands({
          ...action,
          player: 2,
        }, game);
        if (convertedCommand) {
          if (convertedCommand.type === ACTION_PLAY && 'payload' in convertedCommand && !convertedCommand.payload.card) {
            console.error(`Cannot convert ACTION_PLAY command, source card: ${action.payload.card.card} [${action.payload.card.id}]`)
            console.log(game.getZone(ZONE_TYPE_HAND, 2).cards.map(card => `[${card.id}] ${card.card.name}`).join(', '))
            console.dir(action?.payload?.card);
            expect(true).toEqual(false);
          }
          game.update(convertedCommand);
          const activePlayer = game.state.prompt ? game.state.promptPlayer : game.state.activePlayer;
          if (activePlayer === 1) {
            // Support bechamel with the priority events
            // setTimeout(() => {
            actionCallbackOne({
              type: 'display/priority',
              player: 1,
            })
            // }, 0);
          } else if (activePlayer === 2) {
            // setTimeout(() => {
            actionCallbackTwo({
              type: 'display/priority',
              player: 2,
            })
            // }, 0)
          }
        }
      },
      close: () => {
        // console.log(`Closing the connection`);
      }
    }

    const strategyConnectorOne = new StrategyConnector(connectorOne);
    strategyConnectorOne.connect(new SimulationStrategy())
    const strategyConnectorTwo = new StrategyConnector(connectorTwo);
    strategyConnectorTwo.connect(new SimulationStrategy())

    game.debug = false;
    game.setOnAction((action: AnyEffectType) => {
      // console.log(`Action from an engine`);
      // console.dir(action);

      // if (action.type === ACTION_EFFECT && action.effectType === EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES && action.destinationZone === ZONE_TYPE_HAND) {
      // @ts-ignore
      // if (typeof action.target == 'string') {
      //   console.log(`Drawing a card "${action.target}"`);
      // } else {
      //   console.log(`Drawing a card ${action.target.card.name} [${action.target.id}]`);
      // }
      // }
      // try {
      const commandForBotOne = convertServerCommand(action, game, 1);
      actionCallbackOne(commandForBotOne);
      // } catch(e) {
      //   console.log(`Error converting command`)
      //   console.dir(action);
      //   throw e;
      // }

      try {
        const commandForBotTwo = convertServerCommand(action, game, 2);
        actionCallbackTwo(commandForBotTwo);
      } catch (e) {
        console.log(`Error converting command`)
        console.dir(action);
        throw e;
      }

      if (action.type === ACTION_PLAYER_WINS) {
        done();
      }
    });

    gameDataCallbackOne({ playerId: 1, state: game.serializeData(1) })
    gameDataCallbackTwo({ playerId: 2, state: game.serializeData(2) })
  });
})

