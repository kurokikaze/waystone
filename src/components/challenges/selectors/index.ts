import { State } from '../../../types';

export function getChallenges(state: State) {
    return state.challenges.challenges;
}