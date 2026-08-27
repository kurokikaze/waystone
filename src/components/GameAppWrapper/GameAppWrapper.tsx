import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { useEffect, useState } from "react";
import { Provider } from "react-redux"
import { createStore, compose, applyMiddleware } from "redux";
import { createEpicMiddleware } from "redux-observable";
import thunk from "redux-thunk";
import { C2SAction, ClientAction } from "../../clientProtocol";
import { defaultState } from "../../reducers/reducer";
import { EngineConnector } from "../../types";
import rootReducer from '../../reducers';
import GameApp from "../GameApp/GameApp"
import { connectToEngine } from "./engineUtils";

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
  let breakCallback = () => {}

  const [engineConnector, setEngineConnector] = useState<EngineConnector>(emptyEngineConnector);

  useEffect(() => {
   const [realEngineConnector, callback] = connectToEngine(store, playerDeck, opponentDeck)

   setEngineConnector(realEngineConnector)
   breakCallback = callback
  }, []);

  return (<Provider store={store}>
    <GameApp engineConnector={engineConnector} onBreak={breakCallback} onReturnToBase={onReturnToBase} playerId={1} />
  </Provider>)
}
