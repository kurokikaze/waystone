import { appWindow, LogicalSize } from "@tauri-apps/api/window";
import { ACTION_PLAYER_WINS } from "moonlands";
import { useRef, useEffect, useState } from "react";
import { Provider } from "react-redux"
import { createStore, compose, applyMiddleware } from "redux";
import { createEpicMiddleware } from "redux-observable";
import thunk from "redux-thunk";
import { Observable } from "rxjs";
import addAnimations from "../../addAnimations";
import { C2SAction, ClientAction } from "../../clientProtocol";
import { COMMAND_START } from "../../const";
import { defaultState } from "../../reducers/reducer";
import { EngineConnector } from "../../types";
import { enrichState } from "../../utils";
import rootReducer from '../../reducers';
import GameApp from "../GameApp/GameApp"
import Worker from "../../worker/worker?worker"
import BotWorker from "../../worker/botWorker?worker"
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

type GameAppWrapperProps = {
  playerDeck: string[]
  opponentDeck: string[]
  onReturnToBase: () => void
}

export const GameAppWrapper = ({
  playerDeck,
  opponentDeck,
  onReturnToBase,
}: GameAppWrapperProps) => {
  const actionsObservableRef = useRef<Observable<ClientAction>>()

  const [engineConnector, setEngineConnector] = useState<EngineConnector>(emptyEngineConnector);

  const engineRef = useRef<Worker>();
  const botRef = useRef<Worker>();
  const breakRef = useRef<Function>(() => { });

  useEffect(() => {
    try {
      appWindow.setResizable(false);
      appWindow.setSize(new LogicalSize(1111, 660));
    } catch (e) {

    }
    if (!botRef.current) {
      const bechamel = new BotWorker();
      botRef.current = bechamel
      console.log('Bechamel worker created');
    }

    if (!engineRef.current && !actionsObservableRef.current) {
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
            } else if (botRef.current) {
              console.log('Sending initial state to the bot')
              botRef.current.postMessage({
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
            } else if (botRef.current) {
              botRef.current.postMessage(message.data.action);
            }
          }
        }

        engine.onmessage = onmessage;
      });

      actionsObservableRef.current = actionsObservable;
      // console.log('Creating the break observable');
      const breakObservable = new Observable<{}>(observer => {
        // console.log('Setting break callback')
        breakRef.current = () => {
          // console.log('Break detected');
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
      engineRef.current = engine;
      const realEngineConnector = {
        emit: (action: any) => {
          engine.postMessage({
            ...action,
            player: 1,
          })
        },
      };
      setEngineConnector(realEngineConnector);

      // Connect bechamel to the engine
      if (botRef.current) {
        botRef.current.onmessage = (action) => {
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
    }
  }, []);
  return (<Provider store={store}>
    <GameApp engineConnector={engineConnector} onBreak={breakRef.current} onReturnToBase={onReturnToBase} />
  </Provider>)
}
