/* global window */
import { cards } from 'moonlands/src/cards';

import {
	TYPE_RELIC,
	PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI,
	PROMPT_TYPE_SINGLE_MAGI,
	TYPE_CREATURE,
} from 'moonlands/src/const';

import {
	ANIMATION_CREATURE_DISCARDED,
	STEP_PRS_FIRST,
	STEP_PRS_SECOND,
} from '../const';
import { State } from '../types';
import { ConvertedCard } from 'moonlands/src/classes/CardInGame';
import { byName } from 'moonlands/src/cards';

const relicsHash: Record<string, boolean> = {};

cards.forEach(card => {
	if (card.type === TYPE_RELIC) {
		relicsHash[card.name] = true;
	}
});

export function isOurTurn(state: State) {
	return state.activePlayer === state.playerNumber;
}

export function isPromptActive(state: State) {
	return state.prompt && state.promptPlayer === state.playerNumber;
}

export function getMagiEnergy(state: State) {
	const activeMagi = zoneContent('playerActiveMagi', state)
	return activeMagi.length && 'energy' in activeMagi[0].data ? activeMagi[0].data.energy : 0;
}

export function getMaxPaymentSourceEnergy(state: State) {
	const activeMagi = zoneContent('playerActiveMagi', state)
	const paymentCardEnergies = state.zones.inPlay.filter(card => {

		if (card.data.controller !== state.playerNumber) return false;
		const cardData = byName(card.card);

		return cardData && cardData.data.paymentSource?.includes(TYPE_CREATURE);
	}).map(card => card.data.energy);
	const fullArray: number[] = activeMagi.length && 'energy' in activeMagi[0].data ? [activeMagi[0].data?.energy, ...paymentCardEnergies] : paymentCardEnergies;
	return Math.max(...fullArray) || 0;
}

export function getMagiCard(state: State) {
	if (!zoneContent('playerActiveMagi', state).length) {
		return null
	}
	return zoneContent('playerActiveMagi', state)[0].card;
}

const isRelic = (card: ConvertedCard) => relicsHash[card.card];
const isNotRelic = (card: ConvertedCard) => !relicsHash[card.card];

export type ZoneIdentifier = keyof State["zones"] | 'playerRelics' | 'opponentRelics' | 'playerInPlay' | 'opponentInPlay'
export function zoneContent(zoneId: ZoneIdentifier, state: State) {
	switch (zoneId) {
		case 'playerRelics': {
			return state.zones.inPlay.filter(isRelic);
		}
		case 'playerInPlay': {
			return state.zones.inPlay.filter(isNotRelic);
		}
		case 'opponentRelics': {
			return state.zones.inPlay.filter(isRelic);
		}
		case 'opponentInPlay': {
			return state.zones.inPlay.filter(isNotRelic);
		}
		default: {
			return state.zones[zoneId];
		}
	}
}

export const getZoneContent = (zoneId: ZoneIdentifier) => (state: State) => {
	switch (zoneId) {
		case 'playerRelics': {
			return state.zones.inPlay.filter(isRelic);
		}
		case 'playerInPlay': {
			return state.zones.inPlay.filter(isNotRelic);
		}
		case 'opponentRelics': {
			return state.zones.inPlay.filter(isRelic);
		}
		case 'opponentInPlay': {
			return state.zones.inPlay.filter(isNotRelic);
		}
		default: {
			return state.zones[zoneId];
		}
	}
};

export function getAvailableStartingCards(cards: string[] = [], state: State) {
	const discardCards = state.zones.playerDiscard.map(card => card.card);
	const libraryCards = state.zones.playerDeck.map(card => card.card);
	const searchableCards = [...discardCards, ...libraryCards];
	return cards.filter(card => searchableCards.includes(card));
}

export const isPRSAvailable = (state: State) => state.activePlayer == state.playerNumber && typeof state.step == 'number' && [STEP_PRS_FIRST, STEP_PRS_SECOND].includes(state.step);

export const getActivePlayerMagi = (state: State) => state.zones.playerActiveMagi[0];
export const getStartingCards = (state: State) => state.promptParams?.startingCards;
export const getAvailableCards = (state: State) => state.promptParams?.availableCards;
export const getCards = (state: State) => state.promptParams?.cards;

export const getPromptParams = (state: State) => state.promptParams;
export const getPromptZone = (state: State) => state.promptParams?.zone;
export const getPromptZoneOwner = (state: State) => state.promptParams?.zoneOwner;
export const getPromptTargetZones = (state: State) => state.promptParams?.targetZones || [];
export const getPromptMessage = (state: State) => state.promptMessage;
export const getPromptType = (state: State) => state.prompt ? state.promptType : null;
export const getPromptGeneratedBy = (state: State) => state.promptGeneratedBy;
export const getPromptNumberOfCards = (state: State) => state.promptParams?.numberOfCards;
export const getPromptMagi = (state: State) => state.promptParams?.magi;
export const getPromptMin = (state: State) => {
	return typeof state.promptParams?.min == 'number' ? state.promptParams?.min : 1;
};
export const getPromptMax = (state: State) => state.promptParams?.max;
export const getPromptCards = (state: State) => {
	return state.promptParams?.cards;
}

export const getMessage = (state: State) => state.message;
export const getTimer = (state: State) => state.turnTimer;
export const getTimerSeconds = (state: State) => state.turnSecondsLeft;
export const getCurrentStep = (state: State) => state.step;
export const getGameEnded = (state: State) => state.gameEnded;
export const getAlternatives = (state: State) => state.promptParams?.alternatives || [];
export const getMyRelicNames = (state: State) => state.zones.inPlay.filter(cardData => cardData.data.controller === state.playerNumber && relicsHash[cardData.card]).map(cardData => cardData.card);
export const getDefeatedCreatureId = (state: State) => state.animation && state.animation.type === ANIMATION_CREATURE_DISCARDED ? state.animation.target : null
export const getCardsCountInOurDiscard = (state: State) => state.zones.playerDiscard.length;
export const getCardsCountInOpponentDiscard = (state: State) => state.zones.opponentDiscard.length;
export const getCardsCountInOurDeck = (state: State) => state.zones.playerDeck.length;
export const getCardsCountInOpponentDeck = (state: State) => state.zones.opponentDeck.length;
export const getAnimation = (state: State) => state.animation;
export const getIsOnMagiPrompt = (state: State) => state.prompt &&
	(state.promptType === PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI || state.promptType === PROMPT_TYPE_SINGLE_MAGI);
export const getPowerSource = (id: string) => (state: State) => {
	if (!id) return null;

	if (state.zones.opponentActiveMagi.length) {
		const opponentMagi = state.zones.opponentActiveMagi[0];
		if (opponentMagi && opponentMagi.id === id) {
			return opponentMagi;
		}
	}
	const myCards = state.zones.inPlay;
	const myCard = myCards ? myCards.find(card => card.id === id) : null;

	return myCard;
};
export const getWinner = (state: State) => state.winner;
export const getPlayerNumber = (state: State) => state.playerNumber;