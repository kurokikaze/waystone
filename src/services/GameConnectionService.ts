import { Store } from "redux";
import { Observable } from "rxjs";
import { io } from "socket.io-client";
import addAnimations from "../addAnimations";
import { ClientCommand } from "../clientProtocol";
import { EngineConnector } from "../types";

export class GameConnectionService {
    public connectToGame(store: Store, secret: string): [EngineConnector, () => void] {
        const socket = io(`ws://localhost:3000/game/${secret}`);
        let breakCallback = () => {}
    
        socket.on('connect', () => {
            console.log(`Connected to the game`)
        })

        const actionsObservable = new Observable<ClientCommand>(subscriber => {
            socket.on('message', (msg) => {
                subscriber.next(msg)
            })
        })

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

        socket.on('disconnect', () => {
            console.log(`Disconnected from the game server`)
        })

        const networkEngineConnector: EngineConnector = {
            emit: (action: any) => {
                console.log(`Outgoing action`)
                console.dir(action)
                socket.send(action)
            },
        };

        return [networkEngineConnector, breakCallback]
    }
}