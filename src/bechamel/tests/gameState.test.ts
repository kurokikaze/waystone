import { ACTION_EFFECT, EFFECT_TYPE_START_OF_TURN } from 'moonlands/dist/esm/index';
import { GameState } from '../GameState'
import { SerializedClientState } from '../types';
import { SimulationStrategy } from '../strategies/SimulationStrategy';

describe('GameState tests', () => {
    it.only('Non-prrompt response in prompt state', () => {
        const stateJson = {
            "timestamp": "2026-05-20T13:54:00.918Z",
            "state": {
                "staticAbilities": [],
                "energyPrompt": false,
                "turnTimer": false,
                "turnSecondsLeft": 0,
                "promptAvailableCards": [],
                "zones": {
                    "playerHand": [
                        {
                            "card": "Weebo",
                            "data": {
                                "energy": 0,
                                "controller": 1,
                                "attacked": 0,
                                "actionsUsed": [],
                                "energyLostThisTurn": 0,
                                "defeatedCreature": false,
                                "hasAttacked": false,
                                "wasAttacked": false
                            },
                            "owner": 1,
                            "id": "ShsYtxVytv"
                        }
                    ],
                    "opponentHand": [
                        {
                            "card": null,
                            "data": {},
                            "owner": 2,
                            "id": "7NyKEazGUA"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 2,
                            "id": "OWqwyNkc_s"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 2,
                            "id": "uddstp1XuG"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 2,
                            "id": "uZ3cT7vC9L"
                        }
                    ],
                    "playerDeck": [
                        {
                            "card": null,
                            "data": {},
                            "owner": 1,
                            "id": "UF7KHt48Bg"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 1,
                            "id": "4BdEU6ZBR8"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 1,
                            "id": "7dHBZUqZt_"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 1,
                            "id": "-JfpYrkazK"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 1,
                            "id": "iVGk2bgmjC"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 1,
                            "id": "7_uAP6dYwj"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 1,
                            "id": "Tt5FbsSmXC"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 1,
                            "id": "fnmyq807Ll"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 1,
                            "id": "j0PCUdDXb0"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 1,
                            "id": "ODvwGbsv25"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 1,
                            "id": "sJsrTsdiE5"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 1,
                            "id": "PPkzc6dRad"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 1,
                            "id": "whctyv9sCK"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 1,
                            "id": "Swny1nWzgx"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 1,
                            "id": "yeYvzCZ49d"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 1,
                            "id": "CUgZ4HOqVW"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 1,
                            "id": "jAbuZaPoL6"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 1,
                            "id": "tl-QXoW4kY"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 1,
                            "id": "QET1o22r5O"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 1,
                            "id": "SxmjK3dT53"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 1,
                            "id": "IXdE-eFeIx"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 1,
                            "id": "sIAi_RPjCZ"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 1,
                            "id": "Zf7Ap1R1sq"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 1,
                            "id": "h-Uyb7TNVN"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 1,
                            "id": "AKYSyIZIfX"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 1,
                            "id": "g-uhiMdupe"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 1,
                            "id": "uCQp_DD0tf"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 1,
                            "id": "XKYm8A_y_P"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 1,
                            "id": "doVEM9Sc3P"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 1,
                            "id": "6JhIuxwrZS"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 1,
                            "id": "BeQZ34Xll-"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 1,
                            "id": "s2UsBcN1D5"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 1,
                            "id": "oYMkLHBugT"
                        }
                    ],
                    "opponentDeck": [
                        {
                            "card": null,
                            "data": {},
                            "owner": 2,
                            "id": "liD37ALjX8"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 2,
                            "id": "Fz9GDINWOl"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 2,
                            "id": "DjaVUBuSK9"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 2,
                            "id": "eNEHod0G-l"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 2,
                            "id": "h5Qmb7sm4Z"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 2,
                            "id": "JHk5gsGv6m"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 2,
                            "id": "YoIsk9JnNA"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 2,
                            "id": "jlbAv3wEQR"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 2,
                            "id": "ly-BvT2QkV"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 2,
                            "id": "CLXCxyoTCN"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 2,
                            "id": "-VovYW44ls"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 2,
                            "id": "bIUqggHeEN"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 2,
                            "id": "x5tYLkeR3D"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 2,
                            "id": "dsuV5gS_oX"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 2,
                            "id": "rnVix3H-6K"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 2,
                            "id": "vtp5Zem-5o"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 2,
                            "id": "BhPQibiGgs"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 2,
                            "id": "cIBEMo-JgV"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 2,
                            "id": "mFBB8cboUd"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 2,
                            "id": "QOt1kmlJiR"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 2,
                            "id": "vQTzp56Coh"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 2,
                            "id": "ZVO50Wgh9D"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 2,
                            "id": "WKqX7Wvk3_"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 2,
                            "id": "Brc5oQ-DGd"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 2,
                            "id": "la17XnwAJ2"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 2,
                            "id": "314au8yzto"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 2,
                            "id": "O0wxqZhLIY"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 2,
                            "id": "XUkt9aOJRu"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 2,
                            "id": "NN1UZz40-7"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 2,
                            "id": "qxH2Ia_evk"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 2,
                            "id": "d07LTMQ0MB"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 2,
                            "id": "bhXPrxHEQQ"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 2,
                            "id": "PO-xa0mMSk"
                        }
                    ],
                    "playerActiveMagi": [
                        {
                            "card": "Whall",
                            "data": {
                                "energy": 1,
                                "controller": 1,
                                "attacked": 0,
                                "actionsUsed": [],
                                "energyLostThisTurn": 0,
                                "defeatedCreature": false,
                                "hasAttacked": false,
                                "wasAttacked": false
                            },
                            "owner": 1,
                            "id": "cgi9vZQj_R"
                        }
                    ],
                    "opponentActiveMagi": [
                        {
                            "card": "Poad",
                            "data": {
                                "energy": 3,
                                "controller": 2,
                                "attacked": 0,
                                "actionsUsed": [],
                                "energyLostThisTurn": 0,
                                "defeatedCreature": false,
                                "hasAttacked": false,
                                "wasAttacked": false
                            },
                            "owner": 2,
                            "id": "sMHARp8LMJ"
                        }
                    ],
                    "playerMagiPile": [
                        {
                            "card": "Orlon",
                            "data": {
                                "energy": 0,
                                "controller": 1,
                                "attacked": 0,
                                "actionsUsed": [],
                                "energyLostThisTurn": 0,
                                "defeatedCreature": false,
                                "hasAttacked": false,
                                "wasAttacked": false
                            },
                            "owner": 1,
                            "id": "wRF3ri0w9V"
                        },
                        {
                            "card": "Ebylon",
                            "data": {
                                "energy": 0,
                                "controller": 1,
                                "attacked": 0,
                                "actionsUsed": [],
                                "energyLostThisTurn": 0,
                                "defeatedCreature": false,
                                "hasAttacked": false,
                                "wasAttacked": false
                            },
                            "owner": 1,
                            "id": "s9zh5M3UHh"
                        }
                    ],
                    "opponentMagiPile": [
                        {
                            "card": null,
                            "data": {},
                            "owner": 2,
                            "id": "SO2XMFFH4w"
                        },
                        {
                            "card": null,
                            "data": {},
                            "owner": 2,
                            "id": "PN6jdRz8U0"
                        }
                    ],
                    "inPlay": [
                        {
                            "card": "Dream Balm",
                            "data": {
                                "energy": 0,
                                "controller": 1,
                                "attacked": 0,
                                "actionsUsed": [],
                                "energyLostThisTurn": 0,
                                "defeatedCreature": false,
                                "hasAttacked": false,
                                "wasAttacked": false
                            },
                            "owner": 1,
                            "id": "5y7RJTxs86"
                        },
                        {
                            "card": "Sea Barl",
                            "data": {
                                "energy": 7,
                                "controller": 1,
                                "attacked": 0,
                                "actionsUsed": [],
                                "energyLostThisTurn": 0,
                                "defeatedCreature": false,
                                "hasAttacked": false,
                                "wasAttacked": false
                            },
                            "owner": 1,
                            "id": "8qZqi2_Hew"
                        },
                        {
                            "card": "Sphor",
                            "data": {
                                "energy": 2,
                                "controller": 1,
                                "attacked": 0,
                                "actionsUsed": [],
                                "energyLostThisTurn": 0,
                                "defeatedCreature": false,
                                "hasAttacked": false,
                                "wasAttacked": false
                            },
                            "owner": 1,
                            "id": "Du4HJNrlcC"
                        },
                        {
                            "card": "Bwill",
                            "data": {
                                "energy": 1,
                                "controller": 1,
                                "attacked": 0,
                                "actionsUsed": [],
                                "energyLostThisTurn": 0,
                                "defeatedCreature": false,
                                "hasAttacked": false,
                                "wasAttacked": false
                            },
                            "owner": 1,
                            "id": "7oK1hC4gE3"
                        },
                        {
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
                            },
                            "owner": 2,
                            "id": "6ccqssoAUp"
                        },
                        {
                            "card": "Timber Hyren",
                            "data": {
                                "energy": 7,
                                "controller": 2,
                                "attacked": 0,
                                "actionsUsed": [],
                                "energyLostThisTurn": 0,
                                "defeatedCreature": false,
                                "hasAttacked": false,
                                "wasAttacked": false
                            },
                            "owner": 2,
                            "id": "QkggJUD2gr"
                        },
                        {
                            "card": "Giant Carillion",
                            "data": {
                                "energy": 8,
                                "controller": 2,
                                "attacked": 0,
                                "actionsUsed": [],
                                "energyLostThisTurn": 0,
                                "defeatedCreature": false,
                                "hasAttacked": false,
                                "wasAttacked": false
                            },
                            "owner": 2,
                            "id": "VC76EK-NsY"
                        }
                    ],
                    "playerDefeatedMagi": [],
                    "opponentDefeatedMagi": [],
                    "playerDiscard": [
                        {
                            "card": "Submerge",
                            "data": {
                                "energy": 0,
                                "controller": 1,
                                "attacked": 0,
                                "actionsUsed": [],
                                "energyLostThisTurn": 0,
                                "defeatedCreature": false,
                                "hasAttacked": false,
                                "wasAttacked": false
                            },
                            "owner": 1,
                            "id": "de55CzZr2k"
                        },
                        {
                            "card": "Undertow",
                            "data": {
                                "energy": 0,
                                "controller": 1,
                                "attacked": 0,
                                "actionsUsed": [],
                                "energyLostThisTurn": 0,
                                "defeatedCreature": false,
                                "hasAttacked": false,
                                "wasAttacked": false
                            },
                            "owner": 1,
                            "id": "BizJ9fHb8J"
                        }
                    ],
                    "opponentDiscard": []
                },
                "continuousEffects": [],
                "step": 1,
                "turn": 1,
                "goesFirst": 1,
                "activePlayer": 1,
                "prompt": true,
                "promptType": "prompt/creature",
                "promptMessage": "Choose a Creature to discard and shuffle into deck",
                "promptPlayer": 1,
                "promptGeneratedBy": "N1XpedKPSX",
                "promptParams": {},
                "opponentId": 2,
                "log": [
                    {
                        "type": "log_entry/magi_energy_gain",
                        "card": "Whall",
                        "amount": 10
                    },
                    {
                        "type": "log_entry/choose_starting_cards",
                        "player": 1
                    },
                    {
                        "type": "log_entry/draw",
                        "player": 1
                    },
                    {
                        "type": "log_entry/draw",
                        "player": 1
                    },
                    {
                        "type": "log_entry/draw",
                        "player": 1
                    },
                    {
                        "type": "log_entry/draw",
                        "player": 1
                    },
                    {
                        "type": "log_entry/draw",
                        "player": 1
                    },
                    {
                        "type": "log_entry/play",
                        "card": "Dream Balm",
                        "player": 1
                    },
                    {
                        "type": "log_entry/play",
                        "card": "Sea Barl",
                        "player": 1
                    },
                    {
                        "type": "log_entry/creature_energy_gain",
                        "card": "Sea Barl",
                        "amount": 4
                    },
                    {
                        "type": "log_entry/play",
                        "card": "Sphor",
                        "player": 1
                    },
                    {
                        "type": "log_entry/creature_energy_gain",
                        "card": "Sphor",
                        "amount": 2
                    },
                    {
                        "type": "log_entry/play",
                        "card": "Bwill",
                        "player": 1
                    },
                    {
                        "type": "log_entry/creature_energy_gain",
                        "card": "Bwill",
                        "amount": 1
                    },
                    {
                        "type": "log_entry/draw",
                        "player": 1
                    },
                    {
                        "type": "log_entry/draw",
                        "player": 1
                    },
                    {
                        "type": "log_entry/magi_energy_gain",
                        "card": "Poad",
                        "amount": 13
                    },
                    {
                        "type": "log_entry/choose_starting_cards",
                        "player": 2
                    },
                    {
                        "type": "log_entry/draw",
                        "player": 2
                    },
                    {
                        "type": "log_entry/draw",
                        "player": 2
                    },
                    {
                        "type": "log_entry/draw",
                        "player": 2
                    },
                    {
                        "type": "log_entry/draw",
                        "player": 2
                    },
                    {
                        "type": "log_entry/draw",
                        "player": 2
                    },
                    {
                        "type": "log_entry/magi_energy_gain",
                        "card": "Poad",
                        "amount": 5
                    },
                    {
                        "type": "log_entry/play",
                        "card": "Ancestral Flute",
                        "player": 2
                    },
                    {
                        "type": "log_entry/play",
                        "card": "Timber Hyren",
                        "player": 2
                    },
                    {
                        "type": "log_entry/creature_energy_gain",
                        "card": "Timber Hyren",
                        "amount": 7
                    },
                    {
                        "type": "log_entry/play",
                        "card": "Giant Carillion",
                        "player": 2
                    },
                    {
                        "type": "log_entry/creature_energy_gain",
                        "card": "Giant Carillion",
                        "amount": 8
                    },
                    {
                        "type": "log_entry/draw",
                        "player": 2
                    },
                    {
                        "type": "log_entry/draw",
                        "player": 2
                    },
                    {
                        "type": "log_entry/magi_energy_gain",
                        "card": "Whall",
                        "amount": 5
                    },
                    {
                        "type": "log_entry/play",
                        "card": "Submerge",
                        "player": 1
                    },
                    {
                        "type": "log_entry/creature_energy_gain",
                        "card": "Sea Barl",
                        "amount": 3
                    },
                    {
                        "type": "log_entry/play",
                        "card": "Undertow",
                        "player": 1
                    }
                ],
                "gameEnded": false,
                "winner": null,
                "cardsAttached": {}
            },
            "context": {
                "reason": "pass_in_prompt",
                "location": "StrategyConnector",
                "playerId": 1,
                "turn": 3,
                "step": 1
            }
        }
        const gameState = new GameState(stateJson.state as unknown as SerializedClientState)
        gameState.setPlayerId(1)
        console.dir(gameState.playerPriority(1))
        const strategy = new SimulationStrategy()
        strategy.setup(gameState, 1);
        const action = strategy.requestAction()
        console.dir(action)
    })

    it('Ticking down the continuous effects', () => {
        const stateJson = '{"staticAbilities":[],"energyPrompt":false,"turnTimer":false,"turnSecondsLeft":0,"promptAvailableCards":[],"zones":{"playerHand":[{"id":"ErGHXZkngOs1Zqt8FPxSE","owner":2,"card":"Vortex of Knowledge","data":{"energy":0,"controller":2,"attacked":0,"actionsUsed":[],"energyLostThisTurn":0,"defeatedCreature":false,"hasAttacked":false,"wasAttacked":false}},{"id":"TSlnuL_7YE8RM4BfzNxDi","owner":2,"card":"Weebo","data":{"energy":0,"controller":2,"attacked":0,"actionsUsed":[],"energyLostThisTurn":0,"defeatedCreature":false,"hasAttacked":false,"wasAttacked":false}},{"id":"h8zzvHlMd-7HA_2ZFtfgc","owner":2,"card":"Carillion","data":{"energy":0,"controller":2,"attacked":0,"actionsUsed":[],"energyLostThisTurn":0,"defeatedCreature":false,"hasAttacked":false,"wasAttacked":false}},{"id":"5elrTKfasqIqoDSGvf98i","owner":2,"card":"Rudwot","data":{"energy":0,"controller":2,"attacked":0,"actionsUsed":[],"energyLostThisTurn":0,"defeatedCreature":false,"hasAttacked":false,"wasAttacked":false}},{"id":"mABN8go9hTw8qfWmPUQ4r","owner":2,"card":"Rudwot","data":{"energy":0,"controller":2,"attacked":0,"actionsUsed":[],"energyLostThisTurn":0,"defeatedCreature":false,"hasAttacked":false,"wasAttacked":false}}],"opponentHand":[{"id":"ryy3ZLks39vqJSw5CG-DF","owner":1,"card":null,"data":null},{"id":"rPExwk34EtE3VywhDSN4v","owner":1,"card":null,"data":null},{"id":"8FFslEchKc35o8V9MGj4N","owner":1,"card":null,"data":null},{"id":"nIYagrtZOeSzIsuHtaN5w","owner":1,"card":null,"data":null},{"id":"D5F4xCoHvIM3U-TMDlLhg","owner":1,"card":null,"data":null}],"playerDeck":[{"card":null,"data":{},"owner":2,"id":"wQLT1aDVPPu3LzAsiCDlz"},{"card":null,"data":{},"owner":2,"id":"H9R7qJVoyR9p7_s9a3Z2f"},{"card":null,"data":{},"owner":2,"id":"ezpV0z7Qsmv-heO_04Y2A"},{"card":null,"data":{},"owner":2,"id":"HEK8wtK-XCbcQsB2Jf5Jv"},{"card":null,"data":{},"owner":2,"id":"tAnQTAeDpimDymC5vVFgI"},{"card":null,"data":{},"owner":2,"id":"Tzx3HBbTLhcGk_gLhu7jZ"},{"card":null,"data":{},"owner":2,"id":"0W3kP83wPUgcPbsmDCGhp"},{"card":null,"data":{},"owner":2,"id":"u2-bVeez3O03cFIqxC5c1"},{"card":null,"data":{},"owner":2,"id":"qBY4P0kE4qqiKaj9DrJEB"},{"card":null,"data":{},"owner":2,"id":"xjtzPwFKtwP8ifqBHKfCR"},{"card":null,"data":{},"owner":2,"id":"3BHkNem7zJy74g3FtTx3O"},{"card":null,"data":{},"owner":2,"id":"dbESI_-2RoWmqtbfYsnfq"},{"card":null,"data":{},"owner":2,"id":"P8BLVk9_lkqdt6g_b-_tP"},{"card":null,"data":{},"owner":2,"id":"q86ZXJ8ou9KKfAifyvkZl"},{"card":null,"data":{},"owner":2,"id":"-laiXBov0Hsp-wYtO2cDw"},{"card":null,"data":{},"owner":2,"id":"_3YsAXxrC_NSmkX44k1tU"},{"card":null,"data":{},"owner":2,"id":"3lS33toWmwZCnL3YCB0gQ"},{"card":null,"data":{},"owner":2,"id":"5aURsu4BkTMH3OCy16Nvi"},{"card":null,"data":{},"owner":2,"id":"U8z_hGTJtwPNCq7SHmsvK"},{"card":null,"data":{},"owner":2,"id":"yu6i_xhz7-25XUgLfhdyC"},{"card":null,"data":{},"owner":2,"id":"t3N3avHRyJPEg478Qm8tn"},{"card":null,"data":{},"owner":2,"id":"iLOQXxLzZzARF031howRL"},{"card":null,"data":{},"owner":2,"id":"DM6ANUW6VtmlZr47v4pz0"},{"card":null,"data":{},"owner":2,"id":"daisq3kweMCMGWnbKvXry"},{"card":null,"data":{},"owner":2,"id":"68YAgHl30eVCk0DwVfunh"},{"card":null,"data":{},"owner":2,"id":"O7ldGcf4pbk4a7S4ih0xB"},{"card":null,"data":{},"owner":2,"id":"gjswM8VgDobxwS0Lfv7FH"},{"card":null,"data":{},"owner":2,"id":"sR4NEKB24ymGuWkMnMeIw"},{"card":null,"data":{},"owner":2,"id":"l3tfyljX_77o_RBP_0Yj7"},{"card":null,"data":{},"owner":2,"id":"cTOCxxpjYprFVSUGmtvLV"},{"card":null,"data":{},"owner":2,"id":"h2d_xNgcxCux2TqI3rly5"},{"card":null,"data":{},"owner":2,"id":"VA-RbKAyeAXmnnEnWomfe"}],"opponentDeck":[{"card":null,"data":{},"owner":1,"id":"ggH2qnsiCIMumN7F2wSmh"},{"card":null,"data":{},"owner":1,"id":"lJsSSLJIpFR8TLpc9c2RE"},{"card":null,"data":{},"owner":1,"id":"qxU0mkpLVfeTRrDl6OASE"},{"card":null,"data":{},"owner":1,"id":"78C2FlKIsg-75WPYjsQej"},{"card":null,"data":{},"owner":1,"id":"7wYhVbkrjBegm2Y39TA_R"},{"card":null,"data":{},"owner":1,"id":"033ldFVKgv4Fc1pDj83V4"},{"card":null,"data":{},"owner":1,"id":"d3XRFizet4TthwsfYJgq_"},{"card":null,"data":{},"owner":1,"id":"Yey5R5MSASdpVtzQ5S3-G"},{"card":null,"data":{},"owner":1,"id":"4HNq3lf6G5wkqWUAK1WTs"},{"card":null,"data":{},"owner":1,"id":"i_hi7sur1nwM0zNp4zaJz"},{"card":null,"data":{},"owner":1,"id":"S-Qm3HYbxaWPBQ_jT6moM"},{"card":null,"data":{},"owner":1,"id":"CERjNycvGh0JVqLSjFX_V"},{"card":null,"data":{},"owner":1,"id":"V1Qbl293D5LmMSPc-H29w"},{"card":null,"data":{},"owner":1,"id":"9JO4DIZ1RN5Fe3drhWkrv"},{"card":null,"data":{},"owner":1,"id":"7HyYlJQ9oHxL9n2vPtpbi"},{"card":null,"data":{},"owner":1,"id":"WilVt0VX8DXK9_PuxbOIM"},{"card":null,"data":{},"owner":1,"id":"2rBLqueIlMffYLeD5qjEU"},{"card":null,"data":{},"owner":1,"id":"UmBWu3n8t2EFtIPSJ1wZn"},{"card":null,"data":{},"owner":1,"id":"lq11GiHKbUbyOAeHI_3SZ"},{"card":null,"data":{},"owner":1,"id":"7OIihSzlPDyKgWIyaNK-D"},{"card":null,"data":{},"owner":1,"id":"o6R3iir0XVjmnK88kD64b"},{"card":null,"data":{},"owner":1,"id":"MSwbx5od3INNgq0v7fC65"},{"card":null,"data":{},"owner":1,"id":"BuGSTU6gOHngy781JsQgN"},{"card":null,"data":{},"owner":1,"id":"aYcSNuHBXNDLhCLdze-zN"},{"card":null,"data":{},"owner":1,"id":"jT6UYH95c6MUAxPYCjkkd"},{"card":null,"data":{},"owner":1,"id":"Hpu80_tERenmpgMTgJ_Rz"},{"card":null,"data":{},"owner":1,"id":"Po90VTL3EjBr7UcB92gfr"},{"card":null,"data":{},"owner":1,"id":"m3M-7U-jyndqzil_owVhn"},{"card":null,"data":{},"owner":1,"id":"8NsSGVSZNcobj3AeojIgR"},{"card":null,"data":{},"owner":1,"id":"o_UCPfupLWbwB8YPIE7lO"},{"card":null,"data":{},"owner":1,"id":"UzwjdTT6X9rSVQa0ZG9BM"},{"card":null,"data":{},"owner":1,"id":"0nC1Cw-hvLnrZ_zWq7Vzi"},{"card":null,"data":{},"owner":1,"id":"C5bw2-rY-_8yQgzUWVUvm"}],"playerActiveMagi":[{"id":"xFAFfnWZFUaOk272Q8Zqp","owner":2,"card":"Evu","data":{"energy":9,"controller":2,"attacked":0,"actionsUsed":[],"energyLostThisTurn":0,"defeatedCreature":false,"hasAttacked":false,"wasAttacked":false}}],"opponentActiveMagi":[{"id":"rODteQihfu9i6MX_hTiZi","owner":1,"card":"Adis","data":{"energy":12,"controller":1,"attacked":0,"actionsUsed":[],"energyLostThisTurn":0,"defeatedCreature":false,"hasAttacked":false,"wasAttacked":false}}],"playerMagiPile":[{"card":"Tryn","data":{"energy":0,"controller":2,"attacked":0,"actionsUsed":[],"energyLostThisTurn":0,"defeatedCreature":false,"hasAttacked":false,"wasAttacked":false},"owner":2,"id":"fQIDM4VMbbZI-i6_tSwXV"},{"card":"Yaki","data":{"energy":0,"controller":2,"attacked":0,"actionsUsed":[],"energyLostThisTurn":0,"defeatedCreature":false,"hasAttacked":false,"wasAttacked":false},"owner":2,"id":"t5FzHhsLTSHVFlhvrau_1"}],"opponentMagiPile":[{"card":null,"data":{},"owner":1,"id":"5eAC4lIwxEoLYw8Qt6vy2"},{"card":null,"data":{},"owner":1,"id":"9si4OeXFTgan3ef0TDRdK"}],"inPlay":[{"id":"TKZlA03xfuX1s6boQ-Wa9","owner":2,"card":"Furok","data":{"energy":4,"controller":2,"attacked":0,"actionsUsed":[],"energyLostThisTurn":0,"defeatedCreature":false,"hasAttacked":false,"wasAttacked":false}},{"id":"KEFVGd5bUpr4s1PWyIecj","owner":2,"card":"Plith","data":{"energy":3,"controller":2,"attacked":0,"actionsUsed":[],"energyLostThisTurn":0,"defeatedCreature":false,"hasAttacked":false,"wasAttacked":false}},{"id":"HtG3UYed2r06A1wBEXK53","owner":1,"card":"Orathan Flyer","data":{"energy":5,"controller":1,"attacked":0,"actionsUsed":[],"energyLostThisTurn":0,"defeatedCreature":false,"hasAttacked":false,"wasAttacked":false}}],"playerDefeatedMagi":[],"opponentDefeatedMagi":[],"playerDiscard":[{"id":"PNZi5T7i99T7fIpvsHE81","owner":2,"card":"Arboll","data":{"energy":0,"controller":2,"attacked":0,"actionsUsed":[],"energyLostThisTurn":0,"defeatedCreature":false,"hasAttacked":false,"wasAttacked":false}}],"opponentDiscard":[{"id":"HK4ecuB10TzZKQz_hC3-N","owner":1,"card":"Fog Bank","data":{"energy":0,"controller":1,"attacked":0,"actionsUsed":[],"energyLostThisTurn":0,"defeatedCreature":false,"hasAttacked":false,"wasAttacked":false}}]},"continuousEffects":[{"generatedBy":"bNNWJStp-lffqs0Pe6DxW","expiration":{"type":"expiration/opponents_turns","turns":2},"staticAbilities":[{"name":"Fog Bank","text":"Creature cannot be attacked for next two opponents turns","selector":"selectors/id","selectorParameter":"HtG3UYed2r06A1wBEXK53","property":"properties/can_be_attacked","modifier":{"operandOne":false,"operator":"calculations/set"}}],"triggerEffects":[],"player":1,"id":"bNNWJStp-lffqs0Pe6DxW"}],"step":0,"turn":1,"goesFirst":2,"activePlayer":1,"prompt":false,"promptType":null,"promptMessage":null,"promptPlayer":null,"promptGeneratedBy":null,"promptParams":{},"opponentId":1,"log":[],"gameEnded":false,"winner":null}'
        const state = new GameState(JSON.parse(stateJson) as SerializedClientState);

        state.setPlayerId(2)

        const turnStartAction = {
            type: ACTION_EFFECT,
            effectType: EFFECT_TYPE_START_OF_TURN,
            player: 2,
            generatedBy: '3rmwJlpPcDZNhbxxhsUcr'
        }

        state.update(turnStartAction)

        console.dir(state.getContinuousEffects())
    })

    it('Held actions end in prompt', () => {
        const stateObj = { "staticAbilities": [{ "card": "Water of Life", "data": { "energy": 0, "controller": 1, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 1, "id": "hhdOXfvOW3" }, { "card": "Water of Life", "data": { "energy": 0, "controller": 2, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 2, "id": "0d-tRCWV_F" }], "energyPrompt": false, "turnTimer": false, "turnSecondsLeft": 0, "promptAvailableCards": [], "zones": { "playerHand": [{ "card": "Grow", "data": { "energy": 0, "controller": 2, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 2, "id": "CQ8V4VqpEi" }, { "card": "Grow", "data": { "energy": 0, "controller": 2, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 2, "id": "Fr6Xem38fb" }, { "card": "Bhatar", "data": { "energy": 0, "controller": 2, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 2, "id": "Cw0V_H1zTE" }], "opponentHand": [{ "card": null, "data": {}, "owner": 1, "id": "pO4pE9g2gm" }, { "card": null, "data": {}, "owner": 1, "id": "uQEsqhvCwX" }, { "card": null, "data": {}, "owner": 1, "id": "q2TGYPNiSO" }], "playerDeck": [{ "card": null, "data": {}, "owner": 2, "id": "sIiFIaDkbC" }, { "card": null, "data": {}, "owner": 2, "id": "ViWm_wQ8No" }, { "card": null, "data": {}, "owner": 2, "id": "VlmEazsSzg" }, { "card": null, "data": {}, "owner": 2, "id": "q6SEeuxK7d" }, { "card": null, "data": {}, "owner": 2, "id": "z5RhjMB9rG" }, { "card": null, "data": {}, "owner": 2, "id": "99tfbgUuqv" }, { "card": null, "data": {}, "owner": 2, "id": "fPb-UsrKNr" }, { "card": null, "data": {}, "owner": 2, "id": "ajnz85jz7Z" }, { "card": null, "data": {}, "owner": 2, "id": "mn7Xd_CIAw" }, { "card": null, "data": {}, "owner": 2, "id": "3RRV85itAq" }, { "card": null, "data": {}, "owner": 2, "id": "guU0NdzOhm" }, { "card": null, "data": {}, "owner": 2, "id": "SUhxxyvcUz" }, { "card": null, "data": {}, "owner": 2, "id": "4upjb1HYJg" }, { "card": null, "data": {}, "owner": 2, "id": "H6jTIQNv1L" }, { "card": null, "data": {}, "owner": 2, "id": "TJSFtCwymp" }, { "card": null, "data": {}, "owner": 2, "id": "ZMclkPHLj0" }, { "card": null, "data": {}, "owner": 2, "id": "ASC4eaLND9" }, { "card": null, "data": {}, "owner": 2, "id": "ophyAIsu53" }, { "card": null, "data": {}, "owner": 2, "id": "R5hVdRHOct" }, { "card": null, "data": {}, "owner": 2, "id": "KCb0qtN-AS" }, { "card": null, "data": {}, "owner": 2, "id": "vZ1G4aRFkn" }, { "card": null, "data": {}, "owner": 2, "id": "T7FCjf19VB" }, { "card": null, "data": {}, "owner": 2, "id": "RDlOBfGUAy" }, { "card": null, "data": {}, "owner": 2, "id": "JUHnGL-RMP" }, { "card": null, "data": {}, "owner": 2, "id": "tm3fMvRvnO" }, { "card": null, "data": {}, "owner": 2, "id": "rT97z9N9j5" }, { "card": null, "data": {}, "owner": 2, "id": "DO4XdIO6Ow" }, { "card": "Giant Carillion", "data": { "energy": 0, "controller": 2, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 2, "id": "Oh5sTBeJkG" }], "opponentDeck": [{ "card": null, "data": {}, "owner": 1, "id": "AzmKjuTPA0" }, { "card": null, "data": {}, "owner": 1, "id": "1nLjW2EM0c" }, { "card": null, "data": {}, "owner": 1, "id": "4gHIe01IyC" }, { "card": null, "data": {}, "owner": 1, "id": "BSxn4jhzWl" }, { "card": null, "data": {}, "owner": 1, "id": "4LbPKODcIQ" }, { "card": null, "data": {}, "owner": 1, "id": "4srxLH80rb" }, { "card": null, "data": {}, "owner": 1, "id": "WlEr6yLP4a" }, { "card": null, "data": {}, "owner": 1, "id": "HoQSeAHe9k" }, { "card": null, "data": {}, "owner": 1, "id": "3c6axDQJoG" }, { "card": null, "data": {}, "owner": 1, "id": "JZ_gNc9GS4" }, { "card": null, "data": {}, "owner": 1, "id": "B5VowFvpO_" }, { "card": null, "data": {}, "owner": 1, "id": "4rKwyiW-5k" }, { "card": null, "data": {}, "owner": 1, "id": "De0-v69-YQ" }, { "card": null, "data": {}, "owner": 1, "id": "JesRYGsET-" }, { "card": null, "data": {}, "owner": 1, "id": "KYaLVBAArM" }, { "card": null, "data": {}, "owner": 1, "id": "fn92B9dLtR" }, { "card": null, "data": {}, "owner": 1, "id": "DxbaVyS4dE" }, { "card": null, "data": {}, "owner": 1, "id": "N0BR41_2cs" }, { "card": null, "data": {}, "owner": 1, "id": "FiNcmkCTJG" }, { "card": null, "data": {}, "owner": 1, "id": "6Txw0p_-Yn" }, { "card": null, "data": {}, "owner": 1, "id": "aHyMx3i0ut" }, { "card": null, "data": {}, "owner": 1, "id": "gFPuUjaGUd" }, { "card": null, "data": {}, "owner": 1, "id": "EpWls7a2rc" }, { "card": null, "data": {}, "owner": 1, "id": "5wrzLDetHj" }, { "card": null, "data": {}, "owner": 1, "id": "RJ-C__X6IW" }, { "card": null, "data": {}, "owner": 1, "id": "PLgRcrN1F2" }, { "card": null, "data": {}, "owner": 1, "id": "HrfdSpm5BR" }], "playerActiveMagi": [{ "card": "Poad", "data": { "energy": 4, "controller": 2, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 2, "id": "powoI2Dc6T" }], "opponentActiveMagi": [{ "card": "Whall", "data": { "energy": 5, "controller": 1, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 1, "id": "_lVnW5s64Y" }], "playerMagiPile": [{ "card": "Tryn", "data": { "energy": 0, "controller": 2, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 2, "id": "iga6sPcH6Z" }, { "card": "Yaki", "data": { "energy": 0, "controller": 2, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 2, "id": "Dmf5ZDk7wK" }], "opponentMagiPile": [{ "card": null, "data": {}, "owner": 1, "id": "SBhKqfHXEM" }, { "card": null, "data": {}, "owner": 1, "id": "dmtG1t5agR" }], "inPlay": [{ "card": "Water of Life", "data": { "energy": 0, "controller": 1, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 1, "id": "hhdOXfvOW3" }, { "card": "Arboll", "data": { "energy": 1, "controller": 2, "attacked": 1, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": true, "wasAttacked": false }, "owner": 2, "id": "kOxqMrBVgO" }, { "card": "Robe of Vines", "data": { "energy": 0, "controller": 2, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 2, "id": "ELMvnJhhnl" }, { "card": "Water of Life", "data": { "energy": 0, "controller": 2, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 2, "id": "0d-tRCWV_F" }, { "card": "Timber Hyren", "data": { "energy": 3, "controller": 2, "attacked": 1, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": true, "wasAttacked": false }, "owner": 2, "id": "66AakNhpdx" }, { "card": "Ancestral Flute", "data": { "energy": 0, "controller": 2, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 2, "id": "B3bFxmxuo-" }, { "card": "Weebo", "data": { "energy": 3, "controller": 2, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 2, "id": "OoBzGum410" }], "playerDefeatedMagi": [], "opponentDefeatedMagi": [], "playerDiscard": [{ "card": "Carillion", "data": { "energy": 0, "controller": 2, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 2, "id": "HFkV-eVEY6" }, { "card": "Plith", "data": { "energy": 0, "controller": 2, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 2, "id": "Nl_GLch97H" }, { "card": "Twee", "data": { "energy": 0, "controller": 2, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 2, "id": "Pl56rkr9Ld" }], "opponentDiscard": [{ "card": "Sea Barl", "data": { "energy": 0, "controller": 1, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 1, "id": "sX0fYh7N0D" }, { "card": "Weebo", "data": { "energy": 0, "controller": 1, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 1, "id": "814Ykrnj2E" }, { "card": "Sphor", "data": { "energy": 0, "controller": 1, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 1, "id": "UQez8n4xju" }, { "card": "Sphor", "data": { "energy": 0, "controller": 1, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 1, "id": "DPfw1CJr_Z" }, { "card": "Undertow", "data": { "energy": 0, "controller": 1, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 1, "id": "FxGVXu02uc" }, { "card": "Dream Balm", "data": { "energy": 0, "controller": 1, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 1, "id": "9AbawVybFk" }, { "card": "Warrior's Boots", "data": { "energy": 0, "controller": 1, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 1, "id": "7y1_ujHRgC" }, { "card": "Wellisk Pup", "data": { "energy": 0, "controller": 1, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 1, "id": "lTexlr6FJ7" }, { "card": "Sphor", "data": { "energy": 0, "controller": 1, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 1, "id": "m_zEZxMY3t" }] }, "continuousEffects": [], "step": 4, "turn": 1, "goesFirst": 1, "activePlayer": 2, "prompt": false, "promptType": null, "promptMessage": null, "promptPlayer": null, "promptGeneratedBy": null, "promptParams": {}, "opponentId": 1, "log": [], "gameEnded": false, "winner": null, "cardsAttached": {} }

        const state = new GameState(stateObj as unknown as SerializedClientState);
        state.setPlayerId(2)
        state.setTurn(8)

        const strategy = new SimulationStrategy()
        strategy.setup(state, 2);

        const action = strategy.requestAction()
        console.log(strategy.getGraph())
        console.dir(action)

        console.dir(strategy.getHeldActions())
    })

    it('Strange pass action', () => {
        const stateObj = {
            "staticAbilities": [
                { "card": "Water of Life", "data": { "energy": 0, "controller": 1, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 1, "id": "hhdOXfvOW3" }, { "card": "Water of Life", "data": { "energy": 0, "controller": 2, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 2, "id": "0d-tRCWV_F" }], "energyPrompt": false, "turnTimer": false, "turnSecondsLeft": 0, "promptAvailableCards": [], "zones": { "playerHand": [{ "card": "Bhatar", "data": { "energy": 0, "controller": 2, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 2, "id": "Cw0V_H1zTE" }], "opponentHand": [{ "card": null, "data": {}, "owner": 1, "id": "pO4pE9g2gm" }, { "card": null, "data": {}, "owner": 1, "id": "uQEsqhvCwX" }, { "card": null, "data": {}, "owner": 1, "id": "q2TGYPNiSO" }], "playerDeck": [{ "card": null, "data": {}, "owner": 2, "id": "sIiFIaDkbC" }, { "card": null, "data": {}, "owner": 2, "id": "ViWm_wQ8No" }, { "card": null, "data": {}, "owner": 2, "id": "VlmEazsSzg" }, { "card": null, "data": {}, "owner": 2, "id": "q6SEeuxK7d" }, { "card": null, "data": {}, "owner": 2, "id": "z5RhjMB9rG" }, { "card": null, "data": {}, "owner": 2, "id": "99tfbgUuqv" }, { "card": null, "data": {}, "owner": 2, "id": "fPb-UsrKNr" }, { "card": null, "data": {}, "owner": 2, "id": "ajnz85jz7Z" }, { "card": null, "data": {}, "owner": 2, "id": "mn7Xd_CIAw" }, { "card": null, "data": {}, "owner": 2, "id": "3RRV85itAq" }, { "card": null, "data": {}, "owner": 2, "id": "guU0NdzOhm" }, { "card": null, "data": {}, "owner": 2, "id": "SUhxxyvcUz" }, { "card": null, "data": {}, "owner": 2, "id": "4upjb1HYJg" }, { "card": null, "data": {}, "owner": 2, "id": "H6jTIQNv1L" }, { "card": null, "data": {}, "owner": 2, "id": "TJSFtCwymp" }, { "card": null, "data": {}, "owner": 2, "id": "ZMclkPHLj0" }, { "card": null, "data": {}, "owner": 2, "id": "ASC4eaLND9" }, { "card": null, "data": {}, "owner": 2, "id": "ophyAIsu53" }, { "card": null, "data": {}, "owner": 2, "id": "R5hVdRHOct" }, { "card": null, "data": {}, "owner": 2, "id": "KCb0qtN-AS" }, { "card": null, "data": {}, "owner": 2, "id": "vZ1G4aRFkn" }, { "card": null, "data": {}, "owner": 2, "id": "T7FCjf19VB" }, { "card": null, "data": {}, "owner": 2, "id": "RDlOBfGUAy" }, { "card": null, "data": {}, "owner": 2, "id": "JUHnGL-RMP" }, { "card": null, "data": {}, "owner": 2, "id": "tm3fMvRvnO" }, { "card": null, "data": {}, "owner": 2, "id": "rT97z9N9j5" }, { "card": null, "data": {}, "owner": 2, "id": "DO4XdIO6Ow" }, { "card": "Giant Carillion", "data": { "energy": 0, "controller": 2, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 2, "id": "Oh5sTBeJkG" }], "opponentDeck": [{ "card": null, "data": {}, "owner": 1, "id": "AzmKjuTPA0" }, { "card": null, "data": {}, "owner": 1, "id": "1nLjW2EM0c" }, { "card": null, "data": {}, "owner": 1, "id": "4gHIe01IyC" }, { "card": null, "data": {}, "owner": 1, "id": "BSxn4jhzWl" }, { "card": null, "data": {}, "owner": 1, "id": "4LbPKODcIQ" }, { "card": null, "data": {}, "owner": 1, "id": "4srxLH80rb" }, { "card": null, "data": {}, "owner": 1, "id": "WlEr6yLP4a" }, { "card": null, "data": {}, "owner": 1, "id": "HoQSeAHe9k" }, { "card": null, "data": {}, "owner": 1, "id": "3c6axDQJoG" }, { "card": null, "data": {}, "owner": 1, "id": "JZ_gNc9GS4" }, { "card": null, "data": {}, "owner": 1, "id": "B5VowFvpO_" }, { "card": null, "data": {}, "owner": 1, "id": "4rKwyiW-5k" }, { "card": null, "data": {}, "owner": 1, "id": "De0-v69-YQ" }, { "card": null, "data": {}, "owner": 1, "id": "JesRYGsET-" }, { "card": null, "data": {}, "owner": 1, "id": "KYaLVBAArM" }, { "card": null, "data": {}, "owner": 1, "id": "fn92B9dLtR" }, { "card": null, "data": {}, "owner": 1, "id": "DxbaVyS4dE" }, { "card": null, "data": {}, "owner": 1, "id": "N0BR41_2cs" }, { "card": null, "data": {}, "owner": 1, "id": "FiNcmkCTJG" }, { "card": null, "data": {}, "owner": 1, "id": "6Txw0p_-Yn" }, { "card": null, "data": {}, "owner": 1, "id": "aHyMx3i0ut" }, { "card": null, "data": {}, "owner": 1, "id": "gFPuUjaGUd" }, { "card": null, "data": {}, "owner": 1, "id": "EpWls7a2rc" }, { "card": null, "data": {}, "owner": 1, "id": "5wrzLDetHj" }, { "card": null, "data": {}, "owner": 1, "id": "RJ-C__X6IW" }, { "card": null, "data": {}, "owner": 1, "id": "PLgRcrN1F2" }, { "card": null, "data": {}, "owner": 1, "id": "HrfdSpm5BR" }], "playerActiveMagi": [{ "card": "Poad", "data": { "energy": 0, "controller": 2, "attacked": 0, "actionsUsed": ["Heroes' Feast"], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 2, "id": "powoI2Dc6T" }], "opponentActiveMagi": [{ "card": "Whall", "data": { "energy": 5, "controller": 1, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 1, "id": "_lVnW5s64Y" }], "playerMagiPile": [{ "card": "Tryn", "data": { "energy": 0, "controller": 2, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 2, "id": "iga6sPcH6Z" }, { "card": "Yaki", "data": { "energy": 0, "controller": 2, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 2, "id": "Dmf5ZDk7wK" }], "opponentMagiPile": [{ "card": null, "data": {}, "owner": 1, "id": "SBhKqfHXEM" }, { "card": null, "data": {}, "owner": 1, "id": "dmtG1t5agR" }], "inPlay": [{ "card": "Water of Life", "data": { "energy": 0, "controller": 1, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 1, "id": "hhdOXfvOW3" }, { "card": "Robe of Vines", "data": { "energy": 0, "controller": 2, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 2, "id": "ELMvnJhhnl" }, { "card": "Water of Life", "data": { "energy": 0, "controller": 2, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 2, "id": "0d-tRCWV_F" }, { "card": "Timber Hyren", "data": { "energy": 4, "controller": 2, "attacked": 1, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": true, "wasAttacked": false }, "owner": 2, "id": "66AakNhpdx" }, { "card": "Ancestral Flute", "data": { "energy": 0, "controller": 2, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 2, "id": "B3bFxmxuo-" }, { "card": "Weebo", "data": { "energy": 10, "controller": 2, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 2, "id": "OoBzGum410" }], "playerDefeatedMagi": [], "opponentDefeatedMagi": [], "playerDiscard": [{ "card": "Carillion", "data": { "energy": 0, "controller": 2, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 2, "id": "HFkV-eVEY6" }, { "card": "Plith", "data": { "energy": 0, "controller": 2, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 2, "id": "Nl_GLch97H" }, { "card": "Twee", "data": { "energy": 0, "controller": 2, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 2, "id": "Pl56rkr9Ld" }, { "card": "Grow", "data": { "energy": 0, "controller": 2, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 2, "id": "7Q7C3ltwDC" }, { "card": "Arboll", "data": { "energy": 0, "controller": 2, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 2, "id": "V5h-ATisrC" }, { "card": "Grow", "data": { "energy": 0, "controller": 2, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 2, "id": "f21Ezz_ru9" }], "opponentDiscard": [{ "card": "Sea Barl", "data": { "energy": 0, "controller": 1, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 1, "id": "sX0fYh7N0D" }, { "card": "Weebo", "data": { "energy": 0, "controller": 1, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 1, "id": "814Ykrnj2E" }, { "card": "Sphor", "data": { "energy": 0, "controller": 1, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 1, "id": "UQez8n4xju" }, { "card": "Sphor", "data": { "energy": 0, "controller": 1, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 1, "id": "DPfw1CJr_Z" }, { "card": "Undertow", "data": { "energy": 0, "controller": 1, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 1, "id": "FxGVXu02uc" }, { "card": "Dream Balm", "data": { "energy": 0, "controller": 1, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 1, "id": "9AbawVybFk" }, { "card": "Warrior's Boots", "data": { "energy": 0, "controller": 1, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 1, "id": "7y1_ujHRgC" }, { "card": "Wellisk Pup", "data": { "energy": 0, "controller": 1, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 1, "id": "lTexlr6FJ7" }, { "card": "Sphor", "data": { "energy": 0, "controller": 1, "attacked": 0, "actionsUsed": [], "energyLostThisTurn": 0, "defeatedCreature": false, "hasAttacked": false, "wasAttacked": false }, "owner": 1, "id": "m_zEZxMY3t" }] },
            "continuousEffects": [],
            "step": 4,
            "turn": 1,
            "goesFirst": 1,
            "activePlayer": 2,
            "prompt": true,
            "promptType": "prompt/creature",
            "promptMessage": "Choose a creature to add 6 energy to",
            "promptPlayer": 2,
            "promptGeneratedBy": "CQ8V4VqpEi",
            "promptParams": {},
            "opponentId": 1,
            "log": [],
            "gameEnded": false,
            "winner": null,
            "cardsAttached": {}
        }

        const state = new GameState(stateObj as unknown as SerializedClientState);
        state.setPlayerId(2)

        const strategy = new SimulationStrategy()
        strategy.setup(state, 2);

        const action = strategy.requestAction()
        console.log(strategy.getGraph())
        console.dir(action)

        console.dir(strategy.getHeldActions())
    })

    it('Corf action', () => {
        const stateObj = {
            "staticAbilities": [
                {
                    "card": "Water of Life",
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
                    "id": "SegbrAVVoh"
                },
                {
                    "card": "Orlon",
                    "data": {
                        "energy": 0,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 0,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    },
                    "owner": 1,
                    "id": "54brb5ESKK"
                }
            ],
            "energyPrompt": false,
            "turnTimer": false,
            "turnSecondsLeft": 0,
            "promptAvailableCards": [],
            "zones": {
                "playerHand": [
                    {
                        "card": "Submerge",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "D1sPqxyCtC"
                    },
                    {
                        "card": "Submerge",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "qS6LGHWg7X"
                    },
                    {
                        "card": "Dream Balm",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "S9UsuBlls8"
                    }
                ],
                "opponentHand": [
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "lvt1kt6xaG"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "bs1ILgGW6l"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "rmbJ7hUBHT"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "WwdisChH0s"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "yekOSYJero"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "wcuQ6B8mdg"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "YFLBoholwT"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "7393aGy2Cc"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "c4thRwJMkk"
                    }
                ],
                "playerDeck": [
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "4FL-fxeAHY"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "hvN3eq4vjj"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "Zo4vCQHkZV"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "ynHYaKgLHB"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "CA6KOyowrC"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "i7x7hAJXto"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "PxD6I1n-Vb"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "OxKGdXNOYx"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "qBav4OKIxf"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "KwQROG0LUr"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "cowXGyepwC"
                    }
                ],
                "opponentDeck": [
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "9OV8qQ0JVG"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "7yaI09saqI"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "Rub3SFOzM-"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "chYrkUHyPB"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "P7wlwecNPL"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "l63c5Rqucd"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "rFKsExMqP_"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "9Yh4M68L8j"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "O0XheQy-mx"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "yzlBkolBMD"
                    }
                ],
                "playerActiveMagi": [
                    {
                        "card": "Orlon",
                        "data": {
                            "energy": 2,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "54brb5ESKK"
                    }
                ],
                "opponentActiveMagi": [
                    {
                        "card": "Poad",
                        "data": {
                            "energy": 3,
                            "controller": 2,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 2,
                        "id": "K6i7CyJpi5"
                    }
                ],
                "playerMagiPile": [
                    {
                        "card": "Ebylon",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "J_5RqD_9Dd"
                    }
                ],
                "opponentMagiPile": [
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "aL-rf3uYXn"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "1qZwbH-pUS"
                    }
                ],
                "inPlay": [
                    {
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
                        },
                        "owner": 2,
                        "id": "MIg3P1TytV"
                    },
                    {
                        "card": "Timber Hyren",
                        "data": {
                            "energy": 1,
                            "controller": 2,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 2,
                        "id": "qVaRVacBMy"
                    },
                    {
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
                        },
                        "owner": 2,
                        "id": "NjbdbJLHDG"
                    },
                    {
                        "card": "Water of Life",
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
                        "id": "SegbrAVVoh"
                    },
                    {
                        "card": "Dream Balm",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "DNAUZJDaRm"
                    },
                    {
                        "card": "Leaf Hyren",
                        "data": {
                            "energy": 2,
                            "controller": 2,
                            "attacked": 1,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": true,
                            "wasAttacked": false
                        },
                        "owner": 2,
                        "id": "tzHIziI0DA"
                    },
                    {
                        "card": "Bhatar",
                        "data": {
                            "energy": 5,
                            "controller": 2,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 2,
                        "id": "LSEjqoukNV"
                    },
                    {
                        "card": "Giant Parathin",
                        "data": {
                            "energy": 10,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "hBaeoOb5kB"
                    },
                    {
                        "card": "Corf",
                        "data": {
                            "energy": 3,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "cOKWZRuBJb"
                    }
                ],
                "playerDefeatedMagi": [
                    {
                        "card": "Whall",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "7sY49r8qE8"
                    }
                ],
                "opponentDefeatedMagi": [],
                "playerDiscard": [
                    {
                        "card": "Submerge",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "VJFZnYFuDV"
                    },
                    {
                        "card": "Sphor",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "yw9-XqIBqg"
                    },
                    {
                        "card": "Weebo",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "TmgjPluPcz"
                    },
                    {
                        "card": "Bwill",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "n6FIqJffEr"
                    },
                    {
                        "card": "Sea Barl",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "HLaIF6p8oC"
                    },
                    {
                        "card": "Sphor",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "Ga0x4g8QI_"
                    },
                    {
                        "card": "Sea Barl",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "1cjh8jun6u"
                    },
                    {
                        "card": "Wellisk Pup",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "dnAkXNqNU5"
                    },
                    {
                        "card": "Orathan",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "K0pEyZC6FX"
                    },
                    {
                        "card": "Bwill",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "bR9QsDi0h-"
                    },
                    {
                        "card": "Sea Barl",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "WusnwH6yel"
                    },
                    {
                        "card": "Sphor",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "dMIzcWvHo1"
                    },
                    {
                        "card": "Orathan",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "jMwIYG_wS6"
                    },
                    {
                        "card": "Sea Barl",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "KpNP8KANpK"
                    },
                    {
                        "card": "Dream Balm",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "4U50_4mrWb"
                    },
                    {
                        "card": "Ancestral Flute",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "QLWgp8Kdno"
                    },
                    {
                        "card": "Water of Life",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "oqbRMmGvrD"
                    },
                    {
                        "card": "Undertow",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "3qSL_1GaNl"
                    },
                    {
                        "card": "Corf",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "YH4xJC6HOJ"
                    },
                    {
                        "card": "Sea Barl",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "za8nlEq-mH"
                    },
                    {
                        "card": "Wellisk Pup",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "UmJtWryeQl"
                    },
                    {
                        "card": "Wellisk Pup",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "csYLIeoaKB"
                    },
                    {
                        "card": "Paralit",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "mNU3usnGNr"
                    },
                    {
                        "card": "Wellisk Pup",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "tDfkIz5bAv"
                    }
                ],
                "opponentDiscard": [
                    {
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
                        },
                        "owner": 2,
                        "id": "ux1NZR3dEP"
                    },
                    {
                        "card": "Weebo",
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
                        "id": "3gfhY2BEXI"
                    },
                    {
                        "card": "Rudwot",
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
                        "id": "DHKNXfBgkf"
                    },
                    {
                        "card": "Plith",
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
                        "id": "YTwOXKwEAx"
                    },
                    {
                        "card": "Twee",
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
                        "id": "7qczqz-2JS"
                    },
                    {
                        "card": "Grow",
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
                        "id": "0aUyl0Ov0P"
                    },
                    {
                        "card": "Carillion",
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
                        "id": "m3KgMOqEzg"
                    },
                    {
                        "card": "Carillion",
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
                        "id": "iSK1NRtSgB"
                    },
                    {
                        "card": "Plith",
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
                        "id": "EmkYLM9wid"
                    },
                    {
                        "card": "Balamant Pup",
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
                        "id": "bmxxijzawZ"
                    },
                    {
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
                        },
                        "owner": 2,
                        "id": "tClthmtkDM"
                    },
                    {
                        "card": "Grow",
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
                        "id": "M7Ei-jsvuV"
                    },
                    {
                        "card": "Grow",
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
                        "id": "R2ZHBQ_GPO"
                    },
                    {
                        "card": "Rudwot",
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
                        "id": "4fPLsPY3Tm"
                    },
                    {
                        "card": "Carillion",
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
                        "id": "JX6Bmj0uzQ"
                    }
                ]
            },
            "continuousEffects": [],
            "step": 4,
            "turn": 1,
            "goesFirst": 1,
            "activePlayer": 1,
            "prompt": false,
            "promptType": null,
            "promptMessage": "Choose a Creature to discard and shuffle into deck",
            "promptPlayer": null,
            "promptGeneratedBy": null,
            "promptParams": {},
            "opponentId": 2,
            "log": [],
            "gameEnded": false,
            "winner": null,
            "cardsAttached": {}
        }

        const state = new GameState(stateObj as unknown as SerializedClientState);
        state.setPlayerId(1)

        const strategy = new SimulationStrategy()
        strategy.setup(state, 1);

        const action = strategy.requestAction()
        console.log(strategy.getGraph())
        console.dir(action)

        console.dir(strategy.getHeldActions())
    })

    it('Strange prompt entering', () => {
        const stateObj = {
            "staticAbilities": [
                {
                    "card": "Water of Life",
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
                    "id": "SegbrAVVoh"
                },
                {
                    "card": "Orlon",
                    "data": {
                        "energy": 0,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 0,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    },
                    "owner": 1,
                    "id": "54brb5ESKK"
                }
            ],
            "energyPrompt": false,
            "turnTimer": false,
            "turnSecondsLeft": 0,
            "promptAvailableCards": [],
            "zones": {
                "playerHand": [
                    {
                        "card": "Submerge",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "D1sPqxyCtC"
                    },
                    {
                        "card": "Submerge",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "qS6LGHWg7X"
                    },
                    {
                        "card": "Dream Balm",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "S9UsuBlls8"
                    }
                ],
                "opponentHand": [
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "lvt1kt6xaG"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "bs1ILgGW6l"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "rmbJ7hUBHT"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "WwdisChH0s"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "yekOSYJero"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "wcuQ6B8mdg"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "YFLBoholwT"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "7393aGy2Cc"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "c4thRwJMkk"
                    }
                ],
                "playerDeck": [
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "4FL-fxeAHY"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "hvN3eq4vjj"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "Zo4vCQHkZV"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "ynHYaKgLHB"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "CA6KOyowrC"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "i7x7hAJXto"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "PxD6I1n-Vb"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "OxKGdXNOYx"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "qBav4OKIxf"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "KwQROG0LUr"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "cowXGyepwC"
                    }
                ],
                "opponentDeck": [
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "9OV8qQ0JVG"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "7yaI09saqI"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "Rub3SFOzM-"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "chYrkUHyPB"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "P7wlwecNPL"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "l63c5Rqucd"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "rFKsExMqP_"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "9Yh4M68L8j"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "O0XheQy-mx"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "yzlBkolBMD"
                    }
                ],
                "playerActiveMagi": [
                    {
                        "card": "Orlon",
                        "data": {
                            "energy": 2,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "54brb5ESKK"
                    }
                ],
                "opponentActiveMagi": [
                    {
                        "card": "Poad",
                        "data": {
                            "energy": 3,
                            "controller": 2,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 2,
                        "id": "K6i7CyJpi5"
                    }
                ],
                "playerMagiPile": [
                    {
                        "card": "Ebylon",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "J_5RqD_9Dd"
                    }
                ],
                "opponentMagiPile": [
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "aL-rf3uYXn"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "1qZwbH-pUS"
                    }
                ],
                "inPlay": [
                    {
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
                        },
                        "owner": 2,
                        "id": "MIg3P1TytV"
                    },
                    {
                        "card": "Timber Hyren",
                        "data": {
                            "energy": 1,
                            "controller": 2,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 2,
                        "id": "qVaRVacBMy"
                    },
                    {
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
                        },
                        "owner": 2,
                        "id": "NjbdbJLHDG"
                    },
                    {
                        "card": "Water of Life",
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
                        "id": "SegbrAVVoh"
                    },
                    {
                        "card": "Dream Balm",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "DNAUZJDaRm"
                    },
                    {
                        "card": "Leaf Hyren",
                        "data": {
                            "energy": 2,
                            "controller": 2,
                            "attacked": 1,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": true,
                            "wasAttacked": false
                        },
                        "owner": 2,
                        "id": "tzHIziI0DA"
                    },
                    {
                        "card": "Bhatar",
                        "data": {
                            "energy": 5,
                            "controller": 2,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 2,
                        "id": "LSEjqoukNV"
                    },
                    {
                        "card": "Giant Parathin",
                        "data": {
                            "energy": 10,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "hBaeoOb5kB"
                    }
                ],
                "playerDefeatedMagi": [
                    {
                        "card": "Whall",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "7sY49r8qE8"
                    }
                ],
                "opponentDefeatedMagi": [],
                "playerDiscard": [
                    {
                        "card": "Submerge",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "VJFZnYFuDV"
                    },
                    {
                        "card": "Sphor",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "yw9-XqIBqg"
                    },
                    {
                        "card": "Weebo",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "TmgjPluPcz"
                    },
                    {
                        "card": "Bwill",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "n6FIqJffEr"
                    },
                    {
                        "card": "Sea Barl",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "HLaIF6p8oC"
                    },
                    {
                        "card": "Sphor",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "Ga0x4g8QI_"
                    },
                    {
                        "card": "Sea Barl",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "1cjh8jun6u"
                    },
                    {
                        "card": "Wellisk Pup",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "dnAkXNqNU5"
                    },
                    {
                        "card": "Orathan",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "K0pEyZC6FX"
                    },
                    {
                        "card": "Bwill",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "bR9QsDi0h-"
                    },
                    {
                        "card": "Sea Barl",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "WusnwH6yel"
                    },
                    {
                        "card": "Sphor",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "dMIzcWvHo1"
                    },
                    {
                        "card": "Orathan",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "jMwIYG_wS6"
                    },
                    {
                        "card": "Sea Barl",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "KpNP8KANpK"
                    },
                    {
                        "card": "Dream Balm",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "4U50_4mrWb"
                    },
                    {
                        "card": "Ancestral Flute",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "QLWgp8Kdno"
                    },
                    {
                        "card": "Water of Life",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "oqbRMmGvrD"
                    },
                    {
                        "card": "Undertow",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "3qSL_1GaNl"
                    },
                    {
                        "card": "Corf",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "YH4xJC6HOJ"
                    },
                    {
                        "card": "Sea Barl",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "za8nlEq-mH"
                    },
                    {
                        "card": "Wellisk Pup",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "UmJtWryeQl"
                    },
                    {
                        "card": "Wellisk Pup",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "csYLIeoaKB"
                    },
                    {
                        "card": "Paralit",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "mNU3usnGNr"
                    },
                    {
                        "card": "Wellisk Pup",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "tDfkIz5bAv"
                    },
                    {
                        "card": "Corf",
                        "data": {
                            "energy": 0,
                            "controller": 1,
                            "attacked": 0,
                            "actionsUsed": [],
                            "energyLostThisTurn": 0,
                            "defeatedCreature": false,
                            "hasAttacked": false,
                            "wasAttacked": false
                        },
                        "owner": 1,
                        "id": "Ws1E6VVsTg"
                    }
                ],
                "opponentDiscard": [
                    {
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
                        },
                        "owner": 2,
                        "id": "ux1NZR3dEP"
                    },
                    {
                        "card": "Weebo",
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
                        "id": "3gfhY2BEXI"
                    },
                    {
                        "card": "Rudwot",
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
                        "id": "DHKNXfBgkf"
                    },
                    {
                        "card": "Plith",
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
                        "id": "YTwOXKwEAx"
                    },
                    {
                        "card": "Twee",
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
                        "id": "7qczqz-2JS"
                    },
                    {
                        "card": "Grow",
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
                        "id": "0aUyl0Ov0P"
                    },
                    {
                        "card": "Carillion",
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
                        "id": "m3KgMOqEzg"
                    },
                    {
                        "card": "Carillion",
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
                        "id": "iSK1NRtSgB"
                    },
                    {
                        "card": "Plith",
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
                        "id": "EmkYLM9wid"
                    },
                    {
                        "card": "Balamant Pup",
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
                        "id": "bmxxijzawZ"
                    },
                    {
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
                        },
                        "owner": 2,
                        "id": "tClthmtkDM"
                    },
                    {
                        "card": "Grow",
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
                        "id": "M7Ei-jsvuV"
                    },
                    {
                        "card": "Grow",
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
                        "id": "R2ZHBQ_GPO"
                    },
                    {
                        "card": "Rudwot",
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
                        "id": "4fPLsPY3Tm"
                    },
                    {
                        "card": "Carillion",
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
                        "id": "JX6Bmj0uzQ"
                    }
                ]
            },
            "continuousEffects": [],
            "step": 4,
            "turn": 1,
            "goesFirst": 1,
            "activePlayer": 1,
            "prompt": true,
            "promptType": "prompt/creature_filtered",
            "promptMessage": null,
            "promptPlayer": 1,
            "promptParams": {
                "restrictions": [
                    {
                        "type": "restrictions/creature_was_attacked"
                    }
                ]
            },
            "opponentId": 2,
            "log": [],
            "gameEnded": false,
            "winner": null,
            "cardsAttached": {}
        }

        const state = new GameState(stateObj as unknown as SerializedClientState);
        state.setPlayerId(1)

        const strategy = new SimulationStrategy()
        strategy.setup(state, 1);

        debugger;
        const action = strategy.requestAction()
        console.dir(action)

        console.dir(strategy.getHeldActions())
    })
})