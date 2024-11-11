import { useEffect, useState } from "react";
import { Provider } from "react-redux"
import { createStore, compose, applyMiddleware } from "redux";
import { createEpicMiddleware } from "redux-observable";
import thunk from "redux-thunk";
import { C2SAction } from "../../clientProtocol";
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

type NetworkGameAppWrapperProps = {
    secret: string
    onReturnToBase: () => void
}

export const NetworkGameAppWrapper = ({
    secret,
    onReturnToBase,
}: NetworkGameAppWrapperProps) => {
    let breakCallback = () => { }

    const [engineConnector, setEngineConnector] = useState<EngineConnector>(emptyEngineConnector);

    useEffect(() => {
        console.log(`Connecting with the secret ${secret}`)
        const [realEngineConnector, callback] = connectToEngine(store, secret)

        setEngineConnector(realEngineConnector)
        breakCallback = callback

        return () => {
            console.log('Disconnecting from the game')
            // @ts-ignore
            realEngineConnector.disconnect()
        }
    }, [secret]);

    return (<Provider store={store}>
        <GameApp engineConnector={engineConnector} onBreak={breakCallback} onReturnToBase={onReturnToBase} playerId={1} />
    </Provider>)
}
