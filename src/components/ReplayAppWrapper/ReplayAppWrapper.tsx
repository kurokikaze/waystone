import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { isTauri } from "@tauri-apps/api/core";
import { LogicalSize } from "@tauri-apps/api/dpi";
import { ACTION_EFFECT, ACTION_PLAYER_WINS, EFFECT_TYPE_START_OF_TURN } from "moonlands";
import { useRef, useEffect, useState } from "react";
import { Provider } from "react-redux"
import { createStore, compose, applyMiddleware } from "redux";
import { createEpicMiddleware } from "redux-observable";
import thunk from "redux-thunk";
import { Observable, Subscriber } from "rxjs";
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
    const [ticks, setTicks] = useState<Record<number, string>>({})

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

    const rewind = () => {
        if (replayDataInitial.current) {
            replayDataSaved.current = [...replayDataInitial.current]
            setCurrentPosition(0)
        }
    }

    const [interval, saveInterval] = useState<ReturnType<typeof setInterval>>()
    const breakRef = useRef<Function>(() => { });
    const [length, setLength] = useState<number>(0)
    const [currentPosition, setCurrentPosition] = useState<number>(0)

    const loadReplay = async (replayName: string) => {
        const replayData = await (new ReplayLogService()).readReplay(replayName);
        replayDataSaved.current = replayData;
        replayDataInitial.current = [...replayData];
        const ticksFromReplay = replayData
            // @ts-ignore effectType is not always on ClientAction (?)
            .map(({ action: { type = '', effectType = '' } = {}}, index) => [index, type, effectType])
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
        const animatedActions = addAnimations(actionsObservable, breakObservable, store, false);
        animatedActions.subscribe({
            next: (transformedAction) => {
                setCurrentPosition(pos => pos + 1);
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
