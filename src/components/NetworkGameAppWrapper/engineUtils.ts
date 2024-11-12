import { Store } from "redux";
import { GameConnectionService } from "../../services/GameConnectionService";
import { EngineConnector } from "../../types";

export function connectToEngine(store: Store, secret: string): [EngineConnector, () => void] {
    const service = new GameConnectionService()
    return service.connectToGame(store, secret)
}