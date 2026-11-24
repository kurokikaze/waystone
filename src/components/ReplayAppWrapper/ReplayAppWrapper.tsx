import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { isTauri } from "@tauri-apps/api/core";
import { LogicalSize } from "@tauri-apps/api/dpi";
import { ACTION_EFFECT, ACTION_PLAYER_WINS, EFFECT_TYPE_START_OF_TURN } from "moonlands";
import { useRef, useEffect, useState } from "react";
import { Provider } from "react-redux"
import { createStore, compose, applyMiddleware } from "redux";
import { createEpicMiddleware } from "redux-observable";
import thunk from "redux-thunk";
import { BehaviorSubject, Observable, Subscriber, Subscription } from "rxjs";
import { Spin, Slider, Button } from "antd";
import addAnimations from "../../addAnimations";
import { C2SAction, ClientAction, ClientMessage } from "../../clientProtocol";
import { defaultState } from "../../reducers/reducer";
import { EngineConnector } from "../../types";
import { enrichState } from "../../utils";
import rootReducer from '../../reducers';
import GameApp from "../GameApp/GameApp"
import { ReplayLogService } from "../../services/ReplayLogService";

import './style.css';

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
    const replayDataInitial = useRef<ClientMessage[]>()
    const replayPlayer = useRef(1);
    const actionSubscriber = useRef<Subscriber<ClientAction>>()
    const playback = useRef(new BehaviorSubject(true));
    const interval = useRef<ReturnType<typeof setInterval>>();
    const animationSubscription = useRef<Subscription>();
    const [ticks, setTicks] = useState<Record<number, string>>({})

    const startPlayback = () => {
        if (!animationSubscription.current || animationSubscription.current.closed) {
            if (replayDataInitial.current) resetReplay(replayDataInitial.current, true);
            return;
        }
        if (!interval.current && !actionSubscriber.current?.closed) {
            interval.current = setInterval(() => {
                if (!replayDataSaved.current) {
                    throw new Error('Replay stopped prematurely');
                }
                const messageData = replayDataSaved.current.shift();
                if (messageData) actionSubscriber.current?.next(messageData.action);
                if (!messageData || messageData.action.type === ACTION_PLAYER_WINS) {
                    clearInterval(interval.current);
                    interval.current = undefined;
                    actionSubscriber.current?.complete();
                }
            }, 100);
        }
        setPlaying(true);
        playback.current.next(true);
    }

    const pause = () => {
        playback.current.next(false);
        setPlaying(false);
        clearInterval(interval.current);
        interval.current = undefined;
    }

    const play = () => {
        startPlayback();
    }

    const rewind = () => {
        if (replayDataInitial.current) {
            resetReplay(replayDataInitial.current, playing);
        }
    }

    const breakRef = useRef<Function>(() => { });
    const [length, setLength] = useState<number>(0)
    const [currentPosition, setCurrentPosition] = useState<number>(0)
    const [replayRun, setReplayRun] = useState(0);

    const disposeReplay = () => {
        clearInterval(interval.current);
        interval.current = undefined;
        animationSubscription.current?.unsubscribe();
        animationSubscription.current = undefined;
        actionSubscriber.current = undefined;
        breakRef.current = () => {};
    };

    const resetReplay = (replayData: ClientMessage[], autoplay: boolean) => {
        disposeReplay();
        playback.current.next(false);
        const playerNumber = replayPlayer.current;
        const initial = replayData.find(entry => entry.for === playerNumber && 'state' in entry);
        const initialState = structuredClone(defaultState);
        if (initial && 'state' in initial) {
            Object.assign(initialState, structuredClone(initial.state));
        }
        store.dispatch({ type: 'setInitialState', state: enrichState({ ...initialState, playerNumber }) });
        const actions = replayData.filter(entry => entry.for === playerNumber && entry.action);
        replayDataSaved.current = [...actions];
        const positions = new Map(actions.map((entry, index) => [entry.action, index + 1]));
        setCurrentPosition(0);
        setReplayRun(run => run + 1);
        const actionsObservable = new Observable<ClientAction>(subscriber => {
            actionSubscriber.current = subscriber;
        });

        const breakObservable = new Observable<{}>(observer => {
            breakRef.current = () => {
                observer.next({});
            }
        });
        const animatedActions = addAnimations(actionsObservable, breakObservable, store, false, playback.current);
        animationSubscription.current = animatedActions.subscribe({
            next: (transformedAction) => {
                store.dispatch(transformedAction);
                const position = positions.get(transformedAction as ClientAction);
                if (position !== undefined) setCurrentPosition(position);
            },
            complete: () => setPlaying(false),
        });
        setPlaying(autoplay);
        if (autoplay) startPlayback();
    };

    const loadReplay = async (replayName: string, isCancelled: () => boolean) => {
        const replayData = await (new ReplayLogService()).readReplay(replayName);
        if (isCancelled()) return;
        replayDataInitial.current = replayData;
        replayPlayer.current = replayData.find(entry => 'state' in entry)?.for ?? replayData[0]?.for ?? 1;
        const actions = replayData.filter(entry => entry.for === replayPlayer.current && entry.action);
        let turn = 0;
        setTicks(Object.fromEntries(actions.flatMap(({ action }, index) =>
            action.type === ACTION_EFFECT && action.effectType === EFFECT_TYPE_START_OF_TURN
                ? [[index + 1, String(++turn)]] : [])));
        setLength(actions.length);
        resetReplay(replayData, true);
        setLoading(false);
    }

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        try {
            if (isTauri()) {
                const appWindow = getCurrentWebviewWindow()

                appWindow.setResizable(false);
                appWindow.setSize(new LogicalSize(1111, 660));
            }
        } catch (e) {

        }
        const realEngineConnector = {
            emit: (action: any) => {
                switch (action.type) {
                    case 'actions/pause': {
                        pause();
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
        loadReplay(replayName, () => cancelled);
        return () => {
            cancelled = true;
            disposeReplay();
            replayDataInitial.current = undefined;
        };
    }, [replayName]);

    return (
        <div className="replayWrapper">
            <Provider store={store}>
                {loading ? <Spin /> : <GameApp key={replayRun} engineConnector={engineConnector} onBreak={() => breakRef.current()} onReturnToBase={onReturnToBase} playerId={replayPlayer.current} />}
                <div className="controls">
                    <div>
                        <Slider disabled max={length} marks={ticks} value={currentPosition}></Slider>
                    </div>
                    <div className="playPause">
                        <Button onClick={rewind}>Rewind</Button>
                        {playing ? <Button onClick={pause}>Pause</Button>
                            : <Button onClick={play}>Play</Button>}
                    </div>
                </div>
            </Provider>
        </div>)
}
