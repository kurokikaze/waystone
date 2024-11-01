import { fetch as tauriFetch } from '@tauri-apps/plugin-http'
import { isTauri } from "@tauri-apps/api/core";
import { ChallengeType } from '../types';
import StateInterface from '../interfaces/StateInterface';

export class ChallengesService {
    private isTauri() {
        return isTauri()
    }

    public async getChallenges(): Promise<ChallengeType[]> {
        const fetchFunction = this.isTauri() ? tauriFetch : tauriFetch;

        const result = await fetchFunction('http://localhost:3000/challenge/list', {mode: 'no-cors'})
        const json = await result.json() as ChallengeType[]

        return json;
    }
}