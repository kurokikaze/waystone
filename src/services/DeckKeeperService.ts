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

  static arderialStarterDeck = [
    'Nimbulo',
    'Shimmer',
    'Stradus',
    'Lovian',
    'Thunder Hyren',
    'Thunder Hyren',
    'Alaban',
    'Alaban',
    'Epik',
    'Epik',
    'Epik',
    'Cloud Narth',
    'Cloud Narth',
    'Cloud Narth',
    'Lightning Hyren',
    'Lightning Hyren',
    'Lightning Hyren',
    'Pharan',
    'Pharan',
    'Thunder Vashp',
    'Thunder Vashp',
    'Storm Ring',
    'Channeler\'s Gloves',
    'Mask of Abwyn',
    'Robes of the Ages',
    'Relic Stalker',
    'Relic Stalker',
    'Staff of Hyren',
    'Staff of Hyren',
    'Staff of Hyren',
    'Eclipse',
    'Fog Bank',
    'Fog Bank',
    'Fog Bank',
    'Shockwave',
    'Shockwave',
    'Shockwave',
    'Lightning',
    'Lightning',
    'Lightning',
    'Shooting Star',
    'Shooting Star',
    'Shooting Star'
  ]

  static caldStarterDeck = [
    'Ashgar',
    'Gar',
    'Grega',
    'Greater Vaal',
    'Magma Hyren',
    'Magma Hyren',
    'Magma Hyren',
    'Drakan',
    'Drakan',
    'Lava Balamant',
    'Lava Balamant',
    'Quor Pup',
    'Arbolit',
    'Arbolit',
    'Arbolit',
    'Diobor',
    'Diobor',
    'Diobor',
    'Fire Chogo',
    'Fire Chogo',
    'Kelthet',
    'Kelthet',
    'Quor',
    'Quor',
    'Ancestral Flute',
    'Ancestral Flute',
    'Baloo Root',
    'Baloo Root',
    'Magma Armor',
    'Magma Armor',
    'Spirit of the Flame',
    'Flame Geyser',
    'Flame Geyser',
    'Syphon Vortex',
    'Syphon Vortex',
    'Fire Ball',
    'Fire Ball',
    'Fire Ball',
    'Fire Flow',
    'Fire Flow',
    'Fire Flow',
    'Thermal Blast',
    'Thermal Blast'
  ]

  static naroomStarterDeck = [
    'Evu',
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
    'Energy Band',
    'Ancestral Flute',
    'Hood of Hiding',
    'Hood of Hiding',
    'Hood of Hiding',
    'Robe of Vines',
    'Robe of Vines',
    'Robe of Vines',
    'Hyren\'s Call',
    'Orwin\'s Gaze',
    'Orwin\'s Gaze',
    'Vortex of Knowledge',
    'Vortex of Knowledge',
    'Grow',
    'Grow',
    'Grow',
    'Tap Roots',
    'Tap Roots',
    'Tap Roots'
  ]

  static orotheStarterDeck = [
    'Blu',
    'Ebylon',
    'Orlon',
    'Deep Hyren',
    'Orathan',
    'Abaquist',
    'Abaquist',
    'Karak',
    'Paralit',
    'Paralit',
    'Bwill',
    'Bwill',
    'Bwill',
    'Corf',
    'Corf',
    'Corf',
    'Orpus',
    'Orpus',
    'Orpus',
    'Sea Barl',
    'Sea Barl',
    'Sea Barl',
    'Sphor',
    'Wellisk',
    'Wellisk',
    'Wellisk Pup',
    'Hubdra\'s Spear',
    'Orothean Goggles',
    'Mirror Pendant',
    'Mirror Pendant',
    'Orothean Gloves',
    'Entangle',
    'Tidal Wave',
    'Tidal Wave',
    'Tidal Wave',
    'Undertow',
    'Undertow',
    'Undertow',
    'Implosion',
    'Implosion',
    'Submerge',
    'Submerge',
    'Submerge'
  ]

  static underneathStarterDeck = [
    'Fossik',
    'Gruk',
    'Ulk',
    'Giant Korrit',
    'Giant Korrit',
    'Ormagon',
    'Agovo',
    'Agovo',
    'Agovo',
    'Giant Vulbor',
    'Giant Vulbor',
    'Korrit',
    'Korrit',
    'Korrit',
    'Brub',
    'Brub',
    'Crystal Arboll',
    'Crystal Arboll',
    'Crystal Arboll',
    'Gum-Gum',
    'Gum-Gum',
    'Pack Korrit',
    'Pack Korrit',
    'Pack Korrit',
    'Parmalag',
    'Parmalag',
    'Parmalag',
    'Gloves of Crystal',
    'Staff of Korrits',
    'Digging Goggles',
    'Digging Goggles',
    'Digging Goggles',
    'Relic Stalker',
    'Bottomless Pit',
    'Bottomless Pit',
    'Enrich',
    'Enrich',
    'Enrich',
    'Burrow',
    'Burrow',
    'Burrow',
    'Carnivorous Cave',
    'Carnivorous Cave'
  ]

  static get defaultPlayerDeck() { return [...this.arderialStarterDeck]; }
  static get defaultOpponentDeck() { return [...this.caldStarterDeck]; }

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
      this.loadLegacyDeck('playerDeck'),
      this.loadLegacyDeck('opponentDeck'),
    ]);
    return {
      decks: [
        { id: 'arderialStarter', name: 'Arderial Starter', cards: [...DeckKeeperService.arderialStarterDeck] },
        { id: 'caldStarter', name: 'Cald Starter', cards: [...DeckKeeperService.caldStarterDeck] },
        { id: 'naroomStarter', name: 'Naroom Starter', cards: [...DeckKeeperService.naroomStarterDeck] },
        { id: 'orotheStarter', name: 'Orothe Starter', cards: [...DeckKeeperService.orotheStarterDeck] },
        { id: 'underneathStarter', name: 'Underneath Starter', cards: [...DeckKeeperService.underneathStarterDeck] },
        ...(player ? [{ id: 'playerDeck', name: 'Player deck', cards: player }] : []),
        ...(opponent ? [{ id: 'opponentDeck', name: 'Opponent deck', cards: opponent }] : []),
      ],
      playerDeckId: player ? 'playerDeck' : 'arderialStarter',
      opponentDeckId: opponent ? 'opponentDeck' : 'caldStarter',
    };
  }

  private async loadLegacyDeck(name: string): Promise<string[] | null> {
    const path = `decks/${name}.txt`;
    if (this.isTauri() && await exists(path, config)) {
      const cards = (await readTextFile(path, config)).trim().split(/\r?\n/);
      if (isPlayableDeck(cards)) return cards;
    }
    return null;
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
