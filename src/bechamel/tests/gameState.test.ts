import { ACTION_EFFECT, EFFECT_TYPE_START_OF_TURN } from 'moonlands';
import { GameState } from '../GameState'
import { SerializedClientState } from '../types';

describe('GameState tests', () => {
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


    it.only('Strange prompt entering', () => {
        const stateObj = {
            "zones": {
                "playerHand": [],
                "opponentHand": [],
                "playerDeck": [
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "jhNcCzcc1Oh8BEiwMDouw"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "V7DobR5vHAFAaxcVB0Wgs"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "46UGIBiPHfehssLRAUAMT"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "J90JxJsphN0KQnZcX4I9y"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "fsyf9UMx4oPhpXNgNIvWU"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "8sx19c64UQt0yycF1Vw2I"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "qxvKUQEPSXufpTa6-1zVH"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "Ad8M6ZNd9tVbE0VpzhiJn"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "4c_JbzFq0M9tZF7AweauR"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "4ad5Bp3_4QEAcem-II1V2"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "8LeY3WRnCTSSg_IGd-6db"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "MP1Tdpk0jvx5mn8gpOmfh"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "6mLx2ZX9iGtrCDLb6geL8"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "8SqmuRZjj7-nCyp8g9m0N"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "DCowAMGV0ERP4mLkyfZwa"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "vU13ornVRFelfPQRcPaQi"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "z8-96fu_liVec7JvnK23b"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "p6lWHGxfv74wTlkv8l4cU"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "YFqlnjFMWqznAAMauXIi-"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "XoipC8IrtW3Uug9kBkLve"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "aWqn_V2LE8Knw7jFmEXE9"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "BfjL18VjpSpkPEgMLABki"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "fKy8UXOqy_pPf2jutWQJz"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "AI3QbHvB3Lx_wKvmSnaEc"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "dgnMYztTd8jGuYPO7KQtD"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "EymWHgHM_pat5KeGkNyO5"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "VoYTUKOLTM1Mggl-lqIcG"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "k8S6jsreLQen2UJ0ccdEj"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "swiU15-8CSrtwlM6IfJ1i"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "fJwAxqsf2FD3cNvWP14Qs"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "DJhB4rYHQFbtI4epwadFi"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "cPXyFlJeiBO3gXXvlJFRT"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "TnJTRjZecG4fwXWu7BMPf"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "pxcDMshcNTruutv9UILZJ"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "7FMz-BTktRO-g2vzqZ_xO"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "wTdbHqpKs-1I50aaDn797"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "GD-vu91WQcbmWfxqKY5w0"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "dx0S3A-DpUjG-PHHJjb62"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "4lBwWwHvxJKfUxD8z3_AO"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 1,
                        "id": "QrdOWPOV3t_r8OYsu5-j_"
                    }
                ],
                "opponentDeck": [
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "5axG1U2LeBMC4SH_qMQon"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "gqpe_38QNI7vYZ7XLybow"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "qHOiscGidPWPy2ui05YvZ"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "QkrJgnuWt-VTVTgZjd_d8"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "686TJx_vqHgXPXV72_DS6"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "qtk7TEP6IKp6V1xBpg2Ue"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "oRchJGUxnSwS5WGnybhDN"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "yfNeOhyp2FAUrC-OqbpQc"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "fBkx6AmH1PfelZRPZFurN"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "kCTZt864VDU5eTGYfq1jJ"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "8pSjd5Q24BEd07IyTQrwd"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "kKJ3GEb84YcNucgA2dwd1"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "6-2q8l6MOVwhMQcop4u8Y"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "eskBPJ4c7M4i5y01aruzC"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "kGKNe-4Vq6dNy7dSD5s79"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "qYus82czbOMzYhKDkSO6A"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "hZc0quVPEWqD5GlDg6YO1"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "1ul33aKpWCCqrCWUW5-uW"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "CTsaimbMbDrYQncML_pTN"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "T-dDMr3POe7480Pf7qPJs"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "6_I5lBwYa6VlDSfPQQ7bC"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "c93AoZY2tKUb9LUqXHI3N"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "73s5_maDTiQR_l5tM_viy"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "C56TtaiFQQjPKhFAYGARN"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "DQD6u0Oam9A9A62aiESFU"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "kRiEPgLWwl0HdXmx04ldQ"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "UmboPvLzxi0r5g1oqwsqO"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "XkqvKEbQwscsvKgLAU0zT"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "iEW2SaBC1TFcTJXB9oTuS"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "SbEtevvW7JpAhsLCAYwVM"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "UwRcfNQODscm2v329IJgq"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "BOHPX_AtAEBGNj5e7VS1D"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "0VYF8lNam_SG4oz1gatAQ"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "CU5AvZlodEHB-FSUP1_X1"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "TN7zbGe6-G-pe48wi3JMN"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "g-ZC9xeWtxr6gSVqd_ulN"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "Bn8pO_2tCBnmo0gbM5gp4"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "klnf2PBU2Qs2IWMOGYs1d"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "dYiD9xqpFf2HzAlU-Cskh"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "4AvJ1y6pnyglb9c5Bu_89"
                    }
                ],
                "playerActiveMagi": [],
                "opponentActiveMagi": [],
                "playerMagiPile": [
                    {
                        "card": "Nimbulo",
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
                        "id": "Nv8ZRPBwNqzAxu1Aw14Da"
                    },
                    {
                        "card": "Ora",
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
                        "id": "MZD4bW-sJ4dwauvrVjUmy"
                    },
                    {
                        "card": "Stradus",
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
                        "id": "554CUX4SCV7bWAJSo2fxp"
                    }
                ],
                "opponentMagiPile": [
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "cO0coJDyrfEPJIEBo_UU7"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "lxyfCDVBWUOk9-0o6b8ss"
                    },
                    {
                        "card": null,
                        "data": {},
                        "owner": 2,
                        "id": "D2eAes7lAZOdkxkGHNDyG"
                    }
                ],
                "inPlay": [],
                "playerDefeatedMagi": [],
                "opponentDefeatedMagi": [],
                "playerDiscard": [],
                "opponentDiscard": []
            },
            "continuousEffects": [],
            "step": null,
            "turn": 1,
            "goesFirst": 2,
            "activePlayer": 2,
            "prompt": false,
            "promptType": null,
            "promptParams": {},
            "opponentId": 2,
            "log": [],
            "gameEnded": false,
            "winner": null,
            "cardsAttached": {}
        }

        const state = new GameState(stateObj as unknown as SerializedClientState);

        const log = [
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 0
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_of_turn",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "cO0coJDyrfEPJIEBo_UU7",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/magi_pile",
                "destinationCard": {
                    "id": "xgavpDsS5iWshBSLA09pe",
                    "owner": 2,
                    "card": "Poad",
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
                "destinationZone": "zones/active_magi",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "jsZ-heAJbvQJSZaNB618S"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_magi",
                "source": {
                    "id": "xgavpDsS5iWshBSLA09pe"
                },
                "target": {
                    "id": "xgavpDsS5iWshBSLA09pe"
                },
                "amount": 13
            },
            {
                "type": "actions/enter_prompt",
                "promptType": "prompt/choose_cards",
                "promptParams": {
                    "availableCards": [
                        "Leaf Hyren",
                        "Balamant Pup",
                        "Vortex of Knowledge"
                    ],
                    "startingCards": [
                        "Leaf Hyren",
                        "Balamant Pup",
                        "Vortex of Knowledge"
                    ]
                },
                "generatedBy": "jsZ-heAJbvQJSZaNB618S",
                "player": 2
            },
            {
                "type": "actions/resolve_prompt",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "fBkx6AmH1PfelZRPZFurN",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "IEeD18AX-0_n0doXjOA6E",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "jsZ-heAJbvQJSZaNB618S"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "kCTZt864VDU5eTGYfq1jJ",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "7OYgTkoc7LjviK5XB67py",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "jsZ-heAJbvQJSZaNB618S"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "qtk7TEP6IKp6V1xBpg2Ue",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "w6phrA6DMmzu-CEzGanvK",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "jsZ-heAJbvQJSZaNB618S"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "5axG1U2LeBMC4SH_qMQon",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "ytD2T1zD53sO6qD6LIiqB",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "jsZ-heAJbvQJSZaNB618S"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "gqpe_38QNI7vYZ7XLybow",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "cPOLhZnuCHOcKHKYIAZlH",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "jsZ-heAJbvQJSZaNB618S"
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 3
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/play",
                "player": 2,
                "payload": {
                    "card": {
                        "id": "cPOLhZnuCHOcKHKYIAZlH",
                        "owner": 2,
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
                        }
                    },
                    "player": 2
                },
                "forcePriority": false
            },
            {
                "type": "actions/effect",
                "effectType": "effects/paying_energy_for_creature",
                "from": {
                    "id": "xgavpDsS5iWshBSLA09pe"
                },
                "amount": 3,
                "player": 2,
                "generatedBy": "cPOLhZnuCHOcKHKYIAZlH"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/remove_energy_from_magi",
                "target": {
                    "id": "xgavpDsS5iWshBSLA09pe",
                    "owner": 2,
                    "card": "Poad",
                    "data": {
                        "energy": 13,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 0,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 3,
                "generatedBy": "cPOLhZnuCHOcKHKYIAZlH",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/play_creature",
                "card": {
                    "id": "cPOLhZnuCHOcKHKYIAZlH",
                    "owner": 2,
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
                    }
                },
                "player": 2,
                "generatedBy": "cPOLhZnuCHOcKHKYIAZlH"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "cPOLhZnuCHOcKHKYIAZlH",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/hand",
                "destinationCard": {
                    "id": "ZN_CKMu9iUkWwqzRGF7VZ",
                    "owner": 2,
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
                    }
                },
                "destinationZone": "zones/in_play",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "cPOLhZnuCHOcKHKYIAZlH"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "ZN_CKMu9iUkWwqzRGF7VZ"
                },
                "source": false,
                "amount": 3,
                "generatedBy": "cPOLhZnuCHOcKHKYIAZlH"
            },
            {
                "type": "actions/play",
                "player": 2,
                "payload": {
                    "card": {
                        "id": "7OYgTkoc7LjviK5XB67py",
                        "owner": 2,
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
                        }
                    },
                    "player": 2
                },
                "forcePriority": false
            },
            {
                "type": "actions/effect",
                "effectType": "effects/paying_energy_for_creature",
                "from": {
                    "id": "xgavpDsS5iWshBSLA09pe"
                },
                "amount": 4,
                "player": 2,
                "generatedBy": "7OYgTkoc7LjviK5XB67py"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/remove_energy_from_magi",
                "target": {
                    "id": "xgavpDsS5iWshBSLA09pe",
                    "owner": 2,
                    "card": "Poad",
                    "data": {
                        "energy": 10,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 3,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 4,
                "generatedBy": "7OYgTkoc7LjviK5XB67py",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/play_creature",
                "card": {
                    "id": "7OYgTkoc7LjviK5XB67py",
                    "owner": 2,
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
                    }
                },
                "player": 2,
                "generatedBy": "7OYgTkoc7LjviK5XB67py"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "7OYgTkoc7LjviK5XB67py",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/hand",
                "destinationCard": {
                    "id": "WDo7NJOOC-mvQ1mg9ZYNl",
                    "owner": 2,
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
                    }
                },
                "destinationZone": "zones/in_play",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "7OYgTkoc7LjviK5XB67py"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "WDo7NJOOC-mvQ1mg9ZYNl"
                },
                "source": false,
                "amount": 4,
                "generatedBy": "7OYgTkoc7LjviK5XB67py"
            },
            {
                "type": "actions/play",
                "player": 2,
                "payload": {
                    "card": {
                        "id": "w6phrA6DMmzu-CEzGanvK",
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
                    },
                    "player": 2
                },
                "forcePriority": false
            },
            {
                "type": "actions/effect",
                "effectType": "effects/paying_energy_for_creature",
                "from": {
                    "id": "xgavpDsS5iWshBSLA09pe"
                },
                "amount": 4,
                "player": 2,
                "generatedBy": "w6phrA6DMmzu-CEzGanvK"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/remove_energy_from_magi",
                "target": {
                    "id": "xgavpDsS5iWshBSLA09pe",
                    "owner": 2,
                    "card": "Poad",
                    "data": {
                        "energy": 6,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 7,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 4,
                "generatedBy": "w6phrA6DMmzu-CEzGanvK",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/play_creature",
                "card": {
                    "id": "w6phrA6DMmzu-CEzGanvK",
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
                },
                "player": 2,
                "generatedBy": "w6phrA6DMmzu-CEzGanvK"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "w6phrA6DMmzu-CEzGanvK",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/hand",
                "destinationCard": {
                    "id": "-WJMiYA-uuLfNjDTpg_eO",
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
                },
                "destinationZone": "zones/in_play",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "w6phrA6DMmzu-CEzGanvK"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "-WJMiYA-uuLfNjDTpg_eO"
                },
                "source": false,
                "amount": 4,
                "generatedBy": "w6phrA6DMmzu-CEzGanvK"
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 4
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/power",
                "power": "Heroes' Feast",
                "source": {
                    "id": "xgavpDsS5iWshBSLA09pe",
                    "owner": 2,
                    "card": "Poad",
                    "data": {
                        "energy": 2,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 11,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/paying_energy_for_power",
                "target": {
                    "id": "xgavpDsS5iWshBSLA09pe",
                    "owner": 2,
                    "card": "Poad",
                    "data": {
                        "energy": 2,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [
                            "Heroes' Feast"
                        ],
                        "energyLostThisTurn": 11,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 2,
                "generatedBy": "xgavpDsS5iWshBSLA09pe"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/remove_energy_from_magi",
                "target": {
                    "id": "xgavpDsS5iWshBSLA09pe",
                    "owner": 2,
                    "card": "Poad",
                    "data": {
                        "energy": 2,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [
                            "Heroes' Feast"
                        ],
                        "energyLostThisTurn": 11,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 2,
                "generatedBy": "xgavpDsS5iWshBSLA09pe"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": [
                    {
                        "id": "-WJMiYA-uuLfNjDTpg_eO"
                    },
                    {
                        "id": "WDo7NJOOC-mvQ1mg9ZYNl"
                    },
                    {
                        "id": "ZN_CKMu9iUkWwqzRGF7VZ"
                    }
                ],
                "source": {
                    "id": "xgavpDsS5iWshBSLA09pe"
                },
                "amount": 1,
                "generatedBy": "xgavpDsS5iWshBSLA09pe",
                "player": 2
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 5
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "qHOiscGidPWPy2ui05YvZ",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "ssgGwM_ZBtuFEM0CG4HRm",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "7I2Oe7BhN9eBDvMccGAIl"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "QkrJgnuWt-VTVTgZjd_d8",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "ZXq3hrl78SjDzaXRMHD0r",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "7I2Oe7BhN9eBDvMccGAIl"
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 0
            },
            {
                "type": "actions/effect",
                "effectType": "effects/end_of_turn",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_of_turn",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "Nv8ZRPBwNqzAxu1Aw14Da",
                    "owner": 1,
                    "card": "Nimbulo",
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
                },
                "sourceZone": "zones/magi_pile",
                "destinationCard": {
                    "id": "hrzkD8as9z3lBOEDl-inL",
                    "owner": 1,
                    "card": "Nimbulo",
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
                },
                "destinationZone": "zones/active_magi",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "Lv0wJQZmYgIz7uvr5nFTa"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_magi",
                "source": {
                    "id": "hrzkD8as9z3lBOEDl-inL"
                },
                "target": {
                    "id": "hrzkD8as9z3lBOEDl-inL"
                },
                "amount": 14
            },
            {
                "type": "actions/enter_prompt",
                "promptType": "prompt/choose_cards",
                "promptParams": {
                    "availableCards": [
                        "Fog Bank",
                        "Lovian"
                    ],
                    "startingCards": [
                        "Fog Bank",
                        "Lovian",
                        "Shooting Star"
                    ]
                },
                "generatedBy": "Lv0wJQZmYgIz7uvr5nFTa",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/resolve_prompt",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "V7DobR5vHAFAaxcVB0Wgs",
                    "owner": 1,
                    "card": "Lovian",
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
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "bEAoHY537NEARzZzbpJ7X",
                    "owner": 1,
                    "card": "Lovian",
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
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "Lv0wJQZmYgIz7uvr5nFTa"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "qxvKUQEPSXufpTa6-1zVH",
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
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "5beqni9Sfg5r5cZCGXeEl",
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
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "Lv0wJQZmYgIz7uvr5nFTa"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "jhNcCzcc1Oh8BEiwMDouw",
                    "owner": 1,
                    "card": "Ayebaw",
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
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "Cpx9cn4k57C3IdSM256HX",
                    "owner": 1,
                    "card": "Ayebaw",
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
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "Lv0wJQZmYgIz7uvr5nFTa"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "46UGIBiPHfehssLRAUAMT",
                    "owner": 1,
                    "card": "Xyx",
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
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "pQgVxiCRNM0vsLi9y7Pwu",
                    "owner": 1,
                    "card": "Xyx",
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
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "Lv0wJQZmYgIz7uvr5nFTa"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "J90JxJsphN0KQnZcX4I9y",
                    "owner": 1,
                    "card": "Xyx",
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
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "B1SzOgu041uulUWJju_T-",
                    "owner": 1,
                    "card": "Xyx",
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
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "Lv0wJQZmYgIz7uvr5nFTa"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_magi",
                "source": {
                    "id": "hrzkD8as9z3lBOEDl-inL"
                },
                "target": {
                    "id": "hrzkD8as9z3lBOEDl-inL"
                },
                "amount": 5
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 3
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/play",
                "player": 1,
                "payload": {
                    "card": {
                        "id": "bEAoHY537NEARzZzbpJ7X",
                        "owner": 1,
                        "card": "Lovian",
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
                    },
                    "player": 1
                },
                "forcePriority": false
            },
            {
                "type": "actions/effect",
                "effectType": "effects/paying_energy_for_creature",
                "from": {
                    "id": "hrzkD8as9z3lBOEDl-inL"
                },
                "amount": 4,
                "player": 1,
                "generatedBy": "bEAoHY537NEARzZzbpJ7X"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/remove_energy_from_magi",
                "target": {
                    "id": "hrzkD8as9z3lBOEDl-inL",
                    "owner": 1,
                    "card": "Nimbulo",
                    "data": {
                        "energy": 19,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 0,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 4,
                "generatedBy": "bEAoHY537NEARzZzbpJ7X",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/play_creature",
                "card": {
                    "id": "bEAoHY537NEARzZzbpJ7X",
                    "owner": 1,
                    "card": "Lovian",
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
                },
                "player": 1,
                "generatedBy": "bEAoHY537NEARzZzbpJ7X"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "bEAoHY537NEARzZzbpJ7X",
                    "owner": 1,
                    "card": "Lovian",
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
                },
                "sourceZone": "zones/hand",
                "destinationCard": {
                    "id": "6QnnGDAHqKr8O8PSsyECN",
                    "owner": 1,
                    "card": "Lovian",
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
                },
                "destinationZone": "zones/in_play",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "bEAoHY537NEARzZzbpJ7X"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "6QnnGDAHqKr8O8PSsyECN"
                },
                "source": false,
                "amount": 4,
                "generatedBy": "bEAoHY537NEARzZzbpJ7X"
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/play",
                "player": 1,
                "payload": {
                    "card": {
                        "id": "B1SzOgu041uulUWJju_T-",
                        "owner": 1,
                        "card": "Xyx",
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
                    },
                    "player": 1
                },
                "forcePriority": false
            },
            {
                "type": "actions/effect",
                "effectType": "effects/paying_energy_for_creature",
                "from": {
                    "id": "hrzkD8as9z3lBOEDl-inL"
                },
                "amount": 3,
                "player": 1,
                "generatedBy": "B1SzOgu041uulUWJju_T-"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/remove_energy_from_magi",
                "target": {
                    "id": "hrzkD8as9z3lBOEDl-inL",
                    "owner": 1,
                    "card": "Nimbulo",
                    "data": {
                        "energy": 15,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 4,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 3,
                "generatedBy": "B1SzOgu041uulUWJju_T-",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/play_creature",
                "card": {
                    "id": "B1SzOgu041uulUWJju_T-",
                    "owner": 1,
                    "card": "Xyx",
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
                },
                "player": 1,
                "generatedBy": "B1SzOgu041uulUWJju_T-"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "B1SzOgu041uulUWJju_T-",
                    "owner": 1,
                    "card": "Xyx",
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
                },
                "sourceZone": "zones/hand",
                "destinationCard": {
                    "id": "kbjaqgaj3iOiGBhZgrUWg",
                    "owner": 1,
                    "card": "Xyx",
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
                },
                "destinationZone": "zones/in_play",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "B1SzOgu041uulUWJju_T-"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "kbjaqgaj3iOiGBhZgrUWg"
                },
                "source": false,
                "amount": 3,
                "generatedBy": "B1SzOgu041uulUWJju_T-"
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/play",
                "player": 1,
                "payload": {
                    "card": {
                        "id": "Cpx9cn4k57C3IdSM256HX",
                        "owner": 1,
                        "card": "Ayebaw",
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
                    },
                    "player": 1
                },
                "forcePriority": false
            },
            {
                "type": "actions/effect",
                "effectType": "effects/paying_energy_for_creature",
                "from": {
                    "id": "hrzkD8as9z3lBOEDl-inL"
                },
                "amount": 5,
                "player": 1,
                "generatedBy": "Cpx9cn4k57C3IdSM256HX"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/remove_energy_from_magi",
                "target": {
                    "id": "hrzkD8as9z3lBOEDl-inL",
                    "owner": 1,
                    "card": "Nimbulo",
                    "data": {
                        "energy": 12,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 7,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 5,
                "generatedBy": "Cpx9cn4k57C3IdSM256HX",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/play_creature",
                "card": {
                    "id": "Cpx9cn4k57C3IdSM256HX",
                    "owner": 1,
                    "card": "Ayebaw",
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
                },
                "player": 1,
                "generatedBy": "Cpx9cn4k57C3IdSM256HX"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "Cpx9cn4k57C3IdSM256HX",
                    "owner": 1,
                    "card": "Ayebaw",
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
                },
                "sourceZone": "zones/hand",
                "destinationCard": {
                    "id": "bZ_kc0m1xKahfd7mbFEL7",
                    "owner": 1,
                    "card": "Ayebaw",
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
                },
                "destinationZone": "zones/in_play",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "Cpx9cn4k57C3IdSM256HX"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "bZ_kc0m1xKahfd7mbFEL7"
                },
                "source": false,
                "amount": 5,
                "generatedBy": "Cpx9cn4k57C3IdSM256HX"
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/play",
                "player": 1,
                "payload": {
                    "card": {
                        "id": "pQgVxiCRNM0vsLi9y7Pwu",
                        "owner": 1,
                        "card": "Xyx",
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
                    },
                    "player": 1
                },
                "forcePriority": false
            },
            {
                "type": "actions/effect",
                "effectType": "effects/paying_energy_for_creature",
                "from": {
                    "id": "hrzkD8as9z3lBOEDl-inL"
                },
                "amount": 3,
                "player": 1,
                "generatedBy": "pQgVxiCRNM0vsLi9y7Pwu"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/remove_energy_from_magi",
                "target": {
                    "id": "hrzkD8as9z3lBOEDl-inL",
                    "owner": 1,
                    "card": "Nimbulo",
                    "data": {
                        "energy": 7,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 12,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 3,
                "generatedBy": "pQgVxiCRNM0vsLi9y7Pwu",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/play_creature",
                "card": {
                    "id": "pQgVxiCRNM0vsLi9y7Pwu",
                    "owner": 1,
                    "card": "Xyx",
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
                },
                "player": 1,
                "generatedBy": "pQgVxiCRNM0vsLi9y7Pwu"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "pQgVxiCRNM0vsLi9y7Pwu",
                    "owner": 1,
                    "card": "Xyx",
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
                },
                "sourceZone": "zones/hand",
                "destinationCard": {
                    "id": "hcOep0b4EFZZceyenkYrd",
                    "owner": 1,
                    "card": "Xyx",
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
                },
                "destinationZone": "zones/in_play",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "pQgVxiCRNM0vsLi9y7Pwu"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "hcOep0b4EFZZceyenkYrd"
                },
                "source": false,
                "amount": 3,
                "generatedBy": "pQgVxiCRNM0vsLi9y7Pwu"
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 4
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 5
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "fsyf9UMx4oPhpXNgNIvWU",
                    "owner": 1,
                    "card": "Shockwave",
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
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "XJbJogIVMUMdFE0vO3cFK",
                    "owner": 1,
                    "card": "Shockwave",
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
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "utgFo28HbkCO57ywvt2b9"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "8sx19c64UQt0yycF1Vw2I",
                    "owner": 1,
                    "card": "Pharan",
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
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "pdCgcAHB7J3C5_vMvReS3",
                    "owner": 1,
                    "card": "Pharan",
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
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "utgFo28HbkCO57ywvt2b9"
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 0
            },
            {
                "type": "actions/effect",
                "effectType": "effects/end_of_turn",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_of_turn",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_magi",
                "source": {
                    "id": "xgavpDsS5iWshBSLA09pe"
                },
                "target": {
                    "id": "xgavpDsS5iWshBSLA09pe"
                },
                "amount": 5
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/power",
                "power": "Heroes' Feast",
                "source": {
                    "id": "xgavpDsS5iWshBSLA09pe",
                    "owner": 2,
                    "card": "Poad",
                    "data": {
                        "energy": 5,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 13,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/paying_energy_for_power",
                "target": {
                    "id": "xgavpDsS5iWshBSLA09pe",
                    "owner": 2,
                    "card": "Poad",
                    "data": {
                        "energy": 5,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [
                            "Heroes' Feast"
                        ],
                        "energyLostThisTurn": 13,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 2,
                "generatedBy": "xgavpDsS5iWshBSLA09pe"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/remove_energy_from_magi",
                "target": {
                    "id": "xgavpDsS5iWshBSLA09pe",
                    "owner": 2,
                    "card": "Poad",
                    "data": {
                        "energy": 5,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [
                            "Heroes' Feast"
                        ],
                        "energyLostThisTurn": 13,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 2,
                "generatedBy": "xgavpDsS5iWshBSLA09pe"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": [
                    {
                        "id": "-WJMiYA-uuLfNjDTpg_eO"
                    },
                    {
                        "id": "WDo7NJOOC-mvQ1mg9ZYNl"
                    },
                    {
                        "id": "ZN_CKMu9iUkWwqzRGF7VZ"
                    }
                ],
                "source": {
                    "id": "xgavpDsS5iWshBSLA09pe"
                },
                "amount": 1,
                "generatedBy": "xgavpDsS5iWshBSLA09pe",
                "player": 2
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/attack",
                "source": "ZN_CKMu9iUkWwqzRGF7VZ",
                "target": "6QnnGDAHqKr8O8PSsyECN",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/attack",
                "source": "ZN_CKMu9iUkWwqzRGF7VZ",
                "target": "6QnnGDAHqKr8O8PSsyECN",
                "additionalAttackers": [],
                "generatedBy": "ZN_CKMu9iUkWwqzRGF7VZ",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_attacks",
                "source": {
                    "id": "ZN_CKMu9iUkWwqzRGF7VZ"
                },
                "target": {
                    "id": "6QnnGDAHqKr8O8PSsyECN"
                },
                "sourceAtStart": {
                    "id": "ZN_CKMu9iUkWwqzRGF7VZ"
                },
                "targetAtStart": {
                    "id": "6QnnGDAHqKr8O8PSsyECN"
                }
            },
            {
                "type": "actions/effect",
                "effectType": "effects/before_damage",
                "source": "ZN_CKMu9iUkWwqzRGF7VZ",
                "target": "6QnnGDAHqKr8O8PSsyECN",
                "generatedBy": "ZN_CKMu9iUkWwqzRGF7VZ"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/damage_step",
                "source": "ZN_CKMu9iUkWwqzRGF7VZ",
                "target": "6QnnGDAHqKr8O8PSsyECN",
                "packHuntAttack": false,
                "generatedBy": "ZN_CKMu9iUkWwqzRGF7VZ"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/attacker_deals_damage",
                "source": "ZN_CKMu9iUkWwqzRGF7VZ",
                "target": "6QnnGDAHqKr8O8PSsyECN",
                "amount": 5,
                "generatedBy": "ZN_CKMu9iUkWwqzRGF7VZ"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/deal_damage",
                "source": "ZN_CKMu9iUkWwqzRGF7VZ",
                "target": "6QnnGDAHqKr8O8PSsyECN",
                "amount": 5,
                "generatedBy": "ZN_CKMu9iUkWwqzRGF7VZ"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_energy_from_creature_or_magi",
                "source": "ZN_CKMu9iUkWwqzRGF7VZ",
                "target": "6QnnGDAHqKr8O8PSsyECN",
                "attack": true,
                "amount": 5,
                "generatedBy": "ZN_CKMu9iUkWwqzRGF7VZ"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/energy_discarded_from_creature",
                "amount": 4,
                "attack": true,
                "spell": false,
                "relic": false,
                "source": {
                    "id": "ZN_CKMu9iUkWwqzRGF7VZ"
                },
                "variable": "damageDealt",
                "target": {
                    "id": "6QnnGDAHqKr8O8PSsyECN"
                },
                "generatedBy": "ZN_CKMu9iUkWwqzRGF7VZ"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/defender_deals_damage",
                "source": "6QnnGDAHqKr8O8PSsyECN",
                "target": "ZN_CKMu9iUkWwqzRGF7VZ",
                "amount": 4,
                "generatedBy": "ZN_CKMu9iUkWwqzRGF7VZ"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/deal_damage",
                "source": "6QnnGDAHqKr8O8PSsyECN",
                "target": "ZN_CKMu9iUkWwqzRGF7VZ",
                "amount": 4,
                "generatedBy": "ZN_CKMu9iUkWwqzRGF7VZ"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_energy_from_creature_or_magi",
                "source": "6QnnGDAHqKr8O8PSsyECN",
                "target": "ZN_CKMu9iUkWwqzRGF7VZ",
                "attack": true,
                "amount": 4,
                "generatedBy": "ZN_CKMu9iUkWwqzRGF7VZ"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/energy_discarded_from_creature",
                "amount": 4,
                "attack": true,
                "spell": false,
                "relic": false,
                "source": {
                    "id": "6QnnGDAHqKr8O8PSsyECN"
                },
                "variable": "damageDealt",
                "target": {
                    "id": "ZN_CKMu9iUkWwqzRGF7VZ"
                },
                "generatedBy": "ZN_CKMu9iUkWwqzRGF7VZ"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_defeats_creature",
                "source": "ZN_CKMu9iUkWwqzRGF7VZ",
                "target": "6QnnGDAHqKr8O8PSsyECN",
                "attack": true,
                "generatedBy": "ZN_CKMu9iUkWwqzRGF7VZ"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_creature_from_play",
                "source": {
                    "id": "6QnnGDAHqKr8O8PSsyECN",
                    "owner": 1,
                    "card": "Lovian",
                    "data": {
                        "energy": 0,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 4,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": true
                    }
                },
                "target": {
                    "id": "6QnnGDAHqKr8O8PSsyECN",
                    "owner": 1,
                    "card": "Lovian",
                    "data": {
                        "energy": 0,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 4,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": true
                    }
                },
                "generatedBy": "ZN_CKMu9iUkWwqzRGF7VZ",
                "player": 0
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "6QnnGDAHqKr8O8PSsyECN",
                    "owner": 1,
                    "card": "Lovian",
                    "data": {
                        "energy": 0,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 4,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": true
                    }
                },
                "sourceZone": "zones/in_play",
                "destinationCard": {
                    "id": "ebm-gtHZNjdXeGRDANyXk",
                    "owner": 1,
                    "card": "Lovian",
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
                },
                "destinationZone": "zones/discard",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "ZN_CKMu9iUkWwqzRGF7VZ"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_is_defeated",
                "target": "6QnnGDAHqKr8O8PSsyECN",
                "generatedBy": "ZN_CKMu9iUkWwqzRGF7VZ"
            },
            {
                "type": "actions/attack",
                "source": "WDo7NJOOC-mvQ1mg9ZYNl",
                "target": "kbjaqgaj3iOiGBhZgrUWg",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/attack",
                "source": "WDo7NJOOC-mvQ1mg9ZYNl",
                "target": "kbjaqgaj3iOiGBhZgrUWg",
                "additionalAttackers": [],
                "generatedBy": "WDo7NJOOC-mvQ1mg9ZYNl",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_attacks",
                "source": {
                    "id": "WDo7NJOOC-mvQ1mg9ZYNl"
                },
                "target": {
                    "id": "kbjaqgaj3iOiGBhZgrUWg"
                },
                "sourceAtStart": {
                    "id": "WDo7NJOOC-mvQ1mg9ZYNl"
                },
                "targetAtStart": {
                    "id": "kbjaqgaj3iOiGBhZgrUWg"
                }
            },
            {
                "type": "actions/effect",
                "effectType": "effects/before_damage",
                "source": "WDo7NJOOC-mvQ1mg9ZYNl",
                "target": "kbjaqgaj3iOiGBhZgrUWg",
                "generatedBy": "WDo7NJOOC-mvQ1mg9ZYNl"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/damage_step",
                "source": "WDo7NJOOC-mvQ1mg9ZYNl",
                "target": "kbjaqgaj3iOiGBhZgrUWg",
                "packHuntAttack": false,
                "generatedBy": "WDo7NJOOC-mvQ1mg9ZYNl"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/attacker_deals_damage",
                "source": "WDo7NJOOC-mvQ1mg9ZYNl",
                "target": "kbjaqgaj3iOiGBhZgrUWg",
                "amount": 6,
                "generatedBy": "WDo7NJOOC-mvQ1mg9ZYNl"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/deal_damage",
                "source": "WDo7NJOOC-mvQ1mg9ZYNl",
                "target": "kbjaqgaj3iOiGBhZgrUWg",
                "amount": 6,
                "generatedBy": "WDo7NJOOC-mvQ1mg9ZYNl"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_energy_from_creature_or_magi",
                "source": "WDo7NJOOC-mvQ1mg9ZYNl",
                "target": "kbjaqgaj3iOiGBhZgrUWg",
                "attack": true,
                "amount": 6,
                "generatedBy": "WDo7NJOOC-mvQ1mg9ZYNl"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/energy_discarded_from_creature",
                "amount": 3,
                "attack": true,
                "spell": false,
                "relic": false,
                "source": {
                    "id": "WDo7NJOOC-mvQ1mg9ZYNl"
                },
                "variable": "damageDealt",
                "target": {
                    "id": "kbjaqgaj3iOiGBhZgrUWg"
                },
                "generatedBy": "WDo7NJOOC-mvQ1mg9ZYNl"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/defender_deals_damage",
                "source": "kbjaqgaj3iOiGBhZgrUWg",
                "target": "WDo7NJOOC-mvQ1mg9ZYNl",
                "amount": 3,
                "generatedBy": "WDo7NJOOC-mvQ1mg9ZYNl"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/deal_damage",
                "source": "kbjaqgaj3iOiGBhZgrUWg",
                "target": "WDo7NJOOC-mvQ1mg9ZYNl",
                "amount": 3,
                "generatedBy": "WDo7NJOOC-mvQ1mg9ZYNl"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_energy_from_creature_or_magi",
                "source": "kbjaqgaj3iOiGBhZgrUWg",
                "target": "WDo7NJOOC-mvQ1mg9ZYNl",
                "attack": true,
                "amount": 3,
                "generatedBy": "WDo7NJOOC-mvQ1mg9ZYNl"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/energy_discarded_from_creature",
                "amount": 3,
                "attack": true,
                "spell": false,
                "relic": false,
                "source": {
                    "id": "kbjaqgaj3iOiGBhZgrUWg"
                },
                "variable": "damageDealt",
                "target": {
                    "id": "WDo7NJOOC-mvQ1mg9ZYNl"
                },
                "generatedBy": "WDo7NJOOC-mvQ1mg9ZYNl"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_defeats_creature",
                "source": "WDo7NJOOC-mvQ1mg9ZYNl",
                "target": "kbjaqgaj3iOiGBhZgrUWg",
                "attack": true,
                "generatedBy": "WDo7NJOOC-mvQ1mg9ZYNl"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_creature_from_play",
                "source": {
                    "id": "kbjaqgaj3iOiGBhZgrUWg",
                    "owner": 1,
                    "card": "Xyx",
                    "data": {
                        "energy": 0,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 3,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": true
                    }
                },
                "target": {
                    "id": "kbjaqgaj3iOiGBhZgrUWg",
                    "owner": 1,
                    "card": "Xyx",
                    "data": {
                        "energy": 0,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 3,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": true
                    }
                },
                "generatedBy": "WDo7NJOOC-mvQ1mg9ZYNl",
                "player": 0
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "kbjaqgaj3iOiGBhZgrUWg",
                    "owner": 1,
                    "card": "Xyx",
                    "data": {
                        "energy": 0,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 3,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": true
                    }
                },
                "sourceZone": "zones/in_play",
                "destinationCard": {
                    "id": "poQyolzBS4OvSWoslwys5",
                    "owner": 1,
                    "card": "Xyx",
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
                },
                "destinationZone": "zones/discard",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "WDo7NJOOC-mvQ1mg9ZYNl"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_is_defeated",
                "target": "kbjaqgaj3iOiGBhZgrUWg",
                "generatedBy": "WDo7NJOOC-mvQ1mg9ZYNl"
            },
            {
                "type": "actions/attack",
                "source": "-WJMiYA-uuLfNjDTpg_eO",
                "target": "hcOep0b4EFZZceyenkYrd",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/attack",
                "source": "-WJMiYA-uuLfNjDTpg_eO",
                "target": "hcOep0b4EFZZceyenkYrd",
                "additionalAttackers": [],
                "generatedBy": "-WJMiYA-uuLfNjDTpg_eO",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_attacks",
                "source": {
                    "id": "-WJMiYA-uuLfNjDTpg_eO"
                },
                "target": {
                    "id": "hcOep0b4EFZZceyenkYrd"
                },
                "sourceAtStart": {
                    "id": "-WJMiYA-uuLfNjDTpg_eO"
                },
                "targetAtStart": {
                    "id": "hcOep0b4EFZZceyenkYrd"
                }
            },
            {
                "type": "actions/effect",
                "effectType": "effects/before_damage",
                "source": "-WJMiYA-uuLfNjDTpg_eO",
                "target": "hcOep0b4EFZZceyenkYrd",
                "generatedBy": "-WJMiYA-uuLfNjDTpg_eO"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/damage_step",
                "source": "-WJMiYA-uuLfNjDTpg_eO",
                "target": "hcOep0b4EFZZceyenkYrd",
                "packHuntAttack": false,
                "generatedBy": "-WJMiYA-uuLfNjDTpg_eO"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/attacker_deals_damage",
                "source": "-WJMiYA-uuLfNjDTpg_eO",
                "target": "hcOep0b4EFZZceyenkYrd",
                "amount": 6,
                "generatedBy": "-WJMiYA-uuLfNjDTpg_eO"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/deal_damage",
                "source": "-WJMiYA-uuLfNjDTpg_eO",
                "target": "hcOep0b4EFZZceyenkYrd",
                "amount": 6,
                "generatedBy": "-WJMiYA-uuLfNjDTpg_eO"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_energy_from_creature_or_magi",
                "source": "-WJMiYA-uuLfNjDTpg_eO",
                "target": "hcOep0b4EFZZceyenkYrd",
                "attack": true,
                "amount": 6,
                "generatedBy": "-WJMiYA-uuLfNjDTpg_eO"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/energy_discarded_from_creature",
                "amount": 3,
                "attack": true,
                "spell": false,
                "relic": false,
                "source": {
                    "id": "-WJMiYA-uuLfNjDTpg_eO"
                },
                "variable": "damageDealt",
                "target": {
                    "id": "hcOep0b4EFZZceyenkYrd"
                },
                "generatedBy": "-WJMiYA-uuLfNjDTpg_eO"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/defender_deals_damage",
                "source": "hcOep0b4EFZZceyenkYrd",
                "target": "-WJMiYA-uuLfNjDTpg_eO",
                "amount": 3,
                "generatedBy": "-WJMiYA-uuLfNjDTpg_eO"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/deal_damage",
                "source": "hcOep0b4EFZZceyenkYrd",
                "target": "-WJMiYA-uuLfNjDTpg_eO",
                "amount": 3,
                "generatedBy": "-WJMiYA-uuLfNjDTpg_eO"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_energy_from_creature_or_magi",
                "source": "hcOep0b4EFZZceyenkYrd",
                "target": "-WJMiYA-uuLfNjDTpg_eO",
                "attack": true,
                "amount": 3,
                "generatedBy": "-WJMiYA-uuLfNjDTpg_eO"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/energy_discarded_from_creature",
                "amount": 3,
                "attack": true,
                "spell": false,
                "relic": false,
                "source": {
                    "id": "hcOep0b4EFZZceyenkYrd"
                },
                "variable": "damageDealt",
                "target": {
                    "id": "-WJMiYA-uuLfNjDTpg_eO"
                },
                "generatedBy": "-WJMiYA-uuLfNjDTpg_eO"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_defeats_creature",
                "source": "-WJMiYA-uuLfNjDTpg_eO",
                "target": "hcOep0b4EFZZceyenkYrd",
                "attack": true,
                "generatedBy": "-WJMiYA-uuLfNjDTpg_eO"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_creature_from_play",
                "source": {
                    "id": "hcOep0b4EFZZceyenkYrd",
                    "owner": 1,
                    "card": "Xyx",
                    "data": {
                        "energy": 0,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 3,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": true
                    }
                },
                "target": {
                    "id": "hcOep0b4EFZZceyenkYrd",
                    "owner": 1,
                    "card": "Xyx",
                    "data": {
                        "energy": 0,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 3,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": true
                    }
                },
                "generatedBy": "-WJMiYA-uuLfNjDTpg_eO",
                "player": 0
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "hcOep0b4EFZZceyenkYrd",
                    "owner": 1,
                    "card": "Xyx",
                    "data": {
                        "energy": 0,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 3,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": true
                    }
                },
                "sourceZone": "zones/in_play",
                "destinationCard": {
                    "id": "afIYMLPdackZbaPmjVKhM",
                    "owner": 1,
                    "card": "Xyx",
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
                },
                "destinationZone": "zones/discard",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "-WJMiYA-uuLfNjDTpg_eO"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_is_defeated",
                "target": "hcOep0b4EFZZceyenkYrd",
                "generatedBy": "-WJMiYA-uuLfNjDTpg_eO"
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 3
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/play",
                "player": 2,
                "payload": {
                    "card": {
                        "id": "ssgGwM_ZBtuFEM0CG4HRm",
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
                    },
                    "player": 2
                },
                "forcePriority": false
            },
            {
                "type": "actions/effect",
                "effectType": "effects/paying_energy_for_creature",
                "from": {
                    "id": "xgavpDsS5iWshBSLA09pe"
                },
                "amount": 3,
                "player": 2,
                "generatedBy": "ssgGwM_ZBtuFEM0CG4HRm"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/remove_energy_from_magi",
                "target": {
                    "id": "xgavpDsS5iWshBSLA09pe",
                    "owner": 2,
                    "card": "Poad",
                    "data": {
                        "energy": 3,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [
                            "Heroes' Feast",
                            "Heroes' Feast"
                        ],
                        "energyLostThisTurn": 15,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 3,
                "generatedBy": "ssgGwM_ZBtuFEM0CG4HRm",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/play_creature",
                "card": {
                    "id": "ssgGwM_ZBtuFEM0CG4HRm",
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
                },
                "player": 2,
                "generatedBy": "ssgGwM_ZBtuFEM0CG4HRm"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "ssgGwM_ZBtuFEM0CG4HRm",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/hand",
                "destinationCard": {
                    "id": "H0ZQYRlP9qTI_6Q3QOc4j",
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
                },
                "destinationZone": "zones/in_play",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "ssgGwM_ZBtuFEM0CG4HRm"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "H0ZQYRlP9qTI_6Q3QOc4j"
                },
                "source": false,
                "amount": 3,
                "generatedBy": "ssgGwM_ZBtuFEM0CG4HRm"
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 4
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 5
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "686TJx_vqHgXPXV72_DS6",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "j_LYSiDxLmw2G-sw3_WvZ",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "oFfNRFngtzcF86I0lEP-k"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "oRchJGUxnSwS5WGnybhDN",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "bLBCSF0Jfnu1nfE_k99A3",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "oFfNRFngtzcF86I0lEP-k"
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 0
            },
            {
                "type": "actions/effect",
                "effectType": "effects/end_of_turn",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_of_turn",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_magi",
                "source": {
                    "id": "hrzkD8as9z3lBOEDl-inL"
                },
                "target": {
                    "id": "hrzkD8as9z3lBOEDl-inL"
                },
                "amount": 5
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/attack",
                "source": "bZ_kc0m1xKahfd7mbFEL7",
                "target": "ZN_CKMu9iUkWwqzRGF7VZ",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/attack",
                "source": "bZ_kc0m1xKahfd7mbFEL7",
                "target": "ZN_CKMu9iUkWwqzRGF7VZ",
                "additionalAttackers": [],
                "generatedBy": "bZ_kc0m1xKahfd7mbFEL7",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_attacks",
                "source": {
                    "id": "bZ_kc0m1xKahfd7mbFEL7"
                },
                "target": {
                    "id": "ZN_CKMu9iUkWwqzRGF7VZ"
                },
                "sourceAtStart": {
                    "id": "bZ_kc0m1xKahfd7mbFEL7"
                },
                "targetAtStart": {
                    "id": "ZN_CKMu9iUkWwqzRGF7VZ"
                }
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "yfNeOhyp2FAUrC-OqbpQc",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "YMwNA0C3aQnq54B0VVd7x",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "bZ_kc0m1xKahfd7mbFEL7"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/before_damage",
                "source": "bZ_kc0m1xKahfd7mbFEL7",
                "target": "ZN_CKMu9iUkWwqzRGF7VZ",
                "generatedBy": "bZ_kc0m1xKahfd7mbFEL7"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/damage_step",
                "source": "bZ_kc0m1xKahfd7mbFEL7",
                "target": "ZN_CKMu9iUkWwqzRGF7VZ",
                "packHuntAttack": false,
                "generatedBy": "bZ_kc0m1xKahfd7mbFEL7"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/attacker_deals_damage",
                "source": "bZ_kc0m1xKahfd7mbFEL7",
                "target": "ZN_CKMu9iUkWwqzRGF7VZ",
                "amount": 5,
                "generatedBy": "bZ_kc0m1xKahfd7mbFEL7"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/deal_damage",
                "source": "bZ_kc0m1xKahfd7mbFEL7",
                "target": "ZN_CKMu9iUkWwqzRGF7VZ",
                "amount": 5,
                "generatedBy": "bZ_kc0m1xKahfd7mbFEL7"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_energy_from_creature_or_magi",
                "source": "bZ_kc0m1xKahfd7mbFEL7",
                "target": "ZN_CKMu9iUkWwqzRGF7VZ",
                "attack": true,
                "amount": 5,
                "generatedBy": "bZ_kc0m1xKahfd7mbFEL7"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/energy_discarded_from_creature",
                "amount": 1,
                "attack": true,
                "spell": false,
                "relic": false,
                "source": {
                    "id": "bZ_kc0m1xKahfd7mbFEL7"
                },
                "variable": "damageDealt",
                "target": {
                    "id": "ZN_CKMu9iUkWwqzRGF7VZ"
                },
                "generatedBy": "bZ_kc0m1xKahfd7mbFEL7"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/defender_deals_damage",
                "source": "ZN_CKMu9iUkWwqzRGF7VZ",
                "target": "bZ_kc0m1xKahfd7mbFEL7",
                "amount": 1,
                "generatedBy": "bZ_kc0m1xKahfd7mbFEL7"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/deal_damage",
                "source": "ZN_CKMu9iUkWwqzRGF7VZ",
                "target": "bZ_kc0m1xKahfd7mbFEL7",
                "amount": 1,
                "generatedBy": "bZ_kc0m1xKahfd7mbFEL7"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_energy_from_creature_or_magi",
                "source": "ZN_CKMu9iUkWwqzRGF7VZ",
                "target": "bZ_kc0m1xKahfd7mbFEL7",
                "attack": true,
                "amount": 1,
                "generatedBy": "bZ_kc0m1xKahfd7mbFEL7"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/energy_discarded_from_creature",
                "amount": 1,
                "attack": true,
                "spell": false,
                "relic": false,
                "source": {
                    "id": "ZN_CKMu9iUkWwqzRGF7VZ"
                },
                "variable": "damageDealt",
                "target": {
                    "id": "bZ_kc0m1xKahfd7mbFEL7"
                },
                "generatedBy": "bZ_kc0m1xKahfd7mbFEL7"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_defeats_creature",
                "source": "bZ_kc0m1xKahfd7mbFEL7",
                "target": "ZN_CKMu9iUkWwqzRGF7VZ",
                "attack": true,
                "generatedBy": "bZ_kc0m1xKahfd7mbFEL7"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_creature_from_play",
                "source": {
                    "id": "ZN_CKMu9iUkWwqzRGF7VZ",
                    "owner": 2,
                    "card": "Plith",
                    "data": {
                        "energy": 0,
                        "controller": 2,
                        "attacked": 1,
                        "actionsUsed": [],
                        "energyLostThisTurn": 5,
                        "defeatedCreature": true,
                        "hasAttacked": true,
                        "wasAttacked": true
                    }
                },
                "target": {
                    "id": "ZN_CKMu9iUkWwqzRGF7VZ",
                    "owner": 2,
                    "card": "Plith",
                    "data": {
                        "energy": 0,
                        "controller": 2,
                        "attacked": 1,
                        "actionsUsed": [],
                        "energyLostThisTurn": 5,
                        "defeatedCreature": true,
                        "hasAttacked": true,
                        "wasAttacked": true
                    }
                },
                "generatedBy": "bZ_kc0m1xKahfd7mbFEL7",
                "player": 0
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "ZN_CKMu9iUkWwqzRGF7VZ",
                    "owner": 2,
                    "card": "Plith",
                    "data": {
                        "energy": 0,
                        "controller": 2,
                        "attacked": 1,
                        "actionsUsed": [],
                        "energyLostThisTurn": 5,
                        "defeatedCreature": true,
                        "hasAttacked": true,
                        "wasAttacked": true
                    }
                },
                "sourceZone": "zones/in_play",
                "destinationCard": {
                    "id": "ezpZNe-LmyW816odFXHee",
                    "owner": 2,
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
                    }
                },
                "destinationZone": "zones/discard",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "bZ_kc0m1xKahfd7mbFEL7"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_is_defeated",
                "target": "ZN_CKMu9iUkWwqzRGF7VZ",
                "generatedBy": "bZ_kc0m1xKahfd7mbFEL7"
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/attack",
                "source": "bZ_kc0m1xKahfd7mbFEL7",
                "target": "WDo7NJOOC-mvQ1mg9ZYNl",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/attack",
                "source": "bZ_kc0m1xKahfd7mbFEL7",
                "target": "WDo7NJOOC-mvQ1mg9ZYNl",
                "additionalAttackers": [],
                "generatedBy": "bZ_kc0m1xKahfd7mbFEL7",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_attacks",
                "source": {
                    "id": "bZ_kc0m1xKahfd7mbFEL7"
                },
                "target": {
                    "id": "WDo7NJOOC-mvQ1mg9ZYNl"
                },
                "sourceAtStart": {
                    "id": "bZ_kc0m1xKahfd7mbFEL7"
                },
                "targetAtStart": {
                    "id": "WDo7NJOOC-mvQ1mg9ZYNl"
                }
            },
            {
                "type": "actions/effect",
                "effectType": "effects/before_damage",
                "source": "bZ_kc0m1xKahfd7mbFEL7",
                "target": "WDo7NJOOC-mvQ1mg9ZYNl",
                "generatedBy": "bZ_kc0m1xKahfd7mbFEL7"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/damage_step",
                "source": "bZ_kc0m1xKahfd7mbFEL7",
                "target": "WDo7NJOOC-mvQ1mg9ZYNl",
                "packHuntAttack": false,
                "generatedBy": "bZ_kc0m1xKahfd7mbFEL7"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/attacker_deals_damage",
                "source": "bZ_kc0m1xKahfd7mbFEL7",
                "target": "WDo7NJOOC-mvQ1mg9ZYNl",
                "amount": 4,
                "generatedBy": "bZ_kc0m1xKahfd7mbFEL7"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/deal_damage",
                "source": "bZ_kc0m1xKahfd7mbFEL7",
                "target": "WDo7NJOOC-mvQ1mg9ZYNl",
                "amount": 4,
                "generatedBy": "bZ_kc0m1xKahfd7mbFEL7"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_energy_from_creature_or_magi",
                "source": "bZ_kc0m1xKahfd7mbFEL7",
                "target": "WDo7NJOOC-mvQ1mg9ZYNl",
                "attack": true,
                "amount": 4,
                "generatedBy": "bZ_kc0m1xKahfd7mbFEL7"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/energy_discarded_from_creature",
                "amount": 3,
                "attack": true,
                "spell": false,
                "relic": false,
                "source": {
                    "id": "bZ_kc0m1xKahfd7mbFEL7"
                },
                "variable": "damageDealt",
                "target": {
                    "id": "WDo7NJOOC-mvQ1mg9ZYNl"
                },
                "generatedBy": "bZ_kc0m1xKahfd7mbFEL7"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/defender_deals_damage",
                "source": "WDo7NJOOC-mvQ1mg9ZYNl",
                "target": "bZ_kc0m1xKahfd7mbFEL7",
                "amount": 3,
                "generatedBy": "bZ_kc0m1xKahfd7mbFEL7"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/deal_damage",
                "source": "WDo7NJOOC-mvQ1mg9ZYNl",
                "target": "bZ_kc0m1xKahfd7mbFEL7",
                "amount": 3,
                "generatedBy": "bZ_kc0m1xKahfd7mbFEL7"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_energy_from_creature_or_magi",
                "source": "WDo7NJOOC-mvQ1mg9ZYNl",
                "target": "bZ_kc0m1xKahfd7mbFEL7",
                "attack": true,
                "amount": 3,
                "generatedBy": "bZ_kc0m1xKahfd7mbFEL7"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/energy_discarded_from_creature",
                "amount": 3,
                "attack": true,
                "spell": false,
                "relic": false,
                "source": {
                    "id": "WDo7NJOOC-mvQ1mg9ZYNl"
                },
                "variable": "damageDealt",
                "target": {
                    "id": "bZ_kc0m1xKahfd7mbFEL7"
                },
                "generatedBy": "bZ_kc0m1xKahfd7mbFEL7"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_defeats_creature",
                "source": "bZ_kc0m1xKahfd7mbFEL7",
                "target": "WDo7NJOOC-mvQ1mg9ZYNl",
                "attack": true,
                "generatedBy": "bZ_kc0m1xKahfd7mbFEL7"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_creature_from_play",
                "source": {
                    "id": "WDo7NJOOC-mvQ1mg9ZYNl",
                    "owner": 2,
                    "card": "Balamant Pup",
                    "data": {
                        "energy": 0,
                        "controller": 2,
                        "attacked": 1,
                        "actionsUsed": [],
                        "energyLostThisTurn": 6,
                        "defeatedCreature": true,
                        "hasAttacked": true,
                        "wasAttacked": true
                    }
                },
                "target": {
                    "id": "WDo7NJOOC-mvQ1mg9ZYNl",
                    "owner": 2,
                    "card": "Balamant Pup",
                    "data": {
                        "energy": 0,
                        "controller": 2,
                        "attacked": 1,
                        "actionsUsed": [],
                        "energyLostThisTurn": 6,
                        "defeatedCreature": true,
                        "hasAttacked": true,
                        "wasAttacked": true
                    }
                },
                "generatedBy": "bZ_kc0m1xKahfd7mbFEL7",
                "player": 0
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "WDo7NJOOC-mvQ1mg9ZYNl",
                    "owner": 2,
                    "card": "Balamant Pup",
                    "data": {
                        "energy": 0,
                        "controller": 2,
                        "attacked": 1,
                        "actionsUsed": [],
                        "energyLostThisTurn": 6,
                        "defeatedCreature": true,
                        "hasAttacked": true,
                        "wasAttacked": true
                    }
                },
                "sourceZone": "zones/in_play",
                "destinationCard": {
                    "id": "nmmE_KjDgjmixqaGi4Gn7",
                    "owner": 2,
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
                    }
                },
                "destinationZone": "zones/discard",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "bZ_kc0m1xKahfd7mbFEL7"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_is_defeated",
                "target": "WDo7NJOOC-mvQ1mg9ZYNl",
                "generatedBy": "bZ_kc0m1xKahfd7mbFEL7"
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 3
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/play",
                "player": 1,
                "payload": {
                    "card": {
                        "id": "pdCgcAHB7J3C5_vMvReS3",
                        "owner": 1,
                        "card": "Pharan",
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
                    },
                    "player": 1
                },
                "forcePriority": false
            },
            {
                "type": "actions/effect",
                "effectType": "effects/paying_energy_for_creature",
                "from": {
                    "id": "hrzkD8as9z3lBOEDl-inL"
                },
                "amount": 3,
                "player": 1,
                "generatedBy": "pdCgcAHB7J3C5_vMvReS3"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/remove_energy_from_magi",
                "target": {
                    "id": "hrzkD8as9z3lBOEDl-inL",
                    "owner": 1,
                    "card": "Nimbulo",
                    "data": {
                        "energy": 9,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 15,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 3,
                "generatedBy": "pdCgcAHB7J3C5_vMvReS3",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/play_creature",
                "card": {
                    "id": "pdCgcAHB7J3C5_vMvReS3",
                    "owner": 1,
                    "card": "Pharan",
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
                },
                "player": 1,
                "generatedBy": "pdCgcAHB7J3C5_vMvReS3"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "pdCgcAHB7J3C5_vMvReS3",
                    "owner": 1,
                    "card": "Pharan",
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
                },
                "sourceZone": "zones/hand",
                "destinationCard": {
                    "id": "NnG0NXQmIh8QivHWmjBjH",
                    "owner": 1,
                    "card": "Pharan",
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
                },
                "destinationZone": "zones/in_play",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "pdCgcAHB7J3C5_vMvReS3"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "NnG0NXQmIh8QivHWmjBjH"
                },
                "source": false,
                "amount": 3,
                "generatedBy": "pdCgcAHB7J3C5_vMvReS3"
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 4
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 5
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "Ad8M6ZNd9tVbE0VpzhiJn",
                    "owner": 1,
                    "card": "Alaban",
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
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "584SJooN47qFVcp-DW-iw",
                    "owner": 1,
                    "card": "Alaban",
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
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "8N6jQxewG75vy94djjewI"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "4c_JbzFq0M9tZF7AweauR",
                    "owner": 1,
                    "card": "Xyx Elder",
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
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "f71WpAyLfNP1vVFO_vbTK",
                    "owner": 1,
                    "card": "Xyx Elder",
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
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "8N6jQxewG75vy94djjewI"
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 0
            },
            {
                "type": "actions/effect",
                "effectType": "effects/end_of_turn",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_of_turn",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_magi",
                "source": {
                    "id": "xgavpDsS5iWshBSLA09pe"
                },
                "target": {
                    "id": "xgavpDsS5iWshBSLA09pe"
                },
                "amount": 5
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/attack",
                "source": "H0ZQYRlP9qTI_6Q3QOc4j",
                "target": "bZ_kc0m1xKahfd7mbFEL7",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/attack",
                "source": "H0ZQYRlP9qTI_6Q3QOc4j",
                "target": "bZ_kc0m1xKahfd7mbFEL7",
                "additionalAttackers": [],
                "generatedBy": "H0ZQYRlP9qTI_6Q3QOc4j",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_attacks",
                "source": {
                    "id": "H0ZQYRlP9qTI_6Q3QOc4j"
                },
                "target": {
                    "id": "bZ_kc0m1xKahfd7mbFEL7"
                },
                "sourceAtStart": {
                    "id": "H0ZQYRlP9qTI_6Q3QOc4j"
                },
                "targetAtStart": {
                    "id": "bZ_kc0m1xKahfd7mbFEL7"
                }
            },
            {
                "type": "actions/effect",
                "effectType": "effects/before_damage",
                "source": "H0ZQYRlP9qTI_6Q3QOc4j",
                "target": "bZ_kc0m1xKahfd7mbFEL7",
                "generatedBy": "H0ZQYRlP9qTI_6Q3QOc4j"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/damage_step",
                "source": "H0ZQYRlP9qTI_6Q3QOc4j",
                "target": "bZ_kc0m1xKahfd7mbFEL7",
                "packHuntAttack": false,
                "generatedBy": "H0ZQYRlP9qTI_6Q3QOc4j"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/attacker_deals_damage",
                "source": "H0ZQYRlP9qTI_6Q3QOc4j",
                "target": "bZ_kc0m1xKahfd7mbFEL7",
                "amount": 3,
                "generatedBy": "H0ZQYRlP9qTI_6Q3QOc4j"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/deal_damage",
                "source": "H0ZQYRlP9qTI_6Q3QOc4j",
                "target": "bZ_kc0m1xKahfd7mbFEL7",
                "amount": 3,
                "generatedBy": "H0ZQYRlP9qTI_6Q3QOc4j"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_energy_from_creature_or_magi",
                "source": "H0ZQYRlP9qTI_6Q3QOc4j",
                "target": "bZ_kc0m1xKahfd7mbFEL7",
                "attack": true,
                "amount": 3,
                "generatedBy": "H0ZQYRlP9qTI_6Q3QOc4j"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/energy_discarded_from_creature",
                "amount": 1,
                "attack": true,
                "spell": false,
                "relic": false,
                "source": {
                    "id": "H0ZQYRlP9qTI_6Q3QOc4j"
                },
                "variable": "damageDealt",
                "target": {
                    "id": "bZ_kc0m1xKahfd7mbFEL7"
                },
                "generatedBy": "H0ZQYRlP9qTI_6Q3QOc4j"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/defender_deals_damage",
                "source": "bZ_kc0m1xKahfd7mbFEL7",
                "target": "H0ZQYRlP9qTI_6Q3QOc4j",
                "amount": 1,
                "generatedBy": "H0ZQYRlP9qTI_6Q3QOc4j"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/deal_damage",
                "source": "bZ_kc0m1xKahfd7mbFEL7",
                "target": "H0ZQYRlP9qTI_6Q3QOc4j",
                "amount": 1,
                "generatedBy": "H0ZQYRlP9qTI_6Q3QOc4j"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_energy_from_creature_or_magi",
                "source": "bZ_kc0m1xKahfd7mbFEL7",
                "target": "H0ZQYRlP9qTI_6Q3QOc4j",
                "attack": true,
                "amount": 1,
                "generatedBy": "H0ZQYRlP9qTI_6Q3QOc4j"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/energy_discarded_from_creature",
                "amount": 1,
                "attack": true,
                "spell": false,
                "relic": false,
                "source": {
                    "id": "bZ_kc0m1xKahfd7mbFEL7"
                },
                "variable": "damageDealt",
                "target": {
                    "id": "H0ZQYRlP9qTI_6Q3QOc4j"
                },
                "generatedBy": "H0ZQYRlP9qTI_6Q3QOc4j"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_defeats_creature",
                "source": "H0ZQYRlP9qTI_6Q3QOc4j",
                "target": "bZ_kc0m1xKahfd7mbFEL7",
                "attack": true,
                "generatedBy": "H0ZQYRlP9qTI_6Q3QOc4j"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_creature_from_play",
                "source": {
                    "id": "bZ_kc0m1xKahfd7mbFEL7",
                    "owner": 1,
                    "card": "Ayebaw",
                    "data": {
                        "energy": 0,
                        "controller": 1,
                        "attacked": 2,
                        "actionsUsed": [],
                        "energyLostThisTurn": 5,
                        "defeatedCreature": true,
                        "hasAttacked": true,
                        "wasAttacked": true
                    }
                },
                "target": {
                    "id": "bZ_kc0m1xKahfd7mbFEL7",
                    "owner": 1,
                    "card": "Ayebaw",
                    "data": {
                        "energy": 0,
                        "controller": 1,
                        "attacked": 2,
                        "actionsUsed": [],
                        "energyLostThisTurn": 5,
                        "defeatedCreature": true,
                        "hasAttacked": true,
                        "wasAttacked": true
                    }
                },
                "generatedBy": "H0ZQYRlP9qTI_6Q3QOc4j",
                "player": 0
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "bZ_kc0m1xKahfd7mbFEL7",
                    "owner": 1,
                    "card": "Ayebaw",
                    "data": {
                        "energy": 0,
                        "controller": 1,
                        "attacked": 2,
                        "actionsUsed": [],
                        "energyLostThisTurn": 5,
                        "defeatedCreature": true,
                        "hasAttacked": true,
                        "wasAttacked": true
                    }
                },
                "sourceZone": "zones/in_play",
                "destinationCard": {
                    "id": "iniUnVDewsRTte7hUgRyD",
                    "owner": 1,
                    "card": "Ayebaw",
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
                },
                "destinationZone": "zones/discard",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "H0ZQYRlP9qTI_6Q3QOc4j"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_is_defeated",
                "target": "bZ_kc0m1xKahfd7mbFEL7",
                "generatedBy": "H0ZQYRlP9qTI_6Q3QOc4j"
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 3
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 4
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 5
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "8pSjd5Q24BEd07IyTQrwd",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "i7YDD6azNSd2ofBm4xL6W",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "iC4YR5wBsq5vgjzWqJ8GS"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "kKJ3GEb84YcNucgA2dwd1",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "lidoBRuDozGVkv0qKy7m2",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "iC4YR5wBsq5vgjzWqJ8GS"
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 0
            },
            {
                "type": "actions/effect",
                "effectType": "effects/end_of_turn",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_of_turn",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_magi",
                "source": {
                    "id": "hrzkD8as9z3lBOEDl-inL"
                },
                "target": {
                    "id": "hrzkD8as9z3lBOEDl-inL"
                },
                "amount": 5
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/power",
                "power": "Healing Rain",
                "source": {
                    "id": "NnG0NXQmIh8QivHWmjBjH",
                    "owner": 1,
                    "card": "Pharan",
                    "data": {
                        "energy": 3,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 0,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "player": 1
            },
            {
                "type": "actions/enter_prompt",
                "promptType": "prompt/creature_or_magi",
                "generatedBy": "NnG0NXQmIh8QivHWmjBjH",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/resolve_prompt",
                "player": 1,
                "targetCard": {
                    "id": "NnG0NXQmIh8QivHWmjBjH",
                    "owner": 1,
                    "card": "Pharan",
                    "data": {
                        "energy": 3,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [
                            "Healing Rain",
                            "Healing Rain"
                        ],
                        "energyLostThisTurn": 0,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "target": "NnG0NXQmIh8QivHWmjBjH"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/move_energy",
                "target": {
                    "id": "NnG0NXQmIh8QivHWmjBjH",
                    "owner": 1,
                    "card": "Pharan",
                    "data": {
                        "energy": 3,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [
                            "Healing Rain",
                            "Healing Rain"
                        ],
                        "energyLostThisTurn": 0,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "source": {
                    "id": "NnG0NXQmIh8QivHWmjBjH",
                    "owner": 1,
                    "card": "Pharan",
                    "data": {
                        "energy": 3,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [
                            "Healing Rain",
                            "Healing Rain"
                        ],
                        "energyLostThisTurn": 0,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 3,
                "generatedBy": "NnG0NXQmIh8QivHWmjBjH",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/attack",
                "source": "NnG0NXQmIh8QivHWmjBjH",
                "target": "H0ZQYRlP9qTI_6Q3QOc4j",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/attack",
                "source": "NnG0NXQmIh8QivHWmjBjH",
                "target": "H0ZQYRlP9qTI_6Q3QOc4j",
                "additionalAttackers": [],
                "generatedBy": "NnG0NXQmIh8QivHWmjBjH",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_attacks",
                "source": {
                    "id": "NnG0NXQmIh8QivHWmjBjH"
                },
                "target": {
                    "id": "H0ZQYRlP9qTI_6Q3QOc4j"
                },
                "sourceAtStart": {
                    "id": "NnG0NXQmIh8QivHWmjBjH"
                },
                "targetAtStart": {
                    "id": "H0ZQYRlP9qTI_6Q3QOc4j"
                }
            },
            {
                "type": "actions/effect",
                "effectType": "effects/before_damage",
                "source": "NnG0NXQmIh8QivHWmjBjH",
                "target": "H0ZQYRlP9qTI_6Q3QOc4j",
                "generatedBy": "NnG0NXQmIh8QivHWmjBjH"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/damage_step",
                "source": "NnG0NXQmIh8QivHWmjBjH",
                "target": "H0ZQYRlP9qTI_6Q3QOc4j",
                "packHuntAttack": false,
                "generatedBy": "NnG0NXQmIh8QivHWmjBjH"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/attacker_deals_damage",
                "source": "NnG0NXQmIh8QivHWmjBjH",
                "target": "H0ZQYRlP9qTI_6Q3QOc4j",
                "amount": 3,
                "generatedBy": "NnG0NXQmIh8QivHWmjBjH"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/deal_damage",
                "source": "NnG0NXQmIh8QivHWmjBjH",
                "target": "H0ZQYRlP9qTI_6Q3QOc4j",
                "amount": 3,
                "generatedBy": "NnG0NXQmIh8QivHWmjBjH"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_energy_from_creature_or_magi",
                "source": "NnG0NXQmIh8QivHWmjBjH",
                "target": "H0ZQYRlP9qTI_6Q3QOc4j",
                "attack": true,
                "amount": 3,
                "generatedBy": "NnG0NXQmIh8QivHWmjBjH"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/energy_discarded_from_creature",
                "amount": 2,
                "attack": true,
                "spell": false,
                "relic": false,
                "source": {
                    "id": "NnG0NXQmIh8QivHWmjBjH"
                },
                "variable": "damageDealt",
                "target": {
                    "id": "H0ZQYRlP9qTI_6Q3QOc4j"
                },
                "generatedBy": "NnG0NXQmIh8QivHWmjBjH"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/defender_deals_damage",
                "source": "H0ZQYRlP9qTI_6Q3QOc4j",
                "target": "NnG0NXQmIh8QivHWmjBjH",
                "amount": 2,
                "generatedBy": "NnG0NXQmIh8QivHWmjBjH"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/deal_damage",
                "source": "H0ZQYRlP9qTI_6Q3QOc4j",
                "target": "NnG0NXQmIh8QivHWmjBjH",
                "amount": 2,
                "generatedBy": "NnG0NXQmIh8QivHWmjBjH"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_energy_from_creature_or_magi",
                "source": "H0ZQYRlP9qTI_6Q3QOc4j",
                "target": "NnG0NXQmIh8QivHWmjBjH",
                "attack": true,
                "amount": 2,
                "generatedBy": "NnG0NXQmIh8QivHWmjBjH"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/energy_discarded_from_creature",
                "amount": 2,
                "attack": true,
                "spell": false,
                "relic": false,
                "source": {
                    "id": "H0ZQYRlP9qTI_6Q3QOc4j"
                },
                "variable": "damageDealt",
                "target": {
                    "id": "NnG0NXQmIh8QivHWmjBjH"
                },
                "generatedBy": "NnG0NXQmIh8QivHWmjBjH"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_defeats_creature",
                "source": "NnG0NXQmIh8QivHWmjBjH",
                "target": "H0ZQYRlP9qTI_6Q3QOc4j",
                "attack": true,
                "generatedBy": "NnG0NXQmIh8QivHWmjBjH"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_creature_from_play",
                "source": {
                    "id": "H0ZQYRlP9qTI_6Q3QOc4j",
                    "owner": 2,
                    "card": "Arboll",
                    "data": {
                        "energy": 0,
                        "controller": 2,
                        "attacked": 1,
                        "actionsUsed": [],
                        "energyLostThisTurn": 3,
                        "defeatedCreature": true,
                        "hasAttacked": true,
                        "wasAttacked": true
                    }
                },
                "target": {
                    "id": "H0ZQYRlP9qTI_6Q3QOc4j",
                    "owner": 2,
                    "card": "Arboll",
                    "data": {
                        "energy": 0,
                        "controller": 2,
                        "attacked": 1,
                        "actionsUsed": [],
                        "energyLostThisTurn": 3,
                        "defeatedCreature": true,
                        "hasAttacked": true,
                        "wasAttacked": true
                    }
                },
                "generatedBy": "NnG0NXQmIh8QivHWmjBjH",
                "player": 0
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "H0ZQYRlP9qTI_6Q3QOc4j",
                    "owner": 2,
                    "card": "Arboll",
                    "data": {
                        "energy": 0,
                        "controller": 2,
                        "attacked": 1,
                        "actionsUsed": [],
                        "energyLostThisTurn": 3,
                        "defeatedCreature": true,
                        "hasAttacked": true,
                        "wasAttacked": true
                    }
                },
                "sourceZone": "zones/in_play",
                "destinationCard": {
                    "id": "JcX7XosJhd0r3xWwKH6dj",
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
                },
                "destinationZone": "zones/discard",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "NnG0NXQmIh8QivHWmjBjH"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_is_defeated",
                "target": "H0ZQYRlP9qTI_6Q3QOc4j",
                "generatedBy": "NnG0NXQmIh8QivHWmjBjH"
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 3
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/play",
                "player": 1,
                "payload": {
                    "card": {
                        "id": "584SJooN47qFVcp-DW-iw",
                        "owner": 1,
                        "card": "Alaban",
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
                    },
                    "player": 1
                },
                "forcePriority": false
            },
            {
                "type": "actions/effect",
                "effectType": "effects/paying_energy_for_creature",
                "from": {
                    "id": "hrzkD8as9z3lBOEDl-inL"
                },
                "amount": 6,
                "player": 1,
                "generatedBy": "584SJooN47qFVcp-DW-iw"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/remove_energy_from_magi",
                "target": {
                    "id": "hrzkD8as9z3lBOEDl-inL",
                    "owner": 1,
                    "card": "Nimbulo",
                    "data": {
                        "energy": 11,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 18,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 6,
                "generatedBy": "584SJooN47qFVcp-DW-iw",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/play_creature",
                "card": {
                    "id": "584SJooN47qFVcp-DW-iw",
                    "owner": 1,
                    "card": "Alaban",
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
                },
                "player": 1,
                "generatedBy": "584SJooN47qFVcp-DW-iw"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "584SJooN47qFVcp-DW-iw",
                    "owner": 1,
                    "card": "Alaban",
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
                },
                "sourceZone": "zones/hand",
                "destinationCard": {
                    "id": "n2UpiRrtPKeByPKTBNIW_",
                    "owner": 1,
                    "card": "Alaban",
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
                },
                "destinationZone": "zones/in_play",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "584SJooN47qFVcp-DW-iw"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "n2UpiRrtPKeByPKTBNIW_"
                },
                "source": false,
                "amount": 6,
                "generatedBy": "584SJooN47qFVcp-DW-iw"
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 4
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 5
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "4ad5Bp3_4QEAcem-II1V2",
                    "owner": 1,
                    "card": "Cloud Narth",
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
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "AsgTiK2xnepyb2OXgPREg",
                    "owner": 1,
                    "card": "Cloud Narth",
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
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "riFb5rKptfyFWVWwtgwTQ"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "8LeY3WRnCTSSg_IGd-6db",
                    "owner": 1,
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
                    }
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "AhrmvPL6qvgD4HaYdv14V",
                    "owner": 1,
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
                    }
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "riFb5rKptfyFWVWwtgwTQ"
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 0
            },
            {
                "type": "actions/effect",
                "effectType": "effects/end_of_turn",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_of_turn",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_magi",
                "source": {
                    "id": "xgavpDsS5iWshBSLA09pe"
                },
                "target": {
                    "id": "xgavpDsS5iWshBSLA09pe"
                },
                "amount": 5
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/play",
                "player": 2,
                "payload": {
                    "card": {
                        "id": "i7YDD6azNSd2ofBm4xL6W",
                        "owner": 2,
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
                        }
                    },
                    "player": 2
                },
                "forcePriority": false
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "i7YDD6azNSd2ofBm4xL6W",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/hand",
                "destinationCard": {
                    "id": "djRkeC9YicpPMbSo3XlS5",
                    "owner": 2,
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
                    }
                },
                "destinationZone": "zones/in_play",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "i7YDD6azNSd2ofBm4xL6W"
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 3
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/play",
                "player": 2,
                "payload": {
                    "card": {
                        "id": "ZXq3hrl78SjDzaXRMHD0r",
                        "owner": 2,
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
                        }
                    },
                    "player": 2
                },
                "forcePriority": false
            },
            {
                "type": "actions/effect",
                "effectType": "effects/paying_energy_for_creature",
                "from": {
                    "id": "xgavpDsS5iWshBSLA09pe"
                },
                "amount": 4,
                "player": 2,
                "generatedBy": "ZXq3hrl78SjDzaXRMHD0r"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/remove_energy_from_magi",
                "target": {
                    "id": "xgavpDsS5iWshBSLA09pe",
                    "owner": 2,
                    "card": "Poad",
                    "data": {
                        "energy": 10,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 18,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 4,
                "generatedBy": "ZXq3hrl78SjDzaXRMHD0r",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/play_creature",
                "card": {
                    "id": "ZXq3hrl78SjDzaXRMHD0r",
                    "owner": 2,
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
                    }
                },
                "player": 2,
                "generatedBy": "ZXq3hrl78SjDzaXRMHD0r"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "ZXq3hrl78SjDzaXRMHD0r",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/hand",
                "destinationCard": {
                    "id": "VlN-3eEC5KfgLLGofwGqu",
                    "owner": 2,
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
                    }
                },
                "destinationZone": "zones/in_play",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "ZXq3hrl78SjDzaXRMHD0r"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "VlN-3eEC5KfgLLGofwGqu"
                },
                "source": false,
                "amount": 4,
                "generatedBy": "ZXq3hrl78SjDzaXRMHD0r"
            },
            {
                "type": "actions/play",
                "player": 2,
                "payload": {
                    "card": {
                        "id": "j_LYSiDxLmw2G-sw3_WvZ",
                        "owner": 2,
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
                        }
                    },
                    "player": 2
                },
                "forcePriority": false
            },
            {
                "type": "actions/effect",
                "effectType": "effects/paying_energy_for_creature",
                "from": {
                    "id": "xgavpDsS5iWshBSLA09pe"
                },
                "amount": 2,
                "player": 2,
                "generatedBy": "j_LYSiDxLmw2G-sw3_WvZ"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/remove_energy_from_magi",
                "target": {
                    "id": "xgavpDsS5iWshBSLA09pe",
                    "owner": 2,
                    "card": "Poad",
                    "data": {
                        "energy": 6,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 22,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 2,
                "generatedBy": "j_LYSiDxLmw2G-sw3_WvZ",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/play_creature",
                "card": {
                    "id": "j_LYSiDxLmw2G-sw3_WvZ",
                    "owner": 2,
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
                    }
                },
                "player": 2,
                "generatedBy": "j_LYSiDxLmw2G-sw3_WvZ"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "j_LYSiDxLmw2G-sw3_WvZ",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/hand",
                "destinationCard": {
                    "id": "wfd-72lSMCaeOjz0LoimZ",
                    "owner": 2,
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
                    }
                },
                "destinationZone": "zones/in_play",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "j_LYSiDxLmw2G-sw3_WvZ"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "wfd-72lSMCaeOjz0LoimZ"
                },
                "source": false,
                "amount": 2,
                "generatedBy": "j_LYSiDxLmw2G-sw3_WvZ"
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 4
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 5
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "6-2q8l6MOVwhMQcop4u8Y",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "s8lrRVzH80QMCkmaB101j",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "PN7uJo5vlqoYNqK1Qa_bw"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "eskBPJ4c7M4i5y01aruzC",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "9rF9NmWyk5WlD09JK5V3w",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "PN7uJo5vlqoYNqK1Qa_bw"
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 0
            },
            {
                "type": "actions/effect",
                "effectType": "effects/end_of_turn",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_of_turn",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_magi",
                "source": {
                    "id": "hrzkD8as9z3lBOEDl-inL"
                },
                "target": {
                    "id": "hrzkD8as9z3lBOEDl-inL"
                },
                "amount": 5
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/play",
                "player": 1,
                "payload": {
                    "card": {
                        "id": "AhrmvPL6qvgD4HaYdv14V",
                        "owner": 1,
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
                        }
                    },
                    "player": 1
                },
                "forcePriority": false
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "AhrmvPL6qvgD4HaYdv14V",
                    "owner": 1,
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
                    }
                },
                "sourceZone": "zones/hand",
                "destinationCard": {
                    "id": "EZFgby-yq99kR8HwZf8cn",
                    "owner": 1,
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
                    }
                },
                "destinationZone": "zones/in_play",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "AhrmvPL6qvgD4HaYdv14V"
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/power",
                "power": "Undream",
                "source": {
                    "id": "n2UpiRrtPKeByPKTBNIW_",
                    "owner": 1,
                    "card": "Alaban",
                    "data": {
                        "energy": 6,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 0,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/paying_energy_for_power",
                "target": {
                    "id": "n2UpiRrtPKeByPKTBNIW_",
                    "owner": 1,
                    "card": "Alaban",
                    "data": {
                        "energy": 6,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [
                            "Undream"
                        ],
                        "energyLostThisTurn": 0,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 5,
                "generatedBy": "n2UpiRrtPKeByPKTBNIW_"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/remove_energy_from_creature",
                "target": {
                    "id": "n2UpiRrtPKeByPKTBNIW_"
                },
                "amount": 5
            },
            {
                "type": "actions/enter_prompt",
                "promptType": "prompt/creature",
                "generatedBy": "n2UpiRrtPKeByPKTBNIW_",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/resolve_prompt",
                "player": 1,
                "targetCard": {
                    "id": "VlN-3eEC5KfgLLGofwGqu",
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
                "target": "VlN-3eEC5KfgLLGofwGqu"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "VlN-3eEC5KfgLLGofwGqu",
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
                "sourceZone": "zones/in_play",
                "destinationCard": {
                    "id": "IMoIsapaTvGuRTTsEzkxz",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "n2UpiRrtPKeByPKTBNIW_"
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/power",
                "power": "Vitalize",
                "source": {
                    "id": "EZFgby-yq99kR8HwZf8cn",
                    "owner": 1,
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
                    }
                },
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/paying_energy_for_power",
                "target": {
                    "id": "hrzkD8as9z3lBOEDl-inL",
                    "owner": 1,
                    "card": "Nimbulo",
                    "data": {
                        "energy": 10,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 24,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 2,
                "generatedBy": "EZFgby-yq99kR8HwZf8cn"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/remove_energy_from_magi",
                "target": {
                    "id": "hrzkD8as9z3lBOEDl-inL",
                    "owner": 1,
                    "card": "Nimbulo",
                    "data": {
                        "energy": 10,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 24,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 2,
                "generatedBy": "EZFgby-yq99kR8HwZf8cn"
            },
            {
                "type": "actions/enter_prompt",
                "promptType": "prompt/creature_filtered",
                "restriction": "restrictions/energy_less_than_starting",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/resolve_prompt",
                "player": 1,
                "targetCard": {
                    "id": "n2UpiRrtPKeByPKTBNIW_",
                    "owner": 1,
                    "card": "Alaban",
                    "data": {
                        "energy": 1,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [
                            "Undream",
                            "Undream"
                        ],
                        "energyLostThisTurn": 5,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "target": "n2UpiRrtPKeByPKTBNIW_"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "EZFgby-yq99kR8HwZf8cn",
                    "owner": 1,
                    "card": "Dream Balm",
                    "data": {
                        "energy": 0,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [
                            "Vitalize",
                            "Vitalize"
                        ],
                        "energyLostThisTurn": 0,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "sourceZone": "zones/in_play",
                "destinationCard": {
                    "id": "vBeaD69wQ24id5FP4Uto9",
                    "owner": 1,
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
                    }
                },
                "destinationZone": "zones/discard",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "EZFgby-yq99kR8HwZf8cn"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "n2UpiRrtPKeByPKTBNIW_"
                },
                "source": {
                    "id": "EZFgby-yq99kR8HwZf8cn"
                },
                "amount": 5,
                "generatedBy": "EZFgby-yq99kR8HwZf8cn",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/attack",
                "source": "n2UpiRrtPKeByPKTBNIW_",
                "target": "-WJMiYA-uuLfNjDTpg_eO",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/attack",
                "source": "n2UpiRrtPKeByPKTBNIW_",
                "target": "-WJMiYA-uuLfNjDTpg_eO",
                "additionalAttackers": [],
                "generatedBy": "n2UpiRrtPKeByPKTBNIW_",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_attacks",
                "source": {
                    "id": "n2UpiRrtPKeByPKTBNIW_"
                },
                "target": {
                    "id": "-WJMiYA-uuLfNjDTpg_eO"
                },
                "sourceAtStart": {
                    "id": "n2UpiRrtPKeByPKTBNIW_"
                },
                "targetAtStart": {
                    "id": "-WJMiYA-uuLfNjDTpg_eO"
                }
            },
            {
                "type": "actions/effect",
                "effectType": "effects/before_damage",
                "source": "n2UpiRrtPKeByPKTBNIW_",
                "target": "-WJMiYA-uuLfNjDTpg_eO",
                "generatedBy": "n2UpiRrtPKeByPKTBNIW_"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/damage_step",
                "source": "n2UpiRrtPKeByPKTBNIW_",
                "target": "-WJMiYA-uuLfNjDTpg_eO",
                "packHuntAttack": false,
                "generatedBy": "n2UpiRrtPKeByPKTBNIW_"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/attacker_deals_damage",
                "source": "n2UpiRrtPKeByPKTBNIW_",
                "target": "-WJMiYA-uuLfNjDTpg_eO",
                "amount": 6,
                "generatedBy": "n2UpiRrtPKeByPKTBNIW_"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/deal_damage",
                "source": "n2UpiRrtPKeByPKTBNIW_",
                "target": "-WJMiYA-uuLfNjDTpg_eO",
                "amount": 6,
                "generatedBy": "n2UpiRrtPKeByPKTBNIW_"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_energy_from_creature_or_magi",
                "source": "n2UpiRrtPKeByPKTBNIW_",
                "target": "-WJMiYA-uuLfNjDTpg_eO",
                "attack": true,
                "amount": 6,
                "generatedBy": "n2UpiRrtPKeByPKTBNIW_"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/energy_discarded_from_creature",
                "amount": 3,
                "attack": true,
                "spell": false,
                "relic": false,
                "source": {
                    "id": "n2UpiRrtPKeByPKTBNIW_"
                },
                "variable": "damageDealt",
                "target": {
                    "id": "-WJMiYA-uuLfNjDTpg_eO"
                },
                "generatedBy": "n2UpiRrtPKeByPKTBNIW_"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/defender_deals_damage",
                "source": "-WJMiYA-uuLfNjDTpg_eO",
                "target": "n2UpiRrtPKeByPKTBNIW_",
                "amount": 3,
                "generatedBy": "n2UpiRrtPKeByPKTBNIW_"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/deal_damage",
                "source": "-WJMiYA-uuLfNjDTpg_eO",
                "target": "n2UpiRrtPKeByPKTBNIW_",
                "amount": 3,
                "generatedBy": "n2UpiRrtPKeByPKTBNIW_"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_energy_from_creature_or_magi",
                "source": "-WJMiYA-uuLfNjDTpg_eO",
                "target": "n2UpiRrtPKeByPKTBNIW_",
                "attack": true,
                "amount": 3,
                "generatedBy": "n2UpiRrtPKeByPKTBNIW_"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/energy_discarded_from_creature",
                "amount": 3,
                "attack": true,
                "spell": false,
                "relic": false,
                "source": {
                    "id": "-WJMiYA-uuLfNjDTpg_eO"
                },
                "variable": "damageDealt",
                "target": {
                    "id": "n2UpiRrtPKeByPKTBNIW_"
                },
                "generatedBy": "n2UpiRrtPKeByPKTBNIW_"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_defeats_creature",
                "source": "n2UpiRrtPKeByPKTBNIW_",
                "target": "-WJMiYA-uuLfNjDTpg_eO",
                "attack": true,
                "generatedBy": "n2UpiRrtPKeByPKTBNIW_"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_creature_from_play",
                "source": {
                    "id": "-WJMiYA-uuLfNjDTpg_eO",
                    "owner": 2,
                    "card": "Leaf Hyren",
                    "data": {
                        "energy": 0,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 3,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": true
                    }
                },
                "target": {
                    "id": "-WJMiYA-uuLfNjDTpg_eO",
                    "owner": 2,
                    "card": "Leaf Hyren",
                    "data": {
                        "energy": 0,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 3,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": true
                    }
                },
                "generatedBy": "n2UpiRrtPKeByPKTBNIW_",
                "player": 0
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "-WJMiYA-uuLfNjDTpg_eO",
                    "owner": 2,
                    "card": "Leaf Hyren",
                    "data": {
                        "energy": 0,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 3,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": true
                    }
                },
                "sourceZone": "zones/in_play",
                "destinationCard": {
                    "id": "-s_ne_NfEd_gERa100M9M",
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
                },
                "destinationZone": "zones/discard",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "n2UpiRrtPKeByPKTBNIW_"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_is_defeated",
                "target": "-WJMiYA-uuLfNjDTpg_eO",
                "generatedBy": "n2UpiRrtPKeByPKTBNIW_"
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 3
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/play",
                "player": 1,
                "payload": {
                    "card": {
                        "id": "f71WpAyLfNP1vVFO_vbTK",
                        "owner": 1,
                        "card": "Xyx Elder",
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
                    },
                    "player": 1
                },
                "forcePriority": false
            },
            {
                "type": "actions/effect",
                "effectType": "effects/paying_energy_for_creature",
                "from": {
                    "id": "hrzkD8as9z3lBOEDl-inL"
                },
                "amount": 6,
                "player": 1,
                "generatedBy": "f71WpAyLfNP1vVFO_vbTK"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/remove_energy_from_magi",
                "target": {
                    "id": "hrzkD8as9z3lBOEDl-inL",
                    "owner": 1,
                    "card": "Nimbulo",
                    "data": {
                        "energy": 8,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 26,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 6,
                "generatedBy": "f71WpAyLfNP1vVFO_vbTK",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/play_creature",
                "card": {
                    "id": "f71WpAyLfNP1vVFO_vbTK",
                    "owner": 1,
                    "card": "Xyx Elder",
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
                },
                "player": 1,
                "generatedBy": "f71WpAyLfNP1vVFO_vbTK"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "f71WpAyLfNP1vVFO_vbTK",
                    "owner": 1,
                    "card": "Xyx Elder",
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
                },
                "sourceZone": "zones/hand",
                "destinationCard": {
                    "id": "UGXpB_Wn30w0ZtghpUQdD",
                    "owner": 1,
                    "card": "Xyx Elder",
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
                },
                "destinationZone": "zones/in_play",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "f71WpAyLfNP1vVFO_vbTK"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "UGXpB_Wn30w0ZtghpUQdD"
                },
                "source": false,
                "amount": 6,
                "generatedBy": "f71WpAyLfNP1vVFO_vbTK"
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/play",
                "player": 1,
                "payload": {
                    "card": {
                        "id": "AsgTiK2xnepyb2OXgPREg",
                        "owner": 1,
                        "card": "Cloud Narth",
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
                    },
                    "player": 1
                },
                "forcePriority": false
            },
            {
                "type": "actions/effect",
                "effectType": "effects/paying_energy_for_creature",
                "from": {
                    "id": "hrzkD8as9z3lBOEDl-inL"
                },
                "amount": 2,
                "player": 1,
                "generatedBy": "AsgTiK2xnepyb2OXgPREg"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/remove_energy_from_magi",
                "target": {
                    "id": "hrzkD8as9z3lBOEDl-inL",
                    "owner": 1,
                    "card": "Nimbulo",
                    "data": {
                        "energy": 2,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 32,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 2,
                "generatedBy": "AsgTiK2xnepyb2OXgPREg",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/play_creature",
                "card": {
                    "id": "AsgTiK2xnepyb2OXgPREg",
                    "owner": 1,
                    "card": "Cloud Narth",
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
                },
                "player": 1,
                "generatedBy": "AsgTiK2xnepyb2OXgPREg"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "AsgTiK2xnepyb2OXgPREg",
                    "owner": 1,
                    "card": "Cloud Narth",
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
                },
                "sourceZone": "zones/hand",
                "destinationCard": {
                    "id": "NTp8SljKmhn3wEMfLcs1b",
                    "owner": 1,
                    "card": "Cloud Narth",
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
                },
                "destinationZone": "zones/in_play",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "AsgTiK2xnepyb2OXgPREg"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "NTp8SljKmhn3wEMfLcs1b"
                },
                "source": false,
                "amount": 2,
                "generatedBy": "AsgTiK2xnepyb2OXgPREg"
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 4
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 5
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "MP1Tdpk0jvx5mn8gpOmfh",
                    "owner": 1,
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
                    }
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "5oXRXhGJ7_L2kiUpPUt4R",
                    "owner": 1,
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
                    }
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "bUAtNUXXpm04_U9k9rWF4"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "6mLx2ZX9iGtrCDLb6geL8",
                    "owner": 1,
                    "card": "Alaban",
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
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "MtE6TgyEpb0tA-bB7SAxV",
                    "owner": 1,
                    "card": "Alaban",
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
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "bUAtNUXXpm04_U9k9rWF4"
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 0
            },
            {
                "type": "actions/effect",
                "effectType": "effects/end_of_turn",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_of_turn",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_magi",
                "source": {
                    "id": "xgavpDsS5iWshBSLA09pe"
                },
                "target": {
                    "id": "xgavpDsS5iWshBSLA09pe"
                },
                "amount": 6
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/play",
                "player": 2,
                "payload": {
                    "card": {
                        "id": "s8lrRVzH80QMCkmaB101j",
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
                    "player": 2
                },
                "forcePriority": false
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "s8lrRVzH80QMCkmaB101j",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/hand",
                "destinationCard": {
                    "id": "I01aQDk9l4aGSYoMIF8OD",
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
                "destinationZone": "zones/in_play",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "s8lrRVzH80QMCkmaB101j"
            },
            {
                "type": "actions/play",
                "player": 2,
                "payload": {
                    "card": {
                        "id": "9rF9NmWyk5WlD09JK5V3w",
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
                    },
                    "player": 2
                },
                "forcePriority": false
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "9rF9NmWyk5WlD09JK5V3w",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/hand",
                "destinationCard": {
                    "id": "eXwUNWCnuI2MuRELfQI15",
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
                },
                "destinationZone": "zones/in_play",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "9rF9NmWyk5WlD09JK5V3w"
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/attack",
                "source": "wfd-72lSMCaeOjz0LoimZ",
                "target": "NnG0NXQmIh8QivHWmjBjH",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/attack",
                "source": "wfd-72lSMCaeOjz0LoimZ",
                "target": "NnG0NXQmIh8QivHWmjBjH",
                "additionalAttackers": [],
                "generatedBy": "wfd-72lSMCaeOjz0LoimZ",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_attacks",
                "source": {
                    "id": "wfd-72lSMCaeOjz0LoimZ"
                },
                "target": {
                    "id": "NnG0NXQmIh8QivHWmjBjH"
                },
                "sourceAtStart": {
                    "id": "wfd-72lSMCaeOjz0LoimZ"
                },
                "targetAtStart": {
                    "id": "NnG0NXQmIh8QivHWmjBjH"
                }
            },
            {
                "type": "actions/effect",
                "effectType": "effects/before_damage",
                "source": "wfd-72lSMCaeOjz0LoimZ",
                "target": "NnG0NXQmIh8QivHWmjBjH",
                "generatedBy": "wfd-72lSMCaeOjz0LoimZ"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/damage_step",
                "source": "wfd-72lSMCaeOjz0LoimZ",
                "target": "NnG0NXQmIh8QivHWmjBjH",
                "packHuntAttack": false,
                "generatedBy": "wfd-72lSMCaeOjz0LoimZ"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/attacker_deals_damage",
                "source": "wfd-72lSMCaeOjz0LoimZ",
                "target": "NnG0NXQmIh8QivHWmjBjH",
                "amount": 2,
                "generatedBy": "wfd-72lSMCaeOjz0LoimZ"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/deal_damage",
                "source": "wfd-72lSMCaeOjz0LoimZ",
                "target": "NnG0NXQmIh8QivHWmjBjH",
                "amount": 2,
                "generatedBy": "wfd-72lSMCaeOjz0LoimZ"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_energy_from_creature_or_magi",
                "source": "wfd-72lSMCaeOjz0LoimZ",
                "target": "NnG0NXQmIh8QivHWmjBjH",
                "attack": true,
                "amount": 2,
                "generatedBy": "wfd-72lSMCaeOjz0LoimZ"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/energy_discarded_from_creature",
                "amount": 1,
                "attack": true,
                "spell": false,
                "relic": false,
                "source": {
                    "id": "wfd-72lSMCaeOjz0LoimZ"
                },
                "variable": "damageDealt",
                "target": {
                    "id": "NnG0NXQmIh8QivHWmjBjH"
                },
                "generatedBy": "wfd-72lSMCaeOjz0LoimZ"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/defender_deals_damage",
                "source": "NnG0NXQmIh8QivHWmjBjH",
                "target": "wfd-72lSMCaeOjz0LoimZ",
                "amount": 1,
                "generatedBy": "wfd-72lSMCaeOjz0LoimZ"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/deal_damage",
                "source": "NnG0NXQmIh8QivHWmjBjH",
                "target": "wfd-72lSMCaeOjz0LoimZ",
                "amount": 1,
                "generatedBy": "wfd-72lSMCaeOjz0LoimZ"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_energy_from_creature_or_magi",
                "source": "NnG0NXQmIh8QivHWmjBjH",
                "target": "wfd-72lSMCaeOjz0LoimZ",
                "attack": true,
                "amount": 1,
                "generatedBy": "wfd-72lSMCaeOjz0LoimZ"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/energy_discarded_from_creature",
                "amount": 1,
                "attack": true,
                "spell": false,
                "relic": false,
                "source": {
                    "id": "NnG0NXQmIh8QivHWmjBjH"
                },
                "variable": "damageDealt",
                "target": {
                    "id": "wfd-72lSMCaeOjz0LoimZ"
                },
                "generatedBy": "wfd-72lSMCaeOjz0LoimZ"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_defeats_creature",
                "source": "wfd-72lSMCaeOjz0LoimZ",
                "target": "NnG0NXQmIh8QivHWmjBjH",
                "attack": true,
                "generatedBy": "wfd-72lSMCaeOjz0LoimZ"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_creature_from_play",
                "source": {
                    "id": "NnG0NXQmIh8QivHWmjBjH",
                    "owner": 1,
                    "card": "Pharan",
                    "data": {
                        "energy": 0,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 1,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": true
                    }
                },
                "target": {
                    "id": "NnG0NXQmIh8QivHWmjBjH",
                    "owner": 1,
                    "card": "Pharan",
                    "data": {
                        "energy": 0,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 1,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": true
                    }
                },
                "generatedBy": "wfd-72lSMCaeOjz0LoimZ",
                "player": 0
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "NnG0NXQmIh8QivHWmjBjH",
                    "owner": 1,
                    "card": "Pharan",
                    "data": {
                        "energy": 0,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 1,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": true
                    }
                },
                "sourceZone": "zones/in_play",
                "destinationCard": {
                    "id": "RId3qaXowYOhiKTkyNDui",
                    "owner": 1,
                    "card": "Pharan",
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
                },
                "destinationZone": "zones/discard",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "wfd-72lSMCaeOjz0LoimZ"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_is_defeated",
                "target": "NnG0NXQmIh8QivHWmjBjH",
                "generatedBy": "wfd-72lSMCaeOjz0LoimZ"
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 3
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/play",
                "player": 2,
                "payload": {
                    "card": {
                        "id": "lidoBRuDozGVkv0qKy7m2",
                        "owner": 2,
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
                        }
                    },
                    "player": 2
                },
                "forcePriority": false
            },
            {
                "type": "actions/effect",
                "effectType": "effects/paying_energy_for_creature",
                "from": {
                    "id": "xgavpDsS5iWshBSLA09pe"
                },
                "amount": 4,
                "player": 2,
                "generatedBy": "lidoBRuDozGVkv0qKy7m2"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/remove_energy_from_magi",
                "target": {
                    "id": "xgavpDsS5iWshBSLA09pe",
                    "owner": 2,
                    "card": "Poad",
                    "data": {
                        "energy": 10,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 24,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 4,
                "generatedBy": "lidoBRuDozGVkv0qKy7m2",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/play_creature",
                "card": {
                    "id": "lidoBRuDozGVkv0qKy7m2",
                    "owner": 2,
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
                    }
                },
                "player": 2,
                "generatedBy": "lidoBRuDozGVkv0qKy7m2"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "lidoBRuDozGVkv0qKy7m2",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/hand",
                "destinationCard": {
                    "id": "zFpXIATUt6AZyH0ZXbjnU",
                    "owner": 2,
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
                    }
                },
                "destinationZone": "zones/in_play",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "lidoBRuDozGVkv0qKy7m2"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "zFpXIATUt6AZyH0ZXbjnU"
                },
                "source": false,
                "amount": 4,
                "generatedBy": "lidoBRuDozGVkv0qKy7m2"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "zFpXIATUt6AZyH0ZXbjnU"
                },
                "source": false,
                "amount": 1,
                "generatedBy": "lidoBRuDozGVkv0qKy7m2",
                "player": 2
            },
            {
                "type": "actions/play",
                "player": 2,
                "payload": {
                    "card": {
                        "id": "IMoIsapaTvGuRTTsEzkxz",
                        "owner": 2,
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
                        }
                    },
                    "player": 2
                },
                "forcePriority": false
            },
            {
                "type": "actions/effect",
                "effectType": "effects/paying_energy_for_creature",
                "from": {
                    "id": "xgavpDsS5iWshBSLA09pe"
                },
                "amount": 4,
                "player": 2,
                "generatedBy": "IMoIsapaTvGuRTTsEzkxz"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/remove_energy_from_magi",
                "target": {
                    "id": "xgavpDsS5iWshBSLA09pe",
                    "owner": 2,
                    "card": "Poad",
                    "data": {
                        "energy": 6,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 28,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 4,
                "generatedBy": "IMoIsapaTvGuRTTsEzkxz",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/play_creature",
                "card": {
                    "id": "IMoIsapaTvGuRTTsEzkxz",
                    "owner": 2,
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
                    }
                },
                "player": 2,
                "generatedBy": "IMoIsapaTvGuRTTsEzkxz"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "IMoIsapaTvGuRTTsEzkxz",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/hand",
                "destinationCard": {
                    "id": "272fEBsxjauHyIFTkN4KD",
                    "owner": 2,
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
                    }
                },
                "destinationZone": "zones/in_play",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "IMoIsapaTvGuRTTsEzkxz"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "272fEBsxjauHyIFTkN4KD"
                },
                "source": false,
                "amount": 4,
                "generatedBy": "IMoIsapaTvGuRTTsEzkxz"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "272fEBsxjauHyIFTkN4KD"
                },
                "source": false,
                "amount": 1,
                "generatedBy": "IMoIsapaTvGuRTTsEzkxz",
                "player": 2
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 4
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 5
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "kGKNe-4Vq6dNy7dSD5s79",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "hs7--Ep7r88CDmTnil5_I",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "9_sD-P3YXmOSXK22N6ZUd"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "qYus82czbOMzYhKDkSO6A",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "Fw-l4hZjXckqeXCzki1iY",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "9_sD-P3YXmOSXK22N6ZUd"
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 0
            },
            {
                "type": "actions/effect",
                "effectType": "effects/end_of_turn",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_of_turn",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_magi",
                "source": {
                    "id": "hrzkD8as9z3lBOEDl-inL"
                },
                "target": {
                    "id": "hrzkD8as9z3lBOEDl-inL"
                },
                "amount": 5
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/play",
                "player": 1,
                "payload": {
                    "card": {
                        "id": "5oXRXhGJ7_L2kiUpPUt4R",
                        "owner": 1,
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
                        }
                    },
                    "player": 1
                },
                "forcePriority": false
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "5oXRXhGJ7_L2kiUpPUt4R",
                    "owner": 1,
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
                    }
                },
                "sourceZone": "zones/hand",
                "destinationCard": {
                    "id": "w4m8d8OrCQ85ZlS_mvQpU",
                    "owner": 1,
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
                    }
                },
                "destinationZone": "zones/in_play",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "5oXRXhGJ7_L2kiUpPUt4R"
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/power",
                "power": "Healing Rain",
                "source": {
                    "id": "NTp8SljKmhn3wEMfLcs1b",
                    "owner": 1,
                    "card": "Cloud Narth",
                    "data": {
                        "energy": 2,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 0,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "player": 1
            },
            {
                "type": "actions/enter_prompt",
                "promptType": "prompt/creature_or_magi",
                "generatedBy": "NTp8SljKmhn3wEMfLcs1b",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/resolve_prompt",
                "player": 1,
                "targetCard": {
                    "id": "UGXpB_Wn30w0ZtghpUQdD",
                    "owner": 1,
                    "card": "Xyx Elder",
                    "data": {
                        "energy": 6,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 0,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "target": "UGXpB_Wn30w0ZtghpUQdD"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/move_energy",
                "target": {
                    "id": "UGXpB_Wn30w0ZtghpUQdD",
                    "owner": 1,
                    "card": "Xyx Elder",
                    "data": {
                        "energy": 6,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 0,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "source": {
                    "id": "NTp8SljKmhn3wEMfLcs1b",
                    "owner": 1,
                    "card": "Cloud Narth",
                    "data": {
                        "energy": 2,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [
                            "Healing Rain",
                            "Healing Rain"
                        ],
                        "energyLostThisTurn": 0,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 2,
                "generatedBy": "NTp8SljKmhn3wEMfLcs1b",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "NTp8SljKmhn3wEMfLcs1b",
                    "owner": 1,
                    "card": "Cloud Narth",
                    "data": {
                        "energy": 0,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [
                            "Healing Rain",
                            "Healing Rain"
                        ],
                        "energyLostThisTurn": 2,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "sourceZone": "zones/in_play",
                "destinationCard": {
                    "id": "07IftCQvN5tTlK-5T6IYB",
                    "owner": 1,
                    "card": "Cloud Narth",
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
                },
                "destinationZone": "zones/discard",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "NTp8SljKmhn3wEMfLcs1b"
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/power",
                "power": "Shockstorm",
                "source": {
                    "id": "UGXpB_Wn30w0ZtghpUQdD",
                    "owner": 1,
                    "card": "Xyx Elder",
                    "data": {
                        "energy": 8,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 0,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/paying_energy_for_power",
                "target": {
                    "id": "UGXpB_Wn30w0ZtghpUQdD",
                    "owner": 1,
                    "card": "Xyx Elder",
                    "data": {
                        "energy": 8,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [
                            "Shockstorm"
                        ],
                        "energyLostThisTurn": 0,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 6,
                "generatedBy": "UGXpB_Wn30w0ZtghpUQdD"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/remove_energy_from_creature",
                "target": {
                    "id": "UGXpB_Wn30w0ZtghpUQdD"
                },
                "amount": 6
            },
            {
                "type": "actions/effect",
                "effectType": "effects/die_rolled",
                "result": 1,
                "generatedBy": "UGXpB_Wn30w0ZtghpUQdD",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/energy_discarded_from_creature",
                "target": {
                    "id": "n2UpiRrtPKeByPKTBNIW_"
                },
                "amount": 1,
                "power": true,
                "source": {
                    "id": "UGXpB_Wn30w0ZtghpUQdD"
                },
                "player": 1,
                "generatedBy": "UGXpB_Wn30w0ZtghpUQdD"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/energy_discarded_from_creature",
                "target": {
                    "id": "wfd-72lSMCaeOjz0LoimZ"
                },
                "amount": 1,
                "power": true,
                "source": {
                    "id": "UGXpB_Wn30w0ZtghpUQdD"
                },
                "player": 1,
                "generatedBy": "UGXpB_Wn30w0ZtghpUQdD"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_creature_from_play",
                "source": {
                    "id": "wfd-72lSMCaeOjz0LoimZ",
                    "owner": 2,
                    "card": "Weebo",
                    "data": {
                        "energy": 0,
                        "controller": 2,
                        "attacked": 1,
                        "actionsUsed": [],
                        "energyLostThisTurn": 2,
                        "defeatedCreature": true,
                        "hasAttacked": true,
                        "wasAttacked": false
                    }
                },
                "target": {
                    "id": "wfd-72lSMCaeOjz0LoimZ",
                    "owner": 2,
                    "card": "Weebo",
                    "data": {
                        "energy": 0,
                        "controller": 2,
                        "attacked": 1,
                        "actionsUsed": [],
                        "energyLostThisTurn": 2,
                        "defeatedCreature": true,
                        "hasAttacked": true,
                        "wasAttacked": false
                    }
                },
                "generatedBy": "UGXpB_Wn30w0ZtghpUQdD",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "wfd-72lSMCaeOjz0LoimZ",
                    "owner": 2,
                    "card": "Weebo",
                    "data": {
                        "energy": 0,
                        "controller": 2,
                        "attacked": 1,
                        "actionsUsed": [],
                        "energyLostThisTurn": 2,
                        "defeatedCreature": true,
                        "hasAttacked": true,
                        "wasAttacked": false
                    }
                },
                "sourceZone": "zones/in_play",
                "destinationCard": {
                    "id": "FR3E0SzTzSUakCj2op9pP",
                    "owner": 2,
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
                    }
                },
                "destinationZone": "zones/discard",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "UGXpB_Wn30w0ZtghpUQdD"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/energy_discarded_from_creature",
                "target": {
                    "id": "zFpXIATUt6AZyH0ZXbjnU"
                },
                "amount": 1,
                "power": true,
                "source": {
                    "id": "UGXpB_Wn30w0ZtghpUQdD"
                },
                "player": 1,
                "generatedBy": "UGXpB_Wn30w0ZtghpUQdD"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/energy_discarded_from_creature",
                "target": {
                    "id": "272fEBsxjauHyIFTkN4KD"
                },
                "amount": 1,
                "power": true,
                "source": {
                    "id": "UGXpB_Wn30w0ZtghpUQdD"
                },
                "player": 1,
                "generatedBy": "UGXpB_Wn30w0ZtghpUQdD"
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 3
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 4
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 5
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "8SqmuRZjj7-nCyp8g9m0N",
                    "owner": 1,
                    "card": "Lovian",
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
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "zP-8NjaZ3BYOTUoOGQbHb",
                    "owner": 1,
                    "card": "Lovian",
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
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "86zIpE4ulSifFM7Q3xQ4v"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "DCowAMGV0ERP4mLkyfZwa",
                    "owner": 1,
                    "card": "Ayebaw",
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
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "WtIY00RlBB3IwfIfDp5u8",
                    "owner": 1,
                    "card": "Ayebaw",
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
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "86zIpE4ulSifFM7Q3xQ4v"
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 0
            },
            {
                "type": "actions/effect",
                "effectType": "effects/end_of_turn",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_of_turn",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_magi",
                "source": {
                    "id": "xgavpDsS5iWshBSLA09pe"
                },
                "target": {
                    "id": "xgavpDsS5iWshBSLA09pe"
                },
                "amount": 6
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/attack",
                "source": "zFpXIATUt6AZyH0ZXbjnU",
                "target": "n2UpiRrtPKeByPKTBNIW_",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/attack",
                "source": "zFpXIATUt6AZyH0ZXbjnU",
                "target": "n2UpiRrtPKeByPKTBNIW_",
                "additionalAttackers": [],
                "generatedBy": "zFpXIATUt6AZyH0ZXbjnU",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_attacks",
                "source": {
                    "id": "zFpXIATUt6AZyH0ZXbjnU"
                },
                "target": {
                    "id": "n2UpiRrtPKeByPKTBNIW_"
                },
                "sourceAtStart": {
                    "id": "zFpXIATUt6AZyH0ZXbjnU"
                },
                "targetAtStart": {
                    "id": "n2UpiRrtPKeByPKTBNIW_"
                }
            },
            {
                "type": "actions/effect",
                "effectType": "effects/before_damage",
                "source": "zFpXIATUt6AZyH0ZXbjnU",
                "target": "n2UpiRrtPKeByPKTBNIW_",
                "generatedBy": "zFpXIATUt6AZyH0ZXbjnU"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/damage_step",
                "source": "zFpXIATUt6AZyH0ZXbjnU",
                "target": "n2UpiRrtPKeByPKTBNIW_",
                "packHuntAttack": false,
                "generatedBy": "zFpXIATUt6AZyH0ZXbjnU"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/attacker_deals_damage",
                "source": "zFpXIATUt6AZyH0ZXbjnU",
                "target": "n2UpiRrtPKeByPKTBNIW_",
                "amount": 4,
                "generatedBy": "zFpXIATUt6AZyH0ZXbjnU"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/deal_damage",
                "source": "zFpXIATUt6AZyH0ZXbjnU",
                "target": "n2UpiRrtPKeByPKTBNIW_",
                "amount": 4,
                "generatedBy": "zFpXIATUt6AZyH0ZXbjnU"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_energy_from_creature_or_magi",
                "source": "zFpXIATUt6AZyH0ZXbjnU",
                "target": "n2UpiRrtPKeByPKTBNIW_",
                "attack": true,
                "amount": 4,
                "generatedBy": "zFpXIATUt6AZyH0ZXbjnU"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/energy_discarded_from_creature",
                "amount": 2,
                "attack": true,
                "spell": false,
                "relic": false,
                "source": {
                    "id": "zFpXIATUt6AZyH0ZXbjnU"
                },
                "variable": "damageDealt",
                "target": {
                    "id": "n2UpiRrtPKeByPKTBNIW_"
                },
                "generatedBy": "zFpXIATUt6AZyH0ZXbjnU"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_defeats_creature",
                "source": "zFpXIATUt6AZyH0ZXbjnU",
                "target": "n2UpiRrtPKeByPKTBNIW_",
                "attack": true,
                "generatedBy": "zFpXIATUt6AZyH0ZXbjnU"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_creature_from_play",
                "source": {
                    "id": "n2UpiRrtPKeByPKTBNIW_",
                    "owner": 1,
                    "card": "Alaban",
                    "data": {
                        "energy": 0,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 3,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": true
                    }
                },
                "target": {
                    "id": "n2UpiRrtPKeByPKTBNIW_",
                    "owner": 1,
                    "card": "Alaban",
                    "data": {
                        "energy": 0,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 3,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": true
                    }
                },
                "generatedBy": "zFpXIATUt6AZyH0ZXbjnU",
                "player": 0
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "n2UpiRrtPKeByPKTBNIW_",
                    "owner": 1,
                    "card": "Alaban",
                    "data": {
                        "energy": 0,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 3,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": true
                    }
                },
                "sourceZone": "zones/in_play",
                "destinationCard": {
                    "id": "fZ1DkTvovb6lqd92O-OB2",
                    "owner": 1,
                    "card": "Alaban",
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
                },
                "destinationZone": "zones/discard",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "zFpXIATUt6AZyH0ZXbjnU"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_is_defeated",
                "target": "n2UpiRrtPKeByPKTBNIW_",
                "generatedBy": "zFpXIATUt6AZyH0ZXbjnU"
            },
            {
                "type": "actions/attack",
                "source": "272fEBsxjauHyIFTkN4KD",
                "target": "UGXpB_Wn30w0ZtghpUQdD",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/attack",
                "source": "272fEBsxjauHyIFTkN4KD",
                "target": "UGXpB_Wn30w0ZtghpUQdD",
                "additionalAttackers": [],
                "generatedBy": "272fEBsxjauHyIFTkN4KD",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_attacks",
                "source": {
                    "id": "272fEBsxjauHyIFTkN4KD"
                },
                "target": {
                    "id": "UGXpB_Wn30w0ZtghpUQdD"
                },
                "sourceAtStart": {
                    "id": "272fEBsxjauHyIFTkN4KD"
                },
                "targetAtStart": {
                    "id": "UGXpB_Wn30w0ZtghpUQdD"
                }
            },
            {
                "type": "actions/effect",
                "effectType": "effects/before_damage",
                "source": "272fEBsxjauHyIFTkN4KD",
                "target": "UGXpB_Wn30w0ZtghpUQdD",
                "generatedBy": "272fEBsxjauHyIFTkN4KD"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/damage_step",
                "source": "272fEBsxjauHyIFTkN4KD",
                "target": "UGXpB_Wn30w0ZtghpUQdD",
                "packHuntAttack": false,
                "generatedBy": "272fEBsxjauHyIFTkN4KD"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/attacker_deals_damage",
                "source": "272fEBsxjauHyIFTkN4KD",
                "target": "UGXpB_Wn30w0ZtghpUQdD",
                "amount": 4,
                "generatedBy": "272fEBsxjauHyIFTkN4KD"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/deal_damage",
                "source": "272fEBsxjauHyIFTkN4KD",
                "target": "UGXpB_Wn30w0ZtghpUQdD",
                "amount": 4,
                "generatedBy": "272fEBsxjauHyIFTkN4KD"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_energy_from_creature_or_magi",
                "source": "272fEBsxjauHyIFTkN4KD",
                "target": "UGXpB_Wn30w0ZtghpUQdD",
                "attack": true,
                "amount": 4,
                "generatedBy": "272fEBsxjauHyIFTkN4KD"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/energy_discarded_from_creature",
                "amount": 2,
                "attack": true,
                "spell": false,
                "relic": false,
                "source": {
                    "id": "272fEBsxjauHyIFTkN4KD"
                },
                "variable": "damageDealt",
                "target": {
                    "id": "UGXpB_Wn30w0ZtghpUQdD"
                },
                "generatedBy": "272fEBsxjauHyIFTkN4KD"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_defeats_creature",
                "source": "272fEBsxjauHyIFTkN4KD",
                "target": "UGXpB_Wn30w0ZtghpUQdD",
                "attack": true,
                "generatedBy": "272fEBsxjauHyIFTkN4KD"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_creature_from_play",
                "source": {
                    "id": "UGXpB_Wn30w0ZtghpUQdD",
                    "owner": 1,
                    "card": "Xyx Elder",
                    "data": {
                        "energy": 0,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [
                            "Shockstorm",
                            "Shockstorm"
                        ],
                        "energyLostThisTurn": 8,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": true
                    }
                },
                "target": {
                    "id": "UGXpB_Wn30w0ZtghpUQdD",
                    "owner": 1,
                    "card": "Xyx Elder",
                    "data": {
                        "energy": 0,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [
                            "Shockstorm",
                            "Shockstorm"
                        ],
                        "energyLostThisTurn": 8,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": true
                    }
                },
                "generatedBy": "272fEBsxjauHyIFTkN4KD",
                "player": 0
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "UGXpB_Wn30w0ZtghpUQdD",
                    "owner": 1,
                    "card": "Xyx Elder",
                    "data": {
                        "energy": 0,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [
                            "Shockstorm",
                            "Shockstorm"
                        ],
                        "energyLostThisTurn": 8,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": true
                    }
                },
                "sourceZone": "zones/in_play",
                "destinationCard": {
                    "id": "1KTtlyQJx0oMJlvLxkiQT",
                    "owner": 1,
                    "card": "Xyx Elder",
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
                },
                "destinationZone": "zones/discard",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "272fEBsxjauHyIFTkN4KD"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_is_defeated",
                "target": "UGXpB_Wn30w0ZtghpUQdD",
                "generatedBy": "272fEBsxjauHyIFTkN4KD"
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 3
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/play",
                "player": 2,
                "payload": {
                    "card": {
                        "id": "ytD2T1zD53sO6qD6LIiqB",
                        "owner": 2,
                        "card": "Giant Carillion",
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
                    "player": 2
                },
                "forcePriority": false
            },
            {
                "type": "actions/effect",
                "effectType": "effects/paying_energy_for_creature",
                "from": {
                    "id": "xgavpDsS5iWshBSLA09pe"
                },
                "amount": 8,
                "player": 2,
                "generatedBy": "ytD2T1zD53sO6qD6LIiqB"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/remove_energy_from_magi",
                "target": {
                    "id": "xgavpDsS5iWshBSLA09pe",
                    "owner": 2,
                    "card": "Poad",
                    "data": {
                        "energy": 8,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 32,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 8,
                "generatedBy": "ytD2T1zD53sO6qD6LIiqB",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/play_creature",
                "card": {
                    "id": "ytD2T1zD53sO6qD6LIiqB",
                    "owner": 2,
                    "card": "Giant Carillion",
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
                "player": 2,
                "generatedBy": "ytD2T1zD53sO6qD6LIiqB"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "ytD2T1zD53sO6qD6LIiqB",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/hand",
                "destinationCard": {
                    "id": "HF7SYbuGvytIlVJ5YaPzJ",
                    "owner": 2,
                    "card": "Giant Carillion",
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
                "destinationZone": "zones/in_play",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "ytD2T1zD53sO6qD6LIiqB"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "HF7SYbuGvytIlVJ5YaPzJ"
                },
                "source": false,
                "amount": 8,
                "generatedBy": "ytD2T1zD53sO6qD6LIiqB"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "HF7SYbuGvytIlVJ5YaPzJ"
                },
                "source": false,
                "amount": 1,
                "generatedBy": "ytD2T1zD53sO6qD6LIiqB",
                "player": 2
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 4
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 5
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "hZc0quVPEWqD5GlDg6YO1",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "STII7oY410ryqlavt98f6",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "VOPZp3kgfzIRTtVzMKxpY"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "1ul33aKpWCCqrCWUW5-uW",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "7IaAG--_UelTLtaBZ_nPL",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "VOPZp3kgfzIRTtVzMKxpY"
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 0
            },
            {
                "type": "actions/effect",
                "effectType": "effects/end_of_turn",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_of_turn",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_magi",
                "source": {
                    "id": "hrzkD8as9z3lBOEDl-inL"
                },
                "target": {
                    "id": "hrzkD8as9z3lBOEDl-inL"
                },
                "amount": 6
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 3
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/play",
                "player": 1,
                "payload": {
                    "card": {
                        "id": "MtE6TgyEpb0tA-bB7SAxV",
                        "owner": 1,
                        "card": "Alaban",
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
                    },
                    "player": 1
                },
                "forcePriority": false
            },
            {
                "type": "actions/effect",
                "effectType": "effects/paying_energy_for_creature",
                "from": {
                    "id": "hrzkD8as9z3lBOEDl-inL"
                },
                "amount": 6,
                "player": 1,
                "generatedBy": "MtE6TgyEpb0tA-bB7SAxV"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/remove_energy_from_magi",
                "target": {
                    "id": "hrzkD8as9z3lBOEDl-inL",
                    "owner": 1,
                    "card": "Nimbulo",
                    "data": {
                        "energy": 11,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 34,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 6,
                "generatedBy": "MtE6TgyEpb0tA-bB7SAxV",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/play_creature",
                "card": {
                    "id": "MtE6TgyEpb0tA-bB7SAxV",
                    "owner": 1,
                    "card": "Alaban",
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
                },
                "player": 1,
                "generatedBy": "MtE6TgyEpb0tA-bB7SAxV"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "MtE6TgyEpb0tA-bB7SAxV",
                    "owner": 1,
                    "card": "Alaban",
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
                },
                "sourceZone": "zones/hand",
                "destinationCard": {
                    "id": "aFHOfZ74kH2qYgGQ8t6FG",
                    "owner": 1,
                    "card": "Alaban",
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
                },
                "destinationZone": "zones/in_play",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "MtE6TgyEpb0tA-bB7SAxV"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "aFHOfZ74kH2qYgGQ8t6FG"
                },
                "source": false,
                "amount": 6,
                "generatedBy": "MtE6TgyEpb0tA-bB7SAxV"
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/play",
                "player": 1,
                "payload": {
                    "card": {
                        "id": "zP-8NjaZ3BYOTUoOGQbHb",
                        "owner": 1,
                        "card": "Lovian",
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
                    },
                    "player": 1
                },
                "forcePriority": false
            },
            {
                "type": "actions/effect",
                "effectType": "effects/paying_energy_for_creature",
                "from": {
                    "id": "hrzkD8as9z3lBOEDl-inL"
                },
                "amount": 4,
                "player": 1,
                "generatedBy": "zP-8NjaZ3BYOTUoOGQbHb"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/remove_energy_from_magi",
                "target": {
                    "id": "hrzkD8as9z3lBOEDl-inL",
                    "owner": 1,
                    "card": "Nimbulo",
                    "data": {
                        "energy": 5,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 40,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 4,
                "generatedBy": "zP-8NjaZ3BYOTUoOGQbHb",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/play_creature",
                "card": {
                    "id": "zP-8NjaZ3BYOTUoOGQbHb",
                    "owner": 1,
                    "card": "Lovian",
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
                },
                "player": 1,
                "generatedBy": "zP-8NjaZ3BYOTUoOGQbHb"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "zP-8NjaZ3BYOTUoOGQbHb",
                    "owner": 1,
                    "card": "Lovian",
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
                },
                "sourceZone": "zones/hand",
                "destinationCard": {
                    "id": "U27OElMQQ67mLjagBsTX7",
                    "owner": 1,
                    "card": "Lovian",
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
                },
                "destinationZone": "zones/in_play",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "zP-8NjaZ3BYOTUoOGQbHb"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "U27OElMQQ67mLjagBsTX7"
                },
                "source": false,
                "amount": 4,
                "generatedBy": "zP-8NjaZ3BYOTUoOGQbHb"
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 4
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 5
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "vU13ornVRFelfPQRcPaQi",
                    "owner": 1,
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
                    }
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "xkYlAtWDLzB035tkr0562",
                    "owner": 1,
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
                    }
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "wnqGp2l-MiJSAlJbS8EkD"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "z8-96fu_liVec7JvnK23b",
                    "owner": 1,
                    "card": "Cloud Narth",
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
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "ER4eQ8R1iAp_JP7E8ETZb",
                    "owner": 1,
                    "card": "Cloud Narth",
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
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "wnqGp2l-MiJSAlJbS8EkD"
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 0
            },
            {
                "type": "actions/effect",
                "effectType": "effects/end_of_turn",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_of_turn",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_magi",
                "source": {
                    "id": "xgavpDsS5iWshBSLA09pe"
                },
                "target": {
                    "id": "xgavpDsS5iWshBSLA09pe"
                },
                "amount": 6
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/attack",
                "source": "zFpXIATUt6AZyH0ZXbjnU",
                "target": "U27OElMQQ67mLjagBsTX7",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/attack",
                "source": "zFpXIATUt6AZyH0ZXbjnU",
                "target": "U27OElMQQ67mLjagBsTX7",
                "additionalAttackers": [],
                "generatedBy": "zFpXIATUt6AZyH0ZXbjnU",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_attacks",
                "source": {
                    "id": "zFpXIATUt6AZyH0ZXbjnU"
                },
                "target": {
                    "id": "U27OElMQQ67mLjagBsTX7"
                },
                "sourceAtStart": {
                    "id": "zFpXIATUt6AZyH0ZXbjnU"
                },
                "targetAtStart": {
                    "id": "U27OElMQQ67mLjagBsTX7"
                }
            },
            {
                "type": "actions/effect",
                "effectType": "effects/before_damage",
                "source": "zFpXIATUt6AZyH0ZXbjnU",
                "target": "U27OElMQQ67mLjagBsTX7",
                "generatedBy": "zFpXIATUt6AZyH0ZXbjnU"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/damage_step",
                "source": "zFpXIATUt6AZyH0ZXbjnU",
                "target": "U27OElMQQ67mLjagBsTX7",
                "packHuntAttack": false,
                "generatedBy": "zFpXIATUt6AZyH0ZXbjnU"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/attacker_deals_damage",
                "source": "zFpXIATUt6AZyH0ZXbjnU",
                "target": "U27OElMQQ67mLjagBsTX7",
                "amount": 4,
                "generatedBy": "zFpXIATUt6AZyH0ZXbjnU"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/deal_damage",
                "source": "zFpXIATUt6AZyH0ZXbjnU",
                "target": "U27OElMQQ67mLjagBsTX7",
                "amount": 4,
                "generatedBy": "zFpXIATUt6AZyH0ZXbjnU"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_energy_from_creature_or_magi",
                "source": "zFpXIATUt6AZyH0ZXbjnU",
                "target": "U27OElMQQ67mLjagBsTX7",
                "attack": true,
                "amount": 4,
                "generatedBy": "zFpXIATUt6AZyH0ZXbjnU"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/energy_discarded_from_creature",
                "amount": 4,
                "attack": true,
                "spell": false,
                "relic": false,
                "source": {
                    "id": "zFpXIATUt6AZyH0ZXbjnU"
                },
                "variable": "damageDealt",
                "target": {
                    "id": "U27OElMQQ67mLjagBsTX7"
                },
                "generatedBy": "zFpXIATUt6AZyH0ZXbjnU"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/defender_deals_damage",
                "source": "U27OElMQQ67mLjagBsTX7",
                "target": "zFpXIATUt6AZyH0ZXbjnU",
                "amount": 4,
                "generatedBy": "zFpXIATUt6AZyH0ZXbjnU"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/deal_damage",
                "source": "U27OElMQQ67mLjagBsTX7",
                "target": "zFpXIATUt6AZyH0ZXbjnU",
                "amount": 4,
                "generatedBy": "zFpXIATUt6AZyH0ZXbjnU"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_energy_from_creature_or_magi",
                "source": "U27OElMQQ67mLjagBsTX7",
                "target": "zFpXIATUt6AZyH0ZXbjnU",
                "attack": true,
                "amount": 4,
                "generatedBy": "zFpXIATUt6AZyH0ZXbjnU"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/energy_discarded_from_creature",
                "amount": 4,
                "attack": true,
                "spell": false,
                "relic": false,
                "source": {
                    "id": "U27OElMQQ67mLjagBsTX7"
                },
                "variable": "damageDealt",
                "target": {
                    "id": "zFpXIATUt6AZyH0ZXbjnU"
                },
                "generatedBy": "zFpXIATUt6AZyH0ZXbjnU"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_defeats_creature",
                "source": "zFpXIATUt6AZyH0ZXbjnU",
                "target": "U27OElMQQ67mLjagBsTX7",
                "attack": true,
                "generatedBy": "zFpXIATUt6AZyH0ZXbjnU"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_creature_from_play",
                "source": {
                    "id": "U27OElMQQ67mLjagBsTX7",
                    "owner": 1,
                    "card": "Lovian",
                    "data": {
                        "energy": 0,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 4,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": true
                    }
                },
                "target": {
                    "id": "U27OElMQQ67mLjagBsTX7",
                    "owner": 1,
                    "card": "Lovian",
                    "data": {
                        "energy": 0,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 4,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": true
                    }
                },
                "generatedBy": "zFpXIATUt6AZyH0ZXbjnU",
                "player": 0
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "U27OElMQQ67mLjagBsTX7",
                    "owner": 1,
                    "card": "Lovian",
                    "data": {
                        "energy": 0,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 4,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": true
                    }
                },
                "sourceZone": "zones/in_play",
                "destinationCard": {
                    "id": "EqaHgp3OFw56AY_yXKiZr",
                    "owner": 1,
                    "card": "Lovian",
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
                },
                "destinationZone": "zones/discard",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "zFpXIATUt6AZyH0ZXbjnU"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_is_defeated",
                "target": "U27OElMQQ67mLjagBsTX7",
                "generatedBy": "zFpXIATUt6AZyH0ZXbjnU"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "zFpXIATUt6AZyH0ZXbjnU",
                    "owner": 2,
                    "card": "Carillion",
                    "data": {
                        "energy": 0,
                        "controller": 2,
                        "attacked": 1,
                        "actionsUsed": [],
                        "energyLostThisTurn": 4,
                        "defeatedCreature": true,
                        "hasAttacked": true,
                        "wasAttacked": false
                    }
                },
                "sourceZone": "zones/in_play",
                "destinationCard": {
                    "id": "wkVHgzVTGAPm12oGB2yiG",
                    "owner": 2,
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
                    }
                },
                "destinationZone": "zones/discard",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "zFpXIATUt6AZyH0ZXbjnU"
            },
            {
                "type": "actions/attack",
                "source": "HF7SYbuGvytIlVJ5YaPzJ",
                "target": "aFHOfZ74kH2qYgGQ8t6FG",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/attack",
                "source": "HF7SYbuGvytIlVJ5YaPzJ",
                "target": "aFHOfZ74kH2qYgGQ8t6FG",
                "additionalAttackers": [],
                "generatedBy": "HF7SYbuGvytIlVJ5YaPzJ",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_attacks",
                "source": {
                    "id": "HF7SYbuGvytIlVJ5YaPzJ"
                },
                "target": {
                    "id": "aFHOfZ74kH2qYgGQ8t6FG"
                },
                "sourceAtStart": {
                    "id": "HF7SYbuGvytIlVJ5YaPzJ"
                },
                "targetAtStart": {
                    "id": "aFHOfZ74kH2qYgGQ8t6FG"
                }
            },
            {
                "type": "actions/effect",
                "effectType": "effects/before_damage",
                "source": "HF7SYbuGvytIlVJ5YaPzJ",
                "target": "aFHOfZ74kH2qYgGQ8t6FG",
                "generatedBy": "HF7SYbuGvytIlVJ5YaPzJ"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/damage_step",
                "source": "HF7SYbuGvytIlVJ5YaPzJ",
                "target": "aFHOfZ74kH2qYgGQ8t6FG",
                "packHuntAttack": false,
                "generatedBy": "HF7SYbuGvytIlVJ5YaPzJ"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/attacker_deals_damage",
                "source": "HF7SYbuGvytIlVJ5YaPzJ",
                "target": "aFHOfZ74kH2qYgGQ8t6FG",
                "amount": 9,
                "generatedBy": "HF7SYbuGvytIlVJ5YaPzJ"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/deal_damage",
                "source": "HF7SYbuGvytIlVJ5YaPzJ",
                "target": "aFHOfZ74kH2qYgGQ8t6FG",
                "amount": 9,
                "generatedBy": "HF7SYbuGvytIlVJ5YaPzJ"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_energy_from_creature_or_magi",
                "source": "HF7SYbuGvytIlVJ5YaPzJ",
                "target": "aFHOfZ74kH2qYgGQ8t6FG",
                "attack": true,
                "amount": 9,
                "generatedBy": "HF7SYbuGvytIlVJ5YaPzJ"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/energy_discarded_from_creature",
                "amount": 6,
                "attack": true,
                "spell": false,
                "relic": false,
                "source": {
                    "id": "HF7SYbuGvytIlVJ5YaPzJ"
                },
                "variable": "damageDealt",
                "target": {
                    "id": "aFHOfZ74kH2qYgGQ8t6FG"
                },
                "generatedBy": "HF7SYbuGvytIlVJ5YaPzJ"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/defender_deals_damage",
                "source": "aFHOfZ74kH2qYgGQ8t6FG",
                "target": "HF7SYbuGvytIlVJ5YaPzJ",
                "amount": 6,
                "generatedBy": "HF7SYbuGvytIlVJ5YaPzJ"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/deal_damage",
                "source": "aFHOfZ74kH2qYgGQ8t6FG",
                "target": "HF7SYbuGvytIlVJ5YaPzJ",
                "amount": 6,
                "generatedBy": "HF7SYbuGvytIlVJ5YaPzJ"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_energy_from_creature_or_magi",
                "source": "aFHOfZ74kH2qYgGQ8t6FG",
                "target": "HF7SYbuGvytIlVJ5YaPzJ",
                "attack": true,
                "amount": 6,
                "generatedBy": "HF7SYbuGvytIlVJ5YaPzJ"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/energy_discarded_from_creature",
                "amount": 6,
                "attack": true,
                "spell": false,
                "relic": false,
                "source": {
                    "id": "aFHOfZ74kH2qYgGQ8t6FG"
                },
                "variable": "damageDealt",
                "target": {
                    "id": "HF7SYbuGvytIlVJ5YaPzJ"
                },
                "generatedBy": "HF7SYbuGvytIlVJ5YaPzJ"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_defeats_creature",
                "source": "HF7SYbuGvytIlVJ5YaPzJ",
                "target": "aFHOfZ74kH2qYgGQ8t6FG",
                "attack": true,
                "generatedBy": "HF7SYbuGvytIlVJ5YaPzJ"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_creature_from_play",
                "source": {
                    "id": "aFHOfZ74kH2qYgGQ8t6FG",
                    "owner": 1,
                    "card": "Alaban",
                    "data": {
                        "energy": 0,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 6,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": true
                    }
                },
                "target": {
                    "id": "aFHOfZ74kH2qYgGQ8t6FG",
                    "owner": 1,
                    "card": "Alaban",
                    "data": {
                        "energy": 0,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 6,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": true
                    }
                },
                "generatedBy": "HF7SYbuGvytIlVJ5YaPzJ",
                "player": 0
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "aFHOfZ74kH2qYgGQ8t6FG",
                    "owner": 1,
                    "card": "Alaban",
                    "data": {
                        "energy": 0,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 6,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": true
                    }
                },
                "sourceZone": "zones/in_play",
                "destinationCard": {
                    "id": "2B4ueRbNUfVkh7hm2lkBG",
                    "owner": 1,
                    "card": "Alaban",
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
                },
                "destinationZone": "zones/discard",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "HF7SYbuGvytIlVJ5YaPzJ"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_is_defeated",
                "target": "aFHOfZ74kH2qYgGQ8t6FG",
                "generatedBy": "HF7SYbuGvytIlVJ5YaPzJ"
            },
            {
                "type": "actions/attack",
                "source": "272fEBsxjauHyIFTkN4KD",
                "target": "hrzkD8as9z3lBOEDl-inL",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/attack",
                "source": "272fEBsxjauHyIFTkN4KD",
                "target": "hrzkD8as9z3lBOEDl-inL",
                "additionalAttackers": [],
                "generatedBy": "272fEBsxjauHyIFTkN4KD",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_attacks",
                "source": {
                    "id": "272fEBsxjauHyIFTkN4KD"
                },
                "target": {
                    "id": "hrzkD8as9z3lBOEDl-inL"
                },
                "sourceAtStart": {
                    "id": "272fEBsxjauHyIFTkN4KD"
                },
                "targetAtStart": {
                    "id": "hrzkD8as9z3lBOEDl-inL"
                }
            },
            {
                "type": "actions/effect",
                "effectType": "effects/before_damage",
                "source": "272fEBsxjauHyIFTkN4KD",
                "target": "hrzkD8as9z3lBOEDl-inL",
                "generatedBy": "272fEBsxjauHyIFTkN4KD"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/damage_step",
                "source": "272fEBsxjauHyIFTkN4KD",
                "target": "hrzkD8as9z3lBOEDl-inL",
                "packHuntAttack": false,
                "generatedBy": "272fEBsxjauHyIFTkN4KD"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/attacker_deals_damage",
                "source": "272fEBsxjauHyIFTkN4KD",
                "target": "hrzkD8as9z3lBOEDl-inL",
                "amount": 4,
                "generatedBy": "272fEBsxjauHyIFTkN4KD"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/deal_damage",
                "source": "272fEBsxjauHyIFTkN4KD",
                "target": "hrzkD8as9z3lBOEDl-inL",
                "amount": 4,
                "generatedBy": "272fEBsxjauHyIFTkN4KD"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_energy_from_creature_or_magi",
                "source": "272fEBsxjauHyIFTkN4KD",
                "target": "hrzkD8as9z3lBOEDl-inL",
                "attack": true,
                "amount": 4,
                "generatedBy": "272fEBsxjauHyIFTkN4KD"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/energy_discarded_from_magi",
                "target": {
                    "id": "hrzkD8as9z3lBOEDl-inL"
                },
                "source": {
                    "id": "272fEBsxjauHyIFTkN4KD"
                },
                "amount": 1,
                "generatedBy": "272fEBsxjauHyIFTkN4KD"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/magi_is_defeated",
                "target": {
                    "id": "hrzkD8as9z3lBOEDl-inL",
                    "owner": 1,
                    "card": "Nimbulo",
                    "data": {
                        "energy": 0,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 45,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": true
                    }
                },
                "generatedBy": "thegame"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "hrzkD8as9z3lBOEDl-inL",
                    "owner": 1,
                    "card": "Nimbulo",
                    "data": {
                        "energy": 0,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 45,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": true
                    }
                },
                "sourceZone": "zones/active_magi",
                "destinationCard": {
                    "id": "368Kn0nGHRyBp0VhEx-5s",
                    "owner": 1,
                    "card": "Nimbulo",
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
                },
                "destinationZone": "zones/defeated_magi",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "thegame"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "w4m8d8OrCQ85ZlS_mvQpU",
                    "owner": 1,
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
                    }
                },
                "sourceZone": "zones/in_play",
                "destinationCard": {
                    "id": "OEb5TBGhZkuNJXgSisiOU",
                    "owner": 1,
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
                    }
                },
                "destinationZone": "zones/discard",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "thegame"
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 3
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/play",
                "player": 2,
                "payload": {
                    "card": {
                        "id": "hs7--Ep7r88CDmTnil5_I",
                        "owner": 2,
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
                        }
                    },
                    "player": 2
                },
                "forcePriority": false
            },
            {
                "type": "actions/effect",
                "effectType": "effects/paying_energy_for_creature",
                "from": {
                    "id": "xgavpDsS5iWshBSLA09pe"
                },
                "amount": 1,
                "player": 2,
                "generatedBy": "hs7--Ep7r88CDmTnil5_I"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/remove_energy_from_magi",
                "target": {
                    "id": "xgavpDsS5iWshBSLA09pe",
                    "owner": 2,
                    "card": "Poad",
                    "data": {
                        "energy": 6,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 40,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 1,
                "generatedBy": "hs7--Ep7r88CDmTnil5_I",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/play_creature",
                "card": {
                    "id": "hs7--Ep7r88CDmTnil5_I",
                    "owner": 2,
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
                    }
                },
                "player": 2,
                "generatedBy": "hs7--Ep7r88CDmTnil5_I"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "hs7--Ep7r88CDmTnil5_I",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/hand",
                "destinationCard": {
                    "id": "vnQPCog7BMcilhsqqk76L",
                    "owner": 2,
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
                    }
                },
                "destinationZone": "zones/in_play",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "hs7--Ep7r88CDmTnil5_I"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "vnQPCog7BMcilhsqqk76L"
                },
                "source": false,
                "amount": 1,
                "generatedBy": "hs7--Ep7r88CDmTnil5_I"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "vnQPCog7BMcilhsqqk76L"
                },
                "source": false,
                "amount": 1,
                "generatedBy": "hs7--Ep7r88CDmTnil5_I",
                "player": 2
            },
            {
                "type": "actions/play",
                "player": 2,
                "payload": {
                    "card": {
                        "id": "Fw-l4hZjXckqeXCzki1iY",
                        "owner": 2,
                        "card": "Bhatar",
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
                    "player": 2
                },
                "forcePriority": false
            },
            {
                "type": "actions/effect",
                "effectType": "effects/paying_energy_for_creature",
                "from": {
                    "id": "xgavpDsS5iWshBSLA09pe"
                },
                "amount": 5,
                "player": 2,
                "generatedBy": "Fw-l4hZjXckqeXCzki1iY"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/remove_energy_from_magi",
                "target": {
                    "id": "xgavpDsS5iWshBSLA09pe",
                    "owner": 2,
                    "card": "Poad",
                    "data": {
                        "energy": 5,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 41,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 5,
                "generatedBy": "Fw-l4hZjXckqeXCzki1iY",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/play_creature",
                "card": {
                    "id": "Fw-l4hZjXckqeXCzki1iY",
                    "owner": 2,
                    "card": "Bhatar",
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
                "player": 2,
                "generatedBy": "Fw-l4hZjXckqeXCzki1iY"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "Fw-l4hZjXckqeXCzki1iY",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/hand",
                "destinationCard": {
                    "id": "GNGDtvLHRyJQfsHVf6tz9",
                    "owner": 2,
                    "card": "Bhatar",
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
                "destinationZone": "zones/in_play",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "Fw-l4hZjXckqeXCzki1iY"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "GNGDtvLHRyJQfsHVf6tz9"
                },
                "source": false,
                "amount": 5,
                "generatedBy": "Fw-l4hZjXckqeXCzki1iY"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "GNGDtvLHRyJQfsHVf6tz9"
                },
                "source": false,
                "amount": 1,
                "generatedBy": "Fw-l4hZjXckqeXCzki1iY",
                "player": 2
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 4
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 5
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "CTsaimbMbDrYQncML_pTN",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "bRaBiAhRzGhJAUGvPm6CN",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "zgPVHtFXQHGShILWTQVXQ"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "T-dDMr3POe7480Pf7qPJs",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "MAcV3GpnRuEatQn6wgMG0",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "zgPVHtFXQHGShILWTQVXQ"
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 0
            },
            {
                "type": "actions/effect",
                "effectType": "effects/end_of_turn",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_of_turn",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "MZD4bW-sJ4dwauvrVjUmy",
                    "owner": 1,
                    "card": "Ora",
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
                },
                "sourceZone": "zones/magi_pile",
                "destinationCard": {
                    "id": "hWMPXqay5rju-XAsUqL1T",
                    "owner": 1,
                    "card": "Ora",
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
                },
                "destinationZone": "zones/active_magi",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "RuIRgqcV3uJnFdY80JGDd"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_magi",
                "source": {
                    "id": "hWMPXqay5rju-XAsUqL1T"
                },
                "target": {
                    "id": "hWMPXqay5rju-XAsUqL1T"
                },
                "amount": 12
            },
            {
                "type": "actions/enter_prompt",
                "promptType": "prompt/choose_cards",
                "promptParams": {
                    "availableCards": [
                        "Xyx Elder"
                    ],
                    "startingCards": [
                        "Xyx Elder",
                        "Xyx Minor",
                        "Shooting Star"
                    ]
                },
                "generatedBy": "RuIRgqcV3uJnFdY80JGDd",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/resolve_prompt",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "1KTtlyQJx0oMJlvLxkiQT",
                    "owner": 1,
                    "card": "Xyx Elder",
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
                },
                "sourceZone": "zones/discard",
                "destinationCard": {
                    "id": "qWp9plz8NbRGEXovxsrWi",
                    "owner": 1,
                    "card": "Xyx Elder",
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
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "RuIRgqcV3uJnFdY80JGDd"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_magi",
                "source": {
                    "id": "hWMPXqay5rju-XAsUqL1T"
                },
                "target": {
                    "id": "hWMPXqay5rju-XAsUqL1T"
                },
                "amount": 5
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/play",
                "player": 1,
                "payload": {
                    "card": {
                        "id": "xkYlAtWDLzB035tkr0562",
                        "owner": 1,
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
                        }
                    },
                    "player": 1
                },
                "forcePriority": false
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "xkYlAtWDLzB035tkr0562",
                    "owner": 1,
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
                    }
                },
                "sourceZone": "zones/hand",
                "destinationCard": {
                    "id": "_4O29p60SG9DBWE3xCE_O",
                    "owner": 1,
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
                    }
                },
                "destinationZone": "zones/in_play",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "xkYlAtWDLzB035tkr0562"
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 3
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/play",
                "player": 1,
                "payload": {
                    "card": {
                        "id": "qWp9plz8NbRGEXovxsrWi",
                        "owner": 1,
                        "card": "Xyx Elder",
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
                    },
                    "player": 1
                },
                "forcePriority": false
            },
            {
                "type": "actions/effect",
                "effectType": "effects/paying_energy_for_creature",
                "from": {
                    "id": "hWMPXqay5rju-XAsUqL1T"
                },
                "amount": 6,
                "player": 1,
                "generatedBy": "qWp9plz8NbRGEXovxsrWi"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/remove_energy_from_magi",
                "target": {
                    "id": "hWMPXqay5rju-XAsUqL1T",
                    "owner": 1,
                    "card": "Ora",
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
                },
                "amount": 6,
                "generatedBy": "qWp9plz8NbRGEXovxsrWi",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/play_creature",
                "card": {
                    "id": "qWp9plz8NbRGEXovxsrWi",
                    "owner": 1,
                    "card": "Xyx Elder",
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
                },
                "player": 1,
                "generatedBy": "qWp9plz8NbRGEXovxsrWi"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "qWp9plz8NbRGEXovxsrWi",
                    "owner": 1,
                    "card": "Xyx Elder",
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
                },
                "sourceZone": "zones/hand",
                "destinationCard": {
                    "id": "6fZMYqOH-qEkiEUaY4s-_",
                    "owner": 1,
                    "card": "Xyx Elder",
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
                },
                "destinationZone": "zones/in_play",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "qWp9plz8NbRGEXovxsrWi"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "6fZMYqOH-qEkiEUaY4s-_"
                },
                "source": false,
                "amount": 6,
                "generatedBy": "qWp9plz8NbRGEXovxsrWi"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "6fZMYqOH-qEkiEUaY4s-_"
                },
                "source": false,
                "amount": 1,
                "generatedBy": "qWp9plz8NbRGEXovxsrWi",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 4
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/play",
                "player": 1,
                "payload": {
                    "card": {
                        "id": "XJbJogIVMUMdFE0vO3cFK",
                        "owner": 1,
                        "card": "Shockwave",
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
                    },
                    "player": 1
                },
                "forcePriority": false
            },
            {
                "type": "actions/effect",
                "effectType": "effects/play_spell",
                "player": 1,
                "card": {
                    "id": "XJbJogIVMUMdFE0vO3cFK",
                    "owner": 1,
                    "card": "Shockwave",
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
                },
                "generatedBy": "XJbJogIVMUMdFE0vO3cFK"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/paying_energy_for_spell",
                "from": {
                    "id": "hWMPXqay5rju-XAsUqL1T"
                },
                "amount": 5,
                "player": 1,
                "generatedBy": "XJbJogIVMUMdFE0vO3cFK"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/remove_energy_from_magi",
                "target": {
                    "id": "hWMPXqay5rju-XAsUqL1T",
                    "owner": 1,
                    "card": "Ora",
                    "data": {
                        "energy": 11,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 6,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 5,
                "generatedBy": "XJbJogIVMUMdFE0vO3cFK",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "XJbJogIVMUMdFE0vO3cFK",
                    "owner": 1,
                    "card": "Shockwave",
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
                },
                "sourceZone": "zones/hand",
                "destinationCard": {
                    "id": "vtKkIB1Z65GT1wyDxAnhK",
                    "owner": 1,
                    "card": "Shockwave",
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
                },
                "destinationZone": "zones/discard",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "XJbJogIVMUMdFE0vO3cFK"
            },
            {
                "type": "actions/enter_prompt",
                "promptType": "prompt/creature",
                "generatedBy": "XJbJogIVMUMdFE0vO3cFK",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/resolve_prompt",
                "player": 1,
                "targetCard": {
                    "id": "GNGDtvLHRyJQfsHVf6tz9",
                    "owner": 2,
                    "card": "Bhatar",
                    "data": {
                        "energy": 6,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 0,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "target": "GNGDtvLHRyJQfsHVf6tz9"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_creature_from_play",
                "source": {
                    "card": null,
                    "data": null
                },
                "target": {
                    "id": "GNGDtvLHRyJQfsHVf6tz9",
                    "owner": 2,
                    "card": "Bhatar",
                    "data": {
                        "energy": 6,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 0,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "generatedBy": "XJbJogIVMUMdFE0vO3cFK",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "GNGDtvLHRyJQfsHVf6tz9",
                    "owner": 2,
                    "card": "Bhatar",
                    "data": {
                        "energy": 6,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 0,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "sourceZone": "zones/in_play",
                "destinationCard": {
                    "id": "nosKzFYe0UxwhN6kV_NCo",
                    "owner": 2,
                    "card": "Bhatar",
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
                "destinationZone": "zones/discard",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "XJbJogIVMUMdFE0vO3cFK"
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/power",
                "power": "Shockstorm",
                "source": {
                    "id": "6fZMYqOH-qEkiEUaY4s-_",
                    "owner": 1,
                    "card": "Xyx Elder",
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
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/paying_energy_for_power",
                "target": {
                    "id": "6fZMYqOH-qEkiEUaY4s-_",
                    "owner": 1,
                    "card": "Xyx Elder",
                    "data": {
                        "energy": 7,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [
                            "Shockstorm"
                        ],
                        "energyLostThisTurn": 0,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 6,
                "generatedBy": "6fZMYqOH-qEkiEUaY4s-_"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/remove_energy_from_creature",
                "target": {
                    "id": "6fZMYqOH-qEkiEUaY4s-_"
                },
                "amount": 6
            },
            {
                "type": "actions/effect",
                "effectType": "effects/die_rolled",
                "result": 3,
                "generatedBy": "6fZMYqOH-qEkiEUaY4s-_",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/energy_discarded_from_creature",
                "target": {
                    "id": "272fEBsxjauHyIFTkN4KD"
                },
                "amount": 3,
                "power": true,
                "source": {
                    "id": "6fZMYqOH-qEkiEUaY4s-_"
                },
                "player": 1,
                "generatedBy": "6fZMYqOH-qEkiEUaY4s-_"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/energy_discarded_from_creature",
                "target": {
                    "id": "HF7SYbuGvytIlVJ5YaPzJ"
                },
                "amount": 3,
                "power": true,
                "source": {
                    "id": "6fZMYqOH-qEkiEUaY4s-_"
                },
                "player": 1,
                "generatedBy": "6fZMYqOH-qEkiEUaY4s-_"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_creature_from_play",
                "source": {
                    "id": "HF7SYbuGvytIlVJ5YaPzJ",
                    "owner": 2,
                    "card": "Giant Carillion",
                    "data": {
                        "energy": 0,
                        "controller": 2,
                        "attacked": 1,
                        "actionsUsed": [],
                        "energyLostThisTurn": 9,
                        "defeatedCreature": true,
                        "hasAttacked": true,
                        "wasAttacked": false
                    }
                },
                "target": {
                    "id": "HF7SYbuGvytIlVJ5YaPzJ",
                    "owner": 2,
                    "card": "Giant Carillion",
                    "data": {
                        "energy": 0,
                        "controller": 2,
                        "attacked": 1,
                        "actionsUsed": [],
                        "energyLostThisTurn": 9,
                        "defeatedCreature": true,
                        "hasAttacked": true,
                        "wasAttacked": false
                    }
                },
                "generatedBy": "6fZMYqOH-qEkiEUaY4s-_",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "HF7SYbuGvytIlVJ5YaPzJ",
                    "owner": 2,
                    "card": "Giant Carillion",
                    "data": {
                        "energy": 0,
                        "controller": 2,
                        "attacked": 1,
                        "actionsUsed": [],
                        "energyLostThisTurn": 9,
                        "defeatedCreature": true,
                        "hasAttacked": true,
                        "wasAttacked": false
                    }
                },
                "sourceZone": "zones/in_play",
                "destinationCard": {
                    "id": "iWVNx79JWa1vxaNHcfE-w",
                    "owner": 2,
                    "card": "Giant Carillion",
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
                "destinationZone": "zones/discard",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "6fZMYqOH-qEkiEUaY4s-_"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/energy_discarded_from_creature",
                "target": {
                    "id": "vnQPCog7BMcilhsqqk76L"
                },
                "amount": 2,
                "power": true,
                "source": {
                    "id": "6fZMYqOH-qEkiEUaY4s-_"
                },
                "player": 1,
                "generatedBy": "6fZMYqOH-qEkiEUaY4s-_"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_creature_from_play",
                "source": {
                    "id": "vnQPCog7BMcilhsqqk76L",
                    "owner": 2,
                    "card": "Twee",
                    "data": {
                        "energy": 0,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 2,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "target": {
                    "id": "vnQPCog7BMcilhsqqk76L",
                    "owner": 2,
                    "card": "Twee",
                    "data": {
                        "energy": 0,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 2,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "generatedBy": "6fZMYqOH-qEkiEUaY4s-_",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "vnQPCog7BMcilhsqqk76L",
                    "owner": 2,
                    "card": "Twee",
                    "data": {
                        "energy": 0,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 2,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "sourceZone": "zones/in_play",
                "destinationCard": {
                    "id": "C2MrKlpK0iCO9jLYxTAGb",
                    "owner": 2,
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
                    }
                },
                "destinationZone": "zones/discard",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "6fZMYqOH-qEkiEUaY4s-_"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "iWVNx79JWa1vxaNHcfE-w",
                    "owner": 2,
                    "card": "Giant Carillion",
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
                "sourceZone": "zones/discard",
                "destinationCard": {
                    "id": "UaNaTtKJKJOQYmv3A4OLn",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "6fZMYqOH-qEkiEUaY4s-_"
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 5
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "p6lWHGxfv74wTlkv8l4cU",
                    "owner": 1,
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
                    }
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "F37IK1F7K0bPgzZm71uG2",
                    "owner": 1,
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
                    }
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "Auyx_w14_bV4hb_A3-_ZE"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "YFqlnjFMWqznAAMauXIi-",
                    "owner": 1,
                    "card": "Xyx",
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
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "RTuHUoc-yRIUjU-NeqkgS",
                    "owner": 1,
                    "card": "Xyx",
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
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "Auyx_w14_bV4hb_A3-_ZE"
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 0
            },
            {
                "type": "actions/effect",
                "effectType": "effects/end_of_turn",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_of_turn",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_magi",
                "source": {
                    "id": "xgavpDsS5iWshBSLA09pe"
                },
                "target": {
                    "id": "xgavpDsS5iWshBSLA09pe"
                },
                "amount": 6
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/attack",
                "source": "272fEBsxjauHyIFTkN4KD",
                "target": "6fZMYqOH-qEkiEUaY4s-_",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/attack",
                "source": "272fEBsxjauHyIFTkN4KD",
                "target": "6fZMYqOH-qEkiEUaY4s-_",
                "additionalAttackers": [],
                "generatedBy": "272fEBsxjauHyIFTkN4KD",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_attacks",
                "source": {
                    "id": "272fEBsxjauHyIFTkN4KD"
                },
                "target": {
                    "id": "6fZMYqOH-qEkiEUaY4s-_"
                },
                "sourceAtStart": {
                    "id": "272fEBsxjauHyIFTkN4KD"
                },
                "targetAtStart": {
                    "id": "6fZMYqOH-qEkiEUaY4s-_"
                }
            },
            {
                "type": "actions/effect",
                "effectType": "effects/before_damage",
                "source": "272fEBsxjauHyIFTkN4KD",
                "target": "6fZMYqOH-qEkiEUaY4s-_",
                "generatedBy": "272fEBsxjauHyIFTkN4KD"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/damage_step",
                "source": "272fEBsxjauHyIFTkN4KD",
                "target": "6fZMYqOH-qEkiEUaY4s-_",
                "packHuntAttack": false,
                "generatedBy": "272fEBsxjauHyIFTkN4KD"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/attacker_deals_damage",
                "source": "272fEBsxjauHyIFTkN4KD",
                "target": "6fZMYqOH-qEkiEUaY4s-_",
                "amount": 1,
                "generatedBy": "272fEBsxjauHyIFTkN4KD"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/deal_damage",
                "source": "272fEBsxjauHyIFTkN4KD",
                "target": "6fZMYqOH-qEkiEUaY4s-_",
                "amount": 1,
                "generatedBy": "272fEBsxjauHyIFTkN4KD"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_energy_from_creature_or_magi",
                "source": "272fEBsxjauHyIFTkN4KD",
                "target": "6fZMYqOH-qEkiEUaY4s-_",
                "attack": true,
                "amount": 1,
                "generatedBy": "272fEBsxjauHyIFTkN4KD"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/energy_discarded_from_creature",
                "amount": 1,
                "attack": true,
                "spell": false,
                "relic": false,
                "source": {
                    "id": "272fEBsxjauHyIFTkN4KD"
                },
                "variable": "damageDealt",
                "target": {
                    "id": "6fZMYqOH-qEkiEUaY4s-_"
                },
                "generatedBy": "272fEBsxjauHyIFTkN4KD"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_defeats_creature",
                "source": "272fEBsxjauHyIFTkN4KD",
                "target": "6fZMYqOH-qEkiEUaY4s-_",
                "attack": true,
                "generatedBy": "272fEBsxjauHyIFTkN4KD"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_creature_from_play",
                "source": {
                    "id": "6fZMYqOH-qEkiEUaY4s-_",
                    "owner": 1,
                    "card": "Xyx Elder",
                    "data": {
                        "energy": 0,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [
                            "Shockstorm",
                            "Shockstorm"
                        ],
                        "energyLostThisTurn": 7,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": true
                    }
                },
                "target": {
                    "id": "6fZMYqOH-qEkiEUaY4s-_",
                    "owner": 1,
                    "card": "Xyx Elder",
                    "data": {
                        "energy": 0,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [
                            "Shockstorm",
                            "Shockstorm"
                        ],
                        "energyLostThisTurn": 7,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": true
                    }
                },
                "generatedBy": "272fEBsxjauHyIFTkN4KD",
                "player": 0
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "6fZMYqOH-qEkiEUaY4s-_",
                    "owner": 1,
                    "card": "Xyx Elder",
                    "data": {
                        "energy": 0,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [
                            "Shockstorm",
                            "Shockstorm"
                        ],
                        "energyLostThisTurn": 7,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": true
                    }
                },
                "sourceZone": "zones/in_play",
                "destinationCard": {
                    "id": "jK68UwQTD36huCd8cefUV",
                    "owner": 1,
                    "card": "Xyx Elder",
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
                },
                "destinationZone": "zones/discard",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "272fEBsxjauHyIFTkN4KD"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_is_defeated",
                "target": "6fZMYqOH-qEkiEUaY4s-_",
                "generatedBy": "272fEBsxjauHyIFTkN4KD"
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 3
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/play",
                "player": 2,
                "payload": {
                    "card": {
                        "id": "MAcV3GpnRuEatQn6wgMG0",
                        "owner": 2,
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
                        }
                    },
                    "player": 2
                },
                "forcePriority": false
            },
            {
                "type": "actions/effect",
                "effectType": "effects/paying_energy_for_creature",
                "from": {
                    "id": "xgavpDsS5iWshBSLA09pe"
                },
                "amount": 2,
                "player": 2,
                "generatedBy": "MAcV3GpnRuEatQn6wgMG0"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/remove_energy_from_magi",
                "target": {
                    "id": "xgavpDsS5iWshBSLA09pe",
                    "owner": 2,
                    "card": "Poad",
                    "data": {
                        "energy": 6,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 46,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 2,
                "generatedBy": "MAcV3GpnRuEatQn6wgMG0",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/play_creature",
                "card": {
                    "id": "MAcV3GpnRuEatQn6wgMG0",
                    "owner": 2,
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
                    }
                },
                "player": 2,
                "generatedBy": "MAcV3GpnRuEatQn6wgMG0"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "MAcV3GpnRuEatQn6wgMG0",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/hand",
                "destinationCard": {
                    "id": "Pr4JFRkjopHuSVzGF3WlD",
                    "owner": 2,
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
                    }
                },
                "destinationZone": "zones/in_play",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "MAcV3GpnRuEatQn6wgMG0"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "Pr4JFRkjopHuSVzGF3WlD"
                },
                "source": false,
                "amount": 2,
                "generatedBy": "MAcV3GpnRuEatQn6wgMG0"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "Pr4JFRkjopHuSVzGF3WlD"
                },
                "source": false,
                "amount": 1,
                "generatedBy": "MAcV3GpnRuEatQn6wgMG0",
                "player": 2
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 4
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 5
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "6_I5lBwYa6VlDSfPQQ7bC",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "vGPc14vMRK23jsIkQwNox",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "qXnqz8q1P8y-5z7yVEaKi"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "c93AoZY2tKUb9LUqXHI3N",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "YYWIt84OM47Bg46Jludpc",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "qXnqz8q1P8y-5z7yVEaKi"
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 0
            },
            {
                "type": "actions/effect",
                "effectType": "effects/end_of_turn",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_of_turn",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_magi",
                "source": {
                    "id": "hWMPXqay5rju-XAsUqL1T"
                },
                "target": {
                    "id": "hWMPXqay5rju-XAsUqL1T"
                },
                "amount": 6
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/play",
                "player": 1,
                "payload": {
                    "card": {
                        "id": "F37IK1F7K0bPgzZm71uG2",
                        "owner": 1,
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
                        }
                    },
                    "player": 1
                },
                "forcePriority": false
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "F37IK1F7K0bPgzZm71uG2",
                    "owner": 1,
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
                    }
                },
                "sourceZone": "zones/hand",
                "destinationCard": {
                    "id": "m2wKXkDLGCCXjUYzoxH7Q",
                    "owner": 1,
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
                    }
                },
                "destinationZone": "zones/in_play",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "F37IK1F7K0bPgzZm71uG2"
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 3
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/play",
                "player": 1,
                "payload": {
                    "card": {
                        "id": "WtIY00RlBB3IwfIfDp5u8",
                        "owner": 1,
                        "card": "Ayebaw",
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
                    },
                    "player": 1
                },
                "forcePriority": false
            },
            {
                "type": "actions/effect",
                "effectType": "effects/paying_energy_for_creature",
                "from": {
                    "id": "hWMPXqay5rju-XAsUqL1T"
                },
                "amount": 5,
                "player": 1,
                "generatedBy": "WtIY00RlBB3IwfIfDp5u8"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/remove_energy_from_magi",
                "target": {
                    "id": "hWMPXqay5rju-XAsUqL1T",
                    "owner": 1,
                    "card": "Ora",
                    "data": {
                        "energy": 12,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 11,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 5,
                "generatedBy": "WtIY00RlBB3IwfIfDp5u8",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/play_creature",
                "card": {
                    "id": "WtIY00RlBB3IwfIfDp5u8",
                    "owner": 1,
                    "card": "Ayebaw",
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
                },
                "player": 1,
                "generatedBy": "WtIY00RlBB3IwfIfDp5u8"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "WtIY00RlBB3IwfIfDp5u8",
                    "owner": 1,
                    "card": "Ayebaw",
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
                },
                "sourceZone": "zones/hand",
                "destinationCard": {
                    "id": "gTAf96gUGNcYs2CUvt8Zm",
                    "owner": 1,
                    "card": "Ayebaw",
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
                },
                "destinationZone": "zones/in_play",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "WtIY00RlBB3IwfIfDp5u8"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "gTAf96gUGNcYs2CUvt8Zm"
                },
                "source": false,
                "amount": 5,
                "generatedBy": "WtIY00RlBB3IwfIfDp5u8"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "gTAf96gUGNcYs2CUvt8Zm"
                },
                "source": false,
                "amount": 1,
                "generatedBy": "WtIY00RlBB3IwfIfDp5u8",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/play",
                "player": 1,
                "payload": {
                    "card": {
                        "id": "ER4eQ8R1iAp_JP7E8ETZb",
                        "owner": 1,
                        "card": "Cloud Narth",
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
                    },
                    "player": 1
                },
                "forcePriority": false
            },
            {
                "type": "actions/effect",
                "effectType": "effects/paying_energy_for_creature",
                "from": {
                    "id": "hWMPXqay5rju-XAsUqL1T"
                },
                "amount": 2,
                "player": 1,
                "generatedBy": "ER4eQ8R1iAp_JP7E8ETZb"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/remove_energy_from_magi",
                "target": {
                    "id": "hWMPXqay5rju-XAsUqL1T",
                    "owner": 1,
                    "card": "Ora",
                    "data": {
                        "energy": 7,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 16,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 2,
                "generatedBy": "ER4eQ8R1iAp_JP7E8ETZb",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/play_creature",
                "card": {
                    "id": "ER4eQ8R1iAp_JP7E8ETZb",
                    "owner": 1,
                    "card": "Cloud Narth",
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
                },
                "player": 1,
                "generatedBy": "ER4eQ8R1iAp_JP7E8ETZb"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "ER4eQ8R1iAp_JP7E8ETZb",
                    "owner": 1,
                    "card": "Cloud Narth",
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
                },
                "sourceZone": "zones/hand",
                "destinationCard": {
                    "id": "-0aERL-tMgbTD526GgGNs",
                    "owner": 1,
                    "card": "Cloud Narth",
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
                },
                "destinationZone": "zones/in_play",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "ER4eQ8R1iAp_JP7E8ETZb"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "-0aERL-tMgbTD526GgGNs"
                },
                "source": false,
                "amount": 2,
                "generatedBy": "ER4eQ8R1iAp_JP7E8ETZb"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "-0aERL-tMgbTD526GgGNs"
                },
                "source": false,
                "amount": 1,
                "generatedBy": "ER4eQ8R1iAp_JP7E8ETZb",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/play",
                "player": 1,
                "payload": {
                    "card": {
                        "id": "RTuHUoc-yRIUjU-NeqkgS",
                        "owner": 1,
                        "card": "Xyx",
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
                    },
                    "player": 1
                },
                "forcePriority": false
            },
            {
                "type": "actions/effect",
                "effectType": "effects/paying_energy_for_creature",
                "from": {
                    "id": "hWMPXqay5rju-XAsUqL1T"
                },
                "amount": 3,
                "player": 1,
                "generatedBy": "RTuHUoc-yRIUjU-NeqkgS"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/remove_energy_from_magi",
                "target": {
                    "id": "hWMPXqay5rju-XAsUqL1T",
                    "owner": 1,
                    "card": "Ora",
                    "data": {
                        "energy": 5,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 18,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 3,
                "generatedBy": "RTuHUoc-yRIUjU-NeqkgS",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/play_creature",
                "card": {
                    "id": "RTuHUoc-yRIUjU-NeqkgS",
                    "owner": 1,
                    "card": "Xyx",
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
                },
                "player": 1,
                "generatedBy": "RTuHUoc-yRIUjU-NeqkgS"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "RTuHUoc-yRIUjU-NeqkgS",
                    "owner": 1,
                    "card": "Xyx",
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
                },
                "sourceZone": "zones/hand",
                "destinationCard": {
                    "id": "64B6oWxyJFv_qxj9Kltlu",
                    "owner": 1,
                    "card": "Xyx",
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
                },
                "destinationZone": "zones/in_play",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "RTuHUoc-yRIUjU-NeqkgS"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "64B6oWxyJFv_qxj9Kltlu"
                },
                "source": false,
                "amount": 3,
                "generatedBy": "RTuHUoc-yRIUjU-NeqkgS"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "64B6oWxyJFv_qxj9Kltlu"
                },
                "source": false,
                "amount": 1,
                "generatedBy": "RTuHUoc-yRIUjU-NeqkgS",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 4
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 5
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "XoipC8IrtW3Uug9kBkLve",
                    "owner": 1,
                    "card": "Storm Cloud",
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
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "pcDKPK_tpxzHowxmc06PL",
                    "owner": 1,
                    "card": "Storm Cloud",
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
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "CawImR7s4sn7CpBbSzgcg"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "aWqn_V2LE8Knw7jFmEXE9",
                    "owner": 1,
                    "card": "Pharan",
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
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "dRAe5nz0EG8U5Qi-X986U",
                    "owner": 1,
                    "card": "Pharan",
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
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "CawImR7s4sn7CpBbSzgcg"
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 0
            },
            {
                "type": "actions/effect",
                "effectType": "effects/end_of_turn",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_of_turn",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_magi",
                "source": {
                    "id": "xgavpDsS5iWshBSLA09pe"
                },
                "target": {
                    "id": "xgavpDsS5iWshBSLA09pe"
                },
                "amount": 6
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/power",
                "power": "Heroes' Feast",
                "source": {
                    "id": "xgavpDsS5iWshBSLA09pe",
                    "owner": 2,
                    "card": "Poad",
                    "data": {
                        "energy": 10,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 48,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/paying_energy_for_power",
                "target": {
                    "id": "xgavpDsS5iWshBSLA09pe",
                    "owner": 2,
                    "card": "Poad",
                    "data": {
                        "energy": 10,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [
                            "Heroes' Feast"
                        ],
                        "energyLostThisTurn": 48,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 2,
                "generatedBy": "xgavpDsS5iWshBSLA09pe"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/remove_energy_from_magi",
                "target": {
                    "id": "xgavpDsS5iWshBSLA09pe",
                    "owner": 2,
                    "card": "Poad",
                    "data": {
                        "energy": 10,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [
                            "Heroes' Feast"
                        ],
                        "energyLostThisTurn": 48,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 2,
                "generatedBy": "xgavpDsS5iWshBSLA09pe"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": [
                    {
                        "id": "Pr4JFRkjopHuSVzGF3WlD"
                    },
                    {
                        "id": "272fEBsxjauHyIFTkN4KD"
                    }
                ],
                "source": {
                    "id": "xgavpDsS5iWshBSLA09pe"
                },
                "amount": 1,
                "generatedBy": "xgavpDsS5iWshBSLA09pe",
                "player": 2
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/attack",
                "source": "Pr4JFRkjopHuSVzGF3WlD",
                "target": "gTAf96gUGNcYs2CUvt8Zm",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/attack",
                "source": "Pr4JFRkjopHuSVzGF3WlD",
                "target": "gTAf96gUGNcYs2CUvt8Zm",
                "additionalAttackers": [],
                "generatedBy": "Pr4JFRkjopHuSVzGF3WlD",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_attacks",
                "source": {
                    "id": "Pr4JFRkjopHuSVzGF3WlD"
                },
                "target": {
                    "id": "gTAf96gUGNcYs2CUvt8Zm"
                },
                "sourceAtStart": {
                    "id": "Pr4JFRkjopHuSVzGF3WlD"
                },
                "targetAtStart": {
                    "id": "gTAf96gUGNcYs2CUvt8Zm"
                }
            },
            {
                "type": "actions/effect",
                "effectType": "effects/before_damage",
                "source": "Pr4JFRkjopHuSVzGF3WlD",
                "target": "gTAf96gUGNcYs2CUvt8Zm",
                "generatedBy": "Pr4JFRkjopHuSVzGF3WlD"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/damage_step",
                "source": "Pr4JFRkjopHuSVzGF3WlD",
                "target": "gTAf96gUGNcYs2CUvt8Zm",
                "packHuntAttack": false,
                "generatedBy": "Pr4JFRkjopHuSVzGF3WlD"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/attacker_deals_damage",
                "source": "Pr4JFRkjopHuSVzGF3WlD",
                "target": "gTAf96gUGNcYs2CUvt8Zm",
                "amount": 4,
                "generatedBy": "Pr4JFRkjopHuSVzGF3WlD"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/deal_damage",
                "source": "Pr4JFRkjopHuSVzGF3WlD",
                "target": "gTAf96gUGNcYs2CUvt8Zm",
                "amount": 4,
                "generatedBy": "Pr4JFRkjopHuSVzGF3WlD"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_energy_from_creature_or_magi",
                "source": "Pr4JFRkjopHuSVzGF3WlD",
                "target": "gTAf96gUGNcYs2CUvt8Zm",
                "attack": true,
                "amount": 4,
                "generatedBy": "Pr4JFRkjopHuSVzGF3WlD"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/energy_discarded_from_creature",
                "amount": 4,
                "attack": true,
                "spell": false,
                "relic": false,
                "source": {
                    "id": "Pr4JFRkjopHuSVzGF3WlD"
                },
                "variable": "damageDealt",
                "target": {
                    "id": "gTAf96gUGNcYs2CUvt8Zm"
                },
                "generatedBy": "Pr4JFRkjopHuSVzGF3WlD"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/defender_deals_damage",
                "source": "gTAf96gUGNcYs2CUvt8Zm",
                "target": "Pr4JFRkjopHuSVzGF3WlD",
                "amount": 6,
                "generatedBy": "Pr4JFRkjopHuSVzGF3WlD"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/deal_damage",
                "source": "gTAf96gUGNcYs2CUvt8Zm",
                "target": "Pr4JFRkjopHuSVzGF3WlD",
                "amount": 6,
                "generatedBy": "Pr4JFRkjopHuSVzGF3WlD"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_energy_from_creature_or_magi",
                "source": "gTAf96gUGNcYs2CUvt8Zm",
                "target": "Pr4JFRkjopHuSVzGF3WlD",
                "attack": true,
                "amount": 6,
                "generatedBy": "Pr4JFRkjopHuSVzGF3WlD"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/energy_discarded_from_creature",
                "amount": 4,
                "attack": true,
                "spell": false,
                "relic": false,
                "source": {
                    "id": "gTAf96gUGNcYs2CUvt8Zm"
                },
                "variable": "damageDealt",
                "target": {
                    "id": "Pr4JFRkjopHuSVzGF3WlD"
                },
                "generatedBy": "Pr4JFRkjopHuSVzGF3WlD"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "Pr4JFRkjopHuSVzGF3WlD",
                    "owner": 2,
                    "card": "Weebo",
                    "data": {
                        "energy": 0,
                        "controller": 2,
                        "attacked": 1,
                        "actionsUsed": [],
                        "energyLostThisTurn": 4,
                        "defeatedCreature": false,
                        "hasAttacked": true,
                        "wasAttacked": false
                    }
                },
                "sourceZone": "zones/in_play",
                "destinationCard": {
                    "id": "ctvO3CGn5HIY5p8z7t9iC",
                    "owner": 2,
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
                    }
                },
                "destinationZone": "zones/discard",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "Pr4JFRkjopHuSVzGF3WlD"
            },
            {
                "type": "actions/attack",
                "source": "272fEBsxjauHyIFTkN4KD",
                "target": "gTAf96gUGNcYs2CUvt8Zm",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/attack",
                "source": "272fEBsxjauHyIFTkN4KD",
                "target": "gTAf96gUGNcYs2CUvt8Zm",
                "additionalAttackers": [],
                "generatedBy": "272fEBsxjauHyIFTkN4KD",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_attacks",
                "source": {
                    "id": "272fEBsxjauHyIFTkN4KD"
                },
                "target": {
                    "id": "gTAf96gUGNcYs2CUvt8Zm"
                },
                "sourceAtStart": {
                    "id": "272fEBsxjauHyIFTkN4KD"
                },
                "targetAtStart": {
                    "id": "gTAf96gUGNcYs2CUvt8Zm"
                }
            },
            {
                "type": "actions/effect",
                "effectType": "effects/before_damage",
                "source": "272fEBsxjauHyIFTkN4KD",
                "target": "gTAf96gUGNcYs2CUvt8Zm",
                "generatedBy": "272fEBsxjauHyIFTkN4KD"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/damage_step",
                "source": "272fEBsxjauHyIFTkN4KD",
                "target": "gTAf96gUGNcYs2CUvt8Zm",
                "packHuntAttack": false,
                "generatedBy": "272fEBsxjauHyIFTkN4KD"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/attacker_deals_damage",
                "source": "272fEBsxjauHyIFTkN4KD",
                "target": "gTAf96gUGNcYs2CUvt8Zm",
                "amount": 2,
                "generatedBy": "272fEBsxjauHyIFTkN4KD"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/deal_damage",
                "source": "272fEBsxjauHyIFTkN4KD",
                "target": "gTAf96gUGNcYs2CUvt8Zm",
                "amount": 2,
                "generatedBy": "272fEBsxjauHyIFTkN4KD"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_energy_from_creature_or_magi",
                "source": "272fEBsxjauHyIFTkN4KD",
                "target": "gTAf96gUGNcYs2CUvt8Zm",
                "attack": true,
                "amount": 2,
                "generatedBy": "272fEBsxjauHyIFTkN4KD"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/energy_discarded_from_creature",
                "amount": 2,
                "attack": true,
                "spell": false,
                "relic": false,
                "source": {
                    "id": "272fEBsxjauHyIFTkN4KD"
                },
                "variable": "damageDealt",
                "target": {
                    "id": "gTAf96gUGNcYs2CUvt8Zm"
                },
                "generatedBy": "272fEBsxjauHyIFTkN4KD"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_defeats_creature",
                "source": "272fEBsxjauHyIFTkN4KD",
                "target": "gTAf96gUGNcYs2CUvt8Zm",
                "attack": true,
                "generatedBy": "272fEBsxjauHyIFTkN4KD"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_creature_from_play",
                "source": {
                    "id": "gTAf96gUGNcYs2CUvt8Zm",
                    "owner": 1,
                    "card": "Ayebaw",
                    "data": {
                        "energy": 0,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 6,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": true
                    }
                },
                "target": {
                    "id": "gTAf96gUGNcYs2CUvt8Zm",
                    "owner": 1,
                    "card": "Ayebaw",
                    "data": {
                        "energy": 0,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 6,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": true
                    }
                },
                "generatedBy": "272fEBsxjauHyIFTkN4KD",
                "player": 0
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "gTAf96gUGNcYs2CUvt8Zm",
                    "owner": 1,
                    "card": "Ayebaw",
                    "data": {
                        "energy": 0,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 6,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": true
                    }
                },
                "sourceZone": "zones/in_play",
                "destinationCard": {
                    "id": "t_dzURQrQyyjTn9eqKiei",
                    "owner": 1,
                    "card": "Ayebaw",
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
                },
                "destinationZone": "zones/discard",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "272fEBsxjauHyIFTkN4KD"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_is_defeated",
                "target": "gTAf96gUGNcYs2CUvt8Zm",
                "generatedBy": "272fEBsxjauHyIFTkN4KD"
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 3
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/play",
                "player": 2,
                "payload": {
                    "card": {
                        "id": "bLBCSF0Jfnu1nfE_k99A3",
                        "owner": 2,
                        "card": "Giant Carillion",
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
                    "player": 2
                },
                "forcePriority": false
            },
            {
                "type": "actions/effect",
                "effectType": "effects/paying_energy_for_creature",
                "from": {
                    "id": "xgavpDsS5iWshBSLA09pe"
                },
                "amount": 8,
                "player": 2,
                "generatedBy": "bLBCSF0Jfnu1nfE_k99A3"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/remove_energy_from_magi",
                "target": {
                    "id": "xgavpDsS5iWshBSLA09pe",
                    "owner": 2,
                    "card": "Poad",
                    "data": {
                        "energy": 8,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [
                            "Heroes' Feast",
                            "Heroes' Feast"
                        ],
                        "energyLostThisTurn": 50,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 8,
                "generatedBy": "bLBCSF0Jfnu1nfE_k99A3",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/play_creature",
                "card": {
                    "id": "bLBCSF0Jfnu1nfE_k99A3",
                    "owner": 2,
                    "card": "Giant Carillion",
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
                "player": 2,
                "generatedBy": "bLBCSF0Jfnu1nfE_k99A3"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "bLBCSF0Jfnu1nfE_k99A3",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/hand",
                "destinationCard": {
                    "id": "wwCaEocXSyhCp9n7P9ixQ",
                    "owner": 2,
                    "card": "Giant Carillion",
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
                "destinationZone": "zones/in_play",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "bLBCSF0Jfnu1nfE_k99A3"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "wwCaEocXSyhCp9n7P9ixQ"
                },
                "source": false,
                "amount": 8,
                "generatedBy": "bLBCSF0Jfnu1nfE_k99A3"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "wwCaEocXSyhCp9n7P9ixQ"
                },
                "source": false,
                "amount": 1,
                "generatedBy": "bLBCSF0Jfnu1nfE_k99A3",
                "player": 2
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 4
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 5
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "73s5_maDTiQR_l5tM_viy",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "NsNZHJu_NwKRfp4TM_FBL",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "h3T9wrQCXBBjv_Jaxid_V"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "C56TtaiFQQjPKhFAYGARN",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "amO7GT1HIf-2tOnFHpTM3",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "h3T9wrQCXBBjv_Jaxid_V"
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 0
            },
            {
                "type": "actions/effect",
                "effectType": "effects/end_of_turn",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_of_turn",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_magi",
                "source": {
                    "id": "hWMPXqay5rju-XAsUqL1T"
                },
                "target": {
                    "id": "hWMPXqay5rju-XAsUqL1T"
                },
                "amount": 6
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/play",
                "player": 1,
                "payload": {
                    "card": {
                        "id": "pcDKPK_tpxzHowxmc06PL",
                        "owner": 1,
                        "card": "Storm Cloud",
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
                    },
                    "player": 1
                },
                "forcePriority": false
            },
            {
                "type": "actions/effect",
                "effectType": "effects/play_spell",
                "player": 1,
                "card": {
                    "id": "pcDKPK_tpxzHowxmc06PL",
                    "owner": 1,
                    "card": "Storm Cloud",
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
                },
                "generatedBy": "pcDKPK_tpxzHowxmc06PL"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/paying_energy_for_spell",
                "from": {
                    "id": "hWMPXqay5rju-XAsUqL1T"
                },
                "amount": 5,
                "player": 1,
                "generatedBy": "pcDKPK_tpxzHowxmc06PL"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/remove_energy_from_magi",
                "target": {
                    "id": "hWMPXqay5rju-XAsUqL1T",
                    "owner": 1,
                    "card": "Ora",
                    "data": {
                        "energy": 8,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 21,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 5,
                "generatedBy": "pcDKPK_tpxzHowxmc06PL",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "pcDKPK_tpxzHowxmc06PL",
                    "owner": 1,
                    "card": "Storm Cloud",
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
                },
                "sourceZone": "zones/hand",
                "destinationCard": {
                    "id": "LkNbVLt9WndazQMqIu-uz",
                    "owner": 1,
                    "card": "Storm Cloud",
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
                },
                "destinationZone": "zones/discard",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "pcDKPK_tpxzHowxmc06PL"
            },
            {
                "type": "actions/enter_prompt",
                "promptType": "prompt/creature",
                "generatedBy": "pcDKPK_tpxzHowxmc06PL",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/resolve_prompt",
                "player": 1,
                "targetCard": {
                    "id": "wwCaEocXSyhCp9n7P9ixQ",
                    "owner": 2,
                    "card": "Giant Carillion",
                    "data": {
                        "energy": 9,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 0,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "target": "wwCaEocXSyhCp9n7P9ixQ"
            },
            {
                "source": {
                    "id": "pcDKPK_tpxzHowxmc06PL"
                },
                "player": 1,
                "type": "actions/effect",
                "effectType": "effects/energy_discarded_from_creature",
                "target": {
                    "id": "wwCaEocXSyhCp9n7P9ixQ"
                },
                "amount": 8,
                "spell": true,
                "generatedBy": "pcDKPK_tpxzHowxmc06PL"
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/attack",
                "source": "-0aERL-tMgbTD526GgGNs",
                "target": "272fEBsxjauHyIFTkN4KD",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/attack",
                "source": "-0aERL-tMgbTD526GgGNs",
                "target": "272fEBsxjauHyIFTkN4KD",
                "additionalAttackers": [],
                "generatedBy": "-0aERL-tMgbTD526GgGNs",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_attacks",
                "source": {
                    "id": "-0aERL-tMgbTD526GgGNs"
                },
                "target": {
                    "id": "272fEBsxjauHyIFTkN4KD"
                },
                "sourceAtStart": {
                    "id": "-0aERL-tMgbTD526GgGNs"
                },
                "targetAtStart": {
                    "id": "272fEBsxjauHyIFTkN4KD"
                }
            },
            {
                "type": "actions/effect",
                "effectType": "effects/before_damage",
                "source": "-0aERL-tMgbTD526GgGNs",
                "target": "272fEBsxjauHyIFTkN4KD",
                "generatedBy": "-0aERL-tMgbTD526GgGNs"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/damage_step",
                "source": "-0aERL-tMgbTD526GgGNs",
                "target": "272fEBsxjauHyIFTkN4KD",
                "packHuntAttack": false,
                "generatedBy": "-0aERL-tMgbTD526GgGNs"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/attacker_deals_damage",
                "source": "-0aERL-tMgbTD526GgGNs",
                "target": "272fEBsxjauHyIFTkN4KD",
                "amount": 3,
                "generatedBy": "-0aERL-tMgbTD526GgGNs"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/deal_damage",
                "source": "-0aERL-tMgbTD526GgGNs",
                "target": "272fEBsxjauHyIFTkN4KD",
                "amount": 3,
                "generatedBy": "-0aERL-tMgbTD526GgGNs"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_energy_from_creature_or_magi",
                "source": "-0aERL-tMgbTD526GgGNs",
                "target": "272fEBsxjauHyIFTkN4KD",
                "attack": true,
                "amount": 3,
                "generatedBy": "-0aERL-tMgbTD526GgGNs"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/energy_discarded_from_creature",
                "amount": 2,
                "attack": true,
                "spell": false,
                "relic": false,
                "source": {
                    "id": "-0aERL-tMgbTD526GgGNs"
                },
                "variable": "damageDealt",
                "target": {
                    "id": "272fEBsxjauHyIFTkN4KD"
                },
                "generatedBy": "-0aERL-tMgbTD526GgGNs"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/defender_deals_damage",
                "source": "272fEBsxjauHyIFTkN4KD",
                "target": "-0aERL-tMgbTD526GgGNs",
                "amount": 2,
                "generatedBy": "-0aERL-tMgbTD526GgGNs"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/deal_damage",
                "source": "272fEBsxjauHyIFTkN4KD",
                "target": "-0aERL-tMgbTD526GgGNs",
                "amount": 2,
                "generatedBy": "-0aERL-tMgbTD526GgGNs"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_energy_from_creature_or_magi",
                "source": "272fEBsxjauHyIFTkN4KD",
                "target": "-0aERL-tMgbTD526GgGNs",
                "attack": true,
                "amount": 2,
                "generatedBy": "-0aERL-tMgbTD526GgGNs"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/energy_discarded_from_creature",
                "amount": 2,
                "attack": true,
                "spell": false,
                "relic": false,
                "source": {
                    "id": "272fEBsxjauHyIFTkN4KD"
                },
                "variable": "damageDealt",
                "target": {
                    "id": "-0aERL-tMgbTD526GgGNs"
                },
                "generatedBy": "-0aERL-tMgbTD526GgGNs"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_defeats_creature",
                "source": "-0aERL-tMgbTD526GgGNs",
                "target": "272fEBsxjauHyIFTkN4KD",
                "attack": true,
                "generatedBy": "-0aERL-tMgbTD526GgGNs"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_creature_from_play",
                "source": {
                    "id": "272fEBsxjauHyIFTkN4KD",
                    "owner": 2,
                    "card": "Carillion",
                    "data": {
                        "energy": 0,
                        "controller": 2,
                        "attacked": 1,
                        "actionsUsed": [],
                        "energyLostThisTurn": 2,
                        "defeatedCreature": true,
                        "hasAttacked": true,
                        "wasAttacked": true
                    }
                },
                "target": {
                    "id": "272fEBsxjauHyIFTkN4KD",
                    "owner": 2,
                    "card": "Carillion",
                    "data": {
                        "energy": 0,
                        "controller": 2,
                        "attacked": 1,
                        "actionsUsed": [],
                        "energyLostThisTurn": 2,
                        "defeatedCreature": true,
                        "hasAttacked": true,
                        "wasAttacked": true
                    }
                },
                "generatedBy": "-0aERL-tMgbTD526GgGNs",
                "player": 0
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "272fEBsxjauHyIFTkN4KD",
                    "owner": 2,
                    "card": "Carillion",
                    "data": {
                        "energy": 0,
                        "controller": 2,
                        "attacked": 1,
                        "actionsUsed": [],
                        "energyLostThisTurn": 2,
                        "defeatedCreature": true,
                        "hasAttacked": true,
                        "wasAttacked": true
                    }
                },
                "sourceZone": "zones/in_play",
                "destinationCard": {
                    "id": "iPfgesA3YJNefKmLdND9Z",
                    "owner": 2,
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
                    }
                },
                "destinationZone": "zones/discard",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "-0aERL-tMgbTD526GgGNs"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_is_defeated",
                "target": "272fEBsxjauHyIFTkN4KD",
                "generatedBy": "-0aERL-tMgbTD526GgGNs"
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/attack",
                "source": "64B6oWxyJFv_qxj9Kltlu",
                "target": "wwCaEocXSyhCp9n7P9ixQ",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/attack",
                "source": "64B6oWxyJFv_qxj9Kltlu",
                "target": "wwCaEocXSyhCp9n7P9ixQ",
                "additionalAttackers": [],
                "generatedBy": "64B6oWxyJFv_qxj9Kltlu",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_attacks",
                "source": {
                    "id": "64B6oWxyJFv_qxj9Kltlu"
                },
                "target": {
                    "id": "wwCaEocXSyhCp9n7P9ixQ"
                },
                "sourceAtStart": {
                    "id": "64B6oWxyJFv_qxj9Kltlu"
                },
                "targetAtStart": {
                    "id": "wwCaEocXSyhCp9n7P9ixQ"
                }
            },
            {
                "type": "actions/effect",
                "effectType": "effects/before_damage",
                "source": "64B6oWxyJFv_qxj9Kltlu",
                "target": "wwCaEocXSyhCp9n7P9ixQ",
                "generatedBy": "64B6oWxyJFv_qxj9Kltlu"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/damage_step",
                "source": "64B6oWxyJFv_qxj9Kltlu",
                "target": "wwCaEocXSyhCp9n7P9ixQ",
                "packHuntAttack": false,
                "generatedBy": "64B6oWxyJFv_qxj9Kltlu"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/attacker_deals_damage",
                "source": "64B6oWxyJFv_qxj9Kltlu",
                "target": "wwCaEocXSyhCp9n7P9ixQ",
                "amount": 4,
                "generatedBy": "64B6oWxyJFv_qxj9Kltlu"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/deal_damage",
                "source": "64B6oWxyJFv_qxj9Kltlu",
                "target": "wwCaEocXSyhCp9n7P9ixQ",
                "amount": 4,
                "generatedBy": "64B6oWxyJFv_qxj9Kltlu"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_energy_from_creature_or_magi",
                "source": "64B6oWxyJFv_qxj9Kltlu",
                "target": "wwCaEocXSyhCp9n7P9ixQ",
                "attack": true,
                "amount": 4,
                "generatedBy": "64B6oWxyJFv_qxj9Kltlu"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/energy_discarded_from_creature",
                "amount": 1,
                "attack": true,
                "spell": false,
                "relic": false,
                "source": {
                    "id": "64B6oWxyJFv_qxj9Kltlu"
                },
                "variable": "damageDealt",
                "target": {
                    "id": "wwCaEocXSyhCp9n7P9ixQ"
                },
                "generatedBy": "64B6oWxyJFv_qxj9Kltlu"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/defender_deals_damage",
                "source": "wwCaEocXSyhCp9n7P9ixQ",
                "target": "64B6oWxyJFv_qxj9Kltlu",
                "amount": 1,
                "generatedBy": "64B6oWxyJFv_qxj9Kltlu"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/deal_damage",
                "source": "wwCaEocXSyhCp9n7P9ixQ",
                "target": "64B6oWxyJFv_qxj9Kltlu",
                "amount": 1,
                "generatedBy": "64B6oWxyJFv_qxj9Kltlu"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_energy_from_creature_or_magi",
                "source": "wwCaEocXSyhCp9n7P9ixQ",
                "target": "64B6oWxyJFv_qxj9Kltlu",
                "attack": true,
                "amount": 1,
                "generatedBy": "64B6oWxyJFv_qxj9Kltlu"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/energy_discarded_from_creature",
                "amount": 1,
                "attack": true,
                "spell": false,
                "relic": false,
                "source": {
                    "id": "wwCaEocXSyhCp9n7P9ixQ"
                },
                "variable": "damageDealt",
                "target": {
                    "id": "64B6oWxyJFv_qxj9Kltlu"
                },
                "generatedBy": "64B6oWxyJFv_qxj9Kltlu"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_defeats_creature",
                "source": "64B6oWxyJFv_qxj9Kltlu",
                "target": "wwCaEocXSyhCp9n7P9ixQ",
                "attack": true,
                "generatedBy": "64B6oWxyJFv_qxj9Kltlu"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_creature_from_play",
                "source": {
                    "id": "wwCaEocXSyhCp9n7P9ixQ",
                    "owner": 2,
                    "card": "Giant Carillion",
                    "data": {
                        "energy": 0,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 9,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": true
                    }
                },
                "target": {
                    "id": "wwCaEocXSyhCp9n7P9ixQ",
                    "owner": 2,
                    "card": "Giant Carillion",
                    "data": {
                        "energy": 0,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 9,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": true
                    }
                },
                "generatedBy": "64B6oWxyJFv_qxj9Kltlu",
                "player": 0
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "wwCaEocXSyhCp9n7P9ixQ",
                    "owner": 2,
                    "card": "Giant Carillion",
                    "data": {
                        "energy": 0,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 9,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": true
                    }
                },
                "sourceZone": "zones/in_play",
                "destinationCard": {
                    "id": "Q_l9KyhE5DGT8ecrb3kOy",
                    "owner": 2,
                    "card": "Giant Carillion",
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
                "destinationZone": "zones/discard",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "64B6oWxyJFv_qxj9Kltlu"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_is_defeated",
                "target": "wwCaEocXSyhCp9n7P9ixQ",
                "generatedBy": "64B6oWxyJFv_qxj9Kltlu"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/magi_is_defeated",
                "target": {
                    "id": "xgavpDsS5iWshBSLA09pe",
                    "owner": 2,
                    "card": "Poad",
                    "data": {
                        "energy": 0,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [
                            "Heroes' Feast",
                            "Heroes' Feast"
                        ],
                        "energyLostThisTurn": 58,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "generatedBy": "thegame"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "xgavpDsS5iWshBSLA09pe",
                    "owner": 2,
                    "card": "Poad",
                    "data": {
                        "energy": 0,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [
                            "Heroes' Feast",
                            "Heroes' Feast"
                        ],
                        "energyLostThisTurn": 58,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "sourceZone": "zones/active_magi",
                "destinationCard": {
                    "id": "hn5RuFBvoFtjI2xEnYRPk",
                    "owner": 2,
                    "card": "Poad",
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
                "destinationZone": "zones/defeated_magi",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "thegame"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "djRkeC9YicpPMbSo3XlS5",
                    "owner": 2,
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
                    }
                },
                "sourceZone": "zones/in_play",
                "destinationCard": {
                    "id": "nkVpBNazBewG9v1iA91D7",
                    "owner": 2,
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
                    }
                },
                "destinationZone": "zones/discard",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "thegame"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "I01aQDk9l4aGSYoMIF8OD",
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
                "sourceZone": "zones/in_play",
                "destinationCard": {
                    "id": "pEFHPsgDg5ic43RTshITw",
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
                "destinationZone": "zones/discard",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "thegame"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "eXwUNWCnuI2MuRELfQI15",
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
                },
                "sourceZone": "zones/in_play",
                "destinationCard": {
                    "id": "b_GvZq3_2QBoOtUhYiGAd",
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
                },
                "destinationZone": "zones/discard",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "thegame"
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 3
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/play",
                "player": 1,
                "payload": {
                    "card": {
                        "id": "dRAe5nz0EG8U5Qi-X986U",
                        "owner": 1,
                        "card": "Pharan",
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
                    },
                    "player": 1
                },
                "forcePriority": false
            },
            {
                "type": "actions/effect",
                "effectType": "effects/paying_energy_for_creature",
                "from": {
                    "id": "hWMPXqay5rju-XAsUqL1T"
                },
                "amount": 3,
                "player": 1,
                "generatedBy": "dRAe5nz0EG8U5Qi-X986U"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/remove_energy_from_magi",
                "target": {
                    "id": "hWMPXqay5rju-XAsUqL1T",
                    "owner": 1,
                    "card": "Ora",
                    "data": {
                        "energy": 3,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 26,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 3,
                "generatedBy": "dRAe5nz0EG8U5Qi-X986U",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/play_creature",
                "card": {
                    "id": "dRAe5nz0EG8U5Qi-X986U",
                    "owner": 1,
                    "card": "Pharan",
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
                },
                "player": 1,
                "generatedBy": "dRAe5nz0EG8U5Qi-X986U"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "dRAe5nz0EG8U5Qi-X986U",
                    "owner": 1,
                    "card": "Pharan",
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
                },
                "sourceZone": "zones/hand",
                "destinationCard": {
                    "id": "UYFwyOEjHIB851hCxIPH1",
                    "owner": 1,
                    "card": "Pharan",
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
                },
                "destinationZone": "zones/in_play",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "dRAe5nz0EG8U5Qi-X986U"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "UYFwyOEjHIB851hCxIPH1"
                },
                "source": false,
                "amount": 3,
                "generatedBy": "dRAe5nz0EG8U5Qi-X986U"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "UYFwyOEjHIB851hCxIPH1"
                },
                "source": false,
                "amount": 1,
                "generatedBy": "dRAe5nz0EG8U5Qi-X986U",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 4
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 5
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "BfjL18VjpSpkPEgMLABki",
                    "owner": 1,
                    "card": "Shockwave",
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
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "6cln3vU19n5-kY5bno0Hm",
                    "owner": 1,
                    "card": "Shockwave",
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
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "49583HlKMXGWMgElJPG2Z"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "fKy8UXOqy_pPf2jutWQJz",
                    "owner": 1,
                    "card": "Lovian",
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
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "3K_HN5_xb6r_vNWKoSe0P",
                    "owner": 1,
                    "card": "Lovian",
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
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "49583HlKMXGWMgElJPG2Z"
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 0
            },
            {
                "type": "actions/effect",
                "effectType": "effects/end_of_turn",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_of_turn",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "lxyfCDVBWUOk9-0o6b8ss",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/magi_pile",
                "destinationCard": {
                    "id": "ZzSK-NoFth830BTjTfaHt",
                    "owner": 2,
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
                    }
                },
                "destinationZone": "zones/active_magi",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "vDK0JN2FO7DBeu9rrdc9k"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_magi",
                "source": {
                    "id": "ZzSK-NoFth830BTjTfaHt"
                },
                "target": {
                    "id": "ZzSK-NoFth830BTjTfaHt"
                },
                "amount": 14
            },
            {
                "type": "actions/enter_prompt",
                "promptType": "prompt/choose_cards",
                "promptParams": {
                    "availableCards": [
                        "Rudwot",
                        "Grow"
                    ],
                    "startingCards": [
                        "Rudwot",
                        "Hood of Hiding",
                        "Grow"
                    ]
                },
                "generatedBy": "vDK0JN2FO7DBeu9rrdc9k",
                "player": 2
            },
            {
                "type": "actions/resolve_prompt",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "UmboPvLzxi0r5g1oqwsqO",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "Jd6hRLtxYmFaXEVEa8cHj",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "vDK0JN2FO7DBeu9rrdc9k"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "DQD6u0Oam9A9A62aiESFU",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "WRur2R7BUOxjN_5WDkfDj",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "vDK0JN2FO7DBeu9rrdc9k"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_magi",
                "source": {
                    "id": "ZzSK-NoFth830BTjTfaHt"
                },
                "target": {
                    "id": "ZzSK-NoFth830BTjTfaHt"
                },
                "amount": 5
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/play",
                "player": 2,
                "payload": {
                    "card": {
                        "id": "YYWIt84OM47Bg46Jludpc",
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
                    "player": 2
                },
                "forcePriority": false
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "YYWIt84OM47Bg46Jludpc",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/hand",
                "destinationCard": {
                    "id": "emh5pqxZUoVsW0HfVxuCW",
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
                "destinationZone": "zones/in_play",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "YYWIt84OM47Bg46Jludpc"
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 3
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/play",
                "player": 2,
                "payload": {
                    "card": {
                        "id": "bRaBiAhRzGhJAUGvPm6CN",
                        "owner": 2,
                        "card": "Giant Carillion",
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
                    "player": 2
                },
                "forcePriority": false
            },
            {
                "type": "actions/effect",
                "effectType": "effects/paying_energy_for_creature",
                "from": {
                    "id": "ZzSK-NoFth830BTjTfaHt"
                },
                "amount": 8,
                "player": 2,
                "generatedBy": "bRaBiAhRzGhJAUGvPm6CN"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/remove_energy_from_magi",
                "target": {
                    "id": "ZzSK-NoFth830BTjTfaHt",
                    "owner": 2,
                    "card": "Tryn",
                    "data": {
                        "energy": 19,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 0,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 8,
                "generatedBy": "bRaBiAhRzGhJAUGvPm6CN",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/play_creature",
                "card": {
                    "id": "bRaBiAhRzGhJAUGvPm6CN",
                    "owner": 2,
                    "card": "Giant Carillion",
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
                "player": 2,
                "generatedBy": "bRaBiAhRzGhJAUGvPm6CN"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "bRaBiAhRzGhJAUGvPm6CN",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/hand",
                "destinationCard": {
                    "id": "qbOR65CScs6mTPczEDS6L",
                    "owner": 2,
                    "card": "Giant Carillion",
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
                "destinationZone": "zones/in_play",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "bRaBiAhRzGhJAUGvPm6CN"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "qbOR65CScs6mTPczEDS6L"
                },
                "source": false,
                "amount": 8,
                "generatedBy": "bRaBiAhRzGhJAUGvPm6CN"
            },
            {
                "type": "actions/play",
                "player": 2,
                "payload": {
                    "card": {
                        "id": "UaNaTtKJKJOQYmv3A4OLn",
                        "owner": 2,
                        "card": "Giant Carillion",
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
                    "player": 2
                },
                "forcePriority": false
            },
            {
                "type": "actions/effect",
                "effectType": "effects/paying_energy_for_creature",
                "from": {
                    "id": "ZzSK-NoFth830BTjTfaHt"
                },
                "amount": 8,
                "player": 2,
                "generatedBy": "UaNaTtKJKJOQYmv3A4OLn"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/remove_energy_from_magi",
                "target": {
                    "id": "ZzSK-NoFth830BTjTfaHt",
                    "owner": 2,
                    "card": "Tryn",
                    "data": {
                        "energy": 11,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 8,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 8,
                "generatedBy": "UaNaTtKJKJOQYmv3A4OLn",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/play_creature",
                "card": {
                    "id": "UaNaTtKJKJOQYmv3A4OLn",
                    "owner": 2,
                    "card": "Giant Carillion",
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
                "player": 2,
                "generatedBy": "UaNaTtKJKJOQYmv3A4OLn"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "UaNaTtKJKJOQYmv3A4OLn",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/hand",
                "destinationCard": {
                    "id": "Jma_fq2djW3q1AFjKrWUo",
                    "owner": 2,
                    "card": "Giant Carillion",
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
                "destinationZone": "zones/in_play",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "UaNaTtKJKJOQYmv3A4OLn"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "Jma_fq2djW3q1AFjKrWUo"
                },
                "source": false,
                "amount": 8,
                "generatedBy": "UaNaTtKJKJOQYmv3A4OLn"
            },
            {
                "type": "actions/play",
                "player": 2,
                "payload": {
                    "card": {
                        "id": "WRur2R7BUOxjN_5WDkfDj",
                        "owner": 2,
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
                        }
                    },
                    "player": 2
                },
                "forcePriority": false
            },
            {
                "type": "actions/effect",
                "effectType": "effects/paying_energy_for_creature",
                "from": {
                    "id": "ZzSK-NoFth830BTjTfaHt"
                },
                "amount": 3,
                "player": 2,
                "generatedBy": "WRur2R7BUOxjN_5WDkfDj"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/remove_energy_from_magi",
                "target": {
                    "id": "ZzSK-NoFth830BTjTfaHt",
                    "owner": 2,
                    "card": "Tryn",
                    "data": {
                        "energy": 3,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 16,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 3,
                "generatedBy": "WRur2R7BUOxjN_5WDkfDj",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/play_creature",
                "card": {
                    "id": "WRur2R7BUOxjN_5WDkfDj",
                    "owner": 2,
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
                    }
                },
                "player": 2,
                "generatedBy": "WRur2R7BUOxjN_5WDkfDj"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "WRur2R7BUOxjN_5WDkfDj",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/hand",
                "destinationCard": {
                    "id": "g_TgOrkIbTF_c9aYOTWNk",
                    "owner": 2,
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
                    }
                },
                "destinationZone": "zones/in_play",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "WRur2R7BUOxjN_5WDkfDj"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "g_TgOrkIbTF_c9aYOTWNk"
                },
                "source": false,
                "amount": 3,
                "generatedBy": "WRur2R7BUOxjN_5WDkfDj"
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 4
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 5
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "kRiEPgLWwl0HdXmx04ldQ",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "TClihRUIZajwxmbGWc1IQ",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "GUkIUkVA71gZ_Y0TS-Pii"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "XkqvKEbQwscsvKgLAU0zT",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "p9gazZb4dvmb9Y0uzxKhb",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "GUkIUkVA71gZ_Y0TS-Pii"
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 0
            },
            {
                "type": "actions/effect",
                "effectType": "effects/end_of_turn",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_of_turn",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_magi",
                "source": {
                    "id": "hWMPXqay5rju-XAsUqL1T"
                },
                "target": {
                    "id": "hWMPXqay5rju-XAsUqL1T"
                },
                "amount": 6
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/play",
                "player": 1,
                "payload": {
                    "card": {
                        "id": "6cln3vU19n5-kY5bno0Hm",
                        "owner": 1,
                        "card": "Shockwave",
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
                    },
                    "player": 1
                },
                "forcePriority": false
            },
            {
                "type": "actions/effect",
                "effectType": "effects/play_spell",
                "player": 1,
                "card": {
                    "id": "6cln3vU19n5-kY5bno0Hm",
                    "owner": 1,
                    "card": "Shockwave",
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
                },
                "generatedBy": "6cln3vU19n5-kY5bno0Hm"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/paying_energy_for_spell",
                "from": {
                    "id": "hWMPXqay5rju-XAsUqL1T"
                },
                "amount": 5,
                "player": 1,
                "generatedBy": "6cln3vU19n5-kY5bno0Hm"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/remove_energy_from_magi",
                "target": {
                    "id": "hWMPXqay5rju-XAsUqL1T",
                    "owner": 1,
                    "card": "Ora",
                    "data": {
                        "energy": 6,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 29,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 5,
                "generatedBy": "6cln3vU19n5-kY5bno0Hm",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "6cln3vU19n5-kY5bno0Hm",
                    "owner": 1,
                    "card": "Shockwave",
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
                },
                "sourceZone": "zones/hand",
                "destinationCard": {
                    "id": "_0Zl-b2pzCo_hg_DFDPsz",
                    "owner": 1,
                    "card": "Shockwave",
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
                },
                "destinationZone": "zones/discard",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "6cln3vU19n5-kY5bno0Hm"
            },
            {
                "type": "actions/enter_prompt",
                "promptType": "prompt/creature",
                "generatedBy": "6cln3vU19n5-kY5bno0Hm",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/resolve_prompt",
                "player": 1,
                "targetCard": {
                    "id": "qbOR65CScs6mTPczEDS6L",
                    "owner": 2,
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
                    }
                },
                "target": "qbOR65CScs6mTPczEDS6L"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_creature_from_play",
                "source": {
                    "card": null,
                    "data": null
                },
                "target": {
                    "id": "qbOR65CScs6mTPczEDS6L",
                    "owner": 2,
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
                    }
                },
                "generatedBy": "6cln3vU19n5-kY5bno0Hm",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "qbOR65CScs6mTPczEDS6L",
                    "owner": 2,
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
                    }
                },
                "sourceZone": "zones/in_play",
                "destinationCard": {
                    "id": "GfzjLgY-M_gj902CVtyoL",
                    "owner": 2,
                    "card": "Giant Carillion",
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
                "destinationZone": "zones/discard",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "6cln3vU19n5-kY5bno0Hm"
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/attack",
                "source": "UYFwyOEjHIB851hCxIPH1",
                "target": "g_TgOrkIbTF_c9aYOTWNk",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/attack",
                "source": "UYFwyOEjHIB851hCxIPH1",
                "target": "g_TgOrkIbTF_c9aYOTWNk",
                "additionalAttackers": [],
                "generatedBy": "UYFwyOEjHIB851hCxIPH1",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_attacks",
                "source": {
                    "id": "UYFwyOEjHIB851hCxIPH1"
                },
                "target": {
                    "id": "g_TgOrkIbTF_c9aYOTWNk"
                },
                "sourceAtStart": {
                    "id": "UYFwyOEjHIB851hCxIPH1"
                },
                "targetAtStart": {
                    "id": "g_TgOrkIbTF_c9aYOTWNk"
                }
            },
            {
                "type": "actions/effect",
                "effectType": "effects/before_damage",
                "source": "UYFwyOEjHIB851hCxIPH1",
                "target": "g_TgOrkIbTF_c9aYOTWNk",
                "generatedBy": "UYFwyOEjHIB851hCxIPH1"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/damage_step",
                "source": "UYFwyOEjHIB851hCxIPH1",
                "target": "g_TgOrkIbTF_c9aYOTWNk",
                "packHuntAttack": false,
                "generatedBy": "UYFwyOEjHIB851hCxIPH1"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/attacker_deals_damage",
                "source": "UYFwyOEjHIB851hCxIPH1",
                "target": "g_TgOrkIbTF_c9aYOTWNk",
                "amount": 4,
                "generatedBy": "UYFwyOEjHIB851hCxIPH1"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/deal_damage",
                "source": "UYFwyOEjHIB851hCxIPH1",
                "target": "g_TgOrkIbTF_c9aYOTWNk",
                "amount": 4,
                "generatedBy": "UYFwyOEjHIB851hCxIPH1"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_energy_from_creature_or_magi",
                "source": "UYFwyOEjHIB851hCxIPH1",
                "target": "g_TgOrkIbTF_c9aYOTWNk",
                "attack": true,
                "amount": 4,
                "generatedBy": "UYFwyOEjHIB851hCxIPH1"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/energy_discarded_from_creature",
                "amount": 3,
                "attack": true,
                "spell": false,
                "relic": false,
                "source": {
                    "id": "UYFwyOEjHIB851hCxIPH1"
                },
                "variable": "damageDealt",
                "target": {
                    "id": "g_TgOrkIbTF_c9aYOTWNk"
                },
                "generatedBy": "UYFwyOEjHIB851hCxIPH1"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/defender_deals_damage",
                "source": "g_TgOrkIbTF_c9aYOTWNk",
                "target": "UYFwyOEjHIB851hCxIPH1",
                "amount": 3,
                "generatedBy": "UYFwyOEjHIB851hCxIPH1"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/deal_damage",
                "source": "g_TgOrkIbTF_c9aYOTWNk",
                "target": "UYFwyOEjHIB851hCxIPH1",
                "amount": 3,
                "generatedBy": "UYFwyOEjHIB851hCxIPH1"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_energy_from_creature_or_magi",
                "source": "g_TgOrkIbTF_c9aYOTWNk",
                "target": "UYFwyOEjHIB851hCxIPH1",
                "attack": true,
                "amount": 3,
                "generatedBy": "UYFwyOEjHIB851hCxIPH1"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/energy_discarded_from_creature",
                "amount": 3,
                "attack": true,
                "spell": false,
                "relic": false,
                "source": {
                    "id": "g_TgOrkIbTF_c9aYOTWNk"
                },
                "variable": "damageDealt",
                "target": {
                    "id": "UYFwyOEjHIB851hCxIPH1"
                },
                "generatedBy": "UYFwyOEjHIB851hCxIPH1"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_defeats_creature",
                "source": "UYFwyOEjHIB851hCxIPH1",
                "target": "g_TgOrkIbTF_c9aYOTWNk",
                "attack": true,
                "generatedBy": "UYFwyOEjHIB851hCxIPH1"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_creature_from_play",
                "source": {
                    "id": "g_TgOrkIbTF_c9aYOTWNk",
                    "owner": 2,
                    "card": "Rudwot",
                    "data": {
                        "energy": 0,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 3,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": true
                    }
                },
                "target": {
                    "id": "g_TgOrkIbTF_c9aYOTWNk",
                    "owner": 2,
                    "card": "Rudwot",
                    "data": {
                        "energy": 0,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 3,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": true
                    }
                },
                "generatedBy": "UYFwyOEjHIB851hCxIPH1",
                "player": 0
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "g_TgOrkIbTF_c9aYOTWNk",
                    "owner": 2,
                    "card": "Rudwot",
                    "data": {
                        "energy": 0,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 3,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": true
                    }
                },
                "sourceZone": "zones/in_play",
                "destinationCard": {
                    "id": "Wc0w_vTrgnu3UUoleWP2P",
                    "owner": 2,
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
                    }
                },
                "destinationZone": "zones/discard",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "UYFwyOEjHIB851hCxIPH1"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_is_defeated",
                "target": "g_TgOrkIbTF_c9aYOTWNk",
                "generatedBy": "UYFwyOEjHIB851hCxIPH1"
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 3
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 4
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 5
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "AI3QbHvB3Lx_wKvmSnaEc",
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
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "NMX2Pr5GqdLqf_fQPfViz",
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
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "jNWwQiPmqOmTAc552ZIYS"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "dgnMYztTd8jGuYPO7KQtD",
                    "owner": 1,
                    "card": "Orathan Flyer",
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
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "hjo0CFaZRV0JFb6hlx2aN",
                    "owner": 1,
                    "card": "Orathan Flyer",
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
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "jNWwQiPmqOmTAc552ZIYS"
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 0
            },
            {
                "type": "actions/effect",
                "effectType": "effects/end_of_turn",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_of_turn",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_magi",
                "source": {
                    "id": "ZzSK-NoFth830BTjTfaHt"
                },
                "target": {
                    "id": "ZzSK-NoFth830BTjTfaHt"
                },
                "amount": 5
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/power",
                "power": "Refresh",
                "source": {
                    "id": "ZzSK-NoFth830BTjTfaHt",
                    "owner": 2,
                    "card": "Tryn",
                    "data": {
                        "energy": 5,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 19,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "player": 2
            },
            {
                "type": "actions/enter_prompt",
                "promptType": "prompt/creature",
                "generatedBy": "ZzSK-NoFth830BTjTfaHt",
                "player": 2
            },
            {
                "type": "actions/resolve_prompt",
                "player": 2,
                "targetCard": {
                    "id": "Jma_fq2djW3q1AFjKrWUo",
                    "owner": 2,
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
                    }
                },
                "target": "Jma_fq2djW3q1AFjKrWUo"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "Jma_fq2djW3q1AFjKrWUo"
                },
                "source": {
                    "id": "ZzSK-NoFth830BTjTfaHt"
                },
                "amount": 2,
                "generatedBy": "ZzSK-NoFth830BTjTfaHt",
                "player": 2
            },
            {
                "type": "actions/play",
                "player": 2,
                "payload": {
                    "card": {
                        "id": "p9gazZb4dvmb9Y0uzxKhb",
                        "owner": 2,
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
                        }
                    },
                    "player": 2
                },
                "forcePriority": false
            },
            {
                "type": "actions/effect",
                "effectType": "effects/play_spell",
                "player": 2,
                "card": {
                    "id": "p9gazZb4dvmb9Y0uzxKhb",
                    "owner": 2,
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
                    }
                },
                "generatedBy": "p9gazZb4dvmb9Y0uzxKhb"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/paying_energy_for_spell",
                "from": {
                    "id": "ZzSK-NoFth830BTjTfaHt"
                },
                "amount": 3,
                "player": 2,
                "generatedBy": "p9gazZb4dvmb9Y0uzxKhb"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/remove_energy_from_magi",
                "target": {
                    "id": "ZzSK-NoFth830BTjTfaHt",
                    "owner": 2,
                    "card": "Tryn",
                    "data": {
                        "energy": 5,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [
                            "Refresh",
                            "Refresh"
                        ],
                        "energyLostThisTurn": 19,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 3,
                "generatedBy": "p9gazZb4dvmb9Y0uzxKhb",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "p9gazZb4dvmb9Y0uzxKhb",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/hand",
                "destinationCard": {
                    "id": "TvknRcQcGuh0m2x0Uv-AB",
                    "owner": 2,
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
                    }
                },
                "destinationZone": "zones/discard",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "p9gazZb4dvmb9Y0uzxKhb"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/die_rolled",
                "result": 3,
                "generatedBy": "p9gazZb4dvmb9Y0uzxKhb",
                "player": 2
            },
            {
                "type": "actions/enter_prompt",
                "promptType": "prompt/creature",
                "generatedBy": "p9gazZb4dvmb9Y0uzxKhb",
                "message": "Choose a creature to add 3 energy to",
                "player": 2
            },
            {
                "type": "actions/resolve_prompt",
                "player": 2,
                "targetCard": {
                    "id": "Jma_fq2djW3q1AFjKrWUo",
                    "owner": 2,
                    "card": "Giant Carillion",
                    "data": {
                        "energy": 10,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 0,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "target": "Jma_fq2djW3q1AFjKrWUo"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "Jma_fq2djW3q1AFjKrWUo"
                },
                "source": {
                    "id": "p9gazZb4dvmb9Y0uzxKhb"
                },
                "amount": 3,
                "generatedBy": "p9gazZb4dvmb9Y0uzxKhb",
                "player": 2
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/attack",
                "source": "Jma_fq2djW3q1AFjKrWUo",
                "target": "UYFwyOEjHIB851hCxIPH1",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/attack",
                "source": "Jma_fq2djW3q1AFjKrWUo",
                "target": "UYFwyOEjHIB851hCxIPH1",
                "additionalAttackers": [],
                "generatedBy": "Jma_fq2djW3q1AFjKrWUo",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_attacks",
                "source": {
                    "id": "Jma_fq2djW3q1AFjKrWUo"
                },
                "target": {
                    "id": "UYFwyOEjHIB851hCxIPH1"
                },
                "sourceAtStart": {
                    "id": "Jma_fq2djW3q1AFjKrWUo"
                },
                "targetAtStart": {
                    "id": "UYFwyOEjHIB851hCxIPH1"
                }
            },
            {
                "type": "actions/effect",
                "effectType": "effects/before_damage",
                "source": "Jma_fq2djW3q1AFjKrWUo",
                "target": "UYFwyOEjHIB851hCxIPH1",
                "generatedBy": "Jma_fq2djW3q1AFjKrWUo"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/damage_step",
                "source": "Jma_fq2djW3q1AFjKrWUo",
                "target": "UYFwyOEjHIB851hCxIPH1",
                "packHuntAttack": false,
                "generatedBy": "Jma_fq2djW3q1AFjKrWUo"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/attacker_deals_damage",
                "source": "Jma_fq2djW3q1AFjKrWUo",
                "target": "UYFwyOEjHIB851hCxIPH1",
                "amount": 13,
                "generatedBy": "Jma_fq2djW3q1AFjKrWUo"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/deal_damage",
                "source": "Jma_fq2djW3q1AFjKrWUo",
                "target": "UYFwyOEjHIB851hCxIPH1",
                "amount": 13,
                "generatedBy": "Jma_fq2djW3q1AFjKrWUo"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_energy_from_creature_or_magi",
                "source": "Jma_fq2djW3q1AFjKrWUo",
                "target": "UYFwyOEjHIB851hCxIPH1",
                "attack": true,
                "amount": 13,
                "generatedBy": "Jma_fq2djW3q1AFjKrWUo"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/energy_discarded_from_creature",
                "amount": 1,
                "attack": true,
                "spell": false,
                "relic": false,
                "source": {
                    "id": "Jma_fq2djW3q1AFjKrWUo"
                },
                "variable": "damageDealt",
                "target": {
                    "id": "UYFwyOEjHIB851hCxIPH1"
                },
                "generatedBy": "Jma_fq2djW3q1AFjKrWUo"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/defender_deals_damage",
                "source": "UYFwyOEjHIB851hCxIPH1",
                "target": "Jma_fq2djW3q1AFjKrWUo",
                "amount": 1,
                "generatedBy": "Jma_fq2djW3q1AFjKrWUo"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/deal_damage",
                "source": "UYFwyOEjHIB851hCxIPH1",
                "target": "Jma_fq2djW3q1AFjKrWUo",
                "amount": 1,
                "generatedBy": "Jma_fq2djW3q1AFjKrWUo"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_energy_from_creature_or_magi",
                "source": "UYFwyOEjHIB851hCxIPH1",
                "target": "Jma_fq2djW3q1AFjKrWUo",
                "attack": true,
                "amount": 1,
                "generatedBy": "Jma_fq2djW3q1AFjKrWUo"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/energy_discarded_from_creature",
                "amount": 1,
                "attack": true,
                "spell": false,
                "relic": false,
                "source": {
                    "id": "UYFwyOEjHIB851hCxIPH1"
                },
                "variable": "damageDealt",
                "target": {
                    "id": "Jma_fq2djW3q1AFjKrWUo"
                },
                "generatedBy": "Jma_fq2djW3q1AFjKrWUo"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_defeats_creature",
                "source": "Jma_fq2djW3q1AFjKrWUo",
                "target": "UYFwyOEjHIB851hCxIPH1",
                "attack": true,
                "generatedBy": "Jma_fq2djW3q1AFjKrWUo"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_creature_from_play",
                "source": {
                    "id": "UYFwyOEjHIB851hCxIPH1",
                    "owner": 1,
                    "card": "Pharan",
                    "data": {
                        "energy": 0,
                        "controller": 1,
                        "attacked": 1,
                        "actionsUsed": [],
                        "energyLostThisTurn": 4,
                        "defeatedCreature": true,
                        "hasAttacked": true,
                        "wasAttacked": true
                    }
                },
                "target": {
                    "id": "UYFwyOEjHIB851hCxIPH1",
                    "owner": 1,
                    "card": "Pharan",
                    "data": {
                        "energy": 0,
                        "controller": 1,
                        "attacked": 1,
                        "actionsUsed": [],
                        "energyLostThisTurn": 4,
                        "defeatedCreature": true,
                        "hasAttacked": true,
                        "wasAttacked": true
                    }
                },
                "generatedBy": "Jma_fq2djW3q1AFjKrWUo",
                "player": 0
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "UYFwyOEjHIB851hCxIPH1",
                    "owner": 1,
                    "card": "Pharan",
                    "data": {
                        "energy": 0,
                        "controller": 1,
                        "attacked": 1,
                        "actionsUsed": [],
                        "energyLostThisTurn": 4,
                        "defeatedCreature": true,
                        "hasAttacked": true,
                        "wasAttacked": true
                    }
                },
                "sourceZone": "zones/in_play",
                "destinationCard": {
                    "id": "7sz9RV6oeDrHwd0DaG3tt",
                    "owner": 1,
                    "card": "Pharan",
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
                },
                "destinationZone": "zones/discard",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "Jma_fq2djW3q1AFjKrWUo"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_is_defeated",
                "target": "UYFwyOEjHIB851hCxIPH1",
                "generatedBy": "Jma_fq2djW3q1AFjKrWUo"
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 3
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 4
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 5
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "iEW2SaBC1TFcTJXB9oTuS",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "-0De_-gSmJETKOdYYxAKI",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "rudSJ8TYsYsNMl-zpp5IO"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "SbEtevvW7JpAhsLCAYwVM",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "bsbvqu92-DmLvgGHE3wIJ",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "rudSJ8TYsYsNMl-zpp5IO"
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 0
            },
            {
                "type": "actions/effect",
                "effectType": "effects/end_of_turn",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_of_turn",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_magi",
                "source": {
                    "id": "hWMPXqay5rju-XAsUqL1T"
                },
                "target": {
                    "id": "hWMPXqay5rju-XAsUqL1T"
                },
                "amount": 6
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/power",
                "power": "Healing Rain",
                "source": {
                    "id": "-0aERL-tMgbTD526GgGNs",
                    "owner": 1,
                    "card": "Cloud Narth",
                    "data": {
                        "energy": 1,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 0,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "player": 1
            },
            {
                "type": "actions/enter_prompt",
                "promptType": "prompt/creature_or_magi",
                "generatedBy": "-0aERL-tMgbTD526GgGNs",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/resolve_prompt",
                "player": 1,
                "targetCard": {
                    "id": "-0aERL-tMgbTD526GgGNs",
                    "owner": 1,
                    "card": "Cloud Narth",
                    "data": {
                        "energy": 1,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [
                            "Healing Rain",
                            "Healing Rain"
                        ],
                        "energyLostThisTurn": 0,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "target": "-0aERL-tMgbTD526GgGNs"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/move_energy",
                "target": {
                    "id": "-0aERL-tMgbTD526GgGNs",
                    "owner": 1,
                    "card": "Cloud Narth",
                    "data": {
                        "energy": 1,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [
                            "Healing Rain",
                            "Healing Rain"
                        ],
                        "energyLostThisTurn": 0,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "source": {
                    "id": "-0aERL-tMgbTD526GgGNs",
                    "owner": 1,
                    "card": "Cloud Narth",
                    "data": {
                        "energy": 1,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [
                            "Healing Rain",
                            "Healing Rain"
                        ],
                        "energyLostThisTurn": 0,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 1,
                "generatedBy": "-0aERL-tMgbTD526GgGNs",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 3
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/play",
                "player": 1,
                "payload": {
                    "card": {
                        "id": "3K_HN5_xb6r_vNWKoSe0P",
                        "owner": 1,
                        "card": "Lovian",
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
                    },
                    "player": 1
                },
                "forcePriority": false
            },
            {
                "type": "actions/effect",
                "effectType": "effects/paying_energy_for_creature",
                "from": {
                    "id": "hWMPXqay5rju-XAsUqL1T"
                },
                "amount": 4,
                "player": 1,
                "generatedBy": "3K_HN5_xb6r_vNWKoSe0P"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/remove_energy_from_magi",
                "target": {
                    "id": "hWMPXqay5rju-XAsUqL1T",
                    "owner": 1,
                    "card": "Ora",
                    "data": {
                        "energy": 7,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 34,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 4,
                "generatedBy": "3K_HN5_xb6r_vNWKoSe0P",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/play_creature",
                "card": {
                    "id": "3K_HN5_xb6r_vNWKoSe0P",
                    "owner": 1,
                    "card": "Lovian",
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
                },
                "player": 1,
                "generatedBy": "3K_HN5_xb6r_vNWKoSe0P"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "3K_HN5_xb6r_vNWKoSe0P",
                    "owner": 1,
                    "card": "Lovian",
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
                },
                "sourceZone": "zones/hand",
                "destinationCard": {
                    "id": "SuuuGA754_uYfjU5_RfMy",
                    "owner": 1,
                    "card": "Lovian",
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
                },
                "destinationZone": "zones/in_play",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "3K_HN5_xb6r_vNWKoSe0P"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "SuuuGA754_uYfjU5_RfMy"
                },
                "source": false,
                "amount": 4,
                "generatedBy": "3K_HN5_xb6r_vNWKoSe0P"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "SuuuGA754_uYfjU5_RfMy"
                },
                "source": false,
                "amount": 1,
                "generatedBy": "3K_HN5_xb6r_vNWKoSe0P",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 4
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 5
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "EymWHgHM_pat5KeGkNyO5",
                    "owner": 1,
                    "card": "Storm Cloud",
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
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "mbeNiJ7G8pIMkNt6a2PE9",
                    "owner": 1,
                    "card": "Storm Cloud",
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
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "V04Y27pqwg7cL_Y97DEBM"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "VoYTUKOLTM1Mggl-lqIcG",
                    "owner": 1,
                    "card": "Alaban",
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
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "mZi8qj_lGIndjvjq0c9Yx",
                    "owner": 1,
                    "card": "Alaban",
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
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "V04Y27pqwg7cL_Y97DEBM"
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 0
            },
            {
                "type": "actions/effect",
                "effectType": "effects/end_of_turn",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_of_turn",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_magi",
                "source": {
                    "id": "ZzSK-NoFth830BTjTfaHt"
                },
                "target": {
                    "id": "ZzSK-NoFth830BTjTfaHt"
                },
                "amount": 5
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/power",
                "power": "Stomp",
                "source": {
                    "id": "Jma_fq2djW3q1AFjKrWUo",
                    "owner": 2,
                    "card": "Giant Carillion",
                    "data": {
                        "energy": 12,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 0,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/paying_energy_for_power",
                "target": {
                    "id": "Jma_fq2djW3q1AFjKrWUo",
                    "owner": 2,
                    "card": "Giant Carillion",
                    "data": {
                        "energy": 12,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [
                            "Stomp"
                        ],
                        "energyLostThisTurn": 0,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 6,
                "generatedBy": "Jma_fq2djW3q1AFjKrWUo"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/remove_energy_from_creature",
                "target": {
                    "id": "Jma_fq2djW3q1AFjKrWUo"
                },
                "amount": 6
            },
            {
                "type": "actions/enter_prompt",
                "promptType": "prompt/creature",
                "generatedBy": "Jma_fq2djW3q1AFjKrWUo",
                "message": "Choose a Creature to discard from play.",
                "player": 2
            },
            {
                "type": "actions/resolve_prompt",
                "player": 2,
                "targetCard": {
                    "id": "SuuuGA754_uYfjU5_RfMy",
                    "owner": 1,
                    "card": "Lovian",
                    "data": {
                        "energy": 5,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 0,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "target": "SuuuGA754_uYfjU5_RfMy"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_creature_from_play",
                "source": {
                    "card": null,
                    "data": null
                },
                "target": {
                    "id": "SuuuGA754_uYfjU5_RfMy",
                    "owner": 1,
                    "card": "Lovian",
                    "data": {
                        "energy": 5,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 0,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "generatedBy": "Jma_fq2djW3q1AFjKrWUo",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "SuuuGA754_uYfjU5_RfMy",
                    "owner": 1,
                    "card": "Lovian",
                    "data": {
                        "energy": 5,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 0,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "sourceZone": "zones/in_play",
                "destinationCard": {
                    "id": "117QICKoNLxH69ZWk3-15",
                    "owner": 1,
                    "card": "Lovian",
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
                },
                "destinationZone": "zones/discard",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "Jma_fq2djW3q1AFjKrWUo"
            },
            {
                "type": "actions/play",
                "player": 2,
                "payload": {
                    "card": {
                        "id": "Jd6hRLtxYmFaXEVEa8cHj",
                        "owner": 2,
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
                        }
                    },
                    "player": 2
                },
                "forcePriority": false
            },
            {
                "type": "actions/effect",
                "effectType": "effects/play_spell",
                "player": 2,
                "card": {
                    "id": "Jd6hRLtxYmFaXEVEa8cHj",
                    "owner": 2,
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
                    }
                },
                "generatedBy": "Jd6hRLtxYmFaXEVEa8cHj"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/paying_energy_for_spell",
                "from": {
                    "id": "ZzSK-NoFth830BTjTfaHt"
                },
                "amount": 3,
                "player": 2,
                "generatedBy": "Jd6hRLtxYmFaXEVEa8cHj"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/remove_energy_from_magi",
                "target": {
                    "id": "ZzSK-NoFth830BTjTfaHt",
                    "owner": 2,
                    "card": "Tryn",
                    "data": {
                        "energy": 7,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 22,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 3,
                "generatedBy": "Jd6hRLtxYmFaXEVEa8cHj",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "Jd6hRLtxYmFaXEVEa8cHj",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/hand",
                "destinationCard": {
                    "id": "woQtuDldnKsNHs4q6L0zI",
                    "owner": 2,
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
                    }
                },
                "destinationZone": "zones/discard",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "Jd6hRLtxYmFaXEVEa8cHj"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/die_rolled",
                "result": 2,
                "generatedBy": "Jd6hRLtxYmFaXEVEa8cHj",
                "player": 2
            },
            {
                "type": "actions/enter_prompt",
                "promptType": "prompt/creature",
                "generatedBy": "Jd6hRLtxYmFaXEVEa8cHj",
                "message": "Choose a creature to add 2 energy to",
                "player": 2
            },
            {
                "type": "actions/resolve_prompt",
                "player": 2,
                "targetCard": {
                    "id": "Jma_fq2djW3q1AFjKrWUo",
                    "owner": 2,
                    "card": "Giant Carillion",
                    "data": {
                        "energy": 6,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [
                            "Stomp",
                            "Stomp"
                        ],
                        "energyLostThisTurn": 6,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "target": "Jma_fq2djW3q1AFjKrWUo"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "Jma_fq2djW3q1AFjKrWUo"
                },
                "source": {
                    "id": "Jd6hRLtxYmFaXEVEa8cHj"
                },
                "amount": 2,
                "generatedBy": "Jd6hRLtxYmFaXEVEa8cHj",
                "player": 2
            },
            {
                "type": "actions/power",
                "power": "Refresh",
                "source": {
                    "id": "ZzSK-NoFth830BTjTfaHt",
                    "owner": 2,
                    "card": "Tryn",
                    "data": {
                        "energy": 4,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 25,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "player": 2
            },
            {
                "type": "actions/enter_prompt",
                "promptType": "prompt/creature",
                "generatedBy": "ZzSK-NoFth830BTjTfaHt",
                "player": 2
            },
            {
                "type": "actions/resolve_prompt",
                "player": 2,
                "targetCard": {
                    "id": "Jma_fq2djW3q1AFjKrWUo",
                    "owner": 2,
                    "card": "Giant Carillion",
                    "data": {
                        "energy": 8,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [
                            "Stomp",
                            "Stomp"
                        ],
                        "energyLostThisTurn": 6,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "target": "Jma_fq2djW3q1AFjKrWUo"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "Jma_fq2djW3q1AFjKrWUo"
                },
                "source": {
                    "id": "ZzSK-NoFth830BTjTfaHt"
                },
                "amount": 2,
                "generatedBy": "ZzSK-NoFth830BTjTfaHt",
                "player": 2
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/attack",
                "source": "Jma_fq2djW3q1AFjKrWUo",
                "target": "-0aERL-tMgbTD526GgGNs",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/attack",
                "source": "Jma_fq2djW3q1AFjKrWUo",
                "target": "-0aERL-tMgbTD526GgGNs",
                "additionalAttackers": [],
                "generatedBy": "Jma_fq2djW3q1AFjKrWUo",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_attacks",
                "source": {
                    "id": "Jma_fq2djW3q1AFjKrWUo"
                },
                "target": {
                    "id": "-0aERL-tMgbTD526GgGNs"
                },
                "sourceAtStart": {
                    "id": "Jma_fq2djW3q1AFjKrWUo"
                },
                "targetAtStart": {
                    "id": "-0aERL-tMgbTD526GgGNs"
                }
            },
            {
                "type": "actions/effect",
                "effectType": "effects/before_damage",
                "source": "Jma_fq2djW3q1AFjKrWUo",
                "target": "-0aERL-tMgbTD526GgGNs",
                "generatedBy": "Jma_fq2djW3q1AFjKrWUo"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/damage_step",
                "source": "Jma_fq2djW3q1AFjKrWUo",
                "target": "-0aERL-tMgbTD526GgGNs",
                "packHuntAttack": false,
                "generatedBy": "Jma_fq2djW3q1AFjKrWUo"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/attacker_deals_damage",
                "source": "Jma_fq2djW3q1AFjKrWUo",
                "target": "-0aERL-tMgbTD526GgGNs",
                "amount": 10,
                "generatedBy": "Jma_fq2djW3q1AFjKrWUo"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/deal_damage",
                "source": "Jma_fq2djW3q1AFjKrWUo",
                "target": "-0aERL-tMgbTD526GgGNs",
                "amount": 10,
                "generatedBy": "Jma_fq2djW3q1AFjKrWUo"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_energy_from_creature_or_magi",
                "source": "Jma_fq2djW3q1AFjKrWUo",
                "target": "-0aERL-tMgbTD526GgGNs",
                "attack": true,
                "amount": 10,
                "generatedBy": "Jma_fq2djW3q1AFjKrWUo"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/energy_discarded_from_creature",
                "amount": 1,
                "attack": true,
                "spell": false,
                "relic": false,
                "source": {
                    "id": "Jma_fq2djW3q1AFjKrWUo"
                },
                "variable": "damageDealt",
                "target": {
                    "id": "-0aERL-tMgbTD526GgGNs"
                },
                "generatedBy": "Jma_fq2djW3q1AFjKrWUo"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/defender_deals_damage",
                "source": "-0aERL-tMgbTD526GgGNs",
                "target": "Jma_fq2djW3q1AFjKrWUo",
                "amount": 1,
                "generatedBy": "Jma_fq2djW3q1AFjKrWUo"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/deal_damage",
                "source": "-0aERL-tMgbTD526GgGNs",
                "target": "Jma_fq2djW3q1AFjKrWUo",
                "amount": 1,
                "generatedBy": "Jma_fq2djW3q1AFjKrWUo"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_energy_from_creature_or_magi",
                "source": "-0aERL-tMgbTD526GgGNs",
                "target": "Jma_fq2djW3q1AFjKrWUo",
                "attack": true,
                "amount": 1,
                "generatedBy": "Jma_fq2djW3q1AFjKrWUo"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/energy_discarded_from_creature",
                "amount": 1,
                "attack": true,
                "spell": false,
                "relic": false,
                "source": {
                    "id": "-0aERL-tMgbTD526GgGNs"
                },
                "variable": "damageDealt",
                "target": {
                    "id": "Jma_fq2djW3q1AFjKrWUo"
                },
                "generatedBy": "Jma_fq2djW3q1AFjKrWUo"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_defeats_creature",
                "source": "Jma_fq2djW3q1AFjKrWUo",
                "target": "-0aERL-tMgbTD526GgGNs",
                "attack": true,
                "generatedBy": "Jma_fq2djW3q1AFjKrWUo"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_creature_from_play",
                "source": {
                    "id": "-0aERL-tMgbTD526GgGNs",
                    "owner": 1,
                    "card": "Cloud Narth",
                    "data": {
                        "energy": 0,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [
                            "Healing Rain",
                            "Healing Rain"
                        ],
                        "energyLostThisTurn": 2,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": true
                    }
                },
                "target": {
                    "id": "-0aERL-tMgbTD526GgGNs",
                    "owner": 1,
                    "card": "Cloud Narth",
                    "data": {
                        "energy": 0,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [
                            "Healing Rain",
                            "Healing Rain"
                        ],
                        "energyLostThisTurn": 2,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": true
                    }
                },
                "generatedBy": "Jma_fq2djW3q1AFjKrWUo",
                "player": 0
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "-0aERL-tMgbTD526GgGNs",
                    "owner": 1,
                    "card": "Cloud Narth",
                    "data": {
                        "energy": 0,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [
                            "Healing Rain",
                            "Healing Rain"
                        ],
                        "energyLostThisTurn": 2,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": true
                    }
                },
                "sourceZone": "zones/in_play",
                "destinationCard": {
                    "id": "ToR8H40qF9oWisJLaEKk9",
                    "owner": 1,
                    "card": "Cloud Narth",
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
                },
                "destinationZone": "zones/discard",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "Jma_fq2djW3q1AFjKrWUo"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_is_defeated",
                "target": "-0aERL-tMgbTD526GgGNs",
                "generatedBy": "Jma_fq2djW3q1AFjKrWUo"
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 3
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/play",
                "player": 2,
                "payload": {
                    "card": {
                        "id": "NsNZHJu_NwKRfp4TM_FBL",
                        "owner": 2,
                        "card": "Furok",
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
                    "player": 2
                },
                "forcePriority": false
            },
            {
                "type": "actions/effect",
                "effectType": "effects/paying_energy_for_creature",
                "from": {
                    "id": "ZzSK-NoFth830BTjTfaHt"
                },
                "amount": 4,
                "player": 2,
                "generatedBy": "NsNZHJu_NwKRfp4TM_FBL"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/remove_energy_from_magi",
                "target": {
                    "id": "ZzSK-NoFth830BTjTfaHt",
                    "owner": 2,
                    "card": "Tryn",
                    "data": {
                        "energy": 4,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [
                            "Refresh",
                            "Refresh"
                        ],
                        "energyLostThisTurn": 25,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 4,
                "generatedBy": "NsNZHJu_NwKRfp4TM_FBL",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/play_creature",
                "card": {
                    "id": "NsNZHJu_NwKRfp4TM_FBL",
                    "owner": 2,
                    "card": "Furok",
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
                "player": 2,
                "generatedBy": "NsNZHJu_NwKRfp4TM_FBL"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "NsNZHJu_NwKRfp4TM_FBL",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/hand",
                "destinationCard": {
                    "id": "m9nUZxmjL4s1EnQcl7xcY",
                    "owner": 2,
                    "card": "Furok",
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
                "destinationZone": "zones/in_play",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "NsNZHJu_NwKRfp4TM_FBL"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "m9nUZxmjL4s1EnQcl7xcY"
                },
                "source": false,
                "amount": 4,
                "generatedBy": "NsNZHJu_NwKRfp4TM_FBL"
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 4
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 5
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "UwRcfNQODscm2v329IJgq",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "a0DJ-Lrfc5ZY1BfayustE",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "-q7sUfblFa5fgDvOGVdDG"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "BOHPX_AtAEBGNj5e7VS1D",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "ecR8x5TtVYO4O9lQSsptM",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "-q7sUfblFa5fgDvOGVdDG"
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 0
            },
            {
                "type": "actions/effect",
                "effectType": "effects/end_of_turn",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_of_turn",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_magi",
                "source": {
                    "id": "hWMPXqay5rju-XAsUqL1T"
                },
                "target": {
                    "id": "hWMPXqay5rju-XAsUqL1T"
                },
                "amount": 6
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/play",
                "player": 1,
                "payload": {
                    "card": {
                        "id": "mbeNiJ7G8pIMkNt6a2PE9",
                        "owner": 1,
                        "card": "Storm Cloud",
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
                    },
                    "player": 1
                },
                "forcePriority": false
            },
            {
                "type": "actions/effect",
                "effectType": "effects/play_spell",
                "player": 1,
                "card": {
                    "id": "mbeNiJ7G8pIMkNt6a2PE9",
                    "owner": 1,
                    "card": "Storm Cloud",
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
                },
                "generatedBy": "mbeNiJ7G8pIMkNt6a2PE9"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/paying_energy_for_spell",
                "from": {
                    "id": "hWMPXqay5rju-XAsUqL1T"
                },
                "amount": 5,
                "player": 1,
                "generatedBy": "mbeNiJ7G8pIMkNt6a2PE9"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/remove_energy_from_magi",
                "target": {
                    "id": "hWMPXqay5rju-XAsUqL1T",
                    "owner": 1,
                    "card": "Ora",
                    "data": {
                        "energy": 9,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 38,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 5,
                "generatedBy": "mbeNiJ7G8pIMkNt6a2PE9",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "mbeNiJ7G8pIMkNt6a2PE9",
                    "owner": 1,
                    "card": "Storm Cloud",
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
                },
                "sourceZone": "zones/hand",
                "destinationCard": {
                    "id": "0vQ3k80gSnA04dMa_MnS4",
                    "owner": 1,
                    "card": "Storm Cloud",
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
                },
                "destinationZone": "zones/discard",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "mbeNiJ7G8pIMkNt6a2PE9"
            },
            {
                "type": "actions/enter_prompt",
                "promptType": "prompt/creature",
                "generatedBy": "mbeNiJ7G8pIMkNt6a2PE9",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/resolve_prompt",
                "player": 1,
                "targetCard": {
                    "id": "Jma_fq2djW3q1AFjKrWUo",
                    "owner": 2,
                    "card": "Giant Carillion",
                    "data": {
                        "energy": 9,
                        "controller": 2,
                        "attacked": 1,
                        "actionsUsed": [
                            "Stomp",
                            "Stomp"
                        ],
                        "energyLostThisTurn": 7,
                        "defeatedCreature": true,
                        "hasAttacked": true,
                        "wasAttacked": false
                    }
                },
                "target": "Jma_fq2djW3q1AFjKrWUo"
            },
            {
                "source": {
                    "id": "mbeNiJ7G8pIMkNt6a2PE9"
                },
                "player": 1,
                "type": "actions/effect",
                "effectType": "effects/energy_discarded_from_creature",
                "target": {
                    "id": "Jma_fq2djW3q1AFjKrWUo"
                },
                "amount": 8,
                "spell": true,
                "generatedBy": "mbeNiJ7G8pIMkNt6a2PE9"
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/attack",
                "source": "64B6oWxyJFv_qxj9Kltlu",
                "target": "Jma_fq2djW3q1AFjKrWUo",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/attack",
                "source": "64B6oWxyJFv_qxj9Kltlu",
                "target": "Jma_fq2djW3q1AFjKrWUo",
                "additionalAttackers": [],
                "generatedBy": "64B6oWxyJFv_qxj9Kltlu",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_attacks",
                "source": {
                    "id": "64B6oWxyJFv_qxj9Kltlu"
                },
                "target": {
                    "id": "Jma_fq2djW3q1AFjKrWUo"
                },
                "sourceAtStart": {
                    "id": "64B6oWxyJFv_qxj9Kltlu"
                },
                "targetAtStart": {
                    "id": "Jma_fq2djW3q1AFjKrWUo"
                }
            },
            {
                "type": "actions/effect",
                "effectType": "effects/before_damage",
                "source": "64B6oWxyJFv_qxj9Kltlu",
                "target": "Jma_fq2djW3q1AFjKrWUo",
                "generatedBy": "64B6oWxyJFv_qxj9Kltlu"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/damage_step",
                "source": "64B6oWxyJFv_qxj9Kltlu",
                "target": "Jma_fq2djW3q1AFjKrWUo",
                "packHuntAttack": false,
                "generatedBy": "64B6oWxyJFv_qxj9Kltlu"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/attacker_deals_damage",
                "source": "64B6oWxyJFv_qxj9Kltlu",
                "target": "Jma_fq2djW3q1AFjKrWUo",
                "amount": 3,
                "generatedBy": "64B6oWxyJFv_qxj9Kltlu"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/deal_damage",
                "source": "64B6oWxyJFv_qxj9Kltlu",
                "target": "Jma_fq2djW3q1AFjKrWUo",
                "amount": 3,
                "generatedBy": "64B6oWxyJFv_qxj9Kltlu"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_energy_from_creature_or_magi",
                "source": "64B6oWxyJFv_qxj9Kltlu",
                "target": "Jma_fq2djW3q1AFjKrWUo",
                "attack": true,
                "amount": 3,
                "generatedBy": "64B6oWxyJFv_qxj9Kltlu"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/energy_discarded_from_creature",
                "amount": 1,
                "attack": true,
                "spell": false,
                "relic": false,
                "source": {
                    "id": "64B6oWxyJFv_qxj9Kltlu"
                },
                "variable": "damageDealt",
                "target": {
                    "id": "Jma_fq2djW3q1AFjKrWUo"
                },
                "generatedBy": "64B6oWxyJFv_qxj9Kltlu"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/defender_deals_damage",
                "source": "Jma_fq2djW3q1AFjKrWUo",
                "target": "64B6oWxyJFv_qxj9Kltlu",
                "amount": 1,
                "generatedBy": "64B6oWxyJFv_qxj9Kltlu"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/deal_damage",
                "source": "Jma_fq2djW3q1AFjKrWUo",
                "target": "64B6oWxyJFv_qxj9Kltlu",
                "amount": 1,
                "generatedBy": "64B6oWxyJFv_qxj9Kltlu"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_energy_from_creature_or_magi",
                "source": "Jma_fq2djW3q1AFjKrWUo",
                "target": "64B6oWxyJFv_qxj9Kltlu",
                "attack": true,
                "amount": 1,
                "generatedBy": "64B6oWxyJFv_qxj9Kltlu"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/energy_discarded_from_creature",
                "amount": 1,
                "attack": true,
                "spell": false,
                "relic": false,
                "source": {
                    "id": "Jma_fq2djW3q1AFjKrWUo"
                },
                "variable": "damageDealt",
                "target": {
                    "id": "64B6oWxyJFv_qxj9Kltlu"
                },
                "generatedBy": "64B6oWxyJFv_qxj9Kltlu"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_defeats_creature",
                "source": "64B6oWxyJFv_qxj9Kltlu",
                "target": "Jma_fq2djW3q1AFjKrWUo",
                "attack": true,
                "generatedBy": "64B6oWxyJFv_qxj9Kltlu"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_creature_from_play",
                "source": {
                    "id": "Jma_fq2djW3q1AFjKrWUo",
                    "owner": 2,
                    "card": "Giant Carillion",
                    "data": {
                        "energy": 0,
                        "controller": 2,
                        "attacked": 1,
                        "actionsUsed": [
                            "Stomp",
                            "Stomp"
                        ],
                        "energyLostThisTurn": 16,
                        "defeatedCreature": true,
                        "hasAttacked": true,
                        "wasAttacked": true
                    }
                },
                "target": {
                    "id": "Jma_fq2djW3q1AFjKrWUo",
                    "owner": 2,
                    "card": "Giant Carillion",
                    "data": {
                        "energy": 0,
                        "controller": 2,
                        "attacked": 1,
                        "actionsUsed": [
                            "Stomp",
                            "Stomp"
                        ],
                        "energyLostThisTurn": 16,
                        "defeatedCreature": true,
                        "hasAttacked": true,
                        "wasAttacked": true
                    }
                },
                "generatedBy": "64B6oWxyJFv_qxj9Kltlu",
                "player": 0
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "Jma_fq2djW3q1AFjKrWUo",
                    "owner": 2,
                    "card": "Giant Carillion",
                    "data": {
                        "energy": 0,
                        "controller": 2,
                        "attacked": 1,
                        "actionsUsed": [
                            "Stomp",
                            "Stomp"
                        ],
                        "energyLostThisTurn": 16,
                        "defeatedCreature": true,
                        "hasAttacked": true,
                        "wasAttacked": true
                    }
                },
                "sourceZone": "zones/in_play",
                "destinationCard": {
                    "id": "4S9uBJ-aPpKQAlQnPnA7h",
                    "owner": 2,
                    "card": "Giant Carillion",
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
                "destinationZone": "zones/discard",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "64B6oWxyJFv_qxj9Kltlu"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_is_defeated",
                "target": "Jma_fq2djW3q1AFjKrWUo",
                "generatedBy": "64B6oWxyJFv_qxj9Kltlu"
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 3
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 4
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 5
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "k8S6jsreLQen2UJ0ccdEj",
                    "owner": 1,
                    "card": "Orathan Flyer",
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
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "MWjEMptviMQmjL_xQYEjH",
                    "owner": 1,
                    "card": "Orathan Flyer",
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
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "cKuE-CTcR-w0QCX43W9uE"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "swiU15-8CSrtwlM6IfJ1i",
                    "owner": 1,
                    "card": "Storm Cloud",
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
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "SUVw_8wVLbL3d7t5kOjER",
                    "owner": 1,
                    "card": "Storm Cloud",
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
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "cKuE-CTcR-w0QCX43W9uE"
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 0
            },
            {
                "type": "actions/effect",
                "effectType": "effects/end_of_turn",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_of_turn",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_magi",
                "source": {
                    "id": "ZzSK-NoFth830BTjTfaHt"
                },
                "target": {
                    "id": "ZzSK-NoFth830BTjTfaHt"
                },
                "amount": 5
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/play",
                "player": 2,
                "payload": {
                    "card": {
                        "id": "-0De_-gSmJETKOdYYxAKI",
                        "owner": 2,
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
                        }
                    },
                    "player": 2
                },
                "forcePriority": false
            },
            {
                "type": "actions/effect",
                "effectType": "effects/play_spell",
                "player": 2,
                "card": {
                    "id": "-0De_-gSmJETKOdYYxAKI",
                    "owner": 2,
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
                    }
                },
                "generatedBy": "-0De_-gSmJETKOdYYxAKI"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/paying_energy_for_spell",
                "from": {
                    "id": "ZzSK-NoFth830BTjTfaHt"
                },
                "amount": 3,
                "player": 2,
                "generatedBy": "-0De_-gSmJETKOdYYxAKI"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/remove_energy_from_magi",
                "target": {
                    "id": "ZzSK-NoFth830BTjTfaHt",
                    "owner": 2,
                    "card": "Tryn",
                    "data": {
                        "energy": 5,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 29,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 3,
                "generatedBy": "-0De_-gSmJETKOdYYxAKI",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "-0De_-gSmJETKOdYYxAKI",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/hand",
                "destinationCard": {
                    "id": "5JA0Wb-fiAKMQW0dBd9yY",
                    "owner": 2,
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
                    }
                },
                "destinationZone": "zones/discard",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "-0De_-gSmJETKOdYYxAKI"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/die_rolled",
                "result": 5,
                "generatedBy": "-0De_-gSmJETKOdYYxAKI",
                "player": 2
            },
            {
                "type": "actions/enter_prompt",
                "promptType": "prompt/creature",
                "generatedBy": "-0De_-gSmJETKOdYYxAKI",
                "message": "Choose a creature to add 5 energy to",
                "player": 2
            },
            {
                "type": "actions/resolve_prompt",
                "player": 2,
                "targetCard": {
                    "id": "m9nUZxmjL4s1EnQcl7xcY",
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
                "target": "m9nUZxmjL4s1EnQcl7xcY"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "m9nUZxmjL4s1EnQcl7xcY"
                },
                "source": {
                    "id": "-0De_-gSmJETKOdYYxAKI"
                },
                "amount": 5,
                "generatedBy": "-0De_-gSmJETKOdYYxAKI",
                "player": 2
            },
            {
                "type": "actions/power",
                "power": "Refresh",
                "source": {
                    "id": "ZzSK-NoFth830BTjTfaHt",
                    "owner": 2,
                    "card": "Tryn",
                    "data": {
                        "energy": 2,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 32,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "player": 2
            },
            {
                "type": "actions/enter_prompt",
                "promptType": "prompt/creature",
                "generatedBy": "ZzSK-NoFth830BTjTfaHt",
                "player": 2
            },
            {
                "type": "actions/resolve_prompt",
                "player": 2,
                "targetCard": {
                    "id": "m9nUZxmjL4s1EnQcl7xcY",
                    "owner": 2,
                    "card": "Furok",
                    "data": {
                        "energy": 9,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 0,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "target": "m9nUZxmjL4s1EnQcl7xcY"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "m9nUZxmjL4s1EnQcl7xcY"
                },
                "source": {
                    "id": "ZzSK-NoFth830BTjTfaHt"
                },
                "amount": 2,
                "generatedBy": "ZzSK-NoFth830BTjTfaHt",
                "player": 2
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/attack",
                "source": "m9nUZxmjL4s1EnQcl7xcY",
                "target": "64B6oWxyJFv_qxj9Kltlu",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/attack",
                "source": "m9nUZxmjL4s1EnQcl7xcY",
                "target": "64B6oWxyJFv_qxj9Kltlu",
                "additionalAttackers": [],
                "generatedBy": "m9nUZxmjL4s1EnQcl7xcY",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_attacks",
                "source": {
                    "id": "m9nUZxmjL4s1EnQcl7xcY"
                },
                "target": {
                    "id": "64B6oWxyJFv_qxj9Kltlu"
                },
                "sourceAtStart": {
                    "id": "m9nUZxmjL4s1EnQcl7xcY"
                },
                "targetAtStart": {
                    "id": "64B6oWxyJFv_qxj9Kltlu"
                }
            },
            {
                "type": "actions/effect",
                "effectType": "effects/before_damage",
                "source": "m9nUZxmjL4s1EnQcl7xcY",
                "target": "64B6oWxyJFv_qxj9Kltlu",
                "generatedBy": "m9nUZxmjL4s1EnQcl7xcY"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/damage_step",
                "source": "m9nUZxmjL4s1EnQcl7xcY",
                "target": "64B6oWxyJFv_qxj9Kltlu",
                "packHuntAttack": false,
                "generatedBy": "m9nUZxmjL4s1EnQcl7xcY"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/attacker_deals_damage",
                "source": "m9nUZxmjL4s1EnQcl7xcY",
                "target": "64B6oWxyJFv_qxj9Kltlu",
                "amount": 11,
                "generatedBy": "m9nUZxmjL4s1EnQcl7xcY"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/deal_damage",
                "source": "m9nUZxmjL4s1EnQcl7xcY",
                "target": "64B6oWxyJFv_qxj9Kltlu",
                "amount": 11,
                "generatedBy": "m9nUZxmjL4s1EnQcl7xcY"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_energy_from_creature_or_magi",
                "source": "m9nUZxmjL4s1EnQcl7xcY",
                "target": "64B6oWxyJFv_qxj9Kltlu",
                "attack": true,
                "amount": 11,
                "generatedBy": "m9nUZxmjL4s1EnQcl7xcY"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/energy_discarded_from_creature",
                "amount": 2,
                "attack": true,
                "spell": false,
                "relic": false,
                "source": {
                    "id": "m9nUZxmjL4s1EnQcl7xcY"
                },
                "variable": "damageDealt",
                "target": {
                    "id": "64B6oWxyJFv_qxj9Kltlu"
                },
                "generatedBy": "m9nUZxmjL4s1EnQcl7xcY"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/defender_deals_damage",
                "source": "64B6oWxyJFv_qxj9Kltlu",
                "target": "m9nUZxmjL4s1EnQcl7xcY",
                "amount": 2,
                "generatedBy": "m9nUZxmjL4s1EnQcl7xcY"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/deal_damage",
                "source": "64B6oWxyJFv_qxj9Kltlu",
                "target": "m9nUZxmjL4s1EnQcl7xcY",
                "amount": 2,
                "generatedBy": "m9nUZxmjL4s1EnQcl7xcY"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_energy_from_creature_or_magi",
                "source": "64B6oWxyJFv_qxj9Kltlu",
                "target": "m9nUZxmjL4s1EnQcl7xcY",
                "attack": true,
                "amount": 2,
                "generatedBy": "m9nUZxmjL4s1EnQcl7xcY"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/energy_discarded_from_creature",
                "amount": 2,
                "attack": true,
                "spell": false,
                "relic": false,
                "source": {
                    "id": "64B6oWxyJFv_qxj9Kltlu"
                },
                "variable": "damageDealt",
                "target": {
                    "id": "m9nUZxmjL4s1EnQcl7xcY"
                },
                "generatedBy": "m9nUZxmjL4s1EnQcl7xcY"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_magi",
                "source": {},
                "target": {
                    "id": "ZzSK-NoFth830BTjTfaHt"
                },
                "amount": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_defeats_creature",
                "source": "m9nUZxmjL4s1EnQcl7xcY",
                "target": "64B6oWxyJFv_qxj9Kltlu",
                "attack": true,
                "generatedBy": "m9nUZxmjL4s1EnQcl7xcY"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_creature_from_play",
                "source": {
                    "id": "64B6oWxyJFv_qxj9Kltlu",
                    "owner": 1,
                    "card": "Xyx",
                    "data": {
                        "energy": 0,
                        "controller": 1,
                        "attacked": 1,
                        "actionsUsed": [],
                        "energyLostThisTurn": 3,
                        "defeatedCreature": true,
                        "hasAttacked": true,
                        "wasAttacked": true
                    }
                },
                "target": {
                    "id": "64B6oWxyJFv_qxj9Kltlu",
                    "owner": 1,
                    "card": "Xyx",
                    "data": {
                        "energy": 0,
                        "controller": 1,
                        "attacked": 1,
                        "actionsUsed": [],
                        "energyLostThisTurn": 3,
                        "defeatedCreature": true,
                        "hasAttacked": true,
                        "wasAttacked": true
                    }
                },
                "generatedBy": "m9nUZxmjL4s1EnQcl7xcY",
                "player": 0
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "64B6oWxyJFv_qxj9Kltlu",
                    "owner": 1,
                    "card": "Xyx",
                    "data": {
                        "energy": 0,
                        "controller": 1,
                        "attacked": 1,
                        "actionsUsed": [],
                        "energyLostThisTurn": 3,
                        "defeatedCreature": true,
                        "hasAttacked": true,
                        "wasAttacked": true
                    }
                },
                "sourceZone": "zones/in_play",
                "destinationCard": {
                    "id": "JypkTkEmVsuV-FX3LmB1C",
                    "owner": 1,
                    "card": "Xyx",
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
                },
                "destinationZone": "zones/discard",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "m9nUZxmjL4s1EnQcl7xcY"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_is_defeated",
                "target": "64B6oWxyJFv_qxj9Kltlu",
                "generatedBy": "m9nUZxmjL4s1EnQcl7xcY"
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 3
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/play",
                "player": 2,
                "payload": {
                    "card": {
                        "id": "a0DJ-Lrfc5ZY1BfayustE",
                        "owner": 2,
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
                        }
                    },
                    "player": 2
                },
                "forcePriority": false
            },
            {
                "type": "actions/effect",
                "effectType": "effects/paying_energy_for_creature",
                "from": {
                    "id": "ZzSK-NoFth830BTjTfaHt"
                },
                "amount": 3,
                "player": 2,
                "generatedBy": "a0DJ-Lrfc5ZY1BfayustE"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/remove_energy_from_magi",
                "target": {
                    "id": "ZzSK-NoFth830BTjTfaHt",
                    "owner": 2,
                    "card": "Tryn",
                    "data": {
                        "energy": 3,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [
                            "Refresh",
                            "Refresh"
                        ],
                        "energyLostThisTurn": 32,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 3,
                "generatedBy": "a0DJ-Lrfc5ZY1BfayustE",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/play_creature",
                "card": {
                    "id": "a0DJ-Lrfc5ZY1BfayustE",
                    "owner": 2,
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
                    }
                },
                "player": 2,
                "generatedBy": "a0DJ-Lrfc5ZY1BfayustE"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "a0DJ-Lrfc5ZY1BfayustE",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/hand",
                "destinationCard": {
                    "id": "EI4Wxz94sWreQPUAwWFKE",
                    "owner": 2,
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
                    }
                },
                "destinationZone": "zones/in_play",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "a0DJ-Lrfc5ZY1BfayustE"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "EI4Wxz94sWreQPUAwWFKE"
                },
                "source": false,
                "amount": 3,
                "generatedBy": "a0DJ-Lrfc5ZY1BfayustE"
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 4
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 5
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "0VYF8lNam_SG4oz1gatAQ",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "i59JgGPNYe60Ld8qr2LWA",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "UaiOSdFNqZpYA8ZaeHII6"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "CU5AvZlodEHB-FSUP1_X1",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "O-2Sipr0H0-oiCGAIuNkY",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "UaiOSdFNqZpYA8ZaeHII6"
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 0
            },
            {
                "type": "actions/effect",
                "effectType": "effects/end_of_turn",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_of_turn",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_magi",
                "source": {
                    "id": "hWMPXqay5rju-XAsUqL1T"
                },
                "target": {
                    "id": "hWMPXqay5rju-XAsUqL1T"
                },
                "amount": 6
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 3
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/play",
                "player": 1,
                "payload": {
                    "card": {
                        "id": "mZi8qj_lGIndjvjq0c9Yx",
                        "owner": 1,
                        "card": "Alaban",
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
                    },
                    "player": 1
                },
                "forcePriority": false
            },
            {
                "type": "actions/effect",
                "effectType": "effects/paying_energy_for_creature",
                "from": {
                    "id": "hWMPXqay5rju-XAsUqL1T"
                },
                "amount": 6,
                "player": 1,
                "generatedBy": "mZi8qj_lGIndjvjq0c9Yx"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/remove_energy_from_magi",
                "target": {
                    "id": "hWMPXqay5rju-XAsUqL1T",
                    "owner": 1,
                    "card": "Ora",
                    "data": {
                        "energy": 10,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 43,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 6,
                "generatedBy": "mZi8qj_lGIndjvjq0c9Yx",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/play_creature",
                "card": {
                    "id": "mZi8qj_lGIndjvjq0c9Yx",
                    "owner": 1,
                    "card": "Alaban",
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
                },
                "player": 1,
                "generatedBy": "mZi8qj_lGIndjvjq0c9Yx"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "mZi8qj_lGIndjvjq0c9Yx",
                    "owner": 1,
                    "card": "Alaban",
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
                },
                "sourceZone": "zones/hand",
                "destinationCard": {
                    "id": "pA9Bymh20ZDzv4mOSm3vw",
                    "owner": 1,
                    "card": "Alaban",
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
                },
                "destinationZone": "zones/in_play",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "mZi8qj_lGIndjvjq0c9Yx"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "pA9Bymh20ZDzv4mOSm3vw"
                },
                "source": false,
                "amount": 6,
                "generatedBy": "mZi8qj_lGIndjvjq0c9Yx"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "pA9Bymh20ZDzv4mOSm3vw"
                },
                "source": false,
                "amount": 1,
                "generatedBy": "mZi8qj_lGIndjvjq0c9Yx",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 4
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/power",
                "power": "Undream",
                "source": {
                    "id": "pA9Bymh20ZDzv4mOSm3vw",
                    "owner": 1,
                    "card": "Alaban",
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
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/paying_energy_for_power",
                "target": {
                    "id": "pA9Bymh20ZDzv4mOSm3vw",
                    "owner": 1,
                    "card": "Alaban",
                    "data": {
                        "energy": 7,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [
                            "Undream"
                        ],
                        "energyLostThisTurn": 0,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 5,
                "generatedBy": "pA9Bymh20ZDzv4mOSm3vw"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/remove_energy_from_creature",
                "target": {
                    "id": "pA9Bymh20ZDzv4mOSm3vw"
                },
                "amount": 5
            },
            {
                "type": "actions/enter_prompt",
                "promptType": "prompt/creature",
                "generatedBy": "pA9Bymh20ZDzv4mOSm3vw",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/resolve_prompt",
                "player": 1,
                "targetCard": {
                    "id": "m9nUZxmjL4s1EnQcl7xcY",
                    "owner": 2,
                    "card": "Furok",
                    "data": {
                        "energy": 9,
                        "controller": 2,
                        "attacked": 1,
                        "actionsUsed": [],
                        "energyLostThisTurn": 2,
                        "defeatedCreature": true,
                        "hasAttacked": true,
                        "wasAttacked": false
                    }
                },
                "target": "m9nUZxmjL4s1EnQcl7xcY"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "m9nUZxmjL4s1EnQcl7xcY",
                    "owner": 2,
                    "card": "Furok",
                    "data": {
                        "energy": 9,
                        "controller": 2,
                        "attacked": 1,
                        "actionsUsed": [],
                        "energyLostThisTurn": 2,
                        "defeatedCreature": true,
                        "hasAttacked": true,
                        "wasAttacked": false
                    }
                },
                "sourceZone": "zones/in_play",
                "destinationCard": {
                    "id": "XYAV8b11Lgw5UkDtLrDFX",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "pA9Bymh20ZDzv4mOSm3vw"
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/power",
                "power": "Vitalize",
                "source": {
                    "id": "m2wKXkDLGCCXjUYzoxH7Q",
                    "owner": 1,
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
                    }
                },
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/paying_energy_for_power",
                "target": {
                    "id": "hWMPXqay5rju-XAsUqL1T",
                    "owner": 1,
                    "card": "Ora",
                    "data": {
                        "energy": 4,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 49,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 2,
                "generatedBy": "m2wKXkDLGCCXjUYzoxH7Q"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/remove_energy_from_magi",
                "target": {
                    "id": "hWMPXqay5rju-XAsUqL1T",
                    "owner": 1,
                    "card": "Ora",
                    "data": {
                        "energy": 4,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 49,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 2,
                "generatedBy": "m2wKXkDLGCCXjUYzoxH7Q"
            },
            {
                "type": "actions/enter_prompt",
                "promptType": "prompt/creature_filtered",
                "restriction": "restrictions/energy_less_than_starting",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/resolve_prompt",
                "player": 1,
                "targetCard": {
                    "id": "pA9Bymh20ZDzv4mOSm3vw",
                    "owner": 1,
                    "card": "Alaban",
                    "data": {
                        "energy": 2,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [
                            "Undream",
                            "Undream"
                        ],
                        "energyLostThisTurn": 5,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "target": "pA9Bymh20ZDzv4mOSm3vw"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "m2wKXkDLGCCXjUYzoxH7Q",
                    "owner": 1,
                    "card": "Dream Balm",
                    "data": {
                        "energy": 0,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [
                            "Vitalize",
                            "Vitalize"
                        ],
                        "energyLostThisTurn": 0,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "sourceZone": "zones/in_play",
                "destinationCard": {
                    "id": "KdfhH1X27tyw-kB-7caMs",
                    "owner": 1,
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
                    }
                },
                "destinationZone": "zones/discard",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "m2wKXkDLGCCXjUYzoxH7Q"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "pA9Bymh20ZDzv4mOSm3vw"
                },
                "source": {
                    "id": "m2wKXkDLGCCXjUYzoxH7Q"
                },
                "amount": 4,
                "generatedBy": "m2wKXkDLGCCXjUYzoxH7Q",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 5
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "fJwAxqsf2FD3cNvWP14Qs",
                    "owner": 1,
                    "card": "Ayebaw",
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
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "rxnIY6xUWtaYeimhvL2Mp",
                    "owner": 1,
                    "card": "Ayebaw",
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
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "ZTUT8dXEo2k-6O8HFcTDq"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "DJhB4rYHQFbtI4epwadFi",
                    "owner": 1,
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
                    }
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "_T4Y7-jilRwIcKQnQiWKf",
                    "owner": 1,
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
                    }
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "ZTUT8dXEo2k-6O8HFcTDq"
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 0
            },
            {
                "type": "actions/effect",
                "effectType": "effects/end_of_turn",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_of_turn",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_magi",
                "source": {
                    "id": "ZzSK-NoFth830BTjTfaHt"
                },
                "target": {
                    "id": "ZzSK-NoFth830BTjTfaHt"
                },
                "amount": 5
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/power",
                "power": "Refresh",
                "source": {
                    "id": "ZzSK-NoFth830BTjTfaHt",
                    "owner": 2,
                    "card": "Tryn",
                    "data": {
                        "energy": 5,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 35,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "player": 2
            },
            {
                "type": "actions/enter_prompt",
                "promptType": "prompt/creature",
                "generatedBy": "ZzSK-NoFth830BTjTfaHt",
                "player": 2
            },
            {
                "type": "actions/resolve_prompt",
                "player": 2,
                "targetCard": {
                    "id": "EI4Wxz94sWreQPUAwWFKE",
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
                "target": "EI4Wxz94sWreQPUAwWFKE"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "EI4Wxz94sWreQPUAwWFKE"
                },
                "source": {
                    "id": "ZzSK-NoFth830BTjTfaHt"
                },
                "amount": 2,
                "generatedBy": "ZzSK-NoFth830BTjTfaHt",
                "player": 2
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 3
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/play",
                "player": 2,
                "payload": {
                    "card": {
                        "id": "TClihRUIZajwxmbGWc1IQ",
                        "owner": 2,
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
                        }
                    },
                    "player": 2
                },
                "forcePriority": false
            },
            {
                "type": "actions/effect",
                "effectType": "effects/paying_energy_for_creature",
                "from": {
                    "id": "ZzSK-NoFth830BTjTfaHt"
                },
                "amount": 4,
                "player": 2,
                "generatedBy": "TClihRUIZajwxmbGWc1IQ"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/remove_energy_from_magi",
                "target": {
                    "id": "ZzSK-NoFth830BTjTfaHt",
                    "owner": 2,
                    "card": "Tryn",
                    "data": {
                        "energy": 5,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [
                            "Refresh",
                            "Refresh"
                        ],
                        "energyLostThisTurn": 35,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 4,
                "generatedBy": "TClihRUIZajwxmbGWc1IQ",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/play_creature",
                "card": {
                    "id": "TClihRUIZajwxmbGWc1IQ",
                    "owner": 2,
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
                    }
                },
                "player": 2,
                "generatedBy": "TClihRUIZajwxmbGWc1IQ"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "TClihRUIZajwxmbGWc1IQ",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/hand",
                "destinationCard": {
                    "id": "tkhIgqfgMApJ5vK61_5G2",
                    "owner": 2,
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
                    }
                },
                "destinationZone": "zones/in_play",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "TClihRUIZajwxmbGWc1IQ"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "tkhIgqfgMApJ5vK61_5G2"
                },
                "source": false,
                "amount": 4,
                "generatedBy": "TClihRUIZajwxmbGWc1IQ"
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 4
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 5
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "TN7zbGe6-G-pe48wi3JMN",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "r743oNkNVoppCAJMvkxuL",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "O57xuBI_ui3SewP_1S96Q"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "g-ZC9xeWtxr6gSVqd_ulN",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "pFQCLowJ_8_WJxN5HDhOS",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "O57xuBI_ui3SewP_1S96Q"
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 0
            },
            {
                "type": "actions/effect",
                "effectType": "effects/end_of_turn",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_of_turn",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_magi",
                "source": {
                    "id": "hWMPXqay5rju-XAsUqL1T"
                },
                "target": {
                    "id": "hWMPXqay5rju-XAsUqL1T"
                },
                "amount": 6
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 3
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/play",
                "player": 1,
                "payload": {
                    "card": {
                        "id": "hjo0CFaZRV0JFb6hlx2aN",
                        "owner": 1,
                        "card": "Orathan Flyer",
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
                    },
                    "player": 1
                },
                "forcePriority": false
            },
            {
                "type": "actions/effect",
                "effectType": "effects/paying_energy_for_creature",
                "from": {
                    "id": "hWMPXqay5rju-XAsUqL1T"
                },
                "amount": 5,
                "player": 1,
                "generatedBy": "hjo0CFaZRV0JFb6hlx2aN"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/remove_energy_from_magi",
                "target": {
                    "id": "hWMPXqay5rju-XAsUqL1T",
                    "owner": 1,
                    "card": "Ora",
                    "data": {
                        "energy": 8,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 51,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 5,
                "generatedBy": "hjo0CFaZRV0JFb6hlx2aN",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/play_creature",
                "card": {
                    "id": "hjo0CFaZRV0JFb6hlx2aN",
                    "owner": 1,
                    "card": "Orathan Flyer",
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
                },
                "player": 1,
                "generatedBy": "hjo0CFaZRV0JFb6hlx2aN"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "hjo0CFaZRV0JFb6hlx2aN",
                    "owner": 1,
                    "card": "Orathan Flyer",
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
                },
                "sourceZone": "zones/hand",
                "destinationCard": {
                    "id": "i35CvFt-eabaMKJ2gOG2W",
                    "owner": 1,
                    "card": "Orathan Flyer",
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
                },
                "destinationZone": "zones/in_play",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "hjo0CFaZRV0JFb6hlx2aN"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "i35CvFt-eabaMKJ2gOG2W"
                },
                "source": false,
                "amount": 5,
                "generatedBy": "hjo0CFaZRV0JFb6hlx2aN"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "i35CvFt-eabaMKJ2gOG2W"
                },
                "source": false,
                "amount": 1,
                "generatedBy": "hjo0CFaZRV0JFb6hlx2aN",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 4
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 5
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "cPXyFlJeiBO3gXXvlJFRT",
                    "owner": 1,
                    "card": "Orathan Flyer",
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
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "fB1VLziRuvwFnov5o-HBs",
                    "owner": 1,
                    "card": "Orathan Flyer",
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
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "09-SaWaeE8oNLfHMk46So"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "TnJTRjZecG4fwXWu7BMPf",
                    "owner": 1,
                    "card": "Updraft",
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
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "j8ZIUUnNFs4bEwK3uL4iC",
                    "owner": 1,
                    "card": "Updraft",
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
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "09-SaWaeE8oNLfHMk46So"
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 0
            },
            {
                "type": "actions/effect",
                "effectType": "effects/end_of_turn",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_of_turn",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_magi",
                "source": {
                    "id": "ZzSK-NoFth830BTjTfaHt"
                },
                "target": {
                    "id": "ZzSK-NoFth830BTjTfaHt"
                },
                "amount": 5
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/power",
                "power": "Refresh",
                "source": {
                    "id": "ZzSK-NoFth830BTjTfaHt",
                    "owner": 2,
                    "card": "Tryn",
                    "data": {
                        "energy": 6,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 39,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "player": 2
            },
            {
                "type": "actions/enter_prompt",
                "promptType": "prompt/creature",
                "generatedBy": "ZzSK-NoFth830BTjTfaHt",
                "player": 2
            },
            {
                "type": "actions/resolve_prompt",
                "player": 2,
                "targetCard": {
                    "id": "EI4Wxz94sWreQPUAwWFKE",
                    "owner": 2,
                    "card": "Rudwot",
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
                },
                "target": "EI4Wxz94sWreQPUAwWFKE"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "EI4Wxz94sWreQPUAwWFKE"
                },
                "source": {
                    "id": "ZzSK-NoFth830BTjTfaHt"
                },
                "amount": 2,
                "generatedBy": "ZzSK-NoFth830BTjTfaHt",
                "player": 2
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/attack",
                "source": "EI4Wxz94sWreQPUAwWFKE",
                "target": "pA9Bymh20ZDzv4mOSm3vw",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/attack",
                "source": "EI4Wxz94sWreQPUAwWFKE",
                "target": "pA9Bymh20ZDzv4mOSm3vw",
                "additionalAttackers": [],
                "generatedBy": "EI4Wxz94sWreQPUAwWFKE",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_attacks",
                "source": {
                    "id": "EI4Wxz94sWreQPUAwWFKE"
                },
                "target": {
                    "id": "pA9Bymh20ZDzv4mOSm3vw"
                },
                "sourceAtStart": {
                    "id": "EI4Wxz94sWreQPUAwWFKE"
                },
                "targetAtStart": {
                    "id": "pA9Bymh20ZDzv4mOSm3vw"
                }
            },
            {
                "type": "actions/effect",
                "effectType": "effects/before_damage",
                "source": "EI4Wxz94sWreQPUAwWFKE",
                "target": "pA9Bymh20ZDzv4mOSm3vw",
                "generatedBy": "EI4Wxz94sWreQPUAwWFKE"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/damage_step",
                "source": "EI4Wxz94sWreQPUAwWFKE",
                "target": "pA9Bymh20ZDzv4mOSm3vw",
                "packHuntAttack": false,
                "generatedBy": "EI4Wxz94sWreQPUAwWFKE"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/attacker_deals_damage",
                "source": "EI4Wxz94sWreQPUAwWFKE",
                "target": "pA9Bymh20ZDzv4mOSm3vw",
                "amount": 7,
                "generatedBy": "EI4Wxz94sWreQPUAwWFKE"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/deal_damage",
                "source": "EI4Wxz94sWreQPUAwWFKE",
                "target": "pA9Bymh20ZDzv4mOSm3vw",
                "amount": 7,
                "generatedBy": "EI4Wxz94sWreQPUAwWFKE"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_energy_from_creature_or_magi",
                "source": "EI4Wxz94sWreQPUAwWFKE",
                "target": "pA9Bymh20ZDzv4mOSm3vw",
                "attack": true,
                "amount": 7,
                "generatedBy": "EI4Wxz94sWreQPUAwWFKE"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/energy_discarded_from_creature",
                "amount": 6,
                "attack": true,
                "spell": false,
                "relic": false,
                "source": {
                    "id": "EI4Wxz94sWreQPUAwWFKE"
                },
                "variable": "damageDealt",
                "target": {
                    "id": "pA9Bymh20ZDzv4mOSm3vw"
                },
                "generatedBy": "EI4Wxz94sWreQPUAwWFKE"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/defender_deals_damage",
                "source": "pA9Bymh20ZDzv4mOSm3vw",
                "target": "EI4Wxz94sWreQPUAwWFKE",
                "amount": 6,
                "generatedBy": "EI4Wxz94sWreQPUAwWFKE"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/deal_damage",
                "source": "pA9Bymh20ZDzv4mOSm3vw",
                "target": "EI4Wxz94sWreQPUAwWFKE",
                "amount": 6,
                "generatedBy": "EI4Wxz94sWreQPUAwWFKE"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_energy_from_creature_or_magi",
                "source": "pA9Bymh20ZDzv4mOSm3vw",
                "target": "EI4Wxz94sWreQPUAwWFKE",
                "attack": true,
                "amount": 6,
                "generatedBy": "EI4Wxz94sWreQPUAwWFKE"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/energy_discarded_from_creature",
                "amount": 6,
                "attack": true,
                "spell": false,
                "relic": false,
                "source": {
                    "id": "pA9Bymh20ZDzv4mOSm3vw"
                },
                "variable": "damageDealt",
                "target": {
                    "id": "EI4Wxz94sWreQPUAwWFKE"
                },
                "generatedBy": "EI4Wxz94sWreQPUAwWFKE"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_defeats_creature",
                "source": "EI4Wxz94sWreQPUAwWFKE",
                "target": "pA9Bymh20ZDzv4mOSm3vw",
                "attack": true,
                "generatedBy": "EI4Wxz94sWreQPUAwWFKE"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_creature_from_play",
                "source": {
                    "id": "pA9Bymh20ZDzv4mOSm3vw",
                    "owner": 1,
                    "card": "Alaban",
                    "data": {
                        "energy": 0,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 6,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": true
                    }
                },
                "target": {
                    "id": "pA9Bymh20ZDzv4mOSm3vw",
                    "owner": 1,
                    "card": "Alaban",
                    "data": {
                        "energy": 0,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 6,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": true
                    }
                },
                "generatedBy": "EI4Wxz94sWreQPUAwWFKE",
                "player": 0
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "pA9Bymh20ZDzv4mOSm3vw",
                    "owner": 1,
                    "card": "Alaban",
                    "data": {
                        "energy": 0,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 6,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": true
                    }
                },
                "sourceZone": "zones/in_play",
                "destinationCard": {
                    "id": "4CocbJBnR2w-ogiS3LI2M",
                    "owner": 1,
                    "card": "Alaban",
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
                },
                "destinationZone": "zones/discard",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "EI4Wxz94sWreQPUAwWFKE"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_is_defeated",
                "target": "pA9Bymh20ZDzv4mOSm3vw",
                "generatedBy": "EI4Wxz94sWreQPUAwWFKE"
            },
            {
                "type": "actions/attack",
                "source": "tkhIgqfgMApJ5vK61_5G2",
                "target": "i35CvFt-eabaMKJ2gOG2W",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/attack",
                "source": "tkhIgqfgMApJ5vK61_5G2",
                "target": "i35CvFt-eabaMKJ2gOG2W",
                "additionalAttackers": [],
                "generatedBy": "tkhIgqfgMApJ5vK61_5G2",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/creature_attacks",
                "source": {
                    "id": "tkhIgqfgMApJ5vK61_5G2"
                },
                "target": {
                    "id": "i35CvFt-eabaMKJ2gOG2W"
                },
                "sourceAtStart": {
                    "id": "tkhIgqfgMApJ5vK61_5G2"
                },
                "targetAtStart": {
                    "id": "i35CvFt-eabaMKJ2gOG2W"
                }
            },
            {
                "type": "actions/effect",
                "effectType": "effects/before_damage",
                "source": "tkhIgqfgMApJ5vK61_5G2",
                "target": "i35CvFt-eabaMKJ2gOG2W",
                "generatedBy": "tkhIgqfgMApJ5vK61_5G2"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/damage_step",
                "source": "tkhIgqfgMApJ5vK61_5G2",
                "target": "i35CvFt-eabaMKJ2gOG2W",
                "packHuntAttack": false,
                "generatedBy": "tkhIgqfgMApJ5vK61_5G2"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/attacker_deals_damage",
                "source": "tkhIgqfgMApJ5vK61_5G2",
                "target": "i35CvFt-eabaMKJ2gOG2W",
                "amount": 4,
                "generatedBy": "tkhIgqfgMApJ5vK61_5G2"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/deal_damage",
                "source": "tkhIgqfgMApJ5vK61_5G2",
                "target": "i35CvFt-eabaMKJ2gOG2W",
                "amount": 4,
                "generatedBy": "tkhIgqfgMApJ5vK61_5G2"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_energy_from_creature_or_magi",
                "source": "tkhIgqfgMApJ5vK61_5G2",
                "target": "i35CvFt-eabaMKJ2gOG2W",
                "attack": true,
                "amount": 4,
                "generatedBy": "tkhIgqfgMApJ5vK61_5G2"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/energy_discarded_from_creature",
                "amount": 4,
                "attack": true,
                "spell": false,
                "relic": false,
                "source": {
                    "id": "tkhIgqfgMApJ5vK61_5G2"
                },
                "variable": "damageDealt",
                "target": {
                    "id": "i35CvFt-eabaMKJ2gOG2W"
                },
                "generatedBy": "tkhIgqfgMApJ5vK61_5G2"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/defender_deals_damage",
                "source": "i35CvFt-eabaMKJ2gOG2W",
                "target": "tkhIgqfgMApJ5vK61_5G2",
                "amount": 6,
                "generatedBy": "tkhIgqfgMApJ5vK61_5G2"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/deal_damage",
                "source": "i35CvFt-eabaMKJ2gOG2W",
                "target": "tkhIgqfgMApJ5vK61_5G2",
                "amount": 6,
                "generatedBy": "tkhIgqfgMApJ5vK61_5G2"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/discard_energy_from_creature_or_magi",
                "source": "i35CvFt-eabaMKJ2gOG2W",
                "target": "tkhIgqfgMApJ5vK61_5G2",
                "attack": true,
                "amount": 6,
                "generatedBy": "tkhIgqfgMApJ5vK61_5G2"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/energy_discarded_from_creature",
                "amount": 4,
                "attack": true,
                "spell": false,
                "relic": false,
                "source": {
                    "id": "i35CvFt-eabaMKJ2gOG2W"
                },
                "variable": "damageDealt",
                "target": {
                    "id": "tkhIgqfgMApJ5vK61_5G2"
                },
                "generatedBy": "tkhIgqfgMApJ5vK61_5G2"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "tkhIgqfgMApJ5vK61_5G2",
                    "owner": 2,
                    "card": "Carillion",
                    "data": {
                        "energy": 0,
                        "controller": 2,
                        "attacked": 1,
                        "actionsUsed": [],
                        "energyLostThisTurn": 4,
                        "defeatedCreature": false,
                        "hasAttacked": true,
                        "wasAttacked": false
                    }
                },
                "sourceZone": "zones/in_play",
                "destinationCard": {
                    "id": "YOX-Qp3x4v7lz3l5PMlIe",
                    "owner": 2,
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
                    }
                },
                "destinationZone": "zones/discard",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "tkhIgqfgMApJ5vK61_5G2"
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 3
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/play",
                "player": 2,
                "payload": {
                    "card": {
                        "id": "bsbvqu92-DmLvgGHE3wIJ",
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
                    },
                    "player": 2
                },
                "forcePriority": false
            },
            {
                "type": "actions/effect",
                "effectType": "effects/paying_energy_for_creature",
                "from": {
                    "id": "ZzSK-NoFth830BTjTfaHt"
                },
                "amount": 4,
                "player": 2,
                "generatedBy": "bsbvqu92-DmLvgGHE3wIJ"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/remove_energy_from_magi",
                "target": {
                    "id": "ZzSK-NoFth830BTjTfaHt",
                    "owner": 2,
                    "card": "Tryn",
                    "data": {
                        "energy": 6,
                        "controller": 2,
                        "attacked": 0,
                        "actionsUsed": [
                            "Refresh",
                            "Refresh"
                        ],
                        "energyLostThisTurn": 39,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 4,
                "generatedBy": "bsbvqu92-DmLvgGHE3wIJ",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/play_creature",
                "card": {
                    "id": "bsbvqu92-DmLvgGHE3wIJ",
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
                },
                "player": 2,
                "generatedBy": "bsbvqu92-DmLvgGHE3wIJ"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "bsbvqu92-DmLvgGHE3wIJ",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/hand",
                "destinationCard": {
                    "id": "uLbCEfj9y6EDkDN82wTDZ",
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
                },
                "destinationZone": "zones/in_play",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "bsbvqu92-DmLvgGHE3wIJ"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "uLbCEfj9y6EDkDN82wTDZ"
                },
                "source": false,
                "amount": 4,
                "generatedBy": "bsbvqu92-DmLvgGHE3wIJ"
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 4
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 5
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "Bn8pO_2tCBnmo0gbM5gp4",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "qPcSM3Rrqh1IrguRIsOz7",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "iEX5k_ruPwEaBgrkDGRXb"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/draw",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "klnf2PBU2Qs2IWMOGYs1d",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "sourceZone": "zones/deck",
                "destinationCard": {
                    "id": "2F-F3vo9k5CuLZ_jhJZ-1",
                    "owner": 2,
                    "card": null,
                    "data": null
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 2,
                "generatedBy": "iEX5k_ruPwEaBgrkDGRXb"
            },
            {
                "type": "actions/pass",
                "player": 2,
                "newStep": 0
            },
            {
                "type": "actions/effect",
                "effectType": "effects/end_of_turn",
                "player": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_of_turn",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_magi",
                "source": {
                    "id": "hWMPXqay5rju-XAsUqL1T"
                },
                "target": {
                    "id": "hWMPXqay5rju-XAsUqL1T"
                },
                "amount": 6
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "i35CvFt-eabaMKJ2gOG2W"
                },
                "source": false,
                "amount": 2,
                "generatedBy": "cjkyrv_q5ip726krlBmba"
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/play",
                "player": 1,
                "payload": {
                    "card": {
                        "id": "j8ZIUUnNFs4bEwK3uL4iC",
                        "owner": 1,
                        "card": "Updraft",
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
                    },
                    "player": 1
                },
                "forcePriority": false
            },
            {
                "type": "actions/effect",
                "effectType": "effects/play_spell",
                "player": 1,
                "card": {
                    "id": "j8ZIUUnNFs4bEwK3uL4iC",
                    "owner": 1,
                    "card": "Updraft",
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
                },
                "generatedBy": "j8ZIUUnNFs4bEwK3uL4iC"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/paying_energy_for_spell",
                "from": {
                    "id": "hWMPXqay5rju-XAsUqL1T"
                },
                "amount": 1,
                "player": 1,
                "generatedBy": "j8ZIUUnNFs4bEwK3uL4iC"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/remove_energy_from_magi",
                "target": {
                    "id": "hWMPXqay5rju-XAsUqL1T",
                    "owner": 1,
                    "card": "Ora",
                    "data": {
                        "energy": 9,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 56,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 1,
                "generatedBy": "j8ZIUUnNFs4bEwK3uL4iC",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "j8ZIUUnNFs4bEwK3uL4iC",
                    "owner": 1,
                    "card": "Updraft",
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
                },
                "sourceZone": "zones/hand",
                "destinationCard": {
                    "id": "4Rvt7Xd_K8UpaQDB-s0IM",
                    "owner": 1,
                    "card": "Updraft",
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
                },
                "destinationZone": "zones/discard",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "j8ZIUUnNFs4bEwK3uL4iC"
            },
            {
                "type": "actions/enter_prompt",
                "promptType": "prompt/own_creature",
                "promptParams": {},
                "message": "Select your creature. Its energy will be moved onto your Magi and the creature will return to your hand.",
                "generatedBy": "j8ZIUUnNFs4bEwK3uL4iC",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/resolve_prompt",
                "player": 1,
                "targetCard": {
                    "id": "i35CvFt-eabaMKJ2gOG2W",
                    "owner": 1,
                    "card": "Orathan Flyer",
                    "data": {
                        "energy": 4,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 0,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "target": "i35CvFt-eabaMKJ2gOG2W"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/return_creature_returning_energy",
                "target": {
                    "id": "i35CvFt-eabaMKJ2gOG2W"
                },
                "generatedBy": "j8ZIUUnNFs4bEwK3uL4iC"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_magi",
                "source": {
                    "id": "hWMPXqay5rju-XAsUqL1T"
                },
                "target": {
                    "id": "hWMPXqay5rju-XAsUqL1T"
                },
                "amount": 4
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "i35CvFt-eabaMKJ2gOG2W",
                    "owner": 1,
                    "card": "Orathan Flyer",
                    "data": {
                        "energy": 4,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 0,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "sourceZone": "zones/in_play",
                "destinationCard": {
                    "id": "XHFRftCtPWOES_jG5un-z",
                    "owner": 1,
                    "card": "Orathan Flyer",
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
                },
                "destinationZone": "zones/hand",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "j8ZIUUnNFs4bEwK3uL4iC"
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 2
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/pass",
                "player": 1,
                "newStep": 3
            },
            {
                "type": "actions/effect",
                "effectType": "effects/start_step",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/play",
                "player": 1,
                "payload": {
                    "card": {
                        "id": "MWjEMptviMQmjL_xQYEjH",
                        "owner": 1,
                        "card": "Orathan Flyer",
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
                    },
                    "player": 1
                },
                "forcePriority": false
            },
            {
                "type": "actions/effect",
                "effectType": "effects/paying_energy_for_creature",
                "from": {
                    "id": "hWMPXqay5rju-XAsUqL1T"
                },
                "amount": 5,
                "player": 1,
                "generatedBy": "MWjEMptviMQmjL_xQYEjH"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/remove_energy_from_magi",
                "target": {
                    "id": "hWMPXqay5rju-XAsUqL1T",
                    "owner": 1,
                    "card": "Ora",
                    "data": {
                        "energy": 12,
                        "controller": 1,
                        "attacked": 0,
                        "actionsUsed": [],
                        "energyLostThisTurn": 57,
                        "defeatedCreature": false,
                        "hasAttacked": false,
                        "wasAttacked": false
                    }
                },
                "amount": 5,
                "generatedBy": "MWjEMptviMQmjL_xQYEjH",
                "player": 1
            },
            {
                "type": "actions/effect",
                "effectType": "effects/play_creature",
                "card": {
                    "id": "MWjEMptviMQmjL_xQYEjH",
                    "owner": 1,
                    "card": "Orathan Flyer",
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
                },
                "player": 1,
                "generatedBy": "MWjEMptviMQmjL_xQYEjH"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/card_moved_between_zones",
                "sourceCard": {
                    "id": "MWjEMptviMQmjL_xQYEjH",
                    "owner": 1,
                    "card": "Orathan Flyer",
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
                },
                "sourceZone": "zones/hand",
                "destinationCard": {
                    "id": "vxDvbFfzbUiysvsLBEtFB",
                    "owner": 1,
                    "card": "Orathan Flyer",
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
                },
                "destinationZone": "zones/in_play",
                "convertedFor": 1,
                "destOwner": 1,
                "generatedBy": "MWjEMptviMQmjL_xQYEjH"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "vxDvbFfzbUiysvsLBEtFB"
                },
                "source": false,
                "amount": 5,
                "generatedBy": "MWjEMptviMQmjL_xQYEjH"
            },
            {
                "type": "actions/effect",
                "effectType": "effects/add_energy_to_creature",
                "target": {
                    "id": "vxDvbFfzbUiysvsLBEtFB"
                },
                "source": false,
                "amount": 1,
                "generatedBy": "MWjEMptviMQmjL_xQYEjH",
                "player": 1
            },
            {
                "type": "display/priority",
                "player": 1
            },
            {
                "type": "actions/play",
                "player": 1,
                "payload": {
                    "card": {
                        "id": "rxnIY6xUWtaYeimhvL2Mp",
                        "owner": 1,
                        "card": "Ayebaw",
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
                    },
                    "player": 1
                },
                "forcePriority": false
            },
            {
                "type": "actions/enter_prompt",
                "promptType": "prompt/payment_source",
                "paymentType": "types/creature",
                "cards": [
                    {
                        "id": "vxDvbFfzbUiysvsLBEtFB"
                    },
                    {
                        "id": "hWMPXqay5rju-XAsUqL1T"
                    }
                ],
                "amount": 5,
                "generatedBy": "rxnIY6xUWtaYeimhvL2Mp",
                "player": 1
            }
        ];

        for (const action of log) {
            state.update(action)
        }

        expect(state.state.prompt).toEqual(true);
        expect(state.state.promptType).toEqual('prompt/payment_source')
    })
})