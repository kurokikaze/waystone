import Worker from "../../worker/worker?worker"
import BotWorker from "../../worker/botWorker?worker"
import { COMMAND_START } from "../../const";
import { Observable } from "rxjs";
import addAnimations from "../../addAnimations";
import { ReplayLogService } from "../../services/ReplayLogService";
import { ACTION_PLAYER_WINS } from "moonlands";
import { Store } from "redux";
import { ClientAction } from "../../clientProtocol";
import { enrichState } from "../../utils";
import { EngineConnector } from "../../types";

export const connectToEngine = (store: Store, playerDeck: string[], opponentDeck: string[]): [EngineConnector, () => void] => {
    const bechamel = new BotWorker();
    // botRef.current = bechamel
    console.log('Bechamel worker created');
    let breakCallback = () => {};

    // if (!engineRef.current && !actionsObservableRef.current) {
    const engine = new Worker();
    const fullLog: string[] = []
    console.log('Created the worker')
    const actionsObservable = new Observable<ClientAction>(subscriber => {
        const onmessage = (message: any) => {
            if (message.data && 'state' in message.data) {
                const data = message.data;
                if (data.for === 1) {
                    console.log('Setting the initial state');
                    console.dir(message.data.state);
                    store.dispatch({ type: 'setInitialState', state: enrichState(message.data.state, 1) });
                    fullLog.push(JSON.stringify(message.data));
                } else if (bechamel) {
                    console.log('Sending initial state to the bot')
                    bechamel.postMessage({
                        type: 'special/setup',
                        playerId: 2,
                        state: message.data.state,
                    })
                }
            } else if (message.data && 'action' in message.data) {
                if (message.data.for === 1) {
                    // console.dir(message.data.action);
                    fullLog.push(JSON.stringify(message.data));
                    subscriber.next(message.data.action);
                    if (message.data.action.type === ACTION_PLAYER_WINS) {
                        console.log('Trying to save the replay');
                        const replayDate = new Date();
                        const replayName = `${replayDate.getDate().toString().padStart(2, '0')}-${(replayDate.getMonth() + 1).toString().padStart(2, '0')}-${replayDate.getFullYear()} ${replayDate.getHours()}-${replayDate.getMinutes()}`;
                        (new ReplayLogService()).saveReplay(replayName, fullLog);
                        subscriber.complete();
                    }
                } else if (bechamel) {
                    bechamel.postMessage(message.data.action);
                }
            }
        }

        engine.onmessage = onmessage;
    });

    const breakObservable = new Observable<{}>(observer => {
        breakCallback = () => {
            observer.next({});
        }
    });

    const delayedActions = addAnimations(actionsObservable, breakObservable, store, true);

    delayedActions.subscribe({
        next: (transformedAction) => {
            store.dispatch(transformedAction);
        },
    });

    engine.postMessage({
        type: COMMAND_START,
        playerDeck,
        opponentDeck,
    });
    // @ts-ignore
    // window.engine = engine;
    // engineRef.current = engine;
    const realEngineConnector: EngineConnector = {
        emit: (action: any) => {
            engine.postMessage({
                ...action,
                player: 1,
            })
        },
    };
    // setEngineConnector(realEngineConnector);

    // Connect bechamel to the engine
    if (bechamel) {
        bechamel.onmessage = (action: any) => {
            if (action.data && 'type' in action.data) {
                engine.postMessage({
                    ...action.data,
                    player: 2,
                });
            } else if (action.data && 'botState' in action.data) {
                // @ts-ignore
                window.lastBotState = JSON.parse(action.data.botState);
            } else if (action.data && action.data.type == 'display/dump') {
                console.dir(action.data.state)
            }
        }
        console.log('Bechamel connected to the engine');
    }

    return [realEngineConnector, breakCallback]
}