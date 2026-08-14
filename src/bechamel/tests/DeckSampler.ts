import { type DeckConfig } from './simulation';

export type DeckPool = {
    name: string;
    cards: string[];
};

export type DeckSamplerOptions = {
    magiCount?: number;
    maxCopiesPerCard?: number;
};

type SeededRng = () => number;

export class DeckSampler {
    protected readonly magiCount: number;
    protected readonly maxCopiesPerCard: number;

    constructor(options: DeckSamplerOptions = {}) {
        this.magiCount = options.magiCount ?? 3;
        this.maxCopiesPerCard = options.maxCopiesPerCard ?? 3;
    }

    public sampleDeck(pool: DeckPool, deckSize: number, seed: number): DeckConfig {
        this.validateInput(pool, deckSize);

        const magiCards = this.getMagiCards(pool);
        const nonMagiPool = this.getNonMagiPool(pool);

        if (nonMagiPool.length === 0 && deckSize > this.magiCount) {
            throw new Error(`Pool ${pool.name} has no non-Magi cards to fill deck size ${deckSize}`);
        }

        const rng = this.makeRng(seed);
        const cards: string[] = [...magiCards];
        const copyCountByName = new Map<string, number>();

        for (const magi of magiCards) {
            copyCountByName.set(magi, (copyCountByName.get(magi) ?? 0) + 1);
        }

        while (cards.length < deckSize) {
            const availableCards = this.getAvailableCards(nonMagiPool, copyCountByName);

            if (availableCards.length === 0) {
                throw new Error(`Cannot build deck of size ${deckSize} from pool ${pool.name} with max ${this.maxCopiesPerCard} copies per card`);
            }

            const selectedCard = this.pickCard(availableCards, rng);
            cards.push(selectedCard);
            copyCountByName.set(selectedCard, (copyCountByName.get(selectedCard) ?? 0) + 1);
        }

        return {
            name: `${pool.name} seed:${seed}`,
            cards,
        };
    }

    protected validateInput(pool: DeckPool, deckSize: number) {
        if (pool.cards.length < this.magiCount) {
            throw new Error(`Pool ${pool.name} must contain at least ${this.magiCount} cards, with first cards being Magi`);
        }

        if (deckSize < this.magiCount) {
            throw new Error(`Deck size must be at least ${this.magiCount} to include required Magi cards`);
        }
    }

    protected getMagiCards(pool: DeckPool): string[] {
        return pool.cards.slice(0, this.magiCount);
    }

    protected getNonMagiPool(pool: DeckPool): string[] {
        return pool.cards.slice(this.magiCount);
    }

    protected getAvailableCards(nonMagiPool: string[], copyCountByName: Map<string, number>): string[] {
        return nonMagiPool.filter(cardName => (copyCountByName.get(cardName) ?? 0) < this.maxCopiesPerCard);
    }

    protected pickCard(availableCards: string[], rng: SeededRng): string {
        const index = Math.floor(rng() * availableCards.length);
        return availableCards[index];
    }

    protected makeRng(seed: number): SeededRng {
        let state = seed >>> 0;
        return () => {
            state = (1664525 * state + 1013904223) >>> 0;
            return state / 4294967296;
        };
    }
}
