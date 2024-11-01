import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { useEffect, useState } from "react";
import { Provider } from "react-redux"
import { createStore, compose, applyMiddleware } from "redux";
import { createEpicMiddleware } from "redux-observable";
import thunk from "redux-thunk";
import { C2SAction } from "../../../clientProtocol";
import { defaultState } from "../../../reducers/reducer";
import { DeckType, EngineConnector } from "../../../types";
import rootReducer from '../../../reducers';
import ChallengeApp from "../ChallengeApp/ChallengeApp";

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
  playerDeck: DeckType
}

export const ChallengeAppWrapper = ({
  playerDeck,
}: GameAppWrapperProps) => {
  let breakCallback = () => {}

  const [engineConnector, setEngineConnector] = useState<EngineConnector>(emptyEngineConnector);

  useEffect(() => {
  }, []);

  return (<Provider store={store}>
    <ChallengeApp playerDeck={playerDeck} />
  </Provider>)
}
