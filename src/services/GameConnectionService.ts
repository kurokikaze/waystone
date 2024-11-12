import { Store } from "redux";
import { Observable } from "rxjs";
import { io } from "socket.io-client";
import addAnimations from "../addAnimations";
import { ClientCommand } from "../clientProtocol";
import { EngineConnector } from "../types";

export class GameConnectionService {
    public connectToGame(store: Store, secret: string): [EngineConnector, () => void] {
        console.log(`Secret is ${secret}`)
        const socket = io(`ws://ec2-13-60-188-142.eu-north-1.compute.amazonaws.com/game`);
        let breakCallback = () => {}
        socket.on("connect_error", (err) => {
            // the reason of the error, for example "xhr poll error"
            console.log(err.message);
          
            // some additional description, for example the status code of the initial HTTP response
            // @ts-ignore
            console.log(err?.description);
          
            // some additional context, for example the XMLHttpRequest object
            // @ts-ignore
            console.log(err?.context);
          });
                    
        socket.on('connect', () => {
            console.log(`Connected to the game`)
            socket.emit('secret', JSON.stringify({
                secret,
            }))
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

        const networkEngineConnector: EngineConnector & { disconnect: () => void } = {
            emit: (action: any) => {
                console.log(`Outgoing action`)
                console.dir(action)
                socket.send(action)
            },
            disconnect: () => {
                socket.close()
            }
        };

        return [networkEngineConnector, breakCallback]
    }
}