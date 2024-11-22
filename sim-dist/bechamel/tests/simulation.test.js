// globals describe, it
import { ACTION_PLAY, ACTION_PLAYER_WINS, State } from 'moonlands/dist/esm/index.js';
import { byName } from 'moonlands/dist/esm/cards.js';
import CardInGame from 'moonlands/dist/esm/classes/CardInGame.js';
import { SimulationStrategy } from '../strategies/SimulationStrategy.js';
import { GameState } from '../GameState.js';
import { createZones } from '../strategies/simulationUtils.js';
import { ACTION_ATTACK, ACTION_PASS, ZONE_TYPE_ACTIVE_MAGI, ZONE_TYPE_HAND, ZONE_TYPE_IN_PLAY, ZONE_TYPE_MAGI_PILE } from 'moonlands/dist/esm/const.js';
import { createGame } from '../../containedEngine/containedEngine.js';
import { StrategyConnector } from '../StrategyConnector.js';
import convertClientCommands, { convertServerCommand } from '../../containedEngine/utils.js';
const fs = require('node:fs');
const STEP_NAME = {
    ENERGIZE: 0,
    PRS1: 1,
    ATTACK: 2,
    CREATURES: 3,
    PRS2: 4,
    DRAW: 5,
};
const STEP_NAMES = {
    0: 'Energize',
    1: 'Power/Relic/Spell (1)',
    2: 'Attack',
    3: 'Creatures',
    4: 'Power/Relic/Spell (2)',
    5: 'Draw',
};
describe.skip('Simulations', () => {
    it('test', () => {
        const ACTIVE_PLAYER = 422;
        const NON_ACTIVE_PLAYER = 1310;
        const weebo = new CardInGame(byName('Weebo'), ACTIVE_PLAYER).addEnergy(1);
        const timberHyren = new CardInGame(byName('Timber Hyren'), ACTIVE_PLAYER).addEnergy(6);
        const weebo2 = new CardInGame(byName('Weebo'), ACTIVE_PLAYER).addEnergy(1);
        const carillion = new CardInGame(byName('Carillion'), ACTIVE_PLAYER).addEnergy(3);
        const lavaBalamant = new CardInGame(byName('Lava Balamant'), NON_ACTIVE_PLAYER).addEnergy(5);
        const kelthet = new CardInGame(byName('Kelthet'), NON_ACTIVE_PLAYER).addEnergy(4);
        const lavaAq = new CardInGame(byName('Lava Aq'), NON_ACTIVE_PLAYER).addEnergy(2);
        const pruitt = new CardInGame(byName('Pruitt'), ACTIVE_PLAYER).addEnergy(5);
        const magam = new CardInGame(byName('Magam'), ACTIVE_PLAYER).addEnergy(4);
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
        const serializedState = gameState.serializeData(ACTIVE_PLAYER);
        const stateRepresentation = new GameState(serializedState);
        stateRepresentation.setPlayerId(ACTIVE_PLAYER);
        const strategy = new SimulationStrategy();
        strategy.setup(stateRepresentation, ACTIVE_PLAYER);
        // console.dir(strategy.requestAction())
    });
    it('Killing Adis', () => {
        const ACTIVE_PLAYER = 422;
        const NON_ACTIVE_PLAYER = 1310;
        const weebo = new CardInGame(byName('Weebo'), ACTIVE_PLAYER).addEnergy(1);
        const timberHyren = new CardInGame(byName('Timber Hyren'), ACTIVE_PLAYER).addEnergy(6);
        const weebo2 = new CardInGame(byName('Weebo'), ACTIVE_PLAYER).addEnergy(1);
        const carillion = new CardInGame(byName('Carillion'), ACTIVE_PLAYER).addEnergy(3);
        // const gumGum = new CardInGame(byName('Gum-Gum') as Card, NON_ACTIVE_PLAYER).addEnergy(4);
        const pruitt = new CardInGame(byName('Pruitt'), ACTIVE_PLAYER).addEnergy(5);
        const adis = new CardInGame(byName('Adis'), NON_ACTIVE_PLAYER).addEnergy(4);
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
        const serializedState = gameState.serializeData(ACTIVE_PLAYER);
        // console.dir(serializedState.zones.opponentActiveMagi)
        const stateRepresentation = new GameState(serializedState);
        stateRepresentation.setPlayerId(ACTIVE_PLAYER);
        const strategy = new SimulationStrategy();
        strategy.setup(stateRepresentation, ACTIVE_PLAYER);
        const action = strategy.requestAction();
        expect(action.type).toEqual(ACTION_ATTACK);
        // Not sure why expect does not filter out other C2S actions
        if (action.type === ACTION_ATTACK) {
            expect(action.target).toEqual(adis.id);
        }
    });
    it('Failed power activation', () => {
        const stateJson = {
            "activePlayer": 2,
            "cardsAttached": {},
            "continuousEffects": [],
            "energyPrompt": false,
            "gameEnded": false,
            "goesFirst": 2,
            "log": [],
            "opponentId": 1,
            "prompt": true,
            "promptAvailableCards": [],
            "promptMessage": null,
            "promptParams": {
                "cards": [
                    {
                        "card": "Balamant Pup",
                        "data": {
                            "actionsUsed": [],
                            "attacked": 0,
                            "controller": 2,
                            "defeatedCreature": false,
                            "energy": 0,
                            "energyLostThisTurn": 0,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "id": "sUpPZ2aC_u3JJVjWGr8uK",
                        "owner": 2
                    },
                    {
                        "card": "Balamant Pup",
                        "data": {
                            "actionsUsed": [],
                            "attacked": 0,
                            "controller": 2,
                            "defeatedCreature": false,
                            "energy": 0,
                            "energyLostThisTurn": 0,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "id": "En3JG424q9YC2fzP5VwAw",
                        "owner": 2
                    }
                ],
                "numberOfCards": 2,
                "restrictions": [
                    {
                        "type": "restrictions/creature_name",
                        "value": "Balamant Pup"
                    }
                ],
                "zone": "zones/deck",
                "zoneOwner": 2
            },
            "promptPlayer": 2,
            "promptType": "prompt/choose_up_to_n_cards_from_zone",
            "staticAbilities": [
                {
                    "card": "Robes of the Ages",
                    "data": {
                        "actionsUsed": [],
                        "attacked": 0,
                        "controller": 1,
                        "defeatedCreature": false,
                        "energy": 0,
                        "energyLostThisTurn": 0,
                        "hasAttacked": false,
                        "wasAttacked": false
                    },
                    "id": "3gXsprabFfZU-BUSSRJO5",
                    "owner": 1
                }
            ],
            "step": 1,
            "turn": 1,
            "turnSecondsLeft": 0,
            "turnTimer": false,
            "winner": null,
            "zones": {
                "inPlay": [
                    {
                        "card": "Orothean Belt",
                        "data": {
                            "actionsUsed": [],
                            "attacked": 0,
                            "controller": 1,
                            "defeatedCreature": false,
                            "energy": 0,
                            "energyLostThisTurn": 0,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "id": "Cfr4JVDs3r1OOdayrqLSM",
                        "owner": 1
                    },
                    {
                        "card": "Giant Parathin",
                        "data": {
                            "actionsUsed": [],
                            "attacked": 0,
                            "controller": 1,
                            "defeatedCreature": false,
                            "energy": 3,
                            "energyLostThisTurn": 0,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "id": "VXLl9cyD3fQwQdDaW2y8n",
                        "owner": 1
                    },
                    {
                        "card": "Robes of the Ages",
                        "data": {
                            "actionsUsed": [],
                            "attacked": 0,
                            "controller": 1,
                            "defeatedCreature": false,
                            "energy": 0,
                            "energyLostThisTurn": 0,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "id": "3gXsprabFfZU-BUSSRJO5",
                        "owner": 1
                    },
                    {
                        "card": "Balamant Pup",
                        "data": {
                            "actionsUsed": [],
                            "attacked": 0,
                            "controller": 2,
                            "defeatedCreature": false,
                            "energy": 6,
                            "energyLostThisTurn": 0,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "id": "mRhUstfZQmygpAHob2J_K",
                        "owner": 2
                    },
                    {
                        "card": "Deep Hyren",
                        "data": {
                            "actionsUsed": [],
                            "attacked": 1,
                            "controller": 1,
                            "defeatedCreature": false,
                            "energy": 3,
                            "energyLostThisTurn": 0,
                            "hasAttacked": true,
                            "wasAttacked": false
                        },
                        "id": "eZSJhJdwzrGu21DVhNv8T",
                        "owner": 1
                    },
                    {
                        "card": "Hubdra's Spear",
                        "data": {
                            "actionsUsed": [],
                            "attacked": 0,
                            "controller": 1,
                            "defeatedCreature": false,
                            "energy": 0,
                            "energyLostThisTurn": 0,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "id": "xeOeqRrrrBvMSkajSF14V",
                        "owner": 1
                    },
                    {
                        "card": "Corf",
                        "data": {
                            "actionsUsed": [],
                            "attacked": 0,
                            "controller": 1,
                            "defeatedCreature": false,
                            "energy": 3,
                            "energyLostThisTurn": 0,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "id": "BPFX8uF6qYQZvQwjd5Htr",
                        "owner": 1
                    }
                ],
                "opponentActiveMagi": [
                    {
                        "card": "O'Qua",
                        "data": {
                            "actionsUsed": [],
                            "attacked": 0,
                            "controller": 1,
                            "defeatedCreature": false,
                            "energy": 3,
                            "energyLostThisTurn": 0,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "id": "4ftxAz1qjEiExtbwRt4zH",
                        "owner": 1
                    }
                ],
                "opponentDeck": [
                    {
                        "card": null,
                        "data": {},
                        "id": "iI3sM77xywhjCWfEb_fHG",
                        "owner": 1
                    },
                    {
                        "card": null,
                        "data": {},
                        "id": "R-Xl_TZ3PQ055ZdqXjhjw",
                        "owner": 1
                    },
                    {
                        "card": null,
                        "data": {},
                        "id": "YqKFqszvjMaRzPdVECYNZ",
                        "owner": 1
                    },
                    {
                        "card": null,
                        "data": {},
                        "id": "TzZ-P-it2PsYP4i_s2sjo",
                        "owner": 1
                    },
                    {
                        "card": null,
                        "data": {},
                        "id": "61EGj32ubVMNCcucqbJ6j",
                        "owner": 1
                    },
                    {
                        "card": null,
                        "data": {},
                        "id": "z44lyesKH_o1k8WJKXt8Z",
                        "owner": 1
                    },
                    {
                        "card": null,
                        "data": {},
                        "id": "Xh_OXmLE9FC80-blsrSj4",
                        "owner": 1
                    },
                    {
                        "card": null,
                        "data": {},
                        "id": "ArHQlWVkrUxUOcYYQGZrT",
                        "owner": 1
                    },
                    {
                        "card": null,
                        "data": {},
                        "id": "FikK3ZzuhdaQDmztKnb6K",
                        "owner": 1
                    },
                    {
                        "card": null,
                        "data": {},
                        "id": "_TEHkiYKglRJNVt6zcPTu",
                        "owner": 1
                    },
                    {
                        "card": null,
                        "data": {},
                        "id": "2QrJhVjPVOYuifbHgRZCY",
                        "owner": 1
                    },
                    {
                        "card": null,
                        "data": {},
                        "id": "Jf6GyXBNDCKtz3v5c1Q8h",
                        "owner": 1
                    },
                    {
                        "card": null,
                        "data": {},
                        "id": "y0Owh17Vbuv0TC5OZ35GC",
                        "owner": 1
                    },
                    {
                        "card": null,
                        "data": {},
                        "id": "rPskoEq79LchZgjAwMZHi",
                        "owner": 1
                    },
                    {
                        "card": null,
                        "data": {},
                        "id": "FjsevVqqW9VXmqIvFpBrC",
                        "owner": 1
                    },
                    {
                        "card": null,
                        "data": {},
                        "id": "j0WS-Y_BOk57Fuz2mq89t",
                        "owner": 1
                    },
                    {
                        "card": null,
                        "data": {},
                        "id": "F0kXIrKTlGoarMzWrgP8g",
                        "owner": 1
                    },
                    {
                        "card": null,
                        "data": {},
                        "id": "d8MTVF3jVvwQFGma4v_Xe",
                        "owner": 1
                    },
                    {
                        "card": null,
                        "data": {},
                        "id": "L0He8Kdj3Ul_CjkTgQFF6",
                        "owner": 1
                    },
                    {
                        "card": null,
                        "data": {},
                        "id": "XjOD7LMTXORQ4stzWUPUb",
                        "owner": 1
                    },
                    {
                        "card": null,
                        "data": {},
                        "id": "yR78VJ9o6Zwubq4LrFu3H",
                        "owner": 1
                    },
                    {
                        "card": null,
                        "data": {},
                        "id": "0OaCCsNsgBdhR8MKwJHxU",
                        "owner": 1
                    },
                    {
                        "card": null,
                        "data": {},
                        "id": "vMvKj1yLJisld9RiEPxtE",
                        "owner": 1
                    },
                    {
                        "card": null,
                        "data": {},
                        "id": "zlHwTI1zkYYGV9yvE8ECL",
                        "owner": 1
                    },
                    {
                        "card": null,
                        "data": {},
                        "id": "lF4LCVf4rt-xyyaqoME9H",
                        "owner": 1
                    },
                    {
                        "card": null,
                        "data": {},
                        "id": "1XbRN2pr1-hqVlBzhFKek",
                        "owner": 1
                    }
                ],
                "opponentDefeatedMagi": [],
                "opponentDiscard": [
                    {
                        "card": "Submerge",
                        "data": {
                            "actionsUsed": [],
                            "attacked": 0,
                            "controller": 1,
                            "defeatedCreature": false,
                            "energy": 0,
                            "energyLostThisTurn": 0,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "id": "DB-wg8i8ftlT9bIuzkXam",
                        "owner": 1
                    },
                    {
                        "card": "Undertow",
                        "data": {
                            "actionsUsed": [],
                            "attacked": 0,
                            "controller": 1,
                            "defeatedCreature": false,
                            "energy": 0,
                            "energyLostThisTurn": 0,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "id": "DWW7z7Sc8aEUPulDmukht",
                        "owner": 1
                    },
                    {
                        "card": "Abaquist",
                        "data": {
                            "actionsUsed": [],
                            "attacked": 0,
                            "controller": 1,
                            "defeatedCreature": false,
                            "energy": 0,
                            "energyLostThisTurn": 0,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "id": "tJgMU-t_J4jQCpZ6bMU4C",
                        "owner": 1
                    },
                    {
                        "card": "Dream Balm",
                        "data": {
                            "actionsUsed": [],
                            "attacked": 0,
                            "controller": 1,
                            "defeatedCreature": false,
                            "energy": 0,
                            "energyLostThisTurn": 0,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "id": "7tQ8RjPrmjKBpuTz9mek1",
                        "owner": 1
                    },
                    {
                        "card": "Abaquist",
                        "data": {
                            "actionsUsed": [],
                            "attacked": 0,
                            "controller": 1,
                            "defeatedCreature": false,
                            "energy": 0,
                            "energyLostThisTurn": 0,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "id": "lJlPX-guGg9Sxdb1eMr3-",
                        "owner": 1
                    }
                ],
                "opponentHand": [
                    {
                        "card": null,
                        "data": null,
                        "id": "mRNHRBkpwuWZOkqzTivNZ",
                        "owner": 1
                    },
                    {
                        "card": null,
                        "data": null,
                        "id": "gYMHZZsd1jA6fT3m0zn1R",
                        "owner": 1
                    },
                    {
                        "card": null,
                        "data": null,
                        "id": "dTCD8Cfo3jXGfRqVeKc0H",
                        "owner": 1
                    },
                    {
                        "card": null,
                        "data": null,
                        "id": "mWFEAkZdgdKEKQSKsSBI7",
                        "owner": 1
                    }
                ],
                "opponentMagiPile": [
                    {
                        "card": null,
                        "data": {},
                        "id": "-Z40K-ZHrzqJJEfMXyt2z",
                        "owner": 1
                    },
                    {
                        "card": null,
                        "data": {},
                        "id": "YCKgY2AXDNmwqJi8CwSNG",
                        "owner": 1
                    }
                ],
                "playerActiveMagi": [
                    {
                        "card": "Poad",
                        "data": {
                            "actionsUsed": [],
                            "attacked": 0,
                            "controller": 2,
                            "defeatedCreature": false,
                            "energy": 7,
                            "energyLostThisTurn": 0,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "id": "8aRcDD0On7PWSNl_bRKuS",
                        "owner": 2
                    }
                ],
                "playerDeck": [
                    {
                        "card": null,
                        "data": {},
                        "id": "qjlRHP7TZtCd9ZDhj5ame",
                        "owner": 2
                    },
                    {
                        "card": null,
                        "data": {},
                        "id": "sj6p7aS2B38VFW5EgepQ1",
                        "owner": 2
                    },
                    {
                        "card": null,
                        "data": {},
                        "id": "ElCLOhI1hDxkM9UaHHzz_",
                        "owner": 2
                    },
                    {
                        "card": null,
                        "data": {},
                        "id": "qDKq8MFCnQNuEQ0xrBOJ7",
                        "owner": 2
                    },
                    {
                        "card": null,
                        "data": {},
                        "id": "tzJhRR8Nvp9g0I5J2FlgV",
                        "owner": 2
                    },
                    {
                        "card": null,
                        "data": {},
                        "id": "8Ue-W2eDVSNBwzvZsK_72",
                        "owner": 2
                    },
                    {
                        "card": null,
                        "data": {},
                        "id": "sUpPZ2aC_u3JJVjWGr8uK",
                        "owner": 2
                    },
                    {
                        "card": null,
                        "data": {},
                        "id": "CNClU2TLBfQkqA-EDStNY",
                        "owner": 2
                    },
                    {
                        "card": null,
                        "data": {},
                        "id": "zrRUQ2lSFix-A_H5DJtIa",
                        "owner": 2
                    },
                    {
                        "card": null,
                        "data": {},
                        "id": "frjywHuu0Scx0LnvJ3b2o",
                        "owner": 2
                    },
                    {
                        "card": null,
                        "data": {},
                        "id": "QUtJ1sgngeksYo0h0xSTy",
                        "owner": 2
                    },
                    {
                        "card": null,
                        "data": {},
                        "id": "WuYGkfoNPjj2exLkzgHM9",
                        "owner": 2
                    },
                    {
                        "card": null,
                        "data": {},
                        "id": "AKT3WPMyK0tfc55UxRNWi",
                        "owner": 2
                    },
                    {
                        "card": null,
                        "data": {},
                        "id": "L71QjUPkhOO1Es7TvKVZ7",
                        "owner": 2
                    },
                    {
                        "card": null,
                        "data": {},
                        "id": "807r4m4TPLHHxYJ_m8MHe",
                        "owner": 2
                    },
                    {
                        "card": null,
                        "data": {},
                        "id": "Yn-LSujm22El_BSY3j62E",
                        "owner": 2
                    },
                    {
                        "card": null,
                        "data": {},
                        "id": "pIsA-WpV0YnpZIHTDLwx2",
                        "owner": 2
                    },
                    {
                        "card": null,
                        "data": {},
                        "id": "uaffsffDaqYgcGa0lSrh-",
                        "owner": 2
                    },
                    {
                        "card": null,
                        "data": {},
                        "id": "En3JG424q9YC2fzP5VwAw",
                        "owner": 2
                    },
                    {
                        "card": null,
                        "data": {},
                        "id": "dzLlhrO5RlPWbS7FkZtTC",
                        "owner": 2
                    },
                    {
                        "card": null,
                        "data": {},
                        "id": "Y6YJATOVL7JpKC67ycR1e",
                        "owner": 2
                    },
                    {
                        "card": null,
                        "data": {},
                        "id": "CG17jdEJKjsQ6tpfIS9oy",
                        "owner": 2
                    },
                    {
                        "card": null,
                        "data": {},
                        "id": "uUjgsqA-Bqcj6VTO3Hsn7",
                        "owner": 2
                    },
                    {
                        "card": null,
                        "data": {},
                        "id": "qnzFue7uyi-u60YPa1hgy",
                        "owner": 2
                    },
                    {
                        "card": null,
                        "data": {},
                        "id": "1fTZiDBtj221aZOqflP9k",
                        "owner": 2
                    },
                    {
                        "card": null,
                        "data": {},
                        "id": "Uy8TmIOekMV2VvRyWPP4Q",
                        "owner": 2
                    }
                ],
                "playerDefeatedMagi": [],
                "playerDiscard": [
                    {
                        "card": "Carillion",
                        "data": {
                            "actionsUsed": [],
                            "attacked": 0,
                            "controller": 2,
                            "defeatedCreature": false,
                            "energy": 0,
                            "energyLostThisTurn": 0,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "id": "fJh9-WIoLORewsL5QnZ1p",
                        "owner": 2
                    },
                    {
                        "card": "Grow",
                        "data": {
                            "actionsUsed": [],
                            "attacked": 0,
                            "controller": 2,
                            "defeatedCreature": false,
                            "energy": 0,
                            "energyLostThisTurn": 0,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "id": "rjalNTab2h-Y1uHlnXiQ2",
                        "owner": 2
                    },
                    {
                        "card": "Weebo",
                        "data": {
                            "actionsUsed": [],
                            "attacked": 0,
                            "controller": 2,
                            "defeatedCreature": false,
                            "energy": 0,
                            "energyLostThisTurn": 0,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "id": "FD31ggsGg6i-oP2HrOdOm",
                        "owner": 2
                    },
                    {
                        "card": "Leaf Hyren",
                        "data": {
                            "actionsUsed": [],
                            "attacked": 0,
                            "controller": 2,
                            "defeatedCreature": false,
                            "energy": 0,
                            "energyLostThisTurn": 0,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "id": "cq1RbVz2d5u_7kBD0qdDy",
                        "owner": 2
                    },
                    {
                        "card": "Grow",
                        "data": {
                            "actionsUsed": [],
                            "attacked": 0,
                            "controller": 2,
                            "defeatedCreature": false,
                            "energy": 0,
                            "energyLostThisTurn": 0,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "id": "EIqTTxom9YdZOkuzAB6nq",
                        "owner": 2
                    },
                    {
                        "card": "Arboll",
                        "data": {
                            "actionsUsed": [],
                            "attacked": 0,
                            "controller": 2,
                            "defeatedCreature": false,
                            "energy": 0,
                            "energyLostThisTurn": 0,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "id": "YX2GSgALiJMI725qzxunb",
                        "owner": 2
                    },
                    {
                        "card": "Ancestral Flute",
                        "data": {
                            "actionsUsed": [],
                            "attacked": 0,
                            "controller": 2,
                            "defeatedCreature": false,
                            "energy": 0,
                            "energyLostThisTurn": 0,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "id": "IgeN0P7K9Q3nq_illy8jt",
                        "owner": 2
                    }
                ],
                "playerHand": [
                    {
                        "card": "Vortex of Knowledge",
                        "data": {
                            "actionsUsed": [],
                            "attacked": 0,
                            "controller": 2,
                            "defeatedCreature": false,
                            "energy": 0,
                            "energyLostThisTurn": 0,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "id": "2KdnFWgmfBTA2PHDYcjWv",
                        "owner": 2
                    },
                    {
                        "card": "Giant Carillion",
                        "data": {
                            "actionsUsed": [],
                            "attacked": 0,
                            "controller": 2,
                            "defeatedCreature": false,
                            "energy": 0,
                            "energyLostThisTurn": 0,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "id": "9uhH0uSt65BH1PqHLr6kV",
                        "owner": 2
                    },
                    {
                        "card": "Giant Carillion",
                        "data": {
                            "actionsUsed": [],
                            "attacked": 0,
                            "controller": 2,
                            "defeatedCreature": false,
                            "energy": 0,
                            "energyLostThisTurn": 0,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "id": "ZBobAWXOxmPERutciJGbp",
                        "owner": 2
                    },
                    {
                        "card": "Vortex of Knowledge",
                        "data": {
                            "actionsUsed": [],
                            "attacked": 0,
                            "controller": 2,
                            "defeatedCreature": false,
                            "energy": 0,
                            "energyLostThisTurn": 0,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "id": "S9mir49Y1EGV0Vt_r2oi4",
                        "owner": 2
                    },
                    {
                        "card": "Carillion",
                        "data": {
                            "actionsUsed": [],
                            "attacked": 0,
                            "controller": 2,
                            "defeatedCreature": false,
                            "energy": 0,
                            "energyLostThisTurn": 0,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "id": "SFjtOg3pbNdM-0KJliBg7",
                        "owner": 2
                    },
                    {
                        "card": "Grow",
                        "data": {
                            "actionsUsed": [],
                            "attacked": 0,
                            "controller": 2,
                            "defeatedCreature": false,
                            "energy": 0,
                            "energyLostThisTurn": 0,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "id": "oVijOy1LO8kuCEAf4PuJr",
                        "owner": 2
                    }
                ],
                "playerMagiPile": [
                    {
                        "card": "Tryn",
                        "data": {
                            "actionsUsed": [],
                            "attacked": 0,
                            "controller": 2,
                            "defeatedCreature": false,
                            "energy": 0,
                            "energyLostThisTurn": 0,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "id": "82NYqvhw0o3SBu6Wzp_cv",
                        "owner": 2
                    },
                    {
                        "card": "Yaki",
                        "data": {
                            "actionsUsed": [],
                            "attacked": 0,
                            "controller": 2,
                            "defeatedCreature": false,
                            "energy": 0,
                            "energyLostThisTurn": 0,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "id": "2-byrmcxydfwsguFWGDZS",
                        "owner": 2
                    }
                ]
            }
        };
        const ACTIVE_PLAYER = 1;
        const stateRepresentation = new GameState(stateJson);
        stateRepresentation.setPlayerId(ACTIVE_PLAYER);
        const strategy = new SimulationStrategy();
        strategy.setup(stateRepresentation, ACTIVE_PLAYER);
        const action = strategy.requestAction();
        console.dir(action);
    });
});
// Public Morozov just for testing
class PublicSimulationStrategy extends SimulationStrategy {
    getActionsOnHold() {
        return this.actionsOnHold;
    }
    getGraph() {
        return this.graph;
    }
}
describe('Strange attacks', () => {
    it('Double attack', () => {
        const serializedState = { "staticAbilities": [{ "id": "2yiyZsXwXTqfx6E1iuTMu", "owner": 2, "card": "Water of Life", "data": { "energy": 0, "controller": 2, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false } }], "energyPrompt": false, "turnTimer": false, "turnSecondsLeft": 0, "promptAvailableCards": [], "zones": { "playerHand": [{ "id": "CGNu5DXa1673t2zxa898P", "owner": 2, "card": "Vortex of Knowledge", "data": { "energy": 0, "controller": 2, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false } }, { "id": "ic9bJ523jMo-qGkUaHJHs", "owner": 2, "card": "Hyren's Call", "data": { "energy": 0, "controller": 2, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false } }, { "id": "8gaIztrWN_sE1ki5MwUjk", "owner": 2, "card": "Timber Hyren", "data": { "energy": 0, "controller": 2, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false } }, { "id": "wnC99JUKkVT1EK3PYgNj5", "owner": 2, "card": "Giant Carillion", "data": { "energy": 0, "controller": 2, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false } }], "opponentHand": [{ "id": "pSi8m1-JdNkFeW-oa43G_", "owner": 1, "card": null, "data": null }, { "id": "48wjHspTobH_alQwAKFdA", "owner": 1, "card": null, "data": null }, { "id": "5DVEmT4JwiNcIlUKN8D_9", "owner": 1, "card": null, "data": null }, { "id": "HiuX10f5Rt0nC2eV9B8i_", "owner": 1, "card": null, "data": null }, { "id": "v0kP7ro4eBUlmTMsuOKWU", "owner": 1, "card": null, "data": null }, { "id": "vAruVzDnEFdCV3Ze0mUjv", "owner": 1, "card": null, "data": null }], "playerDeck": [{ "card": null, "data": {}, "owner": 2, "id": "kttlD_gzSFhzJ9VDCkl1C" }, { "card": null, "data": {}, "owner": 2, "id": "dq898gykj9lkykH0CS9Ms" }, { "card": null, "data": {}, "owner": 2, "id": "Rrogbk6VMiJ5zeW8sE1RC" }, { "card": null, "data": {}, "owner": 2, "id": "d56KE8EALzv1_k4-KzScR" }, { "card": null, "data": {}, "owner": 2, "id": "yVJKQCdzadVW_goRiiNX2" }, { "card": null, "data": {}, "owner": 2, "id": "OfiCXAnHPr0d9ChpsCb0n" }, { "card": null, "data": {}, "owner": 2, "id": "hpcWik387uYptUqM2aA2S" }, { "card": null, "data": {}, "owner": 2, "id": "Zs-M5mQMCwTthcgxHNJwj" }, { "card": null, "data": {}, "owner": 2, "id": "n0hGzyAKZyhOmrzhdATDe" }, { "card": null, "data": {}, "owner": 2, "id": "p2TLLIobU2nSzM2C_GrsL" }, { "card": null, "data": {}, "owner": 2, "id": "xaiHpVCM08MrOISB5Bt8s" }, { "card": null, "data": {}, "owner": 2, "id": "n_Fq10krXegLrYDCE6qn8" }, { "card": null, "data": {}, "owner": 2, "id": "sGCPjv9OVQzQ23Ic8kyQX" }, { "card": null, "data": {}, "owner": 2, "id": "I-ZQQOiaZJTf0r3Cz-AUw" }, { "card": null, "data": {}, "owner": 2, "id": "CXdcxLOtKm0EbTQ_5vDk9" }, { "card": null, "data": {}, "owner": 2, "id": "siV4qHWnwG-ERg6YWSIUg" }, { "card": null, "data": {}, "owner": 2, "id": "3yaS5D_qltOlEOfwil2_x" }, { "card": null, "data": {}, "owner": 2, "id": "pKFCg5K78XFL1WyccZ_DR" }, { "card": null, "data": {}, "owner": 2, "id": "Dz51fskXZAbRioK79vBMi" }, { "card": null, "data": {}, "owner": 2, "id": "J1WzkbZ4rwh2dtRuM5xC5" }, { "card": null, "data": {}, "owner": 2, "id": "mXIGjalgCzww-gxvhBP4H" }, { "card": null, "data": {}, "owner": 2, "id": "PZv0ORfp4KOEs6PnFy_zS" }, { "card": null, "data": {}, "owner": 2, "id": "y2qblxEd6X-Xeo2CrZmji" }, { "card": null, "data": {}, "owner": 2, "id": "MK3em6cD_AnzKJSUA3PAn" }, { "card": null, "data": {}, "owner": 2, "id": "L1F4hsHYvmET6-sSU8lxF" }, { "card": null, "data": {}, "owner": 2, "id": "xVsKYnbg3WVTz8geZz0GC" }, { "card": null, "data": {}, "owner": 2, "id": "fi-kwNFOWH1brvXcImwKp" }, { "card": null, "data": {}, "owner": 2, "id": "JdbpwCR0Mnt6_-OdEjnOJ" }, { "card": null, "data": {}, "owner": 2, "id": "PhXhP22ry8IztpoOnxd_v" }, { "card": null, "data": {}, "owner": 2, "id": "_odTQCLqXkLA4ssTGrTfU" }, { "card": null, "data": {}, "owner": 2, "id": "oL2gcveRNoOlQAnf8I4Xu" }, { "card": null, "data": {}, "owner": 2, "id": "KtE1_IkILSwDXBhQ9mdlg" }], "opponentDeck": [{ "card": null, "data": {}, "owner": 1, "id": "yPfPXVVIGaQiV1XTzKKR-" }, { "card": null, "data": {}, "owner": 1, "id": "SUpJ8F5JWYPJwWsTKsIpX" }, { "card": null, "data": {}, "owner": 1, "id": "kdZDrlHIcYhQDmdzp9ZoM" }, { "card": null, "data": {}, "owner": 1, "id": "Uhpuq0J--nSwxaMjXc31y" }, { "card": null, "data": {}, "owner": 1, "id": "TIu8DZEdkUH_DzujObCRg" }, { "card": null, "data": {}, "owner": 1, "id": "SnfKlSRh3CZFq39ppZ1fL" }, { "card": null, "data": {}, "owner": 1, "id": "hMLvapicRh8zVuXS7nOoi" }, { "card": null, "data": {}, "owner": 1, "id": "SffIerohbYz19ExSgRc1b" }, { "card": null, "data": {}, "owner": 1, "id": "Kal8LNy7h3qUU2QT_4lsD" }, { "card": null, "data": {}, "owner": 1, "id": "Vz7iiktRGPWtZY6Qs9WDB" }, { "card": null, "data": {}, "owner": 1, "id": "J4-C-ktHbu4DjTIoh7L46" }, { "card": null, "data": {}, "owner": 1, "id": "sR8XqCMQr9lfMe938KAl7" }, { "card": null, "data": {}, "owner": 1, "id": "jRt090PLRb-vwUR6wWtSb" }, { "card": null, "data": {}, "owner": 1, "id": "WRNOlB52RzPqA25A2Cr1g" }, { "card": null, "data": {}, "owner": 1, "id": "yQ_fM7_f8H4Bs4mX0HWnK" }, { "card": null, "data": {}, "owner": 1, "id": "4jH9Rb8jTLX0k7QAfEiC3" }, { "card": null, "data": {}, "owner": 1, "id": "XPELhOApYdrncdtRHdzS8" }, { "card": null, "data": {}, "owner": 1, "id": "y7ptNaFIznDejm54Wrw6m" }, { "card": null, "data": {}, "owner": 1, "id": "gVx11ZcaJ7FuS_58vCX9H" }, { "card": null, "data": {}, "owner": 1, "id": "zJN7_OKCoZHNzR_5BNCAJ" }, { "card": null, "data": {}, "owner": 1, "id": "VAcx_a_VBfreTEL2SvThq" }, { "card": null, "data": {}, "owner": 1, "id": "YchQ3Y5_L9dpQ7LxBNUUo" }, { "card": null, "data": {}, "owner": 1, "id": "g_eZxTMbAoTP_MZY2mVoZ" }, { "card": null, "data": {}, "owner": 1, "id": "m2cQ_CDH1HBMKo1sYQ6VU" }, { "card": null, "data": {}, "owner": 1, "id": "WMPc1P_yBhUmvl4lFqPwA" }, { "card": null, "data": {}, "owner": 1, "id": "XHeP3uyaZnaf-02ppBXso" }, { "card": null, "data": {}, "owner": 1, "id": "Un7TvBfg3g4pSC2q3PNhf" }, { "card": null, "data": {}, "owner": 1, "id": "8wsaJJd-jL2BhUiQ2GdW_" }, { "card": null, "data": {}, "owner": 1, "id": "VLbemUDoJtveYI6d_g_jB" }, { "card": null, "data": {}, "owner": 1, "id": "X6VcsW8scQYb37GgUDExw" }, { "card": null, "data": {}, "owner": 1, "id": "6VggEuT-NKx3LQwPhD6S-" }, { "card": null, "data": {}, "owner": 1, "id": "cMZd4ubNUF29YXhnQe0cj" }, { "card": null, "data": {}, "owner": 1, "id": "GOHpVOqTwh52_wNPWpHfu" }], "playerActiveMagi": [{ "id": "uKxaRkuhyTfuU3641VnB3", "owner": 2, "card": "Evu", "data": { "energy": 8, "controller": 2, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false } }], "opponentActiveMagi": [{ "id": "4ZJVBFkSH-zw7gMWrNWQ-", "owner": 1, "card": "Stradus", "data": { "energy": 13, "controller": 1, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false } }], "playerMagiPile": [{ "card": "Tryn", "data": { "energy": 0, "controller": 2, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 2, "id": "cndmX3B87hWlWi-2tw1Xs" }, { "card": "Yaki", "data": { "energy": 0, "controller": 2, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 2, "id": "hTAcPBSoJIUqvbmvK-LxA" }], "opponentMagiPile": [{ "card": null, "data": {}, "owner": 1, "id": "AAlJQZlVEfxFLUIHlOsrp" }, { "card": null, "data": {}, "owner": 1, "id": "MV8dw-zEUZqt8HkQBPLaY" }], "inPlay": [{ "id": "6IVDwepRNbUecQlnBi5XD", "owner": 2, "card": "Furok", "data": { "energy": 4, "controller": 2, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false } }, { "id": "gj6nMhuxwlZFQl3cZMSIb", "owner": 2, "card": "Plith", "data": { "energy": 3, "controller": 2, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false } }, { "id": "ZN316V9yCMUMXJbNZWQPu", "owner": 2, "card": "Carillion", "data": { "energy": 4, "controller": 2, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false } }, { "id": "Go0F1VAjesIZd8i62j59A", "owner": 1, "card": "Lovian", "data": { "energy": 4, "controller": 1, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false } }, { "id": "2yiyZsXwXTqfx6E1iuTMu", "owner": 2, "card": "Water of Life", "data": { "energy": 0, "controller": 2, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false } }], "playerDefeatedMagi": [], "opponentDefeatedMagi": [], "playerDiscard": [], "opponentDiscard": [] }, "continuousEffects": [], "step": 1, "turn": 1, "goesFirst": 2, "activePlayer": 2, "prompt": false, "promptType": null, "promptMessage": null, "promptPlayer": null, "promptGeneratedBy": null, "promptParams": {}, "opponentId": 1, "log": [], "gameEnded": false, "winner": null };
        const stateRepresentation = new GameState(serializedState);
        const FUROK_ID = serializedState.zones.inPlay.find(card => card.card === "Furok")?.id;
        const PLITH_ID = serializedState.zones.inPlay.find(card => card.card === "Plith")?.id;
        const STRADUS_ID = serializedState.zones.opponentActiveMagi.find(card => card.card === "Stradus")?.id;
        const LOVIAN_ID = serializedState.zones.inPlay.find(card => card.card === "Lovian")?.id;
        const strategy = new PublicSimulationStrategy();
        strategy.setup(stateRepresentation, 2);
        const action = strategy.requestAction();
        expect(action.type).toEqual(ACTION_PASS);
        const actionsOnHold = strategy.getActionsOnHold();
        expect(actionsOnHold).toHaveLength(7);
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
    });
    it('Attacks into Magi with creature', () => {
        const cardHand = (id, owner) => ({
            id,
            data: {},
            card: null,
            owner
        });
        const cardDeck = (id, owner) => ({
            id,
            data: {},
            card: null,
            owner
        });
        const serializedState = {
            "staticAbilities": [],
            "energyPrompt": false,
            "turnTimer": false,
            "turnSecondsLeft": 0,
            "promptAvailableCards": [],
            "zones": {
                "playerHand": [
                    {
                        "id": "waOsioWOGKjL1edBe7-wQ",
                        "owner": 2,
                        "card": "Vortex of Knowledge",
                        "data": {
                            "energy": 0,
                            "controller": 2,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        }
                    },
                    {
                        "id": "hFbDKMYSpvmxw-92MLsps",
                        "owner": 2,
                        "card": "Leaf Hyren",
                        "data": {
                            "energy": 0,
                            "controller": 2,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        }
                    }
                ],
                "opponentHand": [
                    cardHand("Y-jZQoAyBwtcCHoEkctoZ", 1),
                    cardHand("VabLk6P9qoqtx7y3jWIsK", 1),
                    cardHand("r5V5qSUGsgr0UWqJuxFeB", 1),
                    cardHand("fIu5nlwVQhzIeVatxdTOM", 1),
                    cardHand("DrlSai48ihWOA05RxP7dU", 1),
                    cardHand("4KuGbr1fzABErbcwVDP0D", 1),
                    cardHand("ovfY6wP1oFbECTZlRJ4q0", 1)
                ],
                "playerDeck": [
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "2P2XJ-y0dhaAsICvphfFJ"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "jpJG8jg6F0noVloqREU4L"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "r3jdwFZu55YAFp_6ZK1_F"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "0cY5ZGCFCiuN7Mqm5Xdtz"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "erwC-Ts2-EX5r1loAcHz-"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "UPVOgFWElgwRzxBcSxOD2"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "zlsVUkEiCGrCbzDuff4BN"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "LrcwTO6OUVxBVH0OQ06yH"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "eWMRZqmfNrmWrNx_lSTmf"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "WHoGt63z23B1jX_ZW29BA"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "4WkquVuCVdkXcTg8RV_iV"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "daZpM4m6fCgeu5xtKNcd4"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "vw5KQO3DLlvNHScDzdkDl"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "tktKdn4FENxNmW86wojmQ"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "fS_krZU0QT_0PDTtecgAB"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "rWt4frZfiWH4rofj5Cbkv"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "DU_95kerj3P3yM62qlk-3"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "aKxZwXq_FNzaqghaWXqMh"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "ycMQhBKzT_JUX1QsxVhX6"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "lEXuml2fmbtUHviELKhww"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "t48-dWqmC2W8kqVDhmGhe"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "ODZdgAo2n4E40giObFc7m"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "lcrMo8TSVbkU0ANyXcCe8"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "9hKs817YVx-9Thz2R6URp"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "lx0WowJU0yqMPD7BtET7f"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "7Gvo4ylXa7lN81HT3sSXm"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "V2Damm0mFh9C-Y0eyjI5K"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "mVYCvjxGOpAHi6G6fCoo-"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "cnzg75__asHPpxrfgJD2T"
                    }
                ],
                "opponentDeck": [
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "h0bQYO4VhAuT6y0SnTB6J"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "whW68QNi5HLah6NH56VFY"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "5jI9yx1-tJ3VtgBxICFZ1"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "Sv0RdzlvepPcyj4zVKv-b"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "gYbV0hIAtbwCYjUHu0x0W"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "VQ-n-xg6tD7k6jfPts529"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "Y7PWwVpDcydHimZMcGSIl"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "PNQ2aszCysJrcCvfi-Weh"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "nARXR-gWI1UEZCfeoErDg"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "3AJX-3l3xg8GyK2asmijD"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "SZX7xlyk-qNzsdOLkeQNc"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "LBzjMHwif1gzjL6fg4xt8"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "obI2yxN8dB7sm7M4ynEts"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "Cx2R2a63YMQrRZ6aPUHkJ"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "oEL3sBa7yl5ALlCMIA2q6"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "3TAcZZ1nM9u8MRTWxNwiC"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "GK55YqLBQn_GJQ5AALbuI"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "91eG3RbM-WGeQ48bCeB3v"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "8pWLh5CN47dTPMQpMA1UR"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "Cx6wKS1DDrvedlwbY2WO3"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "JpL_eCwOKsGMj2Jf2jW4B"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "NwSIv-QKdrQh8zJO8mWVC"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "YNpHazbNzTRoH1N6rqdg5"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "Lv0_xDFdFxXpw2-bfCfN1"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "1XUHdszrSPk1zc_RyRvX7"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "dLNQTK6oFWWZHAGHMpbaY"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "bdFvOGviCqGeKGtnAe-BV"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "cuMjUsnp78QGiPmUsFv8G"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "oiPpeb7AWM-tzZU2P5362"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "lQR78lqgAL65PSkdHWWjx"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "m3n1hthKcpGlI8fngoD8l"
                    }
                ],
                "playerActiveMagi": [
                    {
                        "id": "xpVPPpkXp4tXk-5agBZCb",
                        "owner": 2,
                        "card": "Evu",
                        "data": {
                            "energy": 5,
                            "controller": 2,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        }
                    }
                ],
                "opponentActiveMagi": [
                    {
                        "id": "IDCV-qFviXmyzSlLn2b4Z",
                        "owner": 1,
                        "card": "Adis",
                        "data": {
                            "energy": 17,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        }
                    }
                ],
                "playerMagiPile": [
                    {
                        "card": "Tryn",
                        "data": {
                            "energy": 0,
                            "controller": 2,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 2,
                        "id": "PSFRlCFzKOsR8ytctZ9H2"
                    },
                    {
                        "card": "Yaki",
                        "data": {
                            "energy": 0,
                            "controller": 2,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 2,
                        "id": "4_L8cqq8X4srEAQQQbGl_"
                    }
                ],
                "opponentMagiPile": [
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "vxI8-1Tr7u8oe673vE_ud"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "opzLfXFrjJkluISNgcZlk"
                    }
                ],
                "inPlay": [
                    {
                        "id": "hrojmW3hg1Brxt3gUTqPs",
                        "owner": 2,
                        "card": "Furok",
                        "data": {
                            "energy": 4,
                            "controller": 2,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        }
                    },
                    {
                        "id": "Rf5FmO-e_BdVapqfJz0Nm",
                        "owner": 2,
                        "card": "Plith",
                        "data": {
                            "energy": 3,
                            "controller": 2,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        }
                    },
                    {
                        "id": "IazPes0M8d2IIG5KOxrCY",
                        "owner": 1,
                        "card": "Orathan Flyer",
                        "data": {
                            "energy": 7,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        }
                    },
                    {
                        "id": "Z9h4EYznWkW9xV-jOuRXr",
                        "owner": 2,
                        "card": "Carillion",
                        "data": {
                            "energy": 4,
                            "controller": 2,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        }
                    },
                    {
                        "id": "9x6SCbVe2uawSRvYev97b",
                        "owner": 2,
                        "card": "Rudwot",
                        "data": {
                            "energy": 3,
                            "controller": 2,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        }
                    },
                    {
                        "id": "KpqUnhqLRk4R_W5NPHYNv",
                        "owner": 2,
                        "card": "Weebo",
                        "data": {
                            "energy": 2,
                            "controller": 2,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        }
                    },
                    {
                        "id": "1zPlxQ-JHrdYNV3offCjI",
                        "owner": 2,
                        "card": "Rudwot",
                        "data": {
                            "energy": 3,
                            "controller": 2,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        }
                    },
                    {
                        "id": "DtCN2XwTYzaDcT6mIsfU-",
                        "owner": 2,
                        "card": "Ancestral Flute",
                        "data": {
                            "energy": 0,
                            "controller": 2,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        }
                    },
                    {
                        "id": "eY6CV4Q8SXCwTWYQdFNWI",
                        "owner": 2,
                        "card": "Robe of Vines",
                        "data": {
                            "energy": 0,
                            "controller": 2,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        }
                    }
                ],
                "playerDefeatedMagi": [],
                "opponentDefeatedMagi": [],
                "playerDiscard": [
                    {
                        "id": "FYCgRS7CBuNcuKrnD1k7c",
                        "owner": 2,
                        "card": "Arboll",
                        "data": {
                            "energy": 0,
                            "controller": 2,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        }
                    }
                ],
                "opponentDiscard": [
                    {
                        "id": "d6cf3QI8NiydxB5VaewRR",
                        "owner": 1,
                        "card": "Fog Bank",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        }
                    }
                ]
            },
            "continuousEffects": [
                {
                    "generatedBy": "XmK1B5y5LIsSarBkRT_W-",
                    "expiration": {
                        "type": "expiration/opponents_turns",
                        "turns": 1
                    },
                    "staticAbilities": [
                        {
                            "name": "Fog Bank",
                            "text": "Creature cannot be attacked for next two opponents turns",
                            "selector": "selectors/id",
                            "selectorParameter": "IazPes0M8d2IIG5KOxrCY",
                            "property": "properties/can_be_attacked",
                            "modifier": {
                                "operandOne": false,
                                "operator": "calculations/set"
                            }
                        }
                    ],
                    "triggerEffects": [],
                    "player": 1,
                    "id": "XmK1B5y5LIsSarBkRT_W-"
                }
            ],
            "step": 2,
            "turn": 1,
            "goesFirst": 2,
            "activePlayer": 2,
            "prompt": false,
            "promptType": null,
            "promptMessage": null,
            "promptPlayer": null,
            "promptGeneratedBy": null,
            "promptParams": {},
            "opponentId": 1,
            "log": [],
            "gameEnded": false,
            "winner": null
        };
        const stateRepresentation = new GameState(serializedState);
        stateRepresentation.setPlayerId(2);
        const strategy = new PublicSimulationStrategy();
        strategy.setup(stateRepresentation, 2);
        const action = strategy.requestAction();
        expect(action.type).toEqual(ACTION_PASS);
    });
});
describe('Simulations', () => {
    it('Cald vs Naroom', (done) => {
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
            'Dream Balm',
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
        ];
        const game = createGame();
        game.setPlayers(1, 2);
        game.setDeck(1, deckOne);
        game.setDeck(2, deckTwo);
        // @ts-ignore
        game.initiatePRNG(12345);
        game.setup();
        // @ts-ignore
        // console.dir(game.twister);
        // game.enableDebug();
        const gameLog = [];
        let gameDataCallbackOne = () => { };
        let actionCallbackOne = () => { };
        let gameDataCallbackTwo = () => { };
        let actionCallbackTwo = () => { };
        const connectorOne = {
            on: (type, callback) => {
                if (type == 'gameData') {
                    gameDataCallbackOne = callback;
                }
                else if (type == 'action') {
                    actionCallbackOne = callback;
                }
            },
            emit: (type, action) => {
                // console.log(`Connector one emitting "${type}"`)
                // console.dir(action);
                if (type === 'clientAction') {
                    const convertedCommand = convertClientCommands({
                        ...action,
                        player: 1,
                    }, game);
                    if (convertedCommand) {
                        if (convertedCommand.type === ACTION_PLAY && 'payload' in convertedCommand && !convertedCommand.payload.card) {
                            console.log(`Cannot convert ACTION_PLAY command, source card: ${action.payload.card.name} [${action.payload.card.id}]`);
                            console.dir(action?.payload?.card);
                            // debugger;
                            // expect(true).toEqual(false);
                        }
                        game.update(convertedCommand);
                        const activePlayer = game.state.prompt ? game.state.promptPlayer : game.state.activePlayer;
                        if (activePlayer == 1) {
                            actionCallbackOne({
                                type: 'display/priority',
                                player: activePlayer,
                            });
                        }
                        else {
                            actionCallbackTwo({
                                type: 'display/priority',
                                player: activePlayer,
                            });
                        }
                    }
                }
            },
            close: () => {
                // console.log(`Closing the connection`);
            }
        };
        const connectorTwo = {
            on: (type, callback) => {
                if (type == 'gameData') {
                    gameDataCallbackTwo = callback;
                }
                else if (type == 'action') {
                    actionCallbackTwo = callback;
                }
            },
            emit: (_type, action) => {
                const convertedCommand = convertClientCommands({
                    ...action,
                    player: 2,
                }, game);
                if (convertedCommand) {
                    if (convertedCommand.type === ACTION_PLAY && 'payload' in convertedCommand && !convertedCommand.payload.card) {
                        console.error(`Cannot convert ACTION_PLAY command, source card: ${action.payload.card.card} [${action.payload.card.id}]`);
                        console.log(game.getZone(ZONE_TYPE_HAND, 2).cards.map(card => `[${card.id}] ${card.card.name}`).join(', '));
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
                        });
                    }
                    else {
                        actionCallbackTwo({
                            type: 'display/priority',
                            player: activePlayer,
                        });
                    }
                }
            },
            close: () => {
                // console.log(`Closing the connection`);
            }
        };
        console.log(`Connecting strategies to game`);
        const strategyConnectorOne = new StrategyConnector(connectorOne);
        strategyConnectorOne.connect(new SimulationStrategy());
        const strategyConnectorTwo = new StrategyConnector(connectorTwo);
        strategyConnectorTwo.connect(new SimulationStrategy());
        console.log(`Turning off debug`);
        game.debug = false;
        // let turnNumber = 0;
        game.setOnAction((action) => {
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
            gameLog.push({ for: 1, action: commandForBotOne });
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
            }
            catch (e) {
                console.log(`Error converting command`);
                console.dir(action);
                throw e;
            }
            if (action.type === ACTION_PLAYER_WINS) {
                if (action.player === 1) {
                    console.log('Cald won');
                }
                else {
                    console.log('Naroom won');
                }
                // console.dir(action)
                const magiLeft = game.getZone(ZONE_TYPE_MAGI_PILE, action.player).cards.length + 1; // plus active magi
                const energyLeft = game.getZone(ZONE_TYPE_ACTIVE_MAGI, action.player).card?.data.energy;
                const creaturesLeft = game.getZone(ZONE_TYPE_IN_PLAY).cards.filter(card => card.data.controller == action.player).length;
                console.log(`Winning player has ${magiLeft} Magi left with ${energyLeft} energy on active Magi and ${creaturesLeft} creatures`);
                done();
            }
        });
        console.log(`Sending state data to log`);
        gameLog.push({ for: 1, state: game.serializeData(1) });
        console.log(`Sending state data to player 1`);
        gameDataCallbackOne({ playerId: 1, state: game.serializeData(1) });
        gameDataCallbackTwo({ playerId: 2, state: game.serializeData(2) });
    }, 20000);
    const naroomDefault = [
        'Poad',
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
    ];
    const underneathKorrits = [
        'Motash',
        'Strag',
        'Ulk',
        'Water of Life',
        'Water of Life',
        'Water of Life',
        'Dream Balm',
        'Dream Balm',
        'Dream Balm',
        'Korrit',
        'Korrit',
        'Korrit',
        'Giant Korrit',
        'Giant Korrit',
        'Giant Korrit',
        'Pack Korrit',
        'Pack Korrit',
        'Pack Korrit',
        'Staff of Korrits',
        'Staff of Korrits',
        'Staff of Korrits',
        'Crystal Arboll',
        'Crystal Arboll',
        'Crystal Arboll',
        'Bottomless Pit',
        'Bottomless Pit',
        'Bottomless Pit',
        'Pharan',
        'Pharan',
        'Pharan',
        'Cloud Narth',
        'Cloud Narth',
        'Cloud Narth',
        'Cave Rudwot',
        'Cave Rudwot',
        'Cave Rudwot',
        'Agovo',
        'Agovo',
        'Agovo',
        'Giant Parmalag',
        'Giant Parmalag',
        'Giant Parmalag',
        'Motash\'s Staff'
    ];
    const caldCreatures = [
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
    const arderialEnergy = [
        'Stradus',
        'Ora',
        'Nimbulo',
        'Water of Life',
        'Water of Life',
        'Water of Life',
        'Dream Balm',
        'Dream Balm',
        'Dream Balm',
        'Lovian',
        'Lovian',
        'Lovian',
        'Alaban',
        'Alaban',
        'Alaban',
        'Ayebaw',
        'Ayebaw',
        'Ayebaw',
        'Fog Bank',
        'Fog Bank',
        'Fog Bank',
        'Xyx',
        'Xyx',
        'Xyx',
        'Xyx Elder',
        'Xyx Elder',
        'Xyx Elder',
        'Pharan',
        'Pharan',
        'Pharan',
        'Cloud Narth',
        'Cloud Narth',
        'Cloud Narth',
        'Orathan Flyer',
        'Orathan Flyer',
        'Orathan Flyer',
        'Shockwave',
        'Shockwave',
        'Shockwave',
        'Storm Cloud',
        'Storm Cloud',
        'Storm Cloud',
        'Updraft'
    ];
    const oQuaCombo = [
        'O\'Qua',
        'Whall',
        'Ebylon',
        'Water of Life',
        'Water of Life',
        'Water of Life',
        'Dream Balm',
        'Dream Balm',
        'Dream Balm',
        'Corf',
        'Corf',
        'Corf',
        'Sphor',
        'Sphor',
        'Sphor',
        'Abaquist',
        'Abaquist',
        'Abaquist',
        'Orothean Belt',
        'Platheus',
        'Platheus',
        'Platheus',
        'Giant Parathin',
        'Giant Parathin',
        'Giant Parathin',
        'Undertow',
        'Undertow',
        'Undertow',
        'Deep Hyren',
        'Deep Hyren',
        'Deep Hyren',
        'Megathan',
        'Megathan',
        'Megathan',
        'Bwill',
        'Bwill',
        'Bwill',
        'Robes of the Ages',
        'Robes of the Ages',
        'Submerge',
        'Submerge',
        'Submerge',
        'Coral Hyren',
        'Coral Hyren',
    ];
    it.only('Underneath vs Naroom', (done) => {
        const deckOne = [
            'Motash',
            'Strag',
            'Ulk',
            'Water of Life',
            'Water of Life',
            'Water of Life',
            'Dream Balm',
            'Dream Balm',
            'Dream Balm',
            'Korrit',
            'Korrit',
            'Korrit',
            'Giant Korrit',
            'Giant Korrit',
            'Giant Korrit',
            'Pack Korrit',
            'Pack Korrit',
            'Pack Korrit',
            'Staff of Korrits',
            'Staff of Korrits',
            'Staff of Korrits',
            'Crystal Arboll',
            'Crystal Arboll',
            'Crystal Arboll',
            'Bottomless Pit',
            'Bottomless Pit',
            'Bottomless Pit',
            'Pharan',
            'Pharan',
            'Pharan',
            'Cloud Narth',
            'Cloud Narth',
            'Cloud Narth',
            'Cave Rudwot',
            'Cave Rudwot',
            'Cave Rudwot',
            'Agovo',
            'Agovo',
            'Agovo',
            'Giant Parmalag',
            'Giant Parmalag',
            'Giant Parmalag',
            'Motash\'s Staff'
        ];
        const deckTwo = [
            'Poad',
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
        ];
        const game = createGame();
        game.setPlayers(1, 2);
        game.setDeck(1, arderialEnergy);
        game.setDeck(2, naroomDefault);
        // @ts-ignore
        game.initiatePRNG(2029);
        game.setup();
        const gameLog = [];
        let gameDataCallbackOne = () => { };
        let actionCallbackOne = () => { };
        let gameDataCallbackTwo = () => { };
        let actionCallbackTwo = () => { };
        const connectorOne = {
            on: (type, callback) => {
                if (type == 'gameData') {
                    gameDataCallbackOne = callback;
                }
                else if (type == 'action') {
                    actionCallbackOne = callback;
                }
            },
            emit: (type, action) => {
                if (type === 'clientAction') {
                    const convertedCommand = convertClientCommands({
                        ...action,
                        player: 1,
                    }, game);
                    if (convertedCommand) {
                        if (convertedCommand.type === ACTION_PLAY && 'payload' in convertedCommand && !convertedCommand.payload.card) {
                            console.log(`Cannot convert ACTION_PLAY command, source card: ${action.payload.card.name} [${action.payload.card.id}]`);
                            console.dir(action?.payload?.card);
                            throw new Error(`Cannot convert ACTION_PLAY command, source card: ${action.payload.card.name} [${action.payload.card.id}]`);
                        }
                        try {
                            game.update(convertedCommand);
                        }
                        catch (e) {
                            if (e && 'message' in e && e.message == 'Non-prompt action in the prompt state') {
                                actionCallbackOne({
                                    type: 'display/status',
                                });
                                actionCallbackTwo({
                                    type: 'display/status',
                                });
                            }
                            else {
                                console.log(`Strange error: ${e?.message}`);
                            }
                            throw e;
                        }
                        const activePlayer = game.state.prompt ? game.state.promptPlayer : game.state.activePlayer;
                        if (activePlayer == 1) {
                            actionCallbackOne({
                                type: 'display/priority',
                                player: activePlayer,
                            });
                        }
                        else {
                            actionCallbackTwo({
                                type: 'display/priority',
                                player: activePlayer,
                            });
                        }
                    }
                }
            },
            close: () => {
                // console.log(`Closing the connection`);
            }
        };
        const connectorTwo = {
            on: (type, callback) => {
                if (type == 'gameData') {
                    gameDataCallbackTwo = callback;
                }
                else if (type == 'action') {
                    actionCallbackTwo = callback;
                }
            },
            emit: (_type, action) => {
                const convertedCommand = convertClientCommands({
                    ...action,
                    player: 2,
                }, game);
                if (convertedCommand) {
                    if (convertedCommand.type === ACTION_PLAY && 'payload' in convertedCommand && !convertedCommand.payload.card) {
                        console.error(`Cannot convert ACTION_PLAY command, source card: ${action.payload.card.card} [${action.payload.card.id}]`);
                        console.log(game.getZone(ZONE_TYPE_HAND, 2).cards.map(card => `[${card.id}] ${card.card.name}`).join(', '));
                        console.dir(action?.payload?.card);
                        expect(true).toEqual(false);
                    }
                    try {
                        game.update(convertedCommand);
                    }
                    catch (e) {
                        if (e && 'message' in e && e.message == 'Non-prompt action in the prompt state') {
                            actionCallbackOne({
                                type: 'display/status',
                            });
                            actionCallbackTwo({
                                type: 'display/status',
                            });
                        }
                        else {
                            console.log(`Strange error: ${e?.message}`);
                        }
                        throw e;
                    }
                    const activePlayer = game.state.prompt ? game.state.promptPlayer : game.state.activePlayer;
                    // if (game.state.prompt) {
                    //   console.log(`Game is in prompt state, prompt is ${game.state.promptType}`)
                    // }
                    // console.log(`Sending out priority display for player ${activePlayer}`);
                    if (activePlayer == 1) {
                        actionCallbackOne({
                            type: 'display/priority',
                            player: activePlayer,
                        });
                    }
                    else {
                        actionCallbackTwo({
                            type: 'display/priority',
                            player: activePlayer,
                        });
                    }
                }
                else {
                    console.log(`Fail to convert command, oh my`);
                    console.log(JSON.stringify(game.serializeData(2)));
                    // if (action.type !== 'display/dump') {
                    //   actionCallbackTwo({
                    //     type: 'display/status',
                    //   })
                    // }
                    fs.writeFileSync('./replayPlayerTwo.json', JSON.stringify(gameLog, null, 2));
                    throw new Error('Conversion error');
                }
            },
            close: () => {
                // console.log(`Closing the connection`);
            }
        };
        console.log(`Connecting strategies to game`);
        const strategyConnectorOne = new StrategyConnector(connectorOne);
        strategyConnectorOne.connect(new SimulationStrategy());
        const strategyConnectorTwo = new StrategyConnector(connectorTwo);
        strategyConnectorTwo.connect(new SimulationStrategy());
        // console.log(`Turning off debug`)
        game.debug = false;
        // let turnNumber = 0;
        game.setOnAction((action) => {
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
            if (commandForBotOne) {
                gameLog.push({ for: 1, action: commandForBotOne });
            }
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
                if (commandForBotTwo) {
                    gameLog.push({ for: 2, action: commandForBotTwo });
                }
                actionCallbackTwo(commandForBotTwo);
            }
            catch (e) {
                console.log(`Error converting command`);
                console.dir(action);
                throw e;
            }
            if (action.type === ACTION_PLAYER_WINS) {
                if (action.player === 1) {
                    console.log('Arderial Energy won');
                }
                else {
                    console.log('Naroom Default won');
                }
                const magiLeft = game.getZone(ZONE_TYPE_MAGI_PILE, action.player).cards.length + 1; // plus active magi
                const energyLeft = game.getZone(ZONE_TYPE_ACTIVE_MAGI, action.player).card?.data.energy;
                const creaturesLeft = game.getZone(ZONE_TYPE_IN_PLAY).cards.filter(card => card.data.controller == action.player).length;
                console.log(`Winning player has ${magiLeft} Magi left with ${energyLeft} energy on active Magi and ${creaturesLeft} creatures`);
                done();
            }
        });
        console.log(`Sending state data to log`);
        gameLog.push({ for: 2, state: game.serializeData(2) });
        console.log(`Sending state data to players`);
        gameDataCallbackOne({ playerId: 1, state: game.serializeData(1) });
        gameDataCallbackTwo({ playerId: 2, state: game.serializeData(2) });
    }, 4000000);
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
        ];
        const game = createGame();
        game.setPlayers(1, 2);
        game.setDeck(1, deckOne);
        game.setDeck(2, deckTwo);
        // @ts-ignore
        game.initiatePRNG(2);
        game.setup();
        let gameDataCallbackOne = () => { };
        let actionCallbackOne = () => { };
        let gameDataCallbackTwo = () => { };
        let actionCallbackTwo = () => { };
        const connectorOne = {
            on: (type, callback) => {
                if (type == 'gameData') {
                    gameDataCallbackOne = callback;
                }
                else if (type == 'action') {
                    actionCallbackOne = callback;
                }
            },
            emit: (type, action) => {
                // console.log(`Connector one emitting "${type}"`)
                // console.dir(action);
                if (type === 'clientAction') {
                    const convertedCommand = convertClientCommands({
                        ...action,
                        player: 1,
                    }, game);
                    if (convertedCommand) {
                        if (convertedCommand.type === ACTION_PLAY && 'payload' in convertedCommand && !convertedCommand.payload.card) {
                            console.log(`Cannot convert ACTION_PLAY command, source card: ${action.payload.card.name} [${action.payload.card.id}]`);
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
                                player: activePlayer,
                            });
                            // }, 0);
                        }
                        else if (activePlayer === 2) {
                            // setTimeout(() => {
                            actionCallbackTwo({
                                type: 'display/priority',
                                player: activePlayer,
                            });
                            // }, 0);
                        }
                    }
                }
            },
            close: () => {
                // console.log(`Closing the connection`);
            }
        };
        const connectorTwo = {
            on: (type, callback) => {
                if (type == 'gameData') {
                    gameDataCallbackTwo = callback;
                }
                else if (type == 'action') {
                    actionCallbackTwo = callback;
                }
            },
            emit: (_type, action) => {
                const convertedCommand = convertClientCommands({
                    ...action,
                    player: 2,
                }, game);
                if (convertedCommand) {
                    if (convertedCommand.type === ACTION_PLAY && 'payload' in convertedCommand && !convertedCommand.payload.card) {
                        console.error(`Cannot convert ACTION_PLAY command, source card: ${action.payload.card.card} [${action.payload.card.id}]`);
                        console.log(game.getZone(ZONE_TYPE_HAND, 2).cards.map(card => `[${card.id}] ${card.card.name}`).join(', '));
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
                            player: activePlayer,
                        });
                        // }, 0);
                    }
                    else if (activePlayer === 2) {
                        // setTimeout(() => {
                        actionCallbackTwo({
                            type: 'display/priority',
                            player: activePlayer,
                        });
                        // }, 0)
                    }
                }
            },
            close: () => {
                // console.log(`Closing the connection`);
            }
        };
        const strategyConnectorOne = new StrategyConnector(connectorOne);
        strategyConnectorOne.connect(new SimulationStrategy());
        const strategyConnectorTwo = new StrategyConnector(connectorTwo);
        strategyConnectorTwo.connect(new SimulationStrategy());
        game.debug = false;
        game.setOnAction((action) => {
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
            }
            catch (e) {
                console.log(`Error converting command`);
                console.dir(action);
                throw e;
            }
            if (action.type === ACTION_PLAYER_WINS) {
                if (action.player === 1) {
                    console.log('Cald won');
                }
                else {
                    console.log('Gum-Gums won');
                }
                console.dir(action);
                const magiLeft = game.getZone(ZONE_TYPE_MAGI_PILE, action.player).cards.length + 1; // plus active magi
                const energyLeft = game.getZone(ZONE_TYPE_ACTIVE_MAGI, action.player).card?.data.energy;
                const creaturesLeft = game.getZone(ZONE_TYPE_IN_PLAY).cards.filter(card => card.data.controller == action.player).length;
                console.log(`Winning player has ${magiLeft} Magi left with ${energyLeft} energy on active Magi and ${creaturesLeft} creatures`);
                done();
            }
        });
        gameDataCallbackOne({ playerId: 1, state: game.serializeData(1) });
        gameDataCallbackTwo({ playerId: 2, state: game.serializeData(2) });
    }, 20000);
});
