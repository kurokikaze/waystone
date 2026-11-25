import {
	TYPE_CREATURE,
	TYPE_MAGI,
} from 'moonlands/dist/esm/const';
import { DraggedItem, SecondCard } from '../types';

export function canFirstAttackSecond(first: DraggedItem, second: SecondCard) {
	return first.card.type === TYPE_CREATURE && first.data.controller !== second.data.controller && (
		second.card.type === TYPE_CREATURE ||
		(second.card.type === TYPE_MAGI && (!second.guarded || !!first.card.data.canAttackMagiDirectly))
	);
}

export function canPackHuntWith(first: DraggedItem, second: SecondCard) {
	return !!first.card.data.canPackHunt &&
		first.data.controller === second.data.controller &&
		second.card.type === TYPE_CREATURE &&
        first.id !== second.id && // sadly being both drop source and target can sometimes cause this
        first.data.attacked < 1 && // actually should be < modifiedData.numberOfAttacks
        second.data.attacked < 1; // actually should be < modifiedData.numberOfAttacks 
}
