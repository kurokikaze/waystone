import { useCallback, useEffect, useState } from "react";
import "./App.css";

import { GameAppWrapper } from "./components/GameAppWrapper/GameAppWrapper";
import { ReplayAppWrapper } from "./components/ReplayAppWrapper/ReplayAppWrapper";
import MoonlandsLogo from "./components/MoonlandsLogo/MoonlandsLogo";
import DeckEditor from "./components/DeckEditor/DeckEditor";

import engineData from 'moonlands/package.json'
import { DeckKeeperService } from "./services/DeckKeeperService";
import ReplayList from "./components/ReplaysList/ReplayList";
import { Button } from "antd";
import { DeckType } from "./types";
import { ChallengeAppWrapper } from "./components/challenges/ChallengeAppWrapper/ChallengeAppWrapper";
import { NetworkGameAppWrapper } from "./components/NetworkGameAppWrapper/NetworkGameAppWrapper";

const MODE_BASE = 'modes/base';
const MODE_EDITOR = 'modes/editor';
const MODE_REPLAY = 'modes/replay';
const MODE_REPLAY_LIST = 'modes/replay_list';
const MODE_GAME = 'modes/game';
const MODE_CHALLENGES = 'modes/challenges';
const MODE_NETWORK_PLAY = 'modes/network_play';

type AppMode = typeof MODE_BASE | typeof MODE_EDITOR | typeof MODE_GAME | typeof MODE_REPLAY_LIST | typeof MODE_REPLAY | typeof MODE_CHALLENGES | typeof MODE_NETWORK_PLAY;

function App() {
    const [mode, setMode] = useState<AppMode>(MODE_BASE);

    const [loading, setLoading] = useState(true)
    const [secret, setSecret] = useState<string>()
    const [editedDeck, setEditedDeck] = useState<DeckType>({ name: '', cards: [] })
    const [playerDeckEdited, setPlayerDeckEdited] = useState(true)
    const [error, setError] = useState('')
    const [chosenReplay, setChosenReplay] = useState<string>('')

    const handleIsTauri = () => {
        return Boolean(
            typeof window !== 'undefined' &&
            window !== undefined &&
            // @ts-ignore
            window.__TAURI_IPC__ !== undefined
        )
    };

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
        const { player, opponent } = await deckService.loadDecks();

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
        setEditedDeck({ name: 'Player deck', cards: playerDeck })
        setPlayerDeckEdited(true)
        setMode(MODE_EDITOR)
    }, [playerDeck])

    const handleEditOpponentDeck = useCallback(() => {
        setEditedDeck({ name: 'Opponent deck', cards: opponentDeck })
        setPlayerDeckEdited(false)
        setMode(MODE_EDITOR)
    }, [playerDeck])

    const handleReturnToBase = useCallback(() => {
        setMode(MODE_BASE);
    }, [])

    const handleStartGame = useCallback(() => {
        setMode(MODE_GAME);
    }, [])

    const handleConnectToServer = useCallback(() => {
        setMode(MODE_CHALLENGES)
    }, [])

    const handleOpenReplays = useCallback(() => {
        setMode(MODE_REPLAY_LIST);
    }, [])

    const handleReplaySelect = useCallback((replay: string) => {
        setChosenReplay(replay)
        setMode(MODE_REPLAY);
    }, [])

    const handleChallengeAccept = useCallback((secret: string) => {
        setSecret(secret)
        setMode(MODE_NETWORK_PLAY)
    }, [])

    return (
        <div>
            {mode === MODE_GAME ? <div>
                <GameAppWrapper playerDeck={playerDeck} opponentDeck={opponentDeck} onReturnToBase={handleReturnToBase} />
            </div> : null}
            {mode === MODE_REPLAY_LIST ? <div>
                <ReplayList onReplayClick={handleReplaySelect} onReturnToBase={handleReturnToBase} />
            </div> : null}
            {mode === MODE_REPLAY ? <div>
                <ReplayAppWrapper replayName={chosenReplay} onReturnToBase={handleReturnToBase} />
            </div> : null}
            {mode === MODE_CHALLENGES ? <div className="appHolder">
                <ChallengeAppWrapper
                    playerDeck={{ name: 'current deck', cards: playerDeck }}
                    onChallengeAccepted={handleChallengeAccept}
                    onReturnToMenu={handleReturnToBase}
                />
            </div> : null}
            {mode === MODE_NETWORK_PLAY ? <div>
                {typeof secret == 'string' ? <NetworkGameAppWrapper secret={secret} onReturnToBase={handleReturnToBase} /> : <b>Bad secret received from server</b>}
            </div> : null}
            {mode === MODE_BASE ? <div className="appHolder"><div className="row">
                <MoonlandsLogo />
            </div>

                {error ? <div><pre>{error}</pre></div> : null}

                <p>Moonlands engine version: {engineData.version}</p>
                <p><Button disabled={loading} onClick={handleEditPlayerDeck}>Edit player deck</Button></p>
                <p><Button disabled={loading} onClick={handleEditOpponentDeck}>Edit opponent deck</Button></p>
                <p><Button disabled={loading} onClick={handleStartGame} type="primary">Start game</Button></p>
                <p><Button disabled={loading} onClick={handleConnectToServer} type="primary">Network play</Button></p>
                <p><Button disabled={loading} onClick={handleOpenReplays}>Replays</Button></p>
            </div> : null}
            {mode === MODE_EDITOR ? <DeckEditor deckContents={editedDeck} onSave={handleSave} onClose={handleReturnToBase} /> : null}
        </div>
    );
}

export default App;
