/* global expect, describe, it */
import {byName} from 'moonlands/src/cards';
import {mapCardDataFromProps, transformCard, getCardDetails} from '../common';
import { state } from '../../spec/abilityState'
import { ExtendedCard, State } from '../../types';
import { ConvertedCard, InGameData } from 'moonlands/src/classes/CardInGame';
// import { StaticAbilityType } from 'moonlands/src/types';

describe('Common code from components', () => {
	it('Fetches card by id from zones', () => {
		const defaultState = {
			zones: {
				playerHand: [
					{
						id: 1,
					},
					{
						id: 2,
					},
				],
				playerDeck: [
					{
						id: 3,
					},
					{
						id: 4,
					},
				],
				playerDiscard: [],
				playerActiveMagi: [
					{
						id: 5,
					},
				],
				playerMagiPile: [
					{
						id: 6,
					},
					{
						id: 7,
						name: 'found',
					},
				],
				playerDefeatedMagi: [],
				inPlay: [
					{
						id: 8,
					},
				],
				opponentHand: [],
				opponentDeck: [],
				opponentDiscard: [],
				opponentActiveMagi: [],
				opponentMagiPile: [],
				opponentDefeatedMagi: [],
				opponentInPlay: [],
			},
			message: null,
			gameEnded: false,
			winner: null,
		};

		const transformedState = mapCardDataFromProps(defaultState as unknown as State, {id: 7} as unknown as ConvertedCard);

		expect(transformedState).toEqual({
			card: {
				id: 7,
				name: 'found',
			},
		});
	});
});

describe('cardDataTransformer', () => {
	it('Static abilities - Double Strike', () => {
		const TEST_PLAYER_ONE = 12;

		const testStaticAbilities = [
			{
				id: 'static1',
				card: byName('Yaki'),
				data: {
					controller: TEST_PLAYER_ONE,
				},
				owner: TEST_PLAYER_ONE,
			},
		];

		const testCard = {
			id: 'card1',
			card: 'Arboll',
			data: {
				controller: TEST_PLAYER_ONE,
			},
		};

		// @ts-ignore
		const resultingCard = transformCard(testStaticAbilities)(testCard);
		// @ts-ignore
		expect(resultingCard.card.data.attacksPerTurn).toEqual(1);
		// @ts-ignore
		expect(resultingCard.modifiedData.attacksPerTurn).toEqual(2);
	});

	it('Static abilities - Invigorate', () => {
		const TEST_PLAYER_ONE = 14;

		const testStaticAbilities = [
			{
				id: 'static1',
				card: byName('Water of Life'),
				data: {
					controller: TEST_PLAYER_ONE,
				},
				owner: TEST_PLAYER_ONE,
			},
		];

		const testCard = {
			id: 'card1',
			card: 'Grega',
			data: {
				controller: TEST_PLAYER_ONE,
			},
		};

		// @ts-ignore
		const resultingCard = transformCard(testStaticAbilities)(testCard);

		// @ts-ignore
		expect(resultingCard.modifiedData.energize).toEqual(6, 'Grega energize rate modified by Water of Life is 6');
		// @ts-ignore
		expect(resultingCard.card.data.energize).toEqual(5, 'Grega original energize rate is still 5');
	});

	it('Static abilities - none', () => {
		const TEST_PLAYER_ONE = 12;

		const testStaticAbilities: ExtendedCard[] = [];

		const testCard: ConvertedCard = {
			id: 'card1',
			card: 'Arboll',
			owner: 1,
			data: {
				controller: TEST_PLAYER_ONE,
			} as InGameData,
		};

		const resultingCard = transformCard(testStaticAbilities)(testCard);
		expect(resultingCard).toHaveProperty('modifiedData')
		if ('modifiedData' in resultingCard) {
			expect(resultingCard.modifiedData.attacksPerTurn).toEqual(1);
		}
	});

	it('Static abilities - none (Stagadan)', () => {
		const TEST_PLAYER_ONE = 12;

		const testStaticAbilities: ExtendedCard[] = [];

		const testCard: ConvertedCard = {
			id: 'card1',
			card: 'Stagadan',
			owner: 1,
			data: {
				controller: TEST_PLAYER_ONE,
			} as InGameData,
		};

		const transformedCard = transformCard(testStaticAbilities)(testCard);
		expect(transformedCard).toHaveProperty('modifiedData')
		if ('modifiedData' in transformedCard) {
			expect(transformedCard.modifiedData.attacksPerTurn).toEqual(1);
		}
	});
});

describe('getCardDetails', () => {
  it('Ability cost for the controlled creature', () => {
	const enrichedState = getCardDetails(state as unknown as State)
    const hyren = enrichedState.inPlay.find(({id}) => id == 'P427nmFyh0KGGYepf0cTh')
	expect(hyren?.data.controller).toEqual(1);
	expect(hyren?.card.data.powers).toHaveLength(1);
	expect(hyren?.card.data.powers![0].cost).toEqual(5);
  })
})