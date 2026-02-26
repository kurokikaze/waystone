import CardInGame from 'moonlands/dist/esm/classes/CardInGame';
import { State } from 'moonlands/dist/esm/index';
import { AnyEffectType } from 'moonlands/dist/esm/types';
import {
    ACTION_ATTACK,
    ACTION_PASS,
    ACTION_PLAY,
    ACTION_POWER,
    ACTION_RESOLVE_PROMPT,
    PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE,
    PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES,
    PROMPT_TYPE_MAY_ABILITY,
    PROMPT_TYPE_NUMBER,
    PROMPT_TYPE_OWN_SINGLE_CREATURE,
    PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES,
    PROMPT_TYPE_SINGLE_CREATURE,
    PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
    PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI,
    PROMPT_TYPE_SINGLE_MAGI,
    PROPERTY_ABLE_TO_ATTACK,
    PROPERTY_CAN_BE_ATTACKED,
    PROPERTY_CONTROLLER,
    REGION_UNIVERSAL,
    TYPE_CREATURE,
    TYPE_SPELL,
    ZONE_TYPE_ACTIVE_MAGI,
    ZONE_TYPE_HAND,
    ZONE_TYPE_IN_PLAY,
} from '../const';
import {
    PROMPT_TYPE_ALTERNATIVE,
    PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE,
    PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
    PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES,
    PROMPT_TYPE_MAGI_WITHOUT_CREATURES,
    PROMPT_TYPE_PAYMENT_SOURCE,
    PROMPT_TYPE_PLAYER,
    PROMPT_TYPE_POWER_ON_MAGI,
    PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE,
    PROMPT_TYPE_RELIC,
    SELECTOR_CREATURES_OF_PLAYER,
    TYPE_RELIC,
} from 'moonlands/dist/esm/const';
import { ActionExtractor } from './ActionExtractor';

// ---------------------------------------------------------------------------
// Action descriptor types
// Each type carries only stable identifiers (card ids, names, numbers) so
// the same descriptor can be applied to any equivalent State instance.
// ---------------------------------------------------------------------------

export type DirectPassAction         = { type: 'PASS' }
export type DirectPowerAction        = { type: 'POWER';       sourceId: string; powerName: string; label: string }
export type DirectPlayAction         = { type: 'PLAY';        cardId: string;                      label: string }
export type DirectAttackAction       = { type: 'ATTACK';      sourceId: string; targetId: string; additionalAttackerId?: string; label: string }
export type DirectMayAbilityAction   = { type: 'MAY_ABILITY'; useEffect: boolean;                  label: string }
export type DirectTargetAction       = { type: 'TARGET';      targetId: string;                    label: string }
export type DirectNumberAction       = { type: 'NUMBER';      number: number;                      label: string }
export type DirectCardsAction        = { type: 'CARDS';       cardIds: string[]; zone: string; zoneOwner: number; label: string }
export type DirectDamageMapAction    = { type: 'DAMAGE_MAP';  damageMap: Record<string, number>;   label: string }
export type DirectEnergyMapAction    = { type: 'ENERGY_MAP';  energyMap: Record<string, number>;   label: string }
export type DirectCardsOrderAction   = { type: 'CARDS_ORDER'; cardsOrder: string[];                label: string }
export type DirectPlayerAction       = { type: 'PLAYER';      targetPlayer: number;                label: string }
export type DirectAlternativeAction  = { type: 'ALTERNATIVE'; alternative: number;                 label: string }
export type DirectPowerOnMagiAction  = { type: 'POWER_ON_MAGI'; powerName: string;                 label: string }

export type DirectAction =
    | DirectPassAction
    | DirectPowerAction
    | DirectPlayAction
    | DirectAttackAction
    | DirectMayAbilityAction
    | DirectTargetAction
    | DirectNumberAction
    | DirectCardsAction
    | DirectDamageMapAction
    | DirectEnergyMapAction
    | DirectCardsOrderAction
    | DirectPlayerAction
    | DirectAlternativeAction
    | DirectPowerOnMagiAction

const STEP_NAME = {
    ENERGIZE: 0,
    PRS1: 1,
    ATTACK: 2,
    CREATURES: 3,
    PRS2: 4,
    DRAW: 5,
}

const FORBIDDEN_SPELLS = ["Hyren's Call"]

export class DirectActionExtractor {

    // -----------------------------------------------------------------------
    // extractActions
    // Returns all legal actions for playerId in the given state as simple
    // descriptors containing only ids/names/numbers — no object references.
    // -----------------------------------------------------------------------
    public static extractActions(sim: State, playerId: number, opponentId: number): DirectAction[] {
        if (sim.state.activePlayer !== playerId) return []

        if (sim.state.prompt) {
            return DirectActionExtractor.extractPromptActions(sim, playerId, opponentId)
        }

        switch (sim.state.step) {
            case STEP_NAME.ENERGIZE: return []
            case STEP_NAME.PRS1:
            case STEP_NAME.PRS2:    return DirectActionExtractor.extractPRSActions(sim, playerId)
            case STEP_NAME.ATTACK:  return DirectActionExtractor.extractAttackActions(sim, playerId, opponentId)
            case STEP_NAME.CREATURES: return DirectActionExtractor.extractCreaturesActions(sim, playerId)
            case STEP_NAME.DRAW:    return []
            default:                return []
        }
    }

    // -----------------------------------------------------------------------
    // applyAction
    // Reconstructs a full AnyEffectType from the descriptor (looking up card
    // objects in sim's own zones) and dispatches sim.update().
    // -----------------------------------------------------------------------
    public static applyAction(sim: State, action: DirectAction, playerId: number, opponentId: number): void {
        const promptGeneratedBy = sim.state.promptGeneratedBy
        const promptPlayer = (sim.state.promptPlayer ?? playerId) as number

        switch (action.type) {

            case 'PASS': {
                sim.update({ type: ACTION_PASS, player: playerId } as AnyEffectType)
                break
            }

            case 'POWER': {
                const source =
                    sim.getZone(ZONE_TYPE_IN_PLAY).byId(action.sourceId) ??
                    sim.getZone(ZONE_TYPE_ACTIVE_MAGI, playerId).card
                if (!source) break
                const power = (source.card.data.powers as any[] | undefined)
                    ?.find((p: any) => p.name === action.powerName)
                if (!power) break
                sim.update({ type: ACTION_POWER, source, power, player: playerId } as AnyEffectType)
                break
            }

            case 'PLAY': {
                const card = sim.getZone(ZONE_TYPE_HAND, playerId).byId(action.cardId)
                if (!card) break
                sim.update({
                    type: ACTION_PLAY,
                    payload: { card, player: playerId },
                    forcePriority: false,
                    player: playerId,
                } as AnyEffectType)
                break
            }

            case 'ATTACK': {
                const source = sim.getZone(ZONE_TYPE_IN_PLAY).byId(action.sourceId)
                const target =
                    sim.getZone(ZONE_TYPE_IN_PLAY).byId(action.targetId) ??
                    sim.getZone(ZONE_TYPE_ACTIVE_MAGI, opponentId).card
                if (!source || !target) break
                const additionalAttackers: CardInGame[] = action.additionalAttackerId
                    ? [sim.getZone(ZONE_TYPE_IN_PLAY).byId(action.additionalAttackerId)].filter(Boolean) as CardInGame[]
                    : []
                sim.update({
                    type: ACTION_ATTACK,
                    source,
                    target,
                    additionalAttackers,
                    player: playerId,
                } as AnyEffectType)
                break
            }

            case 'MAY_ABILITY': {
                sim.update({
                    type: ACTION_RESOLVE_PROMPT,
                    useEffect: action.useEffect,
                    generatedBy: promptGeneratedBy,
                    player: promptPlayer,
                } as AnyEffectType)
                break
            }

            case 'TARGET': {
                const target =
                    sim.getZone(ZONE_TYPE_IN_PLAY).byId(action.targetId) ??
                    sim.getZone(ZONE_TYPE_ACTIVE_MAGI, playerId).byId(action.targetId) ??
                    sim.getZone(ZONE_TYPE_ACTIVE_MAGI, opponentId).byId(action.targetId)
                if (!target) {
                    console.error(`No target found: ${action.targetId}`)
                    break
                }
                sim.update({
                    type: ACTION_RESOLVE_PROMPT,
                    target,
                    generatedBy: promptGeneratedBy,
                    player: promptPlayer,
                } as AnyEffectType)
                break
            }

            case 'NUMBER': {
                sim.update({
                    type: ACTION_RESOLVE_PROMPT,
                    number: action.number,
                    generatedBy: promptGeneratedBy,
                    player: promptPlayer,
                } as AnyEffectType)
                break
            }

            case 'CARDS': {
                const cards = action.cardIds
                    .map(id => sim.getZone(action.zone as any, action.zoneOwner).byId(id))
                    .filter(Boolean) as CardInGame[]
                sim.update({
                    type: ACTION_RESOLVE_PROMPT,
                    cards,
                    zone: action.zone,
                    zoneOwner: action.zoneOwner,
                    generatedBy: promptGeneratedBy,
                    player: promptPlayer,
                } as AnyEffectType)
                break
            }

            case 'DAMAGE_MAP': {
                sim.update({
                    type: ACTION_RESOLVE_PROMPT,
                    damageOnCreatures: action.damageMap,
                    generatedBy: promptGeneratedBy,
                    player: promptPlayer,
                } as AnyEffectType)
                break
            }

            case 'ENERGY_MAP': {
                sim.update({
                    type: ACTION_RESOLVE_PROMPT,
                    energyOnCreatures: action.energyMap,
                    generatedBy: promptGeneratedBy,
                    player: promptPlayer,
                } as AnyEffectType)
                break
            }

            case 'CARDS_ORDER': {
                sim.update({
                    type: ACTION_RESOLVE_PROMPT,
                    cardsOrder: action.cardsOrder,
                    generatedBy: promptGeneratedBy,
                    player: promptPlayer,
                } as AnyEffectType)
                break
            }

            case 'PLAYER': {
                sim.update({
                    type: ACTION_RESOLVE_PROMPT,
                    targetPlayer: action.targetPlayer,
                    generatedBy: promptGeneratedBy,
                    player: promptPlayer,
                } as AnyEffectType)
                break
            }

            case 'ALTERNATIVE': {
                sim.update({
                    type: ACTION_RESOLVE_PROMPT,
                    alternative: action.alternative,
                    generatedBy: promptGeneratedBy,
                    player: promptPlayer,
                } as AnyEffectType)
                break
            }

            case 'POWER_ON_MAGI': {
                const myMagi = sim.getZone(ZONE_TYPE_ACTIVE_MAGI, playerId).card
                const power = (myMagi?.card.data.powers as any[] | undefined)
                    ?.find((p: any) => p.name === action.powerName)
                if (!power) break
                sim.update({
                    type: ACTION_RESOLVE_PROMPT,
                    power,
                    generatedBy: promptGeneratedBy,
                    player: promptPlayer,
                } as AnyEffectType)
                break
            }
        }
    }

    // -----------------------------------------------------------------------
    // Private helpers
    // -----------------------------------------------------------------------

    private static extractPRSActions(sim: State, playerId: number): DirectAction[] {
        const magiCard: CardInGame | null = sim.getZone(ZONE_TYPE_ACTIVE_MAGI, playerId).card
        if (!magiCard) return [{ type: 'PASS' }]

        const actions: DirectAction[] = []

        // Creature / relic powers
        const myCreatures = (sim.getZone(ZONE_TYPE_IN_PLAY).cards as CardInGame[])
            .filter(card => sim.modifyByStaticAbilities(card, PROPERTY_CONTROLLER) === playerId)
        const creaturesWithPowers = myCreatures
            .filter(c => c.card.data.powers && c.data.actionsUsed.length === 0)

        creaturesWithPowers.forEach(card => {
            const power = card.card.data.powers?.[0]
            const energyReserve = card.card.type === TYPE_CREATURE ? card.data.energy : magiCard.data.energy
            if (power && typeof power.cost === 'number' && power.cost <= energyReserve) {
                actions.push({
                    type: 'POWER',
                    sourceId: card.id,
                    powerName: power.name,
                    label: `Use ${card.card.name}'s ${power.name}`,
                })
            }
        })

        // Magi powers
        if (magiCard.card.data.powers?.length) {
            ;(magiCard.card.data.powers as any[]).forEach(power => {
                if (!magiCard.data.actionsUsed.includes(power.name) && power.cost <= magiCard.data.energy) {
                    actions.push({
                        type: 'POWER',
                        sourceId: magiCard.id,
                        powerName: power.name,
                        label: `Use ${magiCard.card.name}'s ${power.name}`,
                    })
                }
            })
        }

        // Playable spells
        sim.getZone(ZONE_TYPE_HAND, playerId).cards
            .filter(card =>
                card.card.type === TYPE_SPELL &&
                typeof card.card.cost === 'number' &&
                card.card.cost <= magiCard.data.energy &&
                !FORBIDDEN_SPELLS.includes(card.card.name)
            )
            .forEach(spell => {
                actions.push({ type: 'PLAY', cardId: spell.id, label: `Play ${spell.card.name}` })
            })

        actions.push({ type: 'PASS' })
        return actions
    }

    private static extractAttackActions(sim: State, playerId: number, opponentId: number): DirectAction[] {
        const actions: DirectAction[] = [{ type: 'PASS' }]

        ActionExtractor.getAllAttackPatterns(sim, playerId, opponentId).forEach(pattern => {
            const source = sim.getZone(ZONE_TYPE_IN_PLAY).byId(pattern.from)
            const target =
                sim.getZone(ZONE_TYPE_IN_PLAY).byId(pattern.to) ??
                sim.getZone(ZONE_TYPE_ACTIVE_MAGI, opponentId).card
            const additional = pattern.add ? sim.getZone(ZONE_TYPE_IN_PLAY).byId(pattern.add) : null

            if (!source || !target) return

            const label = additional
                ? `Attack ${target.card.name} with ${source.card.name} + ${additional.card.name}`
                : `Attack ${target.card.name} with ${source.card.name}`

            actions.push({
                type: 'ATTACK',
                sourceId: pattern.from,
                targetId: pattern.to,
                ...(pattern.add ? { additionalAttackerId: pattern.add } : {}),
                label,
            })
        })

        return actions
    }

    private static extractCreaturesActions(sim: State, playerId: number): DirectAction[] {
        const magiCard: CardInGame | null = sim.getZone(ZONE_TYPE_ACTIVE_MAGI, playerId).card
        const actions: DirectAction[] = [{ type: 'PASS' }]
        if (!magiCard) return actions

        sim.getZone(ZONE_TYPE_HAND, playerId).cards
            .filter(card => card.card.type === TYPE_CREATURE)
            .forEach(creature => {
                const regionTax = (
                    creature.card.region === magiCard.card.region ||
                    creature.card.region === REGION_UNIVERSAL
                ) ? 0 : 1
                if (typeof creature.card.cost === 'number' && creature.card.cost + regionTax <= magiCard.data.energy) {
                    actions.push({ type: 'PLAY', cardId: creature.id, label: `Play ${creature.card.name}` })
                }
            })

        return actions
    }

    private static extractPromptActions(sim: State, playerId: number, opponentId: number): DirectAction[] {
        switch (sim.state.promptType) {

            case PROMPT_TYPE_MAY_ABILITY: {
                return [
                    { type: 'MAY_ABILITY', useEffect: true,  label: 'Use effect'  },
                    { type: 'MAY_ABILITY', useEffect: false, label: 'Skip effect' },
                ]
            }

            case PROMPT_TYPE_ALTERNATIVE: {
                return (sim.state.promptParams.alternatives ?? []).map((alt: any) => ({
                    type: 'ALTERNATIVE' as const,
                    alternative: alt.value,
                    label: `Choose alternative ${alt.value}`,
                }))
            }

            case PROMPT_TYPE_SINGLE_CREATURE_FILTERED: {
                const all: CardInGame[] = (sim.getZone(ZONE_TYPE_IN_PLAY).cards as CardInGame[])
                    .filter(c => c.card.type === TYPE_CREATURE)
                const filtered = sim.state.promptParams.restrictions
                    ? all.filter(sim.makeCardFilter(sim.state.promptParams.restrictions))
                    : all
                return filtered.map(c => ({
                    type: 'TARGET' as const,
                    targetId: c.id,
                    label: `Choose ${c.card.name} (${c.id.slice(0, 6)})`,
                }))
            }

            case PROMPT_TYPE_SINGLE_CREATURE: {
                return (sim.getZone(ZONE_TYPE_IN_PLAY).cards as CardInGame[])
                    .filter(c => c.card.type === TYPE_CREATURE)
                    .map(c => ({
                        type: 'TARGET' as const,
                        targetId: c.id,
                        label: `Choose ${c.card.name} (${c.id.slice(0, 6)})`,
                    }))
            }

            case PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI: {
                const actions: DirectAction[] = (sim.getZone(ZONE_TYPE_IN_PLAY).cards as CardInGame[])
                    .filter(c => c.card.type === TYPE_CREATURE)
                    .map(c => ({
                        type: 'TARGET' as const,
                        targetId: c.id,
                        label: `Choose ${c.card.name} (${c.id.slice(0, 6)})`,
                    }))
                const myMagi  = sim.getZone(ZONE_TYPE_ACTIVE_MAGI, playerId).card
                const oppMagi = sim.getZone(ZONE_TYPE_ACTIVE_MAGI, opponentId).card
                if (myMagi)  actions.push({ type: 'TARGET', targetId: myMagi.id,  label: `Choose ${myMagi.card.name}`  })
                if (oppMagi) actions.push({ type: 'TARGET', targetId: oppMagi.id, label: `Choose ${oppMagi.card.name}` })
                return actions
            }

            case PROMPT_TYPE_RELIC: {
                return (sim.getZone(ZONE_TYPE_IN_PLAY).cards as CardInGame[])
                    .filter(c => c.card.type === TYPE_RELIC)
                    .map(r => ({
                        type: 'TARGET' as const,
                        targetId: r.id,
                        label: `Choose relic ${r.card.name}`,
                    }))
            }

            case PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE: {
                return (sim.getZone(ZONE_TYPE_IN_PLAY).cards as CardInGame[])
                    .filter(c => c.card.type === TYPE_CREATURE && c.id !== sim.state.promptGeneratedBy)
                    .map(c => ({
                        type: 'TARGET' as const,
                        targetId: c.id,
                        label: `Choose ${c.card.name} (${c.id.slice(0, 6)})`,
                    }))
            }

            case PROMPT_TYPE_NUMBER: {
                const { min, max } = sim.state.promptParams
                if (typeof min !== 'number' || typeof max !== 'number') return []
                const actions: DirectAction[] = []
                for (let i = min; i < max; i++) {
                    actions.push({ type: 'NUMBER', number: i, label: `Choose ${i}` })
                }
                return actions
            }

            case PROMPT_TYPE_OWN_SINGLE_CREATURE: {
                const promptPlayer = sim.state.promptPlayer as number
                return (sim.getZone(ZONE_TYPE_IN_PLAY).cards as CardInGame[])
                    .filter(c =>
                        c.card.type === TYPE_CREATURE &&
                        sim.modifyByStaticAbilities(c, PROPERTY_CONTROLLER) === promptPlayer
                    )
                    .map(c => ({
                        type: 'TARGET' as const,
                        targetId: c.id,
                        label: `Choose ${c.card.name} (${c.id.slice(0, 6)})`,
                    }))
            }

            case PROMPT_TYPE_SINGLE_MAGI: {
                const actions: DirectAction[] = []
                const myMagi  = sim.getZone(ZONE_TYPE_ACTIVE_MAGI, playerId).card
                const oppMagi = sim.getZone(ZONE_TYPE_ACTIVE_MAGI, opponentId).card
                if (myMagi)  actions.push({ type: 'TARGET', targetId: myMagi.id,  label: `Choose ${myMagi.card.name}`  })
                if (oppMagi) actions.push({ type: 'TARGET', targetId: oppMagi.id, label: `Choose ${oppMagi.card.name}` })
                return actions
            }

            case PROMPT_TYPE_MAGI_WITHOUT_CREATURES: {
                const actions: DirectAction[] = []
                const myMagi  = sim.getZone(ZONE_TYPE_ACTIVE_MAGI, playerId).card
                const oppMagi = sim.getZone(ZONE_TYPE_ACTIVE_MAGI, opponentId).card
                const iHaveCreatures  = sim.useSelector(SELECTOR_CREATURES_OF_PLAYER, playerId).length > 0
                const oppHasCreatures = sim.useSelector(SELECTOR_CREATURES_OF_PLAYER, opponentId).length > 0
                if (myMagi  && !iHaveCreatures)  actions.push({ type: 'TARGET', targetId: myMagi.id,  label: `Choose ${myMagi.card.name}`  })
                if (oppMagi && !oppHasCreatures) actions.push({ type: 'TARGET', targetId: oppMagi.id, label: `Choose ${oppMagi.card.name}` })
                return actions
            }

            case PROMPT_TYPE_POWER_ON_MAGI: {
                const myMagi = sim.getZone(ZONE_TYPE_ACTIVE_MAGI, playerId).card
                const power = (myMagi?.card.data.powers as any[] | undefined)?.[0]
                if (!power) return []
                return [{ type: 'POWER_ON_MAGI', powerName: power.name, label: `Choose power ${power.name}` }]
            }

            case PROMPT_TYPE_PLAYER: {
                return [
                    { type: 'PLAYER', targetPlayer: playerId,   label: `Choose player ${playerId}`   },
                    { type: 'PLAYER', targetPlayer: opponentId, label: `Choose player ${opponentId}` },
                ]
            }

            case PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE: {
                const order = (sim.state.promptParams?.cards ?? []).map((c: any) => c.id)
                return [{ type: 'CARDS_ORDER', cardsOrder: order, label: 'Rearrange cards (keep order)' }]
            }

            case PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES: {
                const enemies = (sim.getZone(ZONE_TYPE_IN_PLAY).cards as CardInGame[])
                    .filter(c => c.card.type === TYPE_CREATURE && sim.modifyByStaticAbilities(c, PROPERTY_CONTROLLER) === opponentId)
                    .map(c => [c.id, c.data.energy] as [string, number])
                    .sort((a, b) => a[1] - b[1])

                let left = sim.state.promptParams.amount as number
                if (typeof left !== 'number') return []

                const damageMap: Record<string, number> = {}
                const remaining = [...enemies]
                let lastId: string | null = null
                while (left > 0 && remaining.length) {
                    const [id, energy] = remaining.shift()!
                    const dmg = Math.min(energy, left)
                    lastId = id
                    damageMap[id] = dmg
                    left -= dmg
                }
                if (left > 0 && lastId) damageMap[lastId] += left

                return [{ type: 'DAMAGE_MAP', damageMap, label: `Distribute ${sim.state.promptParams.amount} damage` }]
            }

            case PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES: {
                const allies = (sim.getZone(ZONE_TYPE_IN_PLAY).cards as CardInGame[])
                    .filter(c => c.card.type === TYPE_CREATURE && sim.modifyByStaticAbilities(c, PROPERTY_CONTROLLER) === playerId)
                    .map(c => [c.id, c.data.energy] as [string, number])
                    .sort((a, b) => a[1] - b[1])

                let left = sim.state.promptParams.amount as number
                if (typeof left !== 'number') return []

                const energyMap: Record<string, number> = {}
                const remaining = [...allies]
                let lastId: string | null = null
                while (left > 0 && remaining.length) {
                    const [id, energy] = remaining.shift()!
                    const give = Math.min(energy, left)
                    lastId = id
                    energyMap[id] = give
                    left -= give
                }
                if (left > 0 && lastId) energyMap[lastId] += left

                return [{ type: 'ENERGY_MAP', energyMap, label: `Distribute ${sim.state.promptParams.amount} energy` }]
            }

            case PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES: {
                const energyMap = Object.fromEntries(
                    (sim.getZone(ZONE_TYPE_IN_PLAY).cards as CardInGame[])
                        .filter(c => c.card.type === TYPE_CREATURE && sim.modifyByStaticAbilities(c, PROPERTY_CONTROLLER) === playerId)
                        .map(c => [c.id, c.data.energy])
                )
                return [{ type: 'ENERGY_MAP', energyMap, label: 'Rearrange energy (keep distribution)' }]
            }

            case PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE: {
                if (!sim.state.promptParams.zone) return []
                const zone = sim.state.promptParams.zone
                const zoneOwner = sim.state.promptParams.zoneOwner ?? 0
                const zoneCards = sim.getZone(zone as any, zoneOwner).cards as CardInGame[]
                const n = sim.state.promptParams.numberOfCards ?? 1
                const variants = Math.floor(zoneCards.length / n)
                const actions: DirectAction[] = []
                for (let i = 0; i < variants; i++) {
                    const slice = zoneCards.slice(i * n, i * n + n)
                    actions.push({
                        type: 'CARDS',
                        cardIds: slice.map(c => c.id),
                        zone,
                        zoneOwner,
                        label: `Choose: ${slice.map(c => c.card.name).join(', ')}`,
                    })
                }
                return actions
            }

            case PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE: {
                if (!sim.state.promptParams.zone) return []
                const zone = sim.state.promptParams.zone
                const zoneOwner = sim.state.promptParams.zoneOwner ?? 0
                const zoneCards = sim.getZone(zone as any, zoneOwner).cards as CardInGame[]
                const n = sim.state.promptParams.numberOfCards ?? 1
                const actions: DirectAction[] = []
                for (let i = 0; i < Math.min(n, zoneCards.length); i++) {
                    const slice = zoneCards.slice(0, i)
                    actions.push({
                        type: 'CARDS',
                        cardIds: slice.map(c => c.id),
                        zone,
                        zoneOwner,
                        label: slice.length
                            ? `Choose ${slice.length}: ${slice.map(c => c.card.name).join(', ')}`
                            : 'Choose none',
                    })
                }
                return actions
            }

            case PROMPT_TYPE_PAYMENT_SOURCE: {
                return (sim.state.promptParams.cards ?? []).flatMap((card: any) => {
                    const found =
                        sim.getZone(ZONE_TYPE_IN_PLAY).byId(card.id) ??
                        sim.getZone(ZONE_TYPE_ACTIVE_MAGI, sim.state.promptPlayer as number).byId(card.id)
                    if (!found) return []
                    return [{ type: 'TARGET' as const, targetId: card.id, label: `Pay with ${found.card.name}` }]
                })
            }

            default: {
                console.log(`DirectActionExtractor: no handler for prompt type ${sim.state.promptType}`)
                return []
            }
        }
    }
}
