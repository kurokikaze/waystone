import { Store } from 'redux';
import { Subject, Subscription } from 'rxjs';
import { io } from 'socket.io-client';
import addAnimations from '../addAnimations';
import { ClientCommand } from '../clientProtocol';
import { EngineConnector, State } from '../types';
import { getEverflameUrl } from '../config/everflame';

type InitialStateMessage = { type: 'setInitialState'; state: Partial<State> };

export class GameConnectionService {
    public connectToGame(store: Store, secret: string): [EngineConnector, () => void, () => void] {
        const socket = io(getEverflameUrl('game'), { autoConnect: false });
        const actions = new Subject<ClientCommand>();
        const breaks = new Subject<{}>();
        let subscription: Subscription | undefined;
        let ready = false;
        let disposed = false;

        const stopAnimations = () => {
            subscription?.unsubscribe();
            subscription = undefined;
        };
        const onConnect = () => {
            ready = false;
            stopAnimations();
            socket.emit('secret', JSON.stringify({ secret }));
        };
        const onDisconnect = () => {
            ready = false;
            stopAnimations();
        };
        const onMessage = (message: ClientCommand | InitialStateMessage) => {
            if (disposed) return;
            if (message.type === 'setInitialState' && 'state' in message) {
                // A snapshot supersedes all queued events from the old connection.
                stopAnimations();
                store.dispatch(message);
                subscription = addAnimations(actions, breaks, store, true).subscribe(action => store.dispatch(action));
                ready = true;
            } else if (ready) {
                actions.next(message as ClientCommand);
            }
        };
        const onConnectionError = (error: Error) => console.error('Game connection failed:', error.message);
        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('connect_error', onConnectionError);
        socket.on('message', onMessage);
        socket.connect();

        const disconnect = () => {
            if (disposed) return;
            disposed = true;
            ready = false;
            stopAnimations();
            actions.complete();
            breaks.complete();
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('connect_error', onConnectionError);
            socket.off('message', onMessage);
            socket.close();
        };
        const connector: EngineConnector = {
            emit: action => {
                // Socket.IO buffers offline sends; those actions would be stale
                // when authentication and a fresh snapshot arrive after reconnect.
                if (ready && socket.connected && !disposed) socket.send(action);
            },
        };
        return [connector, () => breaks.next({}), disconnect];
    }
}
