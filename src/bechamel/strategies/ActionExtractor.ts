import CardInGame from 'moonlands/src/classes/CardInGame';
import { State } from 'moonlands/src/index'
import { ACTION_ATTACK, PROPERTY_ATTACKS_PER_TURN, ACTION_PASS, TYPE_CREATURE, ZONE_TYPE_ACTIVE_MAGI, ZONE_TYPE_IN_PLAY, PROMPT_TYPE_OWN_SINGLE_CREATURE, ACTION_RESOLVE_PROMPT, PROMPT_TYPE_MAY_ABILITY, PROMPT_TYPE_NUMBER, PROMPT_TYPE_SINGLE_CREATURE, PROMPT_TYPE_SINGLE_MAGI, ACTION_POWER, ZONE_TYPE_HAND, TYPE_SPELL, ACTION_PLAY, REGION_UNIVERSAL, PROMPT_TYPE_SINGLE_CREATURE_FILTERED, PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI, ACTION_EFFECT, EFFECT_TYPE_CARD_MOVED_BETWEEN_ZONES, PROPERTY_CONTROLLER, PROPERTY_CAN_BE_ATTACKED, PROPERTY_ABLE_TO_ATTACK, PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE, PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES, PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES } from '../const';
import { ActionOnHold, SimulationEntity } from '../types';
import { HashBuilder } from './HashBuilder';
import { PROMPT_TYPE_ALTERNATIVE, PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE, PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE, PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES, PROMPT_TYPE_MAGI_WITHOUT_CREATURES, PROMPT_TYPE_PAYMENT_SOURCE, PROMPT_TYPE_PLAYER, PROMPT_TYPE_POWER_ON_MAGI, PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE, PROMPT_TYPE_RELIC, SELECTOR_CREATURES_OF_PLAYER, TYPE_RELIC } from 'moonlands/src/const';
import { C2SAction } from '../../clientProtocol';
import { AnyEffectType } from 'moonlands/src/types';
import { ResolvePaymentSourcePrompt } from 'moonlands/src/types/resolvePrompt';

const STEP_NAME = {
  ENERGIZE: 0,
  PRS1: 1,
  ATTACK: 2,
  CREATURES: 3,
  PRS2: 4,
  DRAW: 5,
}

type AttackPattern = {
  from: string,
  add?: string,
  to: string,
}

export class ActionExtractor {
  public static extractActions(sim: State, playerId: number, opponentId: number, actionLog: ActionOnHold[], previousHash: string, hashBuilder: HashBuilder): SimulationEntity[] {
    if (sim.state.activePlayer !== playerId) {
      return []
    }

    if (sim.state.prompt) {
      return ActionExtractor.extractPromptAction(sim, playerId, opponentId, actionLog, previousHash);
    }
    const step = sim.state.step
    switch (step) {
      case STEP_NAME.ENERGIZE: {
        return []
      }
      // Fall through is intended
      case STEP_NAME.PRS1:
      case STEP_NAME.PRS2: {
        const magiCard: CardInGame | null = sim.getZone(ZONE_TYPE_ACTIVE_MAGI, playerId).card

        if (!magiCard) return [ActionExtractor.getPassAction(sim, playerId, actionLog, previousHash)]

        const mySimCreatures = (sim.getZone(ZONE_TYPE_IN_PLAY).cards as CardInGame[]).filter(card => sim.modifyByStaticAbilities(card, PROPERTY_CONTROLLER) === playerId)
        const creaturesWithPowers = mySimCreatures.filter(creature => creature.card.data.powers && creature.data.actionsUsed.length === 0)

        const simulationQueue: SimulationEntity[] = []

        simulationQueue.push(ActionExtractor.getPassAction(sim, playerId, actionLog, previousHash))

        creaturesWithPowers.forEach(card => {
          const power = card.card?.data?.powers ? card.card.data.powers[0] : null
          // Don't forget: Relic powers are paid from the Magi
          const energyReserve = card.card.type === TYPE_CREATURE ? card.data.energy : magiCard.data.energy
          if (power && typeof power.cost == 'number' && power.cost <= energyReserve) {
            const innerSim = sim.clone()
            const action: AnyEffectType = {
              type: ACTION_POWER,
              source: innerSim.getZone(ZONE_TYPE_IN_PLAY).byId(card.id),
              power,
              player: playerId,
            } as AnyEffectType;
            simulationQueue.push({
              sim: innerSim,
              action,
              actionLog: [...actionLog, {
                action,
                hash: previousHash,
              }],
              previousHash,
            })
          }
        })

        if (magiCard) {
          if (magiCard.card.data.powers && magiCard.card.data.powers.length) {
            magiCard.card.data.powers.forEach((power: Record<string, any>) => {
              if (!magiCard.data.actionsUsed.includes(power.name) && power.cost <= magiCard.data.energy) {
                const innerSim = sim.clone()
                const source = innerSim.getZone(ZONE_TYPE_ACTIVE_MAGI, playerId).card
                if (source) {
                  const action: AnyEffectType = {
                    type: ACTION_POWER,
                    source,
                    power,
                    player: playerId,
                  } as AnyEffectType;
                  simulationQueue.push({
                    sim: innerSim,
                    action,
                    actionLog: [...actionLog, {
                      action,
                      hash: previousHash,
                    }],
                    previousHash,
                  })
                }
              }
            })
          }

          // Never try to cast these (for now)
          const FORBIDDEN_SPELLS = ["Hyren's Call"];

          const playableSpells = sim.getZone(ZONE_TYPE_HAND, playerId).cards.filter(
            card => card.card.type === TYPE_SPELL &&
              typeof card.card.cost == 'number' &&
              card.card.cost <= magiCard.data.energy &&
              !FORBIDDEN_SPELLS.includes(card.card.name)
          )
          playableSpells.forEach(spell => {
            const innerSim = sim.clone()
            const card = innerSim.getZone(ZONE_TYPE_HAND, playerId).byId(spell.id)
            if (card && typeof spell.card.cost == 'number' && spell.card.cost <= magiCard.data.energy) {
              const action: AnyEffectType = {
                type: ACTION_PLAY,
                payload: {
                  card,
                  player: playerId,
                },
                forcePriority: false,
                player: playerId,
              }
              simulationQueue.push({
                sim: innerSim,
                action,
                actionLog: [...actionLog, {
                  action,
                  hash: hashBuilder.makeHash(innerSim),
                }],
                previousHash,
              })
            }
          })
        }
        return simulationQueue
      }
      case STEP_NAME.ATTACK: {
        const attackPatterns = ActionExtractor.getAllAttackPatterns(sim, playerId, opponentId)

        const workEntities: SimulationEntity[] = [ActionExtractor.getPassAction(sim, playerId, actionLog, previousHash)]
        attackPatterns.forEach(pattern => {
          const innerSim = sim.clone()
          const source = innerSim.getZone(ZONE_TYPE_IN_PLAY).byId(pattern.from)
          const target = innerSim.getZone(ZONE_TYPE_IN_PLAY).byId(pattern.to) || innerSim.getZone(ZONE_TYPE_ACTIVE_MAGI, opponentId).byId(pattern.to)

          const additionalAttackers = pattern.add ? [innerSim.getZone(ZONE_TYPE_IN_PLAY).byId(pattern.add)] : []
          if (source && target) {
            const action = additionalAttackers ? {
              type: ACTION_ATTACK,
              source,
              additionalAttackers,
              target,
              player: playerId,
            } :
              {
                type: ACTION_ATTACK,
                source,
                target,
                player: playerId,
              }
            workEntities.push({
              sim: innerSim,
              action,
              actionLog: [...actionLog, {
                action,
                hash: previousHash,
              } as ActionOnHold],
              previousHash,
            })
          }
        })
        return workEntities
      }
      case STEP_NAME.CREATURES: {
        const magiCard: CardInGame | null = sim.getZone(ZONE_TYPE_ACTIVE_MAGI, playerId).card
        const simulationQueue: SimulationEntity[] = [ActionExtractor.getPassAction(sim, playerId, actionLog, previousHash)]
        if (magiCard) {
          const playableCreatures = sim.getZone(ZONE_TYPE_HAND, playerId).cards.filter(card => card.card.type === TYPE_CREATURE)
          playableCreatures.forEach(creature => {
            const regionTax: number = (creature.card.region === magiCard.card.region || creature.card.region === REGION_UNIVERSAL) ? 0 : 1
            if ((typeof creature.card.cost == 'number') && (creature.card.cost + regionTax <= magiCard.data.energy)) {
              const innerSim = sim.clone()
              innerSim.setOnAction(action => {
                if (action.type === ACTION_EFFECT &&
                  action.effectType === EFFECT_TYPE_CARD_MOVED_BETWEEN_ZONES // &&
                  // action.sourceZone === ZONE_TYPE_HAND &&
                  // action.destinationZone === ZONE_TYPE_IN_PLAY
                ) {
                  hashBuilder.registerChildHash(action.sourceCard.id, action.destinationCard.id);
                }
              });
              const card = innerSim.getZone(ZONE_TYPE_HAND, playerId).byId(creature.id)
              if (card) {
                const action: AnyEffectType = {
                  type: ACTION_PLAY,
                  payload: {
                    card,
                    player: playerId,
                  },
                  forcePriority: false,
                  player: playerId,
                }
                simulationQueue.push({
                  sim: innerSim,
                  action,
                  actionLog: [...actionLog, {
                    action,
                    hash: previousHash,
                  }],
                  previousHash,
                })
              }
            }
          })
        }
        return simulationQueue
      }
      case STEP_NAME.DRAW: {
        return []
      }
    }

    return []
  }

  public static getPassAction(sim: State, playerId: number, actionLog: ActionOnHold[], previousHash: string): SimulationEntity {
    const innerSim = sim.clone()
    const passAction: C2SAction = {
      type: ACTION_PASS,
      player: playerId,
    };
    return {
      sim: innerSim,
      action: passAction,
      actionLog: [...actionLog, {
        action: passAction,
        hash: previousHash,
      }],
      previousHash,
    }
  }

  public static extractPromptAction(sim: State, playerId: number, opponentId: number, actionLog: ActionOnHold[], previousHash: string): SimulationEntity[] {
    switch (sim.state.promptType) {
      case PROMPT_TYPE_MAY_ABILITY: {
        const actionYes: AnyEffectType = {
          type: ACTION_RESOLVE_PROMPT,
          // promptType: PROMPT_TYPE_MAY_ABILITY,
          generatedBy: sim.state.promptGeneratedBy,
          useEffect: true,
          player: sim.state.promptPlayer || playerId,
        }
        const actionNo: AnyEffectType = {
          type: ACTION_RESOLVE_PROMPT,
          // promptType: PROMPT_TYPE_MAY_ABILITY,
          generatedBy: sim.state.promptGeneratedBy,
          useEffect: false,
          player: sim.state.promptPlayer || playerId,
        }
        return [
          {
            sim: sim.clone(),
            action: actionYes,
            actionLog: [...actionLog, {
              action: actionYes,
              hash: previousHash,
            }],
            previousHash,
          },
          {
            sim: sim.clone(),
            action: actionNo,
            actionLog: [...actionLog, {
              action: actionNo,
              hash: previousHash,
            }],
            previousHash,
          },
        ]
      }
      case PROMPT_TYPE_ALTERNATIVE: {
        if (sim.state.promptParams.alternatives) {
          return sim.state.promptParams.alternatives.map(alternative => {
            const action: AnyEffectType = {
              type: ACTION_RESOLVE_PROMPT,
              // promptType: PROMPT_TYPE_ALTERNATIVE,
              player: sim.state.promptPlayer as number,
              alternative: alternative.value,
            }
            return ({
              sim: sim.clone(),
              action,
              actionLog: [...actionLog, {
                action,
                hash: previousHash,
              }],
              previousHash,
            })
          });
        }

        return []
      }
      case PROMPT_TYPE_SINGLE_CREATURE_FILTERED: {
        const allCreatures: CardInGame[] = sim.getZone(ZONE_TYPE_IN_PLAY).cards
          .filter((card: CardInGame) => card.card.type === TYPE_CREATURE)
        let filteredCreatures = allCreatures
        if (sim.state.promptParams.restrictions) {
          const filter = sim.makeCardFilter(sim.state.promptParams.restrictions)
          filteredCreatures = allCreatures.filter(filter)
        }
        const simulationQueue: SimulationEntity[] = []
        filteredCreatures.forEach(creature => {
          const innerSim = sim.clone()
          const action: AnyEffectType = {
            type: ACTION_RESOLVE_PROMPT,
            promptType: PROMPT_TYPE_OWN_SINGLE_CREATURE,
            target: innerSim.getZone(ZONE_TYPE_IN_PLAY).byId(creature.id),
            generatedBy: innerSim.state.promptGeneratedBy,
            player: innerSim.state.promptPlayer,
          } as AnyEffectType;
          simulationQueue.push(
            {
              sim: innerSim,
              action,
              actionLog: [...actionLog, {
                action,
                hash: previousHash,
              }],
              previousHash,
            }
          )
        })
        return simulationQueue
      }
      case PROMPT_TYPE_SINGLE_CREATURE: {
        const allCreatures: CardInGame[] = sim.getZone(ZONE_TYPE_IN_PLAY).cards
          .filter((card: CardInGame) => card.card.type === TYPE_CREATURE)
        const simulationQueue: SimulationEntity[] = []
        allCreatures.forEach(creature => {
          const innerSim = sim.clone()
          const action: AnyEffectType = {
            type: ACTION_RESOLVE_PROMPT,
            promptType: PROMPT_TYPE_SINGLE_CREATURE,
            target: innerSim.getZone(ZONE_TYPE_IN_PLAY).byId(creature.id),
            generatedBy: innerSim.state.promptGeneratedBy,
            player: innerSim.state.promptPlayer,
          } as AnyEffectType;
          simulationQueue.push(
            {
              sim: innerSim,
              action,
              actionLog: [...actionLog, {
                action,
                hash: previousHash,
              }],
              previousHash,
            }
          )
        })
        return simulationQueue
      }
      case PROMPT_TYPE_RELIC: {
        const allRelics: CardInGame[] = sim.getZone(ZONE_TYPE_IN_PLAY).cards
          .filter((card: CardInGame) => card.card.type === TYPE_RELIC)
        const simulationQueue: SimulationEntity[] = []
        allRelics.forEach(relic => {
          const innerSim = sim.clone()
          const action: AnyEffectType = {
            type: ACTION_RESOLVE_PROMPT,
            promptType: PROMPT_TYPE_RELIC,
            target: innerSim.getZone(ZONE_TYPE_IN_PLAY).byId(relic.id),
            generatedBy: innerSim.state.promptGeneratedBy,
            player: innerSim.state.promptPlayer,
          } as AnyEffectType;
          simulationQueue.push(
            {
              sim: innerSim,
              action,
              actionLog: [...actionLog, {
                action,
                hash: previousHash,
              }],
              previousHash,
            }
          )
        })
        return simulationQueue
      }
      case PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE: {
        const allCreatures: CardInGame[] = sim.getZone(ZONE_TYPE_IN_PLAY).cards
          .filter((card: CardInGame) => card.card.type === TYPE_CREATURE && card.id !== sim.state.promptGeneratedBy)
        const simulationQueue: SimulationEntity[] = []
        allCreatures.forEach(creature => {
          const innerSim = sim.clone()
          const action: AnyEffectType = {
            type: ACTION_RESOLVE_PROMPT,
            // promptType: PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE,
            target: innerSim.getZone(ZONE_TYPE_IN_PLAY).byId(creature.id),
            generatedBy: innerSim.state.promptGeneratedBy,
            player: innerSim.state.promptPlayer as number,
          }
          simulationQueue.push(
            {
              sim: innerSim,
              action,
              actionLog: [...actionLog, {
                action,
                hash: previousHash,
              }],
              previousHash,
            }
          )
        })
        return simulationQueue
      }
      case PROMPT_TYPE_NUMBER: {
        const min = sim.state.promptParams.min
        const max = sim.state.promptParams.max
        const simulationQueue: SimulationEntity[] = []
        if (typeof min === 'number' && typeof max === 'number') {
          for (let i = min; i < max; i++) {
            const innerSim = sim.clone()
            const action: AnyEffectType = {
              type: ACTION_RESOLVE_PROMPT,
              // promptType: PROMPT_TYPE_NUMBER,
              number: i,
              generatedBy: sim.state.promptGeneratedBy,
              player: sim.state.promptPlayer as number,
            }
            simulationQueue.push(
              {
                sim: innerSim,
                action,
                actionLog: [...actionLog, {
                  action,
                  hash: previousHash,
                }],
                previousHash,
              }
            )
          }
        }
        return simulationQueue
      }
      case PROMPT_TYPE_OWN_SINGLE_CREATURE: {
        const promptPlayer = sim.state.promptPlayer;
        const myCreatures: CardInGame[] = sim.getZone(ZONE_TYPE_IN_PLAY).cards
          .filter((card: CardInGame) => card.card.type === TYPE_CREATURE && sim.modifyByStaticAbilities(card, PROPERTY_CONTROLLER) === promptPlayer)
        const simulationQueue: SimulationEntity[] = []
        // console.log(`My creatures for the prompt: ${myCreatures.map(creature=>`${creature.card.name}(${creature.id})`).join(' ')}`)
        myCreatures.forEach(creature => {
          const innerSim = sim.clone()
          const action: AnyEffectType = {
            type: ACTION_RESOLVE_PROMPT,
            // promptType: PROMPT_TYPE_OWN_SINGLE_CREATURE,
            target: innerSim.getZone(ZONE_TYPE_IN_PLAY).byId(creature.id),
            generatedBy: innerSim.state.promptGeneratedBy,
            player: innerSim.state.promptPlayer as number,
          }
          simulationQueue.push(
            {
              sim: innerSim,
              action,
              actionLog: [...actionLog, {
                action,
                hash: previousHash,
              }],
              previousHash,
            }
          )
        })

        return simulationQueue
      }
      case PROMPT_TYPE_SINGLE_MAGI: {
        const myMagi: CardInGame | null = sim.getZone(ZONE_TYPE_ACTIVE_MAGI, playerId).card
        const simulationQueue: SimulationEntity[] = []
        if (myMagi) {
          const innerSim = sim.clone()
          const newMyMagi = innerSim.getZone(ZONE_TYPE_ACTIVE_MAGI, playerId).card;
          if (newMyMagi) {
            const action: AnyEffectType = {
              type: ACTION_RESOLVE_PROMPT,
              // promptType: PROMPT_TYPE_SINGLE_MAGI,
              target: newMyMagi,
              generatedBy: innerSim.state.promptGeneratedBy,
              player: innerSim.state.promptPlayer as number,
            }
            simulationQueue.push(
              {
                sim: innerSim,
                action,
                actionLog: [...actionLog, {
                  action,
                  hash: previousHash,
                }],
                previousHash,
              }
            )
          }
        }
        const opponentMagi: CardInGame | null = sim.getZone(ZONE_TYPE_ACTIVE_MAGI, opponentId).card
        if (opponentMagi) {
          const innerSim = sim.clone()
          const newOpponentMagi = innerSim.getZone(ZONE_TYPE_ACTIVE_MAGI, opponentId).card;
          if (newOpponentMagi) {
            const action: AnyEffectType = {
              type: ACTION_RESOLVE_PROMPT,
              // promptType: PROMPT_TYPE_SINGLE_MAGI,
              target: newOpponentMagi,
              generatedBy: innerSim.state.promptGeneratedBy,
              player: innerSim.state.promptPlayer as number,
            }
            simulationQueue.push(
              {
                sim: innerSim,
                action,
                actionLog: [...actionLog, {
                  action,
                  hash: previousHash,
                }],
                previousHash,
              }
            )
          }
        }

        return simulationQueue
      }
      // PROMPT_TYPE_POWER_ON_MAGI is not in PromptTypeType yet
      case PROMPT_TYPE_POWER_ON_MAGI: {
        const myMagi: CardInGame | null = sim.getZone(ZONE_TYPE_ACTIVE_MAGI, playerId).card

        const simulationQueue: SimulationEntity[] = []
        if (myMagi && myMagi.card.data.powers && myMagi.card.data.powers.length) {
          const innerSim = sim.clone()
          const newMyMagiPowers = innerSim.getZone(ZONE_TYPE_ACTIVE_MAGI, playerId)?.card?.card?.data?.powers;
          if (newMyMagiPowers && newMyMagiPowers.length) {
            const newMyMagiPower = newMyMagiPowers[0];

            if (newMyMagiPower) {
              const action: AnyEffectType = {
                type: ACTION_RESOLVE_PROMPT,
                // promptType: PROMPT_TYPE_MAGI_WITHOUT_CREATURES,
                // @ts-ignore
                power: newMyMagiPower,
                generatedBy: innerSim.state.promptGeneratedBy,
                player: innerSim.state.promptPlayer as number,
              }
              simulationQueue.push(
                {
                  sim: innerSim,
                  action,
                  actionLog: [...actionLog, {
                    action,
                    hash: previousHash,
                  }],
                  previousHash,
                }
              )
            }
          }
        }

        return simulationQueue
      }
      // Just so the bot won't stop if it encounters this prompt
      case PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE: {
        const simulationQueue: SimulationEntity[] = []

        const innerSim = sim.clone()
        const action: AnyEffectType = {
          type: ACTION_RESOLVE_PROMPT,
          // promptType: PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE,
          cardsOrder: innerSim.state.promptParams?.cards?.map(({ id }) => id) || [],
          generatedBy: innerSim.state.promptGeneratedBy,
          player: innerSim.state.promptPlayer as number,
        }
        simulationQueue.push(
          {
            sim: innerSim,
            action,
            actionLog: [...actionLog, {
              action,
              hash: previousHash,
            }],
            previousHash,
          }
        )

        return simulationQueue
      }
      case PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES: {
        const simulationQueue: SimulationEntity[] = []

        const enemyCreatures = sim.getZone(ZONE_TYPE_IN_PLAY).cards.filter(
          card => card.card.type === TYPE_CREATURE && sim.modifyByStaticAbilities(card, PROPERTY_CONTROLLER) === opponentId
        )
        const ids: [string, number][] = enemyCreatures.map(card => [card.id, card.data.energy])
        ids.sort((a, b) => a[1] - b[1])

        let damageLeft = sim.state.promptParams.amount;
        if (typeof damageLeft == 'number') {
          const damageMap: Record<string, number> = {}
          let lastDamagedId: string | null = null;

          while (damageLeft > 0 && ids.length) {
            const creature = ids.shift()!

            const damageWeCanDeal = Math.min(creature[1], damageLeft)
            lastDamagedId = creature[0]
            damageMap[lastDamagedId] = damageWeCanDeal
            damageLeft -= damageWeCanDeal
          }

          // Maybe we had more than enough damage for everyone?
          // If so, pile the rest on the last creature
          if (damageLeft > 0 && lastDamagedId) {
            damageMap[lastDamagedId] = damageMap[lastDamagedId] + damageLeft
          }

          const innerSim = sim.clone()
          const action: AnyEffectType = {
            type: ACTION_RESOLVE_PROMPT,
            // promptType: PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES,
            damageOnCreatures: damageMap,
            generatedBy: innerSim.state.promptGeneratedBy,
            player: innerSim.state.promptPlayer as number,
          }
          simulationQueue.push(
            {
              sim: innerSim,
              action,
              actionLog: [...actionLog, {
                action,
                hash: previousHash,
              }],
              previousHash,
            }
          )
        }
        return simulationQueue
      }
      case PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES: {
        const simulationQueue: SimulationEntity[] = []

        const enemyCreatures = sim.getZone(ZONE_TYPE_IN_PLAY).cards.filter(
          card => card.card.type === TYPE_CREATURE && sim.modifyByStaticAbilities(card, PROPERTY_CONTROLLER) === playerId
        )
        const ids: [string, number][] = enemyCreatures.map(card => [card.id, card.data.energy])
        ids.sort((a, b) => a[1] - b[1])

        let energyLeft = sim.state.promptParams.amount;
        if (typeof energyLeft == 'number') {
          const energyMap: Record<string, number> = {}
          let lastEnergyId: string | null = null;

          while (energyLeft > 0 && ids.length) {
            const creature = ids.shift()!

            const energyWeCanGive = Math.min(creature[1], energyLeft)
            lastEnergyId = creature[0]
            energyMap[lastEnergyId] = energyWeCanGive
            energyLeft -= energyWeCanGive
          }

          // Maybe we had more than enough energy for everyone?
          // If so, pile the rest on the last creature
          if (energyLeft > 0 && lastEnergyId) {
            energyMap[lastEnergyId] = energyMap[lastEnergyId] + energyLeft
          }

          const innerSim = sim.clone()
          const action: AnyEffectType = {
            type: ACTION_RESOLVE_PROMPT,
            // promptType: PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES,
            energyOnCreatures: energyMap,
            generatedBy: innerSim.state.promptGeneratedBy,
            player: innerSim.state.promptPlayer as number,
          }
          simulationQueue.push(
            {
              sim: innerSim,
              action,
              actionLog: [...actionLog, {
                action,
                hash: previousHash,
              }],
              previousHash,
            }
          )
        }
        return simulationQueue
      }
      case PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES: {
        const simulationQueue: SimulationEntity[] = []

        const myCreatures = sim.getZone(ZONE_TYPE_IN_PLAY).cards.filter(
          card => card.card.type === TYPE_CREATURE && sim.modifyByStaticAbilities(card, PROPERTY_CONTROLLER) === playerId
        )
        const ids: [string, number][] = myCreatures.map(card => [card.id, card.data.energy])
        const energyDistribution = Object.fromEntries(ids)
        const innerSim = sim.clone()
        const action: AnyEffectType = {
          type: ACTION_RESOLVE_PROMPT,
          // promptType: PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES,
          energyOnCreatures: energyDistribution,
          generatedBy: innerSim.state.promptGeneratedBy,
          player: innerSim.state.promptPlayer as number,
        }
        simulationQueue.push(
          {
            sim: innerSim,
            action,
            actionLog: [...actionLog, {
              action,
              hash: previousHash,
            }],
            previousHash,
          }
        )
        return simulationQueue
      }
      case PROMPT_TYPE_MAGI_WITHOUT_CREATURES: {
        const myMagi: CardInGame | null = sim.getZone(ZONE_TYPE_ACTIVE_MAGI, playerId).card
        const iHaveCreatures: boolean = sim.useSelector(SELECTOR_CREATURES_OF_PLAYER, playerId).length > 0;

        const simulationQueue: SimulationEntity[] = []
        if (myMagi && !iHaveCreatures) {
          const innerSim = sim.clone()
          const newMyMagi = innerSim.getZone(ZONE_TYPE_ACTIVE_MAGI, playerId).card;
          if (newMyMagi) {
            const action: AnyEffectType = {
              type: ACTION_RESOLVE_PROMPT,
              // promptType: PROMPT_TYPE_MAGI_WITHOUT_CREATURES,
              target: newMyMagi,
              generatedBy: innerSim.state.promptGeneratedBy,
              player: innerSim.state.promptPlayer as number,
            }
            simulationQueue.push(
              {
                sim: innerSim,
                action,
                actionLog: [...actionLog, {
                  action,
                  hash: previousHash,
                }],
                previousHash,
              }
            )
          }
        }
        const opponentMagi: CardInGame | null = sim.getZone(ZONE_TYPE_ACTIVE_MAGI, opponentId).card
        const opponentHasCreatures: boolean = sim.useSelector(SELECTOR_CREATURES_OF_PLAYER, opponentId).length > 0;
        if (opponentMagi && !opponentHasCreatures) {
          const innerSim = sim.clone()
          const newOpponentMagi = innerSim.getZone(ZONE_TYPE_ACTIVE_MAGI, opponentId).card;
          if (newOpponentMagi) {
            const action: AnyEffectType = {
              type: ACTION_RESOLVE_PROMPT,
              // promptType: PROMPT_TYPE_MAGI_WITHOUT_CREATURES,
              target: newOpponentMagi,
              generatedBy: innerSim.state.promptGeneratedBy,
              player: innerSim.state.promptPlayer as number,
            }
            simulationQueue.push(
              {
                sim: innerSim,
                action,
                actionLog: [...actionLog, {
                  action,
                  hash: previousHash,
                }],
                previousHash,
              }
            )
          }
        }

        return simulationQueue
      }
      case PROMPT_TYPE_PLAYER: {
        const simulationQueue: SimulationEntity[] = []

        const innerSim = sim.clone()
        const action: AnyEffectType = {
          type: ACTION_RESOLVE_PROMPT,
          // promptType: PROMPT_TYPE_PLAYER,
          targetPlayer: playerId,
          generatedBy: innerSim.state.promptGeneratedBy,
          player: innerSim.state.promptPlayer as number,
        }
        simulationQueue.push(
          {
            sim: innerSim,
            action,
            actionLog: [...actionLog, {
              action,
              hash: previousHash,
            }],
            previousHash,
          }
        )

        const oppInnerSim = sim.clone()
        const oppAction: AnyEffectType = {
          type: ACTION_RESOLVE_PROMPT,
          // promptType: PROMPT_TYPE_PLAYER,
          targetPlayer: opponentId,
          generatedBy: oppInnerSim.state.promptGeneratedBy,
          player: oppInnerSim.state.promptPlayer as number,
        }
        simulationQueue.push(
          {
            sim: oppInnerSim,
            action: oppAction,
            actionLog: [...actionLog, {
              action: oppAction,
              hash: previousHash,
            }],
            previousHash,
          }
        )

        return simulationQueue
      }
      case PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI: {
        const myMagi: CardInGame | null = sim.getZone(ZONE_TYPE_ACTIVE_MAGI, playerId).card
        const simulationQueue: SimulationEntity[] = []
        if (myMagi) {
          const innerSim = sim.clone()
          const newMyMagi = innerSim.getZone(ZONE_TYPE_ACTIVE_MAGI, playerId).card;
          if (newMyMagi) {
            const action: AnyEffectType = {
              type: ACTION_RESOLVE_PROMPT,
              // promptType: PROMPT_TYPE_SINGLE_MAGI,
              target: newMyMagi,
              generatedBy: innerSim.state.promptGeneratedBy,
              player: innerSim.state.promptPlayer as number,
            }
            simulationQueue.push(
              {
                sim: innerSim,
                action,
                actionLog: [...actionLog, {
                  action,
                  hash: previousHash,
                }],
                previousHash,
              }
            )
          }
        }
        const opponentMagi: CardInGame | null = sim.getZone(ZONE_TYPE_ACTIVE_MAGI, opponentId).card
        if (opponentMagi) {
          const innerSim = sim.clone()
          const newOpponentMagi = innerSim.getZone(ZONE_TYPE_ACTIVE_MAGI, opponentId).card;
          if (newOpponentMagi) {
            const action: AnyEffectType = {
              type: ACTION_RESOLVE_PROMPT,
              // promptType: PROMPT_TYPE_SINGLE_MAGI,
              target: newOpponentMagi,
              generatedBy: innerSim.state.promptGeneratedBy,
              player: innerSim.state.promptPlayer as number,
            }
            simulationQueue.push(
              {
                sim: innerSim,
                action,
                actionLog: [...actionLog, {
                  action,
                  hash: previousHash,
                }],
                previousHash,
              }
            )
          }
        }
        const allCreatures: CardInGame[] = sim.getZone(ZONE_TYPE_IN_PLAY).cards
          .filter((card: CardInGame) => card.card.type === TYPE_CREATURE)

        allCreatures.forEach(creature => {
          const innerSim = sim.clone()
          const action: AnyEffectType = {
            type: ACTION_RESOLVE_PROMPT,
            // promptType: PROMPT_TYPE_OWN_SINGLE_CREATURE,
            target: innerSim.getZone(ZONE_TYPE_IN_PLAY).byId(creature.id),
            generatedBy: innerSim.state.promptGeneratedBy,
            player: innerSim.state.promptPlayer as number,
          }
          simulationQueue.push(
            {
              sim: innerSim,
              action,
              actionLog: [...actionLog, {
                action,
                hash: previousHash,
              }],
              previousHash,
            }
          )
        })

        return simulationQueue
      }
      case PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE: {
        // const myMagi: CardInGame | null = sim.getZone(ZONE_TYPE_ACTIVE_MAGI, playerId).card
        const simulationQueue: SimulationEntity[] = []
        if (sim.state.promptParams.zone) {
          const zoneCards = sim.getZone(sim.state.promptParams.zone, sim.state.promptParams.zoneOwner).cards;
          // console.log('PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE')
          // We don't want to check all combinations, we can be asked to discard 3 cards from a hand of 13,
          // and suddenly we're facing 286 branches on this prompt alone
          // Sure, for more competitive bot I can add this, but for the start this will do
          const promptCards = (sim.state.promptParams.numberOfCards || 1)
          const numberOfVariants = Math.floor(zoneCards.length / promptCards)
          for (let i = 0; i < numberOfVariants; i++) {
            const innerSim = sim.clone()
            const cards = innerSim.getZone(sim.state.promptParams.zone, sim.state.promptParams.zoneOwner).cards.slice(i * promptCards, promptCards);
            const action: AnyEffectType = {
              type: ACTION_RESOLVE_PROMPT,
              // promptType: PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
              cards: cards,
              // @ts-ignore
              zone: innerSim.state.promptParams.zone,
              zoneOwner: innerSim.state.promptParams.zoneOwner,
              generatedBy: innerSim.state.promptGeneratedBy,
              player: innerSim.state.promptPlayer as number,
            }
            simulationQueue.push({
              sim: innerSim,
              action,
              actionLog: [...actionLog, {
                action,
                hash: previousHash,
              }],
              previousHash,
            })
          }
        }
        return simulationQueue
      }
      case PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE: {
        const simulationQueue: SimulationEntity[] = []
        if (sim.state.promptParams.zone) {
          const zoneCards = sim.getZone(sim.state.promptParams.zone, sim.state.promptParams.zoneOwner).cards;
          // console.log('PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE')
          const promptCards = (sim.state.promptParams.numberOfCards || 1)
          // const numberOfVariants = Math.floor(zoneCards.length / promptCards)
          const upperBound = Math.min(promptCards, zoneCards.length)
          for (let i = 0; i < upperBound; i++) {
            const innerSim = sim.clone()
            const cards = innerSim.getZone(sim.state.promptParams.zone, sim.state.promptParams.zoneOwner).cards.slice(0, i);
            const action: AnyEffectType = {
              type: ACTION_RESOLVE_PROMPT,
              // promptType: PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
              cards: cards,
              generatedBy: innerSim.state.promptGeneratedBy,
              player: innerSim.state.promptPlayer as number,
            }
            simulationQueue.push({
              sim: innerSim,
              action,
              actionLog: [...actionLog, {
                action,
                hash: previousHash,
              }],
              previousHash,
            })
          }
        }
        return simulationQueue
      }
      case PROMPT_TYPE_PAYMENT_SOURCE: {
        const simulationQueue: SimulationEntity[] = []
        if (sim.state.promptParams.cards) {
          for (const card of sim.state.promptParams.cards) {
            const innerSim = sim.clone()

            const foundCreatureCard = innerSim.getZone(ZONE_TYPE_IN_PLAY).byId(card.id);
            const foundMagiCard = innerSim.getZone(ZONE_TYPE_ACTIVE_MAGI, sim.state.promptPlayer).byId(card.id);
            const foundCard = foundCreatureCard || foundMagiCard;
            if (foundCard) {
              const action: ResolvePaymentSourcePrompt = {
                type: ACTION_RESOLVE_PROMPT,
                // promptType: PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
                target: foundCard,
                player: innerSim.state.promptPlayer as number,
              }
              simulationQueue.push({
                sim: innerSim,
                action,
                actionLog: [...actionLog, {
                  action,
                  hash: previousHash,
                }],
                previousHash,
              })
            }

          }
        }
        return simulationQueue;
      }
      default: {
        console.log(`No handler for ${sim.state.promptType} prompt types`)
        return []
      }
    }
  }

  public static getAllAttackPatterns(sim: State, attacker: number, opponent: number): AttackPattern[] {
    const creatures = sim.getZone(ZONE_TYPE_IN_PLAY).cards.filter((card: CardInGame) => card.card.type === TYPE_CREATURE)
    const attackers = creatures.filter((card: CardInGame) => sim.modifyByStaticAbilities(card, PROPERTY_CONTROLLER) === attacker && sim.modifyByStaticAbilities(card, PROPERTY_ABLE_TO_ATTACK) === true)
    const defenders = creatures.filter((card: CardInGame) => sim.modifyByStaticAbilities(card, PROPERTY_CONTROLLER) !== attacker && sim.modifyByStaticAbilities(card, PROPERTY_CAN_BE_ATTACKED) === true)

    const allOpponentCreatures = creatures.filter((card: CardInGame) => sim.modifyByStaticAbilities(card, PROPERTY_CONTROLLER) !== attacker)

    const enemyMagi = sim.getZone(ZONE_TYPE_ACTIVE_MAGI, opponent).cards[0]
    const magiCanBeAttacked = sim.modifyByStaticAbilities(enemyMagi, PROPERTY_CAN_BE_ATTACKED)

    const result: AttackPattern[] = []
    const packHunters = attackers.filter(card => card.card.data.canPackHunt)
    for (let attacker of attackers) {
      const numberOfAttacks = sim.modifyByStaticAbilities(attacker, PROPERTY_ATTACKS_PER_TURN)
      if (attacker.data.attacked < numberOfAttacks) {
        if ((!allOpponentCreatures.length || attacker.card.data.canAttackMagiDirectly) && enemyMagi && enemyMagi.data.energy > 0 && magiCanBeAttacked) {
          result.push({ from: attacker.id, to: enemyMagi.id })
        }
        for (let defender of defenders) {
          result.push({ from: attacker.id, to: defender.id })
          for (let packHunter of packHunters) {
            if (packHunter.id !== attacker.id) {
              result.push({ from: attacker.id, add: packHunter.id, to: defender.id })
            }
          }
        }
      }
    }

    return result
  }
}
