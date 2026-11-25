import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";

import { GameAppWrapper } from "./components/GameAppWrapper/GameAppWrapper";
import { ReplayAppWrapper } from "./components/ReplayAppWrapper/ReplayAppWrapper";
import MoonlandsLogo from "./components/MoonlandsLogo/MoonlandsLogo";
import DeckEditor from "./components/DeckEditor/DeckEditor";

import engineData from 'moonlands/package.json'
import { DeckKeeperService, isPlayableDeck } from "./services/DeckKeeperService";
import ReplayList from "./components/ReplaysList/ReplayList";
import { Button, Select, Space } from "antd";
import type { DeckLibrary, SavedDeck } from "./services/DeckKeeperService";
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

    const [loading, setLoading] = useState(true);
    const [secret, setSecret] = useState<string>();
    const [library, setLibrary] = useState<DeckLibrary | null>(null);
    const [editedDeck, setEditedDeck] = useState<SavedDeck | null>(null);
    const [saving, setSaving] = useState(false);
    const saveInProgress = useRef(false);
    const [error, setError] = useState('');
    const [chosenReplay, setChosenReplay] = useState('');

    useEffect(() => {
        let cancelled = false;
        new DeckKeeperService().loadLibrary()
            .then(decks => { if (!cancelled) setLibrary(decks); })
            .catch((error: unknown) => { if (!cancelled) setError(`Could not load decks: ${String(error)}`); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, []);

    const persistLibrary = async (next: DeckLibrary): Promise<boolean> => {
        if (saveInProgress.current) return false;
        saveInProgress.current = true;
        setSaving(true);
        setError('');
        try {
            await new DeckKeeperService().saveLibrary(next);
            setLibrary(next);
            return true;
        } catch (error) {
            setError(`Could not save decks: ${String(error)}`);
            return false;
        } finally {
            saveInProgress.current = false;
            setSaving(false);
        }
    };

    const playerDeck = library?.decks.find(deck => deck.id === library.playerDeckId);
    const opponentDeck = library?.decks.find(deck => deck.id === library.opponentDeckId);
    const deckOptions = library?.decks.map(deck => ({ value: deck.id, label: deck.name })) ?? [];

    const editDeck = (deck: SavedDeck) => {
        setError('');
        setEditedDeck(deck);
        setMode(MODE_EDITOR);
    };

    const handleSave = async (deck: DeckType) => {
        if (!library || !editedDeck) return;
        const saved = { ...deck, id: editedDeck.id };
        const decks = library.decks.some(entry => entry.id === saved.id)
            ? library.decks.map(entry => entry.id === saved.id ? saved : entry)
            : [...library.decks, saved];
        if (await persistLibrary({ ...library, decks })) setMode(MODE_BASE);
    };

    const chooseDeck = (slot: 'playerDeckId' | 'opponentDeckId', id: string) => {
        if (library && library[slot] !== id) void persistLibrary({ ...library, [slot]: id });
    };

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
            {mode === MODE_GAME && playerDeck && opponentDeck ? <div>
                <GameAppWrapper playerDeck={playerDeck.cards} opponentDeck={opponentDeck.cards} onReturnToBase={handleReturnToBase} />
            </div> : null}
            {mode === MODE_REPLAY_LIST ? <div>
                <ReplayList onReplayClick={handleReplaySelect} onReturnToBase={handleReturnToBase} />
            </div> : null}
            {mode === MODE_REPLAY ? <div>
                <ReplayAppWrapper replayName={chosenReplay} onReturnToBase={handleReturnToBase} />
            </div> : null}
            {mode === MODE_CHALLENGES && playerDeck ? <div className="appHolder">
                <ChallengeAppWrapper
                    playerDeck={playerDeck}
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
                <div className="deckSelection">
                    <Space wrap>
                        <label id="player-deck-label">Your deck</label>
                        <Select aria-labelledby="player-deck-label" value={playerDeck?.id} options={deckOptions}
                            disabled={loading || saving || !library} onChange={id => chooseDeck('playerDeckId', id)} />
                        <Button disabled={saving || !playerDeck} onClick={() => playerDeck && editDeck(playerDeck)}>Edit</Button>
                    </Space>
                    <Space wrap>
                        <label id="opponent-deck-label">Opponent deck</label>
                        <Select aria-labelledby="opponent-deck-label" value={opponentDeck?.id} options={deckOptions}
                            disabled={loading || saving || !library} onChange={id => chooseDeck('opponentDeckId', id)} />
                        <Button disabled={saving || !opponentDeck} onClick={() => opponentDeck && editDeck(opponentDeck)}>Edit</Button>
                    </Space>
                    <Button disabled={saving || !library} onClick={() => editDeck({ id: crypto.randomUUID(), name: '', cards: ['', '', ''] })}>New deck</Button>
                </div>
                <p><Button disabled={saving || !playerDeck || !opponentDeck || !isPlayableDeck(playerDeck.cards) || !isPlayableDeck(opponentDeck.cards)} onClick={handleStartGame} type="primary">Start game</Button></p>
                <p><Button disabled={saving || !playerDeck || !isPlayableDeck(playerDeck.cards)} onClick={handleConnectToServer} type="primary">Network play</Button></p>
                <p><Button disabled={loading} onClick={handleOpenReplays}>Replays</Button></p>
            </div> : null}
            {mode === MODE_EDITOR && editedDeck ? <DeckEditor deckContents={editedDeck} onSave={handleSave} onClose={handleReturnToBase} saving={saving} error={error} /> : null}
        </div>
    );
}

export default App;
