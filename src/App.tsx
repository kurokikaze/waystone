import { useCallback, useEffect, useState } from "react";
import "./App.css";

import { GameAppWrapper } from "./components/GameAppWrapper/GameAppWrapper";
import MoonlandsLogo from "./components/MoonlandsLogo/MoonlandsLogo";
import DeckEditor, { DeckType } from "./components/DeckEditor/DeckEditor";

import engineData from 'moonlands/package.json'
import { DeckKeeperService } from "./services/DeckKeeperService";

const MODE_BASE = 'modes/base';
const MODE_EDITOR = 'modes/editor';
const MODE_GAME = 'modes/game';

type AppMode = typeof MODE_BASE | typeof MODE_EDITOR | typeof MODE_GAME;

function App() {
  const [mode, setMode] = useState<AppMode>(MODE_BASE);

  const [loading, setLoading] = useState(true)
  const [editedDeck, setEditedDeck] = useState<DeckType>({name: '', cards: []})
  const [playerDeckEdited, setPlayerDeckEdited] = useState(true)
  const [error, setError] = useState('')

  const handleIsTauri = () => {
    return Boolean(
      typeof window !== 'undefined' &&
      window !== undefined &&
      // @ts-ignore
      window.__TAURI_IPC__ !== undefined
  )};
  
  const handleSave = useCallback((cards: string[]) => {
    const deckService = new DeckKeeperService();
    if (playerDeckEdited) {
      setPlayerDeck(cards)
      deckService.saveDeck('playerDeck', cards);
    } else {
      setOpponentDeck(cards)
      deckService.saveDeck('opponentDeck', cards);
    }
  }, [playerDeckEdited])

  const loadDecks = async () => {
    const deckService = new DeckKeeperService();
    await deckService.createFiles();
    const {player, opponent} = await deckService.loadDecks();

    setPlayerDeck(player)
    setOpponentDeck(opponent)
    setLoading(false);
  }

  useEffect(() => {
    try {
      if (handleIsTauri()) {
        loadDecks()
      } else {
        setPlayerDeck(DeckKeeperService.defaultPlayerDeck);
        setOpponentDeck(DeckKeeperService.defaultOpponentDeck);
        setLoading(false);
        setError('Not a Tauri environment')
      }
    } catch (e) {
      setError(JSON.stringify(e));
    }
  }, [])

  const [playerDeck, setPlayerDeck] = useState<string[]>([])
  const [opponentDeck, setOpponentDeck] = useState<string[]>([])

const handleEditPlayerDeck = useCallback(() => {
  setEditedDeck({name: 'Player deck', cards: playerDeck})
  setPlayerDeckEdited(true)
  setMode(MODE_EDITOR)
}, [playerDeck])

const handleEditOpponentDeck = useCallback(() => {
  setEditedDeck({name: 'Opponent deck', cards: opponentDeck})
  setPlayerDeckEdited(false)
  setMode(MODE_EDITOR)
}, [playerDeck])
 
  const handleReturnToBase = useCallback(() => {
    setMode(MODE_BASE);
  }, [])

  const handleStartGame = useCallback(() => {
    setMode(MODE_GAME);
  }, [])

  return (
    <div>
      {mode === MODE_GAME ? <div>
        <GameAppWrapper playerDeck={playerDeck} opponentDeck={opponentDeck} onReturnToBase={handleReturnToBase} />
      </div> : null}
      {mode === MODE_BASE ? <>
        <div className="row">
            <MoonlandsLogo />
        </div>

        {error ? <div><pre>{error}</pre></div> : null}

        <p>Moonlands engine version: {engineData.version}</p>
        <p><button disabled={loading} onClick={handleEditPlayerDeck}>Edit player deck</button></p>
        <p><button disabled={loading} onClick={handleEditOpponentDeck}>Edit opponent deck</button></p>
        <p><button disabled={loading} onClick={handleStartGame}>Start game</button></p>
      </> : null}
      {mode === MODE_EDITOR ? <DeckEditor deckContents={editedDeck} onSave={handleSave} onClose={handleReturnToBase} /> : null}
    </div>
  );
}

export default App;
