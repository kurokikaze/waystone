import type { State } from '../types';

export const defaultState: State = {
	zones: {
		playerHand: [],
		playerDeck: [],
		playerDiscard: [],
		playerActiveMagi: [],
		playerMagiPile: [],
		playerDefeatedMagi: [],
		inPlay: [],
		opponentHand: [],
		opponentDeck: [],
		opponentDiscard: [],
		opponentActiveMagi: [],
		opponentMagiPile: [],
		opponentDefeatedMagi: [],
	},
	continuousEffects: [],
	staticAbilities: [],
	animation: null,
	message: null,
	step: null,
	log: [],
	turnTimer: false,
	turnSecondsLeft: null,
	gameEnded: false,
	winner: null,
	packs: [],
	energyLosses: [],
	energyLossId: 0,
	energyPrompt: {
		freeEnergy: 0,
		cards: {},
	},
	prompt: false,
	promptPlayer: null,
	promptType: null,
	promptMessage: null,
	promptParams: null,
	promptGeneratedBy: null,
	promptAvailableCards: [],
	activePlayer: 0,
	lastPositions: {},
	energyAnimationsShown: new Set<number>(),
	challenges: {
		challenges: []
	},
	playerNumber: 1
};

export const createInitialState = (): State => structuredClone(defaultState);
