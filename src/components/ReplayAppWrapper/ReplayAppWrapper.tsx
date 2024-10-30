import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { LogicalSize } from "@tauri-apps/api/dpi";
import { ACTION_PLAYER_WINS } from "moonlands";
import { useRef, useEffect, useState } from "react";
import { Provider } from "react-redux"
import { createStore, compose, applyMiddleware } from "redux";
import { createEpicMiddleware } from "redux-observable";
import thunk from "redux-thunk";
import { Observable, Subscriber } from "rxjs";
import Spin from "antd/es/spin";
import addAnimations from "../../addAnimations";
import { C2SAction, ClientAction, ClientMessage } from "../../clientProtocol";
import { defaultState } from "../../reducers/reducer";
import { EngineConnector } from "../../types";
import { enrichState } from "../../utils";
import rootReducer from '../../reducers';
import GameApp from "../GameApp/GameApp"
import { ReplayLogService } from "../../services/ReplayLogService";

import './style.css';
function isTauri() {
	return Boolean(
		typeof window !== 'undefined' &&
		window !== undefined &&
		// @ts-ignore
		window.__TAURI_IPC__ !== undefined
	)
}

const epicMiddleware = createEpicMiddleware();
const store = createStore(
	rootReducer,
	defaultState,
	compose(
		applyMiddleware(thunk),
		applyMiddleware(epicMiddleware),
	),
);


var emptyEngineConnector: EngineConnector = {
	emit: (_action: C2SAction) => { },
};

type ReplayAppWrapperProps = {
	replayName: string
	onReturnToBase: () => void
}

export const ReplayAppWrapper = ({
	replayName,
	onReturnToBase,
}: ReplayAppWrapperProps) => {
	const [engineConnector, setEngineConnector] = useState<EngineConnector>(emptyEngineConnector);

	const [loading, setLoading] = useState(true);
	const [playing, setPlaying] = useState(true);
	const replayDataSaved = useRef<ClientMessage[]>()
	const actionSubscriber = useRef<Subscriber<ClientAction>>()

	const startPlayback = (speed = 100) => {
		if (replayDataSaved.current && actionSubscriber.current) {
			saveInterval(setInterval(() => {
				if (!replayDataSaved.current) {
					throw new Error('Replay stopped prematurely');
				}
				const messageData = replayDataSaved.current.shift();
				if (messageData && 'state' in messageData) {
					const data = messageData;
					if (data.for === 1) {
						console.log('Setting the initial state');
						console.dir(messageData.state);
						// @ts-ignore
						store.dispatch({ type: 'setInitialState', state: enrichState(messageData.state, 1) });
					}
				} else if (messageData && 'action' in messageData) {
					if (messageData.for === 1) {
						actionSubscriber.current?.next(messageData.action);
						if (messageData.action.type === ACTION_PLAYER_WINS) {
							actionSubscriber.current?.complete();
						}
					}
				}
			}, speed));
			setPlaying(true);
		}
	}

	const pause = () => {
		setPlaying(false);
		clearInterval(interval);
	}

	const play = () => {
		startPlayback();
	}

	const [interval, saveInterval] = useState<ReturnType<typeof setInterval>>()
	const breakRef = useRef<Function>(() => { });

	const loadReplay = async (replayName: string) => {
		const replayData = await (new ReplayLogService()).readReplay(replayName);
		replayDataSaved.current = replayData;

		const actionsObservable = new Observable<ClientAction>(subscriber => {
			actionSubscriber.current = subscriber;

			startPlayback();
		});

		const breakObservable = new Observable<{}>(observer => {
			breakRef.current = () => {
				observer.next({});
			}
		});
		const animatedActions = addAnimations(actionsObservable, breakObservable, store, false);
		animatedActions.subscribe({
			next: (transformedAction) => {
				store.dispatch(transformedAction);
			},
		});
		setLoading(false);
	}

	useEffect(() => {
		try {
			if (isTauri()) {
				const appWindow = getCurrentWebviewWindow()

				appWindow.setResizable(false);
				appWindow.setSize(new LogicalSize(1111, 660));
			}
		} catch (e) {

		}
		const realEngineConnector = {
			emit: (action: any) => () => {
				switch (action.type) {
					case 'actions/pause': {
						clearInterval(interval);
						setPlaying(false);
						break;
					}
					case 'actions/play': {
						startPlayback();
						break;
					}
				}
			}
		};
		setEngineConnector(realEngineConnector);
		loadReplay(replayName);
	}, [replayName]);

	return (
		<div className="replayWrapper">
			<Provider store={store}>
				{loading ? <Spin /> : <GameApp engineConnector={engineConnector} onBreak={breakRef.current} onReturnToBase={onReturnToBase} />}
				<div className="controls">
					{playing ? <button onClick={pause}>Pause</button>
						: <button onClick={play}>Play</button>}
				</div>
			</Provider>
		</div>)
}
