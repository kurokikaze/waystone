import { fetch as tauriFetch } from '@tauri-apps/plugin-http'
import { io } from 'socket.io-client';
// import WebSocket from '@tauri-apps/plugin-websocket';
import { isTauri } from "@tauri-apps/api/core";
import { ChallengeType } from '../types';

export class ChallengesService {
    private isTauri() {
        return isTauri()
    }

    public async getChallenges(): Promise<ChallengeType[]> {
        const fetchFunction = this.isTauri() ? tauriFetch : tauriFetch;

        const result = await fetchFunction('http://localhost:3000/challenge/list', { mode: 'no-cors' })
        const json = await result.json() as ChallengeType[]

        return json;
    }

    public async connectToChallenges(setter: (challenges: ChallengeType[]) => void): Promise<void> {
        const socket = io('ws://localhost:3000');

        socket.on('connect', () => {
            console.log(`Connected to the server!`)
        })

        socket.on('message', (msg) => {
            console.log('Received Message:', msg);
            if (msg.event == 'response') {
                setter(msg.data)
            }
        });


        socket.on('disconnect', () => {
            console.log(`Disconnected from the server`)
        })

    }
}