import { BaseDirectory, readTextFile, writeTextFile, mkdir, exists, rename } from '@tauri-apps/plugin-fs';
import { byName } from 'moonlands/dist/esm/cards';
import { TYPE_MAGI } from 'moonlands/dist/esm/const';
import { isTauri } from "@tauri-apps/api/core";

import type { DeckType } from '../types';

export type SavedDeck = DeckType & { id: string };
export type DeckLibrary = { decks: SavedDeck[]; playerDeckId: string; opponentDeckId: string };

const libraryPath = 'decks/library.json';
const browserKey = 'waystone.deckLibrary';
const config = { baseDir: BaseDirectory.AppConfig };

export function isPlayableDeck(cards: string[]): boolean {
  return cards.length >= 43 && cards.every((name, index) => {
    const card = byName(name);
    return !!card && (card.type === TYPE_MAGI) === (index < 3);
  }) && new Set(cards.slice(0, 3)).size === 3;
}

export class DeckKeeperService {
  static DECKS_DIR = 'decks'

  private isTauri() {
    return isTauri()
  }

  static defaultPlayerDeck = [
    /*'O\'Qua',
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
    'Hubdra\'s Spear',
    'Hubdra\'s Spear',
    'Hubdra\'s Spear',
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
    'Coral Hyren',*/
    'Blu',
    'O\'Qua',
    'Ebylon',
    'Ancestral Flute',
    'Ancestral Flute',
    'Water of Life',
    'Water of Life',
    'Water of Life',
    'Dream Balm',
    'Dream Balm',
    'Dream Balm',
    'Mirror Pendant',
    'Mirror Pendant',
    'Robes of the Ages',
    'Robes of the Ages',
    'Ring of Secrets',
    'Orothean Belt',
    'Orothean Belt',
    'Orothean Belt',
    'Orothean Gloves',
    'Orothean Gloves',
    'Orothean Gloves',
    'Hubdra\'s Spear',
    'Ancestral Flute',
    'Relic Mirror',
    'Relic Mirror',
    'Corf',
    'Corf',
    'Corf',
    'Giant Parathin',
    'Giant Parathin',
    'Giant Parathin',
    'Sphor',
    'Sphor',
    'Sphor',
    'Megathan',
    'Megathan',
    'Megathan',
    'Sea Barl',
    'Sea Barl',
    'Sea Barl',
    'Bwill',
    'Bwill',
  ]

  static defaultOpponentDeck = [
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
    'Hubdra\'s Spear',
    'Hubdra\'s Spear',
    'Hubdra\'s Spear',
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
    // 'Pruitt',
    // 'Poad',
    // 'Yaki',
    // 'Leaf Hyren',
    // 'Leaf Hyren',
    // 'Leaf Hyren',
    // 'Weebo',
    // 'Weebo',
    // 'Weebo',
    // 'Arboll',
    // 'Arboll',
    // 'Arboll',
    // 'Giant Carillion',
    // 'Giant Carillion',
    // 'Giant Carillion',
    // 'Furok',
    // 'Furok',
    // 'Furok',
    // 'Balamant',
    // 'Balamant',
    // 'Balamant',
    // 'Grow',
    // 'Grow',
    // 'Grow',
    // 'Timber Hyren',
    // 'Timber Hyren',
    // 'Water of Life',
    // 'Water of Life',
    // 'Syphon Stone',
    // 'Syphon Stone',
    // 'Carillion',
    // 'Carillion',
    // 'Carillion',
    // 'Rudwot',
    // 'Rudwot',
    // 'Rudwot',
    // 'Stagadan',
    // 'Stagadan',
    // 'Stagadan',
    // 'Robe of Vines',
    // 'Robe of Vines',
    // 'Robe of Vines',
    // 'Sea Barl',
  ]
  async loadLibrary(): Promise<DeckLibrary> {
    const stored = this.isTauri()
      ? await exists(libraryPath, config) ? await readTextFile(libraryPath, config) : null
      : localStorage.getItem(browserKey);
    if (stored !== null) {
      const library = JSON.parse(stored) as DeckLibrary;
      if (!Array.isArray(library?.decks) || !library.decks.length ||
          library.decks.some(deck => typeof deck?.id !== 'string' ||
            typeof deck.name !== 'string' || !Array.isArray(deck.cards) ||
            deck.cards.some(card => typeof card !== 'string'))) {
        throw new Error('Invalid deck library.');
      }
      return {
        ...library,
        playerDeckId: library.decks.find(deck => deck.id === library.playerDeckId)?.id ?? library.decks[0].id,
        opponentDeckId: library.decks.find(deck => deck.id === library.opponentDeckId)?.id ?? library.decks.at(-1)!.id,
      };
    }

    const [player, opponent] = await Promise.all([
      this.loadLegacyDeck('playerDeck', DeckKeeperService.defaultPlayerDeck),
      this.loadLegacyDeck('opponentDeck', DeckKeeperService.defaultOpponentDeck),
    ]);
    return {
      decks: [
        { id: 'playerDeck', name: 'Player deck', cards: player },
        { id: 'opponentDeck', name: 'Opponent deck', cards: opponent },
      ],
      playerDeckId: 'playerDeck',
      opponentDeckId: 'opponentDeck',
    };
  }

  private async loadLegacyDeck(name: string, fallback: string[]): Promise<string[]> {
    const path = `decks/${name}.txt`;
    if (this.isTauri() && await exists(path, config)) {
      const cards = (await readTextFile(path, config)).trim().split(/\r?\n/);
      if (isPlayableDeck(cards)) return cards;
    }
    return [...fallback];
  }

  async saveLibrary(library: DeckLibrary): Promise<void> {
    const content = JSON.stringify(library);
    if (!this.isTauri()) {
      localStorage.setItem(browserKey, content);
      return;
    }
    await mkdir(DeckKeeperService.DECKS_DIR, { ...config, recursive: true });
    const temporaryPath = 'decks/library.json.tmp';
    await writeTextFile(temporaryPath, content, config);
    await rename(temporaryPath, libraryPath, { oldPathBaseDir: BaseDirectory.AppConfig, newPathBaseDir: BaseDirectory.AppConfig });
  }
}
