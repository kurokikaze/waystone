// Will have to convert them all to TS someday
// @ts-nocheck
import { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import {
	ACTION_PASS,
	ACTION_PLAY,
} from 'moonlands/src/const';
import { FloatButton } from 'antd';
import Log from '../Log/Log.tsx';
// @ts-ignore-next
import Zone from '../zones/Zone.jsx';
// @ts-ignore-next
import ZoneHand from '../zones/ZoneHand.jsx';
// @ts-ignore-next
import ZoneDiscard from '../zones/ZoneDiscard.jsx';
// @ts-ignore-next
import ZonePlayerInPlay from '../zones/ZonePlayerInPlay.jsx';
// @ts-ignore-next
import ZonePlayerRelics from '../zones/ZonePlayerRelics.jsx';
// @ts-ignore-next
import ZoneOpponentInPlay from '../zones/ZoneOpponentInPlay.jsx';
// @ts-ignore-next
import ZoneOpponentActiveMagi from '../zones/ZoneOpponentActiveMagi.jsx';
// @ts-ignore-next
import ZonePlayerActiveMagi from '../zones/ZonePlayerActiveMagi.jsx';
// @ts-ignore-next
import PromptOverlay from '../prompts/PromptOverlay.jsx';
// @ts-ignore-next
import PowerMessage from '../messages/PowerMessage.jsx';
// @ts-ignore-next
import RelicMessage from '../messages/RelicMessage.jsx';
// @ts-ignore-next
import SpellMessage from '../messages/SpellMessage.jsx';
// @ts-ignore-next
import CreatureMessage from '../messages/CreatureMessage.jsx';
// @ts-ignore-next
import PromptResolutionMessage from '../messages/PromptResolutionMessage.jsx';
// @ts-ignore-next
import ActionCardView from '../ActionCardView.jsx';

// @ts-ignore
import StepBoard from '../StepBoard/StepBoard.jsx';
// @ts-ignore-next
import EndgameOverlay from '../EndgameOverlay/EndgameOverlay.tsx';

import "./style.css";
import "../../assets/style.css";
import "../../assets/game.css";

// @ts-ignore
import { withSingleCardData } from '../common';
import {
	isPromptActive,
	isOurTurn,
	getCurrentStep,
	getMessage,
	getCardsCountInOurDiscard,
	getCardsCountInOpponentDiscard,
	getGameEnded,
	getCardsCountInOurDeck,
	getCardsCountInOpponentDeck,
    getPlayerNumber,
} from '../../selectors';

import {
	MESSAGE_TYPE_POWER,
	MESSAGE_TYPE_RELIC,
	MESSAGE_TYPE_SPELL,
	MESSAGE_TYPE_CREATURE,
	MESSAGE_TYPE_PROMPT_RESOLUTION,

	// Steps without priority
	STEP_ENERGIZE,
	STEP_DRAW,
} from '../../const.js';
import { EngineConnector, MessageType } from '../../types';
import { isTauri } from '@tauri-apps/api/core';
import { LogicalSize } from '@tauri-apps/api/dpi';
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';

const EnhancedPowerMessage = withSingleCardData(PowerMessage);

type AppProps = {
	engineConnector: EngineConnector,
	onBreak: Function,
	onReturnToBase: () => void,
    playerId: number
}

function App({ engineConnector, onBreak, onReturnToBase, playerId }: AppProps) {
	const [discardShown, setDiscardShown] = useState(false);
	const [opponentDiscardShown, setOpponentDiscardShown] = useState(false);

    useEffect(() => {
		if (isTauri()) {
			const appWindow = getCurrentWebviewWindow()
			appWindow.setResizable(true);
			appWindow.setSize(new LogicalSize(1108, 659));
		}
	}, []);

	const handleOurDiscardClick = useCallback(
		() => {
			setDiscardShown(true);
			setOpponentDiscardShown(false);
		},
		[],
	);

	const handleOurDiscardClose = useCallback(
		() => setDiscardShown(false),
		[],
	);

	const handleOpponentDiscardClick = useCallback(
		() => {
			setDiscardShown(false);
			setOpponentDiscardShown(true);
		},
		[],
	);

	const handleOpponentDiscardClose = useCallback(
		() => setOpponentDiscardShown(false),
		[],
	);

	const prompt: boolean = useSelector(isPromptActive);
	const ourTurn: boolean = useSelector(isOurTurn);
	const currentPlayer: number = useSelector((state: { activePlayer: number }) => state.activePlayer);
	// const timer = useSelector(getTimer);
	const currentStep = useSelector(getCurrentStep);
	const message: MessageType | null = useSelector(getMessage);
	// const timerSeconds = useSelector(getTimerSeconds);
	const gameEnded: boolean = useSelector(getGameEnded);
	const cardsInOpponentDiscard: number = useSelector(getCardsCountInOpponentDiscard);
	const cardsInOurDiscard: number = useSelector(getCardsCountInOurDiscard);
	const cardsInOurDeck: number = useSelector(getCardsCountInOurDeck);
	const cardsInOpponentDeck: number = useSelector(getCardsCountInOpponentDeck);
    const playerNumber = useSelector(getPlayerNumber)

	const onPass = useCallback(() => {
		engineConnector.emit({
			type: ACTION_PASS,
			player: playerNumber,
		});
	}, [engineConnector, playerNumber]);

	const onPlay = useCallback((cardId: string) => {
		engineConnector.emit({
			type: ACTION_PLAY,
			payload: {
				card: {
					id: cardId,
				},
			},
			player: playerNumber,
		});
	}, [engineConnector, playerNumber]);

	const onDebug = useCallback(() => {
		console.log(`Sending debug command`)
		engineConnector.emit({
            // @ts-ignore
			special: 'status',
		})
	}, [engineConnector])

	return (
		<div className='gameContainer'>
			<FloatButton type="primary" onClick={onDebug} style={{ right: 24 }} />
			{/*timer && <div className="turnTimer">00:{timerSeconds.toString().padStart(2, '0')}</div>*/}
			<div className="game">
				<DndProvider backend={HTML5Backend}>
					<>
						{message && message.type == MESSAGE_TYPE_POWER && <EnhancedPowerMessage id={message.source || 'source'} power={message.power} onBreak={onBreak} />}
						{message && message.type == MESSAGE_TYPE_RELIC && <RelicMessage card={message.card} player={message.player} />}
						{message && message.type == MESSAGE_TYPE_SPELL && <SpellMessage card={message.card} player={message.player} />}
						{message && message.type == MESSAGE_TYPE_CREATURE && <CreatureMessage card={message.card} player={message.player} />}
						{message && message.type == MESSAGE_TYPE_PROMPT_RESOLUTION && <PromptResolutionMessage card={message.chosenTarget} number={message.chosenNumber} />}
						<Zone zoneId='opponentHand' name='Opponent hand' />
						<div className='middleZones'>
							<div className='zone-placeholder'>
								<div className='libraryCounter'>{cardsInOpponentDeck}</div>
								<div className='discardCounter' onClick={handleOpponentDiscardClick}>{cardsInOpponentDiscard}</div>
							</div>
							<ZoneOpponentActiveMagi zoneId='opponentActiveMagi' name='Opponent Active Magi' engineConnector={engineConnector} />
							<ZonePlayerRelics zoneId='opponentRelics' name='Opponent Relics' engineConnector={engineConnector} />
						</div>
						<ZoneOpponentInPlay zoneId='opponentInPlay' name='Opponent in play' engineConnector={engineConnector} />
						<ZonePlayerInPlay zoneId='playerInPlay' name='Player in play' engineConnector={engineConnector} />
						<div className='middleZones'>
							<ZonePlayerRelics zoneId='playerRelics' name='Player Relics' engineConnector={engineConnector} />
							<ZonePlayerActiveMagi zoneId='playerActiveMagi' name='Player Active Magi' engineConnector={engineConnector} />
							<div className='zone-placeholder'>
								<div className='discardCounter' onClick={handleOurDiscardClick}>{cardsInOurDiscard}</div>
								<div className='libraryCounter'>{cardsInOurDeck}</div>
							</div>
						</div>
						<ZoneHand zoneId='playerHand' name='Player hand' onCardClick={onPlay} />
						<StepBoard />
						<ActionCardView />
						{ourTurn && (currentStep !== STEP_ENERGIZE) && (currentStep !== STEP_DRAW) && <>
							<button onClick={onPass}>{currentStep === null ? 'Start the game' : 'Pass'}</button>
						</>}
						{!ourTurn && <div>Opponent&apos;s turn ({currentPlayer}/{playerNumber})</div>}
						{/*<button onClick={onRefresh}>Refresh</button>*/}
						{discardShown && <div className='discardOverlay'>
							<h2>Discard</h2>
							<div className='closeIcon' onClick={handleOurDiscardClose}>&times;</div>
							<ZoneDiscard zoneId='playerDiscard' name='Player discard' />
						</div>}
						{opponentDiscardShown && <div className='discardOverlay'>
							<h2>Opponent&apos;s Discard</h2>
							<div className='closeIcon' onClick={handleOpponentDiscardClose}>&times;</div>
							<ZoneDiscard zoneId='opponentDiscard' name='Opponent discard' />
						</div>}
						{prompt && <PromptOverlay engineConnector={engineConnector} />}
						{gameEnded && <EndgameOverlay onReturnToBase={onReturnToBase} />}
					</>
				</DndProvider>
			</div>
			<Log />
		</div>
	);
}

export default App;
