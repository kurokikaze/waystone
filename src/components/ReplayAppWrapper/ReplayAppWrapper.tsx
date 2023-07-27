import { appWindow, LogicalSize } from "@tauri-apps/api/window";
import { ACTION_PLAYER_WINS } from "moonlands";
import { useRef, useEffect, useState } from "react";
import { Provider } from "react-redux"
import { createStore, compose, applyMiddleware } from "redux";
import { createEpicMiddleware } from "redux-observable";
import thunk from "redux-thunk";
import { Observable } from "rxjs";
import Spin from "antd/es/spin";
import addAnimations from "../../addAnimations";
import { C2SAction, ClientAction } from "../../clientProtocol";
import { defaultState } from "../../reducers/reducer";
import { EngineConnector } from "../../types";
import { enrichState } from "../../utils";
import rootReducer from '../../reducers';
import GameApp from "../GameApp/GameApp"
import { ReplayLogService } from "../../services/ReplayLogService";

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
	const breakRef = useRef<Function>(() => { });

	const loadReplay = async (replayName: string) => {
		const replayData = await (new ReplayLogService()).readReplay(replayName);

		const actionsObservable = new Observable<ClientAction>(subscriber => {
			setInterval(() => {
				const messageData = replayData.shift();
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
						// @ts-ignore
						subscriber.next(messageData.action);
						if (messageData.action.type === ACTION_PLAYER_WINS) {
							subscriber.complete();
						}
					}
				}
			}, 100);
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
			appWindow.setResizable(false);
			appWindow.setSize(new LogicalSize(1111, 660));
		} catch (e) {

		}
		const realEngineConnector = {
			emit: (_action: any) => () => { }
		};
		setEngineConnector(realEngineConnector);
		loadReplay(replayName);
	}, [replayName]);

	return (<Provider store={store}>
		{loading ? <Spin /> : <GameApp engineConnector={engineConnector} onBreak={breakRef.current} onReturnToBase={onReturnToBase} />}
	</Provider>)
}
