import { isTauri } from '@tauri-apps/api/core';
import { exists, readTextFile, rename, writeTextFile } from '@tauri-apps/plugin-fs';
import { DeckKeeperService, isPlayableDeck } from '../DeckKeeperService';

jest.mock('@tauri-apps/api/core', () => ({ isTauri: jest.fn() }));
jest.mock('@tauri-apps/plugin-fs', () => ({
  BaseDirectory: { AppConfig: 1 },
  exists: jest.fn(),
  readTextFile: jest.fn(),
  writeTextFile: jest.fn(),
  rename: jest.fn(),
  mkdir: jest.fn(),
}));

describe('Deck library', () => {
  const storageDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  const files = new Map<string, string>();
  const browserStorage = new Map<string, string>();

  beforeEach(() => {
    files.clear();
    browserStorage.clear();
    jest.mocked(exists).mockImplementation(async path => files.has(String(path)));
    jest.mocked(readTextFile).mockImplementation(async path => files.get(String(path))!);
    jest.mocked(writeTextFile).mockImplementation(async (path, content) => { files.set(String(path), content); });
    jest.mocked(rename).mockImplementation(async (from, to) => {
      files.set(String(to), files.get(String(from))!);
      files.delete(String(from));
    });
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: {
        getItem: (key: string) => browserStorage.get(key) ?? null,
        setItem: (key: string, value: string) => browserStorage.set(key, value),
      },
    });
  });

  afterAll(() => {
    if (storageDescriptor) Object.defineProperty(globalThis, 'localStorage', storageDescriptor);
    else Reflect.deleteProperty(globalThis, 'localStorage');
  });

  it('loads existing desktop decks and preserves them when saving a separate named deck', async () => {
    jest.mocked(isTauri).mockReturnValue(true);
    const legacy = DeckKeeperService.defaultOpponentDeck.join('\r\n');
    files.set('decks/playerDeck.txt', legacy);
    const library = await new DeckKeeperService().loadLibrary();
    expect(library.decks[0].cards).toEqual(DeckKeeperService.defaultOpponentDeck);
    const newDeck = { id: 'custom', name: 'Orothe', cards: DeckKeeperService.defaultPlayerDeck };
    const updated = { ...library, decks: [...library.decks, newDeck], opponentDeckId: newDeck.id };
    await new DeckKeeperService().saveLibrary(updated);
    expect(await new DeckKeeperService().loadLibrary()).toEqual(updated);
    expect(files.get('decks/playerDeck.txt')).toBe(legacy);
  });

  it('remembers both selections after reload in the browser', async () => {
    jest.mocked(isTauri).mockReturnValue(false);
    const library = await new DeckKeeperService().loadLibrary();
    expect(library.decks.every(deck => isPlayableDeck(deck.cards))).toBe(true);
    const updated = { ...library, playerDeckId: library.opponentDeckId, opponentDeckId: library.playerDeckId };
    await new DeckKeeperService().saveLibrary(updated);
    expect(await new DeckKeeperService().loadLibrary()).toEqual(updated);
  });
});
