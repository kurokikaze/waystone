import { BaseDirectory, readTextFile, writeTextFile, createDir, exists } from '@tauri-apps/api/fs';
import { byName } from 'moonlands/dist/cards';
import { TYPE_MAGI } from 'moonlands/dist/const';

type DecksResult = {player: string[], opponent: string[]}

export class DeckKeeperService {
  static DECKS_DIR = 'decks'

  private isTauri() {
    return Boolean(
      typeof window !== 'undefined' &&
      window !== undefined &&
      // @ts-ignore
      window.__TAURI_IPC__ !== undefined
    )
  }

  static defaultPlayerDeck = [
    'Adis',
    'Stradus',
    'Sinder',
    'Orathan Flyer',
    'Orathan Flyer',
    'Orathan Flyer',
    'Orathan Flyer',
    'Orathan Flyer',
    'Orathan Flyer',
    'Orathan Flyer',
    'Orathan Flyer',
    'Orathan Flyer',
    'Orathan Flyer',
    'Orathan Flyer',
    'Orathan Flyer',
    'Orathan Flyer',
    'Lovian',
    'Lovian',
    'Lovian',
    'Fog Bank',
    'Fog Bank',
    'Fog Bank',
    'Fog Bank',
    'Fog Bank',
    'Fog Bank',
    'Fog Bank',
    'Fog Bank',
    'Fog Bank',
    'Fog Bank',
    'Fog Bank',
    'Fog Bank',
    'Fog Bank',
    'Fog Bank',
    'Fog Bank',
    'Fog Bank',
    'Fog Bank',
    'Fog Bank',
    'Fog Bank',
    'Fog Bank',
    'Fog Bank',
    'Fog Bank',
    'Fog Bank',
    'Fog Bank'
    // 'O\'Qua',
    // 'Whall',
    // 'Ebylon',
    // 'Water of Life',
    // 'Water of Life',
    // 'Water of Life',
    // 'Dream Balm',
    // 'Dream Balm',
    // 'Dream Balm',
    // 'Corf',
    // 'Corf',
    // 'Corf',
    // 'Hubdra\'s Spear',
    // 'Hubdra\'s Spear',
    // 'Hubdra\'s Spear',
    // 'Abaquist',
    // 'Abaquist',
    // 'Abaquist',
    // 'Orothean Belt',
    // 'Platheus',
    // 'Platheus',
    // 'Platheus',
    // 'Giant Parathin',
    // 'Giant Parathin',
    // 'Giant Parathin',
    // 'Undertow',
    // 'Undertow',
    // 'Undertow',
    // 'Deep Hyren',
    // 'Deep Hyren',
    // 'Deep Hyren',
    // 'Megathan',
    // 'Megathan',
    // 'Megathan',
    // 'Bwill',
    // 'Bwill',
    // 'Bwill',
    // 'Robes of the Ages',
    // 'Robes of the Ages',
    // 'Submerge',
    // 'Submerge',
    // 'Submerge',
    // 'Coral Hyren',
    // 'Coral Hyren',
  ]

  static defaultOpponentDeck = [
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
  constructor() {

  }

  public async createFiles() {
    if (!this.isTauri()) {
      return;
    }
    const dirExists = await exists(DeckKeeperService.DECKS_DIR, { dir: BaseDirectory.AppConfig });
    if (!dirExists) {
      await createDir(DeckKeeperService.DECKS_DIR, { dir: BaseDirectory.AppConfig, recursive: true });
    }
    await this.createDeckFileIfNotExists('playerDeck', DeckKeeperService.defaultPlayerDeck);
    await this.createDeckFileIfNotExists('opponentDeck', DeckKeeperService.defaultOpponentDeck);
  }

  private async createDeckFileIfNotExists(deckFileName: string, deckContents: string[]) {
    const deckFileExists =  await exists(`${DeckKeeperService.DECKS_DIR}\\${deckFileName}.txt`, { dir: BaseDirectory.AppConfig });
    if (!deckFileExists) {
      await this.saveDeck(deckFileName, deckContents)
    }
  }

  public async loadDecks(): Promise<DecksResult> {
    if (!this.isTauri()) {
      return {
        player: DeckKeeperService.defaultPlayerDeck,
        opponent: DeckKeeperService.defaultOpponentDeck,
      };
    }
    const result: DecksResult = {player: [], opponent: []}
    const playerDeckContents = await readTextFile(`${DeckKeeperService.DECKS_DIR}\\playerDeck.txt`, { dir: BaseDirectory.AppConfig });
    const playerDeckCards: string[] = playerDeckContents.split("\n");
    if (
      playerDeckCards.length === 43 &&
      byName(playerDeckCards[0])?.type === TYPE_MAGI &&
      byName(playerDeckCards[1])?.type === TYPE_MAGI &&
      byName(playerDeckCards[2])?.type === TYPE_MAGI
    ) {
      result.player = playerDeckCards;
    }

    const opponentDeckContents = await readTextFile(`${DeckKeeperService.DECKS_DIR}\\opponentDeck.txt`, { dir: BaseDirectory.AppConfig });
    const opponentDeckCards: string[] = opponentDeckContents.split("\n");
    if (
      opponentDeckCards.length === 43 &&
      byName(opponentDeckCards[0])?.type === TYPE_MAGI &&
      byName(opponentDeckCards[1])?.type === TYPE_MAGI &&
      byName(opponentDeckCards[2])?.type === TYPE_MAGI
    ) {
      result.opponent = opponentDeckCards;
    }
    return result;
  }

  public async saveDeck(deckFileName: string, deckContents: string[]) {
    if (this.isTauri()) {
      await writeTextFile(`${DeckKeeperService.DECKS_DIR}\\${deckFileName}.txt`, deckContents.join("\n"), { dir: BaseDirectory.AppConfig })
    }
  }
}