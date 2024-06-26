import {
	LOG_ENTRY_PLAY,
	LOG_ENTRY_DRAW,
	LOG_ENTRY_CHOOSES_STARTING_CARDS,
	LOG_ENTRY_POWER_ACTIVATION,
	LOG_ENTRY_CREATURE_DISCARDED_FROM_PLAY,
	LOG_ENTRY_RELIC_DISCARDED_FROM_PLAY,
	LOG_ENTRY_TARGETING,
	LOG_ENTRY_NUMBER_CHOICE,
	LOG_ENTRY_ATTACK,
	LOG_ENTRY_CREATURE_ENERGY_LOSS,
	LOG_ENTRY_MAGI_ENERGY_LOSS,
	LOG_ENTRY_CREATURE_ENERGY_GAIN,
	LOG_ENTRY_MAGI_ENERGY_GAIN,
	LOG_ENTRY_MAGI_DEFEATED,
	LOG_ENTRY_CARD_DISCARDED_FROM_HAND,
	LOG_ENTRY_DIE_ROLLED
} from 'moonlands/src/const';
import { LogEntryType } from 'moonlands/src/types';

export const mapEntryToText = (entry: LogEntryType): string => {
	switch (entry.type) {
		case LOG_ENTRY_PLAY:
			return `Player ${entry.player} plays ${entry.card}`;
		case LOG_ENTRY_DRAW:
			return `Player ${entry.player} draws a card`;
		case LOG_ENTRY_CHOOSES_STARTING_CARDS:
			return `Player ${entry.player} chooses starting cards`;
		case LOG_ENTRY_POWER_ACTIVATION:
			return `Power "${entry.name}" of ${entry.card} is activated by player ${entry.player}`;
		case LOG_ENTRY_CREATURE_DISCARDED_FROM_PLAY:
			return `${entry.card} is discarded from play`;
		case LOG_ENTRY_RELIC_DISCARDED_FROM_PLAY:
			return `Relic ${entry.card} is discarded from play`;
		case LOG_ENTRY_TARGETING:
			return `${entry.card} is chosen as a target`;
		case LOG_ENTRY_CREATURE_ENERGY_LOSS:
			return `${entry.card} loses ${entry.amount} energy`;
		case LOG_ENTRY_MAGI_ENERGY_LOSS:
			return `Magi ${entry.card} loses ${entry.amount} energy`;
		case LOG_ENTRY_CREATURE_ENERGY_GAIN:
			return `${entry.card} gains ${entry.amount} energy`;
		case LOG_ENTRY_MAGI_ENERGY_GAIN:
			return `Magi ${entry.card} gains ${entry.amount} energy`;
		case LOG_ENTRY_ATTACK:
			return `${entry.source} attacks ${entry.target}${entry.packHuntAttack ? ' (pack hunt attack)' : ''}`;
		case LOG_ENTRY_MAGI_DEFEATED:
			return `Magi ${entry.card} is defeated`;
		case LOG_ENTRY_NUMBER_CHOICE:
			return `Player ${entry.player} chooses number ${entry.number}`;
		case LOG_ENTRY_DIE_ROLLED:
			return `Player ${entry.player} rolled ${entry.result}`;
		case LOG_ENTRY_CARD_DISCARDED_FROM_HAND:
			return `Player ${entry.player} discards ${entry.card} from hand`
	}
};
