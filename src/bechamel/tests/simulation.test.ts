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

  it('test', () => {
    const ACTIVE_PLAYER = 422;
		const NON_ACTIVE_PLAYER = 1310;

		const weebo = new CardInGame(byName('Weebo') as Card, ACTIVE_PLAYER).addEnergy(1);
		const timberHyren = new CardInGame(byName('Timber Hyren') as Card, ACTIVE_PLAYER).addEnergy(6);
		const weebo2 = new CardInGame(byName('Weebo') as Card, ACTIVE_PLAYER).addEnergy(1);
		const carillion = new CardInGame(byName('Carillion') as Card, ACTIVE_PLAYER).addEnergy(3);
		const gumGum = new CardInGame(byName('Gum-Gum') as Card, NON_ACTIVE_PLAYER).addEnergy(4);
		const pruitt = new CardInGame(byName('Pruitt') as Card, ACTIVE_PLAYER).addEnergy(5);
		const magam = new CardInGame(byName('Magam') as Card, ACTIVE_PLAYER).addEnergy(4);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [weebo, timberHyren, weebo2, carillion, gumGum]);

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
  // it('doesn\'t see some prompts', () => {
  //   const stateRepresentation = new GameState({
  //     "staticAbilities":[],
  //     "energyPrompt":false,
  //     "turnTimer":false,
  //     "turnSecondsLeft":0,
  //     "promptAvailableCards":[],
  //     "zones":{
  //       "playerHand":[],
  //       "opponentHand":[
  //         {
  //           "id":"6pJG-DVHihIKRkt_k0d6_",
  //           "owner":1,
  //           "card":null,
  //           "data":null,
  //         },
  //         {
  //           "id":"2eIFHRnaUluPZZlS_mGt0",
  //           "owner":1,
  //           "card":null,
  //           "data":null,
  //         },
  //         {
  //           "id":"VpNhwSd-l5Rxt9zhAGjUu",
  //           "owner":1,
  //           "card":null,
  //           "data":null,
  //         },
  //         {
  //           "id":"gpuy-gRAq-dR4lpY6xlo7",
  //           "owner":1,
  //           "card":null,
  //           "data":null,
  //         }
  //       ],
  //       "playerDeck":[
  //         {"card":null,"data":{},"owner":2,"id":"NKBekrVNbBQMspcP6IbWh"},
  //         {"card":null,"data":{},"owner":2,"id":"MF_vvZUdgWoCBiZQZ5AJw"},
  //         {"card":null,"data":{},"owner":2,"id":"JG5Dlr13SmL-Za9SkhFej"},
  //         {"card":null,"data":{},"owner":2,"id":"gzhljTSppS5CX-J2vQHjp"},
  //         {"card":null,"data":{},"owner":2,"id":"xDKSNLfG_5ty9hx2G2aPX"},
  //         {"card":null,"data":{},"owner":2,"id":"N9sNqya31rIzpkZeOEqEC"},
  //         {"card":null,"data":{},"owner":2,"id":"pepqEKvaH8i_4Q3Et9N3N"},
  //         {"card":null,"data":{},"owner":2,"id":"SFqnFyk6d5JRv93rJzedl"},
  //         {"card":null,"data":{},"owner":2,"id":"5jlshMDPl2_-1j_vFjvHn"},
  //         {"card":null,"data":{},"owner":2,"id":"pU7Iu98LY2NoVZfBsYAf4"},
  //         {"card":null,"data":{},"owner":2,"id":"iD6rWfSKO207KAiFTbxWY"},
  //         {"card":null,"data":{},"owner":2,"id":"vg43VL3wC_uXFANsNWo3z"},
  //         {"card":null,"data":{},"owner":2,"id":"n9V0skmcu-QI-iWBAmU9M"},
  //         {"card":null,"data":{},"owner":2,"id":"zVuzfBpceewzVrs4MPn0c"},
  //         {"card":null,"data":{},"owner":2,"id":"A3VxRSFUSSb4HVDJ_T-im"},
  //         {"card":null,"data":{},"owner":2,"id":"2aocgL4eg43vExJJwRBIQ"},
  //         {"card":null,"data":{},"owner":2,"id":"y4FPbdydSZ2mr1Q--9buE"},
  //         {"card":null,"data":{},"owner":2,"id":"OlIP-xv3Eshoj94foNeEi"},
  //         {"card":null,"data":{},"owner":2,"id":"KiQV7vZmQtkwru7xfkFnS"},
  //         {"card":null,"data":{},"owner":2,"id":"JuqbEc70NT8M3yT9l9sUk"},
  //         {"card":null,"data":{},"owner":2,"id":"ZoL4zk1ekwg6Q5bRsjjHC"},
  //         {"card":null,"data":{},"owner":2,"id":"0V_yh4m3ZRldsYflGvyST"},
  //         {"card":null,"data":{},"owner":2,"id":"vMeUaV9pdz6W2PNZq5seS"},
  //         {"card":null,"data":{},"owner":2,"id":"0mvHEPzMF0SWE0VojeAmB"},
  //         {"card":null,"data":{},"owner":2,"id":"Ay3LTY5M2iTOceFMv0MG9"},
  //         {"card":null,"data":{},"owner":2,"id":"GHUVE3GyXOeOL0wSHpwvp"},
  //         {"card":null,"data":{},"owner":2,"id":"0j_RER2CqhLrutmstUFDi"},
  //         {"card":null,"data":{},"owner":2,"id":"pUmAhG6xPm1WBf69TYtLF"},
  //         {"card":null,"data":{},"owner":2,"id":"KgjSt3NA_BnyZPT36mB6h"},
  //         {"card":null,"data":{},"owner":2,"id":"ebHmA5uI7BRk2BK05ODfZ"},
  //         {"card":null,"data":{},"owner":2,"id":"jWi4yprvHPk-RvFuoufTx"},
  //         {"card":null,"data":{},"owner":2,"id":"nn2XhBVIAu6Awpw0mbjFE"},
  //         {"card":null,"data":{},"owner":2,"id":"cQ8hPo3x9BjOoefUqEUKF"},
  //         {"card":null,"data":{},"owner":2,"id":"2Tb6iuxuOjTDgz-fjvewe"},
  //         {"card":null,"data":{},"owner":2,"id":"Y95T7b4Ibah48I3I1Kord"},
  //         {"card":null,"data":{},"owner":2,"id":"3TOaBhXTzWV03j5S0n6LF"},
  //         {"card":null,"data":{},"owner":2,"id":"XN45Qoki_EOd0gt-p_G7Q"},
  //         {"card":null,"data":{},"owner":2,"id":"tom__yF0ggEM1NL7NEcZP"},
  //         {"card":null,"data":{},"owner":2,"id":"mZbb8FrZkR7mRqNmzKM2U"},
  //         {"card":null,"data":{},"owner":2,"id":"tJScgYp_YXhTF0rb8QANa"}
  //       ],
  //       "opponentDeck":[
  //         {"card":null,"data":{},"owner":1,"id":"uWlMaOOsXPoFzb2m3hn3t"},
  //         {"card":null,"data":{},"owner":1,"id":"ty2NARKi70_c1RGGNu7sG"},
  //         {"card":null,"data":{},"owner":1,"id":"R12GZBQ09-hWlhbJu1sMN"},
  //         {"card":null,"data":{},"owner":1,"id":"dETrwXT1VIpz-qaknBsCk"},
  //         {"card":null,"data":{},"owner":1,"id":"LF08KZ07-ULvz3ZZwfuPI"},
  //         {"card":null,"data":{},"owner":1,"id":"buxiQFzW21Y5LS-3awReW"},
  //         {"card":null,"data":{},"owner":1,"id":"HrrL5ypZ7Pf6n6isjCRyI"},
  //         {"card":null,"data":{},"owner":1,"id":"ar801bnZGX_4oce3A8jjT"},
  //         {"card":null,"data":{},"owner":1,"id":"HRzwxzU2NBTwt2EfDeSUS"},
  //         {"card":null,"data":{},"owner":1,"id":"D8py4088tacmN5lqCebYX"},
  //         {"card":null,"data":{},"owner":1,"id":"zuaTo6WxKDmWuIuXhqmbA"},
  //         {"card":null,"data":{},"owner":1,"id":"BklZSjmBKHLQSHUd5-n_S"},
  //         {"card":null,"data":{},"owner":1,"id":"xWUV-Hxszflqc2MThlYp3"},
  //         {"card":null,"data":{},"owner":1,"id":"uQqs6oxyf0eCo_zM31jg-"},
  //         {"card":null,"data":{},"owner":1,"id":"GelLMZjoR6Yt-sjNQoIFZ"},
  //         {"card":null,"data":{},"owner":1,"id":"mjOkPLQnPzQYzqYmId1dn"},
  //         {"card":null,"data":{},"owner":1,"id":"NZ6sxHyN2Yqc6xiEkE8sO"},
  //         {"card":null,"data":{},"owner":1,"id":"m8r0SZAZe9t8D6MpAOUUY"},
  //         {"card":null,"data":{},"owner":1,"id":"c1BEjtJR5M2bzJ-aP5sSO"},
  //         {"card":null,"data":{},"owner":1,"id":"If3nPMZXgVP0U2DJsSxz6"},
  //         {"card":null,"data":{},"owner":1,"id":"MNyFUi9aqmZOwL9kMLn4f"},
  //         {"card":null,"data":{},"owner":1,"id":"b585xe9NAdaM3EbalTB2Y"},
  //         {"card":null,"data":{},"owner":1,"id":"rErYQ7iDsdwJxLeLE2rTF"},
  //         {"card":null,"data":{},"owner":1,"id":"aP0FHHFZhZRuI5306dkDX"},
  //         {"card":null,"data":{},"owner":1,"id":"I-WOCE3_qglPgzFoW__b3"},
  //         {"card":null,"data":{},"owner":1,"id":"sjc1TWrBZgeWJxwRy4hOK"},
  //         {"card":null,"data":{},"owner":1,"id":"boMoJ4rKsFasH519vZWGQ"},
  //         {"card":null,"data":{},"owner":1,"id":"HLqH9LkxB-JI_GZSK_hXL"},
  //         {"card":null,"data":{},"owner":1,"id":"xT3SkCoKGKPX61f_UxW8n"},
  //         {"card":null,"data":{},"owner":1,"id":"7gZGsiCjBzhX-7QG9U6cv"},
  //         {"card":null,"data":{},"owner":1,"id":"idwo4YV0rByMFINb3U5CO"},
  //         {"card":null,"data":{},"owner":1,"id":"gqYQK6lB7z_iJQhagc_qt"},
  //         {"card":null,"data":{},"owner":1,"id":"ysCesxA-NqY_Tahz8am50"}
  //       ],
  //       "playerActiveMagi":[],
  //       "opponentActiveMagi":[
  //         {
  //           "id":"PJOq54Av96WS7nnm4NiuS",
  //           "owner":1,
  //           "card":"Nimbulo",
  //           "data":{
  //             "energy":8,
  //             "controller":1,
  //             "attacked":0,
  //             "actionsUsed":[],
  //             "energyLostThisTurn":0,
  //             "defeatedCreature":false,
  //             "hasAttacked":false,
  //             "wasAttacked":false,
  //           }
  //         }
  //       ],
  //       "playerMagiPile":[
  //         {
  //           "card":"Ebylon",
  //           "data":{
  //             "energy":0,
  //             "controller":2,
  //             "attacked":0,
  //             "actionsUsed":[],
  //             "energyLostThisTurn":0,
  //             "defeatedCreature":false,
  //             "hasAttacked":false,
  //             "wasAttacked":false,
  //           },
  //           "owner":2,
  //           "id":"aNoU4H1pbiSitFQgK2s7g",
  //         },{
  //           "card":"O'Qua",
  //           "data":{
  //             "energy":0,
  //             "controller":2,
  //             "attacked":0,
  //             "actionsUsed":[],
  //             "energyLostThisTurn":0,
  //             "defeatedCreature":false,
  //             "hasAttacked":false,
  //             "wasAttacked":false,
  //           },
  //           "owner":2,
  //           "id":"NkCTjDJqBeIHT3RH-xhlw",
  //         },
  //         {
  //           "card":"Whall",
  //           "data":{
  //             "energy":0,
  //             "controller":2,
  //             "attacked":0,
  //             "actionsUsed":[],
  //             "energyLostThisTurn":0,
  //             "defeatedCreature":false,
  //             "hasAttacked":false,
  //             "wasAttacked":false,
  //           },
  //           "owner":2,
  //           "id":"lf_CB9hEWyHTgE4uUM-In"
  //         }
  //       ],
  //       "opponentMagiPile":[
  //         {
  //           "card":null,
  //           "data":{},
  //           "owner":1,
  //           "id":"Bx3JmZsn8C9OzXJ1P8dnt",
  //         },
  //         {
  //           "card":null,
  //           "data":{},
  //           "owner":1,
  //           "id":"F7Ee2BRkPwDXJrube7Q54",
  //         }
  //       ],
  //       "inPlay":[
  //         {
  //           "id":"wgLtjs5lmfvOnAtvYExch",
  //           "owner":1,
  //           "card":"Storm Ring",
  //           "data":{
  //             "energy":0,
  //             "controller":1,
  //             "attacked":0,
  //             "actionsUsed":[],
  //             "energyLostThisTurn":0,
  //             "defeatedCreature":false,
  //             "hasAttacked":false,
  //             "wasAttacked":false,
  //           }
  //         },
  //         {
  //           "id":"ySpDz2KzClaJaZRvCsuY9",
  //           "owner":1,
  //           "card":"Lovian",
  //           "data":{
  //             "energy":4,
  //             "controller":1,
  //             "attacked":0,
  //             "actionsUsed":[],
  //             "energyLostThisTurn":0,
  //             "defeatedCreature":false,
  //             "hasAttacked":false
  //             ,"wasAttacked":false,
  //           }
  //         },
  //         {
  //           "id":"dKXoQDDtPdQGK_XOzYsNd",
  //           "owner":1,
  //           "card":"Thunder Vashp",
  //           "data":{
  //             "energy":2,
  //             "controller":1,
  //             "attacked":0,
  //             "actionsUsed":[],
  //             "energyLostThisTurn":0,
  //             "defeatedCreature":false,
  //             "hasAttacked":false,
  //             "wasAttacked":false,
  //           }
  //         }
  //       ],
  //       "playerDefeatedMagi":[],
  //       "opponentDefeatedMagi":[],
  //       "playerDiscard":[],
  //       "opponentDiscard":[]
  //     },
  //     "continuousEffects":[],
  //     "step":0,
  //     "turn":1,
  //     "goesFirst":1,
  //     "activePlayer":1,
  //     "prompt":false,
  //     "promptType":null,
  //     "promptMessage":null,
  //     "promptPlayer":null,
  //     "promptGeneratedBy":null,
  //     "promptParams":{},
  //     "log":[],
  //     "gameEnded":false,
  //     "winner":null,
  //   });
  //   stateRepresentation.setPlayerId(2);
    
  //   const strategy = new SimulationStrategy()

  //   strategy.setup(stateRepresentation, 2)
  // })
})