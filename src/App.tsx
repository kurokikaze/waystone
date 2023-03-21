import { useCallback, useState } from "react";
import "./App.css";

import { GameAppWrapper } from "./components/GameAppWrapper/GameAppWrapper";
import MoonlandsLogo from "./components/MoonlandsLogo/MoonlandsLogo";
import DeckEditor, { DeckType } from "./components/DeckEditor/DeckEditor";

import engineData from 'moonlands/package.json'

const MODE_BASE = 'modes/base';
const MODE_EDITOR = 'modes/editor';
const MODE_GAME = 'modes/game';

type AppMode = typeof MODE_BASE | typeof MODE_EDITOR | typeof MODE_GAME;

function App() {
  // const [name, setName] = useState("");

  const [game, setGame] = useState<boolean>(false);
  const [mode, setMode] = useState<AppMode>(MODE_BASE);

  const [editedDeck, setEditedDeck] = useState<DeckType>({name: '', cards: []})
  const [playerDeckEdited, setPlayerDeckEdited] = useState(true)

  const handleSave = useCallback((cards: string[]) => {
    if (playerDeckEdited) {
      setPlayerDeck(cards)
    } else {
      setOpponentDeck(cards)
    }
  }, [playerDeckEdited])

  const [playerDeck, setPlayerDeck] = useState<string[]>([
    'Grega',
    'Magam',
    'Sinder',
    'Fire Chogo',
    'Fire Chogo',
    'Fire Chogo',
    'Fire Grag',
    'Fire Grag',
    'Fire Grag',
    'Arbolit',
    'Arbolit',
    'Arbolit',
    'Magma Hyren',
    'Magma Hyren',
    'Magma Hyren',
    'Quor',
    'Quor',
    'Quor',
    'Lava Aq',
    'Lava Aq',
    'Lava Aq',
    'Lava Arboll',
    'Lava Arboll',
    'Lava Arboll',
    'Diobor',
    'Diobor',
    'Diobor',
    'Drakan',
    'Drakan',
    'Drakan',
    'Thermal Blast',
    'Thermal Blast',
    'Thermal Blast',
    'Flame Geyser',
    'Flame Geyser',
    'Flame Geyser',
    'Cave Hyren',
    'Cave Hyren',
    'Cave Hyren',
    'Magma Armor',
    'Magma Armor',
    'Water of Life',
    'Water of Life',
  ])
  const [opponentDeck, setOpponentDeck] = useState<string[]>(['Pruitt',
	'Poad',
	'Yaki',
	'Leaf Hyren',
	'Leaf Hyren',
	'Leaf Hyren',
	'Weebo',
	'Weebo',
	'Weebo',
	'Arboll',
	'Arboll',
	'Arboll',
	'Giant Carillion',
	'Giant Carillion',
	'Giant Carillion',
	'Giant Parathin',
	'Giant Parathin',
	'Giant Parathin',
	'Balamant',
	'Balamant',
	'Balamant',
	'Grow',
	'Grow',
	'Grow',
	'Giant Parathin',
	'Giant Parathin',
	'Giant Parathin',
	'Water of Life',
	'Syphon Stone',
	'Syphon Stone',
	'Carillion',
	'Carillion',
	'Carillion',
	'Rudwot',
	'Rudwot',
	'Rudwot',
	'Stagadan',
	'Stagadan',
	'Stagadan',
	'Robe of Vines',
	'Robe of Vines',
	'Water of Life',
	'Sea Barl',
])

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

  return (
    <div>
      {mode === MODE_GAME ? <div>
        <GameAppWrapper playerDeck={playerDeck} opponentDeck={opponentDeck} />
      </div> : null}
      {mode === MODE_BASE ? <>
        <h1>Welcome to Tauri!</h1>

        <div className="row">
            <MoonlandsLogo />
        </div>

        <p>Moonlands engine version: {engineData.version}</p>
        <p><button onClick={handleEditPlayerDeck}>Edit player deck</button></p>
        <p><button onClick={handleEditOpponentDeck}>Edit opponent deck</button></p>
        <p><button onClick={() => setMode(MODE_GAME)}>Start game</button></p>
      </> : null}
      {mode === MODE_EDITOR ? <DeckEditor deckContents={editedDeck} onSave={handleSave} onClose={handleReturnToBase} /> : null}
    </div>
  );
}

export default App;
