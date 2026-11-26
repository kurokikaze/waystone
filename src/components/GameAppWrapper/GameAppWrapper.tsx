import { useEffect, useRef, useState } from "react";
import { Provider } from "react-redux"
import { C2SAction, ClientAction } from "../../clientProtocol";
import { EngineConnector } from "../../types";
import { createGameStore } from '../../store/createGameStore';
import GameApp from "../GameApp/GameApp"
import { connectToEngine } from "./engineUtils";


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
  const [store] = useState(createGameStore);
  const breakCallback = useRef(() => {});

  const [engineConnector, setEngineConnector] = useState<EngineConnector>(emptyEngineConnector);

  useEffect(() => {
   const [realEngineConnector, callback, disconnect] = connectToEngine(store, playerDeck, opponentDeck)

   setEngineConnector(realEngineConnector)
   breakCallback.current = callback;
   return () => {
    breakCallback.current = () => {};
    disconnect();
   };
  }, []);

  return (<Provider store={store}>
    <GameApp engineConnector={engineConnector} onBreak={() => breakCallback.current()} onReturnToBase={onReturnToBase} playerId={1} />
  </Provider>)
}
