import { fetch as tauriFetch } from '@tauri-apps/plugin-http'
import { io, Socket } from 'socket.io-client';
// import WebSocket from '@tauri-apps/plugin-websocket';
import { isTauri } from "@tauri-apps/api/core";
import { ChallengeType } from '../types';

const CLIENT_CHALLENGE_EVENT_INITIAL = 'response'
const CLIENT_CHALLENGE_EVENT_CREATE = 'new_challenge'
const CLIENT_CHALLENGE_EVENT_DELETE = 'remove_challenge'
const CLIENT_CHALLENGE_EVENT_ACCEPT = 'challenge_accepted'

export class ChallengesService {
    // @deprecated
    public async getChallenges(): Promise<ChallengeType[]> {
        const fetchFunction = isTauri() ? tauriFetch : fetch;

        const result = await fetchFunction('http://13.53.133.189:80/challenge/list', { mode: 'no-cors' })
        const json = await result.json() as ChallengeType[]

        return json;
    }

    public connectToChallenges(setter: (
        challenges: ChallengeType[] | ((oldChallenges: ChallengeType[]) => ChallengeType[])
    ) => void, onAccept: (secret: string) => void): Socket {
        const socket = io('ws://13.53.133.189:80/challenge');

        socket.on('connect', () => {
            console.log(`Connected to the server!`)
        })

        console.log(`Creating the receivers:`)
        socket.on('message', (msg) => {
            console.log('Received Message:', msg.event, JSON.stringify(msg.data));
            switch (msg.event) {
                case CLIENT_CHALLENGE_EVENT_INITIAL: {
                    setter(msg.data)
                    break;
                }
                case CLIENT_CHALLENGE_EVENT_CREATE: {
                    setter(data => [...data, msg.data])
                    break;
                }
                case CLIENT_CHALLENGE_EVENT_DELETE: {
                    setter(data => data.filter(challenge => challenge.id !== msg.data))
                    break;
                }
                case CLIENT_CHALLENGE_EVENT_ACCEPT: {
                    onAccept(msg.data)
                    break;
                }
            }
        })

        socket.on('disconnect', () => {
            console.log(`Disconnected from the server`)
        })

        return socket
    }
}