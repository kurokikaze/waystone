import { useEffect, useRef, useState } from "react";
import { Provider } from "react-redux"
import { C2SAction } from "../../clientProtocol";
import { EngineConnector } from "../../types";
import { createGameStore } from '../../store/createGameStore';
import GameApp from "../GameApp/GameApp"
import { connectToEngine } from "./engineUtils";

var emptyEngineConnector: EngineConnector = {
    emit: (_action: C2SAction) => { },
};

type NetworkGameAppWrapperProps = {
    secret: string
    onReturnToBase: () => void
}

const NetworkGameSession = ({
    secret,
    onReturnToBase,
}: NetworkGameAppWrapperProps) => {
    const [store] = useState(createGameStore);
    const breakCallback = useRef(() => {});

    const [engineConnector, setEngineConnector] = useState<EngineConnector>(emptyEngineConnector);

    useEffect(() => {
        const [realEngineConnector, callback, disconnect] = connectToEngine(store, secret)

        setEngineConnector(realEngineConnector)
        breakCallback.current = callback;

        return () => {
            console.log('Disconnecting from the game')
            breakCallback.current = () => {};
            disconnect();
        }
    }, [secret, store]);

    return (<Provider store={store}>
        <GameApp engineConnector={engineConnector} onBreak={() => breakCallback.current()} onReturnToBase={onReturnToBase} playerId={1} />
    </Provider>)
}

export const NetworkGameAppWrapper = (props: NetworkGameAppWrapperProps) => <NetworkGameSession key={props.secret} {...props} />;
