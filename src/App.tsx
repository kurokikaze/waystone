import { useState, useCallback, useRef, useEffect } from "react";
import { Observable } from 'rxjs';
import reactLogo from "./assets/react.svg";
import GameApp from './components/App';
import "./App.css";
import Worker from "./worker/worker?worker"
import BotWorker from "./worker/botWorker?worker"

import { Provider } from 'react-redux';

import { createStore, applyMiddleware, compose } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
// import { Observable } from 'rxjs';
import thunk from 'redux-thunk';
import addAnimations from './addAnimations.js';
// @ts-ignore
import { enrichState } from './utils.js';
// @ts-ignore
import rootReducer from './reducers';
// @ts-ignore
import {defaultState} from './reducers/reducer';
import { EngineConnector } from "./types";
import { ACTION_PASS, ACTION_PLAYER_WINS } from "moonlands/dist/const";
import { ClientAction, ClientCommand } from "./clientProtocol";

var emptyEngineConnector: EngineConnector = {
  emit: (_action: ClientCommand) => {},
};

const epicMiddleware = createEpicMiddleware();
const store = createStore(
  rootReducer,
  defaultState,
  compose(
    applyMiddleware(thunk),
    applyMiddleware(epicMiddleware),
  ),
);

function App() {
  const [name, setName] = useState("");

  const [game, setGame] = useState<boolean>(false);
  const [lastAction, setLastAction] = useState("");
  const [engineConnector, setEngineConnector] = useState<EngineConnector>(emptyEngineConnector);

  const engineRef = useRef<Worker>();
  const botRef = useRef<Worker>();

  const actionsObservableRef = useRef<Observable<ClientAction>>()

  useEffect(() => {
    if (!botRef.current) {
      const bechamel = new BotWorker();
      botRef.current = bechamel
      console.log('Bechamel worker created');
    }

    if (!engineRef.current && !actionsObservableRef.current) {
      const engine = new Worker();
      console.log('Created the worker')
      const actionsObservable = new Observable<ClientAction>(subscriber => {
        const onmessage = (message: any) => {
          // console.dir(message)
          if (message.data && 'state' in message.data) {
            const data = message.data;
            if (data.for === 1) {
              console.log('Setting the initial state');
              console.dir(message.data.state);
              store.dispatch({type: 'setInitialState', state: enrichState(message.data.state, 1)});
              setGame(true);
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
              subscriber.next(message.data.action);
              if (message.data.action.type === ACTION_PLAYER_WINS) {
                subscriber.complete();
              }

              // store.dispatch(message.data.action);
            } else if (botRef.current) {
              botRef.current.postMessage(message.data.action);
            }
          }
        }

        engine.onmessage = onmessage;
      });      

      actionsObservableRef.current = actionsObservable;
      const delayedActions = addAnimations(actionsObservable, store);

	    delayedActions.subscribe({
        next: (transformedAction) => {
          console.dir(transformedAction);
          store.dispatch(transformedAction);
        },
      });

      engine.postMessage('start');
      // @ts-ignore
      // window.engine = engine;
      engineRef.current = engine;
      const realEngineConnector = {
        emit: (action: any) => engine.postMessage({
          ...action,
          player: 1,
        }),
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
          }
        }
        console.log('Bechamel connected to the engine');
      }
    }
  }, []);

  const pass = useCallback(() => {
    if (engineRef.current && engineRef.current.postMessage) {
      engineRef.current.postMessage({type: ACTION_PASS, player: 1})
    }
  }, [])

  return (
    <div>
      {game ? <div>
        <Provider store={store}>
          <GameApp engineConnector={engineConnector}/>
        </Provider>
      </div> : <div className="container">
        <h1>Welcome to Tauri!</h1>

        <div className="row">
          <a href="https://vitejs.dev" target="_blank">
            <img src="/vite.svg" className="logo vite" alt="Vite logo" />
          </a>
          <a href="https://tauri.app" target="_blank">
            <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
          </a>
          <a href="https://reactjs.org" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>

        <p>Click on the Tauri, Vite, and React logos to learn more.</p>

        <p>Last game action: {lastAction}.</p>

        <div className="row">
          <div>
            <input
              id="greet-input"
              onChange={(e) => setName(e.currentTarget.value)}
              placeholder="Enter a name..."
            />
            <button type="button" onClick={pass}>
              Game
            </button>
          </div>
        </div>
      </div>}
    </div>
  );
}

export default App;
