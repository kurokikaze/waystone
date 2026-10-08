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
    const actionSubscriber = useRef<Subscriber<ClientAction>>()
    const playback = useRef(new BehaviorSubject(true));
    const interval = useRef<ReturnType<typeof setInterval>>();
    const animationSubscription = useRef<Subscription>();
    const [ticks, setTicks] = useState<Record<number, string>>({})

    const startPlayback = (speed = 100) => {
        if (replayDataSaved.current && actionSubscriber.current && !actionSubscriber.current.closed && !interval.current) {
            interval.current = setInterval(() => {
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
                            clearInterval(interval.current);
                            interval.current = undefined;
                            actionSubscriber.current?.complete();
                        }
                    }
                } else if (!messageData) {
                    clearInterval(interval.current);
                    interval.current = undefined;
                    actionSubscriber.current?.complete();
                }
            }, speed);
        }
        playback.current.next(true);
        setPlaying(true);
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
            replayDataSaved.current = [...replayDataInitial.current]
            setCurrentPosition(0)
        }
    }

    const breakRef = useRef<Function>(() => { });
    const [length, setLength] = useState<number>(0)
    const [currentPosition, setCurrentPosition] = useState<number>(0)

    const loadReplay = async (replayName: string, isCancelled: () => boolean) => {
        const replayData = await (new ReplayLogService()).readReplay(replayName);
        if (isCancelled()) return;
        replayDataSaved.current = replayData;
        replayDataInitial.current = [...replayData];
        const ticksFromReplay = replayData
            .map((entry, index) => {
                if (!('action' in entry) || !entry.action) return [index, '', ''];
                if (entry.action.type !== ACTION_EFFECT) return [index, entry.action.type, ''];
                const { type = '', effectType = '' } = entry.action
                return [index, type, effectType];
            })
            .filter(([_, type, effectType]) => type == ACTION_EFFECT && effectType == EFFECT_TYPE_START_OF_TURN)
            .map(([step], index) => [step, (index + 1).toString()])
        setTicks(Object.fromEntries(ticksFromReplay))
        setLength(replayData.length)

        const actionsObservable = new Observable<ClientAction>(subscriber => {
            actionSubscriber.current = subscriber;

            startPlayback();
        });

        const breakObservable = new Observable<{}>(observer => {
            breakRef.current = () => {
                observer.next({});
            }
        });
        const animatedActions = addAnimations(actionsObservable, breakObservable, store, false, playback.current);
        animationSubscription.current = animatedActions.subscribe({
            next: (transformedAction) => {
                setCurrentPosition(pos => pos + 1);
                store.dispatch(transformedAction);
            },
            complete: () => setPlaying(false),
        });
        setLoading(false);
    }

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        playback.current.next(true);
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
            clearInterval(interval.current);
            interval.current = undefined;
            animationSubscription.current?.unsubscribe();
            actionSubscriber.current = undefined;
            breakRef.current = () => {};
        };
    }, [replayName]);

    return (
        <div className="replayWrapper">
            <Provider store={store}>
                {loading ? <Spin /> : <GameApp engineConnector={engineConnector} onBreak={breakRef.current} onReturnToBase={onReturnToBase} playerId={1} />}
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
