/* global window */
import { cards } from 'moonlands/dist/cards';

import {
	TYPE_RELIC,
	PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI,
	PROMPT_TYPE_SINGLE_MAGI,
} from 'moonlands/dist/const';

import {
	STEP_PRS_FIRST,
	STEP_PRS_SECOND,
} from '../const';
import { State } from '../types';
import { ConvertedCard } from 'moonlands/dist/classes/CardInGame';

const relicsHash: Record<string, boolean> = {};

cards.forEach(card => {
	if (card.type === TYPE_RELIC) {
		relicsHash[card.name] = true;
	}
});

export function isOurTurn(state: State) {
	return state.activePlayer === 1;
}

export function isPromptActive(state: State) {
	return state.prompt && state.promptPlayer === 1;
}

export function getMagiEnergy(state: State) {
  const activeMagi = zoneContent('playerActiveMagi', state)
	return activeMagi.length ? activeMagi[0].data?.energy : 0;
}

export function getMagiCard(state: State) {
  if (!zoneContent('playerActiveMagi', state).length) {
    return null
  }
  return zoneContent('playerActiveMagi', state)[0].card;
}

const isRelic = (card: ConvertedCard) => relicsHash[card.card];
const isNotRelic = (card: ConvertedCard) => !relicsHash[card.card];

type ZoneIdentifier = keyof State["zones"] | 'playerRelics' | 'opponentRelics' | 'playerInPlay' | 'opponentInPlay' 
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

export const isPRSAvailable = (state: State) => state.activePlayer == 1 && typeof state.step == 'number' && [STEP_PRS_FIRST, STEP_PRS_SECOND].includes(state.step);

export const getActivePlayerMagi = (state: State) => state.zones.playerActiveMagi[0];
export const getPromptCards = (state: State) => {
  return state.promptParams?.cards;
}
export const getStartingCards = (state: State) => state.promptParams?.startingCards;
export const getAvailableCards = (state: State) => state.promptParams?.availableCards;
export const getPromptGeneratedBy = (state: State) => state.promptGeneratedBy;
export const getPromptNumberOfCards = (state: State) => state.promptParams?.numberOfCards;
export const getPromptMin = (state: State) => state.promptParams?.min || 1;
export const getPromptMax = (state: State) => state.promptParams?.max;
export const getCards = (state: State) => state.promptParams?.cards;
export const getPromptParams = (state: State) => state.promptParams;
export const getPromptZone = (state: State) => state.promptParams?.zone;
export const getPromptZoneOwner = (state: State) => state.promptParams?.zoneOwner;
export const getPromptMessage = (state: State) => state.promptMessage;
export const getPromptType = (state: State) => state.prompt ? state.promptType : null;
export const getMessage = (state: State) => state.message;
export const getTimer = (state: State) => state.turnTimer;
export const getTimerSeconds = (state: State) => state.turnSecondsLeft;
export const getCurrentStep = (state: State) => state.step;
export const getGameEnded = (state: State) => state.gameEnded;

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
