import { ClientAction } from "../../clientProtocol";
import { GameState } from "../GameState";
import {
    ACTION_RESOLVE_PROMPT,
    PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
    PROMPT_TYPE_SINGLE_CREATURE,
    PROMPT_TYPE_OWN_SINGLE_CREATURE,
    PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE,
    PROMPT_TYPE_CHOOSE_CARDS,
    PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
    PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE,
    PROMPT_TYPE_NUMBER,
    PROMPT_TYPE_PAYMENT_SOURCE,
    PROMPT_TYPE_ALTERNATIVE,
    PROMPT_TYPE_POWER_ON_MAGI,
    PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES,
    PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES,
    PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES,
} from "moonlands/dist/esm/const";

class UnexpectedPromptResolver  {
    public resolvePrompt(state: GameState): ClientAction {
        const promptType = state.getPromptType();
        const player = (state as any).playerId || 0;

        // Safe defaults for common prompt types. Never return a plain pass.
        switch (promptType) {
            case PROMPT_TYPE_SINGLE_CREATURE_FILTERED:
            case PROMPT_TYPE_SINGLE_CREATURE:
            case PROMPT_TYPE_OWN_SINGLE_CREATURE:
                return this.resolveCreaturePrompt(state);

            case PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE: {
                const src = (state as any).state?.promptParams?.source?.id;
                const my = state.getMyCreaturesInPlay() || [];
                const enemy = state.getEnemyCreaturesInPlay() || [];
                const all = [...my, ...enemy].filter((c: any) => c.id !== src);
                if (all.length) {
                    const chosen = all.reduce((a: any, b: any) => (a.data.energy <= b.data.energy ? a : b));
                    return { type: ACTION_RESOLVE_PROMPT, promptType, target: chosen.id, player } as any;
                }
                break;
            }

            case PROMPT_TYPE_CHOOSE_CARDS:
            case PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE:
            case PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE: {
                const params = (state as any).state?.promptParams || {};
                const zoneCards = params.cards || (state as any).state?.promptAvailableCards || [];
                const numberOfCards = params.numberOfCards || 1;
                const ids = zoneCards.map((c: any) => c.id || c).filter(Boolean);
                const chosen = ids.slice(0, numberOfCards);
                if (chosen.length) {
                    return { type: ACTION_RESOLVE_PROMPT, promptType, zone: params.zone, zoneOwner: params.zoneOwner, cards: chosen, player } as any;
                }
                break;
            }

            case PROMPT_TYPE_NUMBER: {
                const params = (state as any).state?.promptParams || {};
                const n = typeof params.min === 'number' ? params.min : 0;
                return { type: ACTION_RESOLVE_PROMPT, promptType, number: n, player } as any;
            }

            case PROMPT_TYPE_PAYMENT_SOURCE: {
                const candidates = state.getPaymentSourceCards();
                if (candidates && candidates.length) {
                    return { type: ACTION_RESOLVE_PROMPT, promptType, target: candidates[0], player } as any;
                }
                break;
            }

            case PROMPT_TYPE_ALTERNATIVE: {
                const alts = (state as any).state?.promptParams?.alternatives || (state as any).state?.promptAvailableCards || [];
                const first = Array.isArray(alts) && alts.length ? (alts[0].id || alts[0]) : null;
                if (first) return { type: ACTION_RESOLVE_PROMPT, promptType, alternative: first, player } as any;
                break;
            }

            case PROMPT_TYPE_POWER_ON_MAGI: {
                const magi = (state as any).state?.promptParams?.magi || [];
                if (magi.length) {
                    // choose first power if available
                    const magiCard = magi[0];
                    const power = magiCard?.card?.data?.powers?.[0]?.name;
                    if (power) return { type: ACTION_RESOLVE_PROMPT, promptType, power, player } as any;
                }
                break;
            }

            case PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES:
            case PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES:
            case PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES: {
                const params = (state as any).state?.promptParams || {};
                const amount = params.amount || 0;
                const creatures = state.getMyCreaturesInPlay() || state.getEnemyCreaturesInPlay() || [];
                const ids = (creatures && creatures.length) ? creatures.map((c: any) => c.id) : ((state as any).state?.promptAvailableCards || []);
                if (ids && ids.length) {
                    const map: Record<string, number> = {};
                    // put everything on the first creature
                    map[ids[0]] = amount;
                    return { type: ACTION_RESOLVE_PROMPT, promptType, energyOnCreatures: map, damageOnCreatures: map, player } as any;
                }
                break;
            }
        }

        // Fallback: if the prompt provides available card ids, pick the first
        const available = (state as any).state?.promptAvailableCards || [];
        if (available && available.length) {
            const first = available[0];
            return { type: ACTION_RESOLVE_PROMPT, promptType: state.getPromptType(), target: first, player } as any;
        }

        // Last resort: resolve with number 0
        return { type: ACTION_RESOLVE_PROMPT, promptType: state.getPromptType(), number: 0, player } as any;
    }

    private resolveCreaturePrompt(state: GameState): ClientAction {
        const filtered = (state as any).state?.promptParams ? state.getCardsForFilteredPrompt() : [];
        const own = state.getMyCreaturesInPlay() || [];
        const candidates = (filtered && filtered.length) ? filtered : (own.length ? own : state.getEnemyCreaturesInPlay() || []);

        if (candidates && candidates.length) {
            const chosen = candidates.reduce((a: any, b: any) => (a.data.energy <= b.data.energy ? a : b));
            return { type: ACTION_RESOLVE_PROMPT, promptType: state.getPromptType(), target: chosen.id, player: (state as any).playerId || 0 } as any;
        }

        const available = (state as any).state?.promptAvailableCards || [];
        if (available && available.length) {
            return { type: ACTION_RESOLVE_PROMPT, promptType: state.getPromptType(), target: available[0], player: (state as any).playerId || 0 } as any;
        }

        return { type: ACTION_RESOLVE_PROMPT, promptType: state.getPromptType(), number: 0, player: (state as any).playerId || 0 } as any;
    }
}

export default UnexpectedPromptResolver;