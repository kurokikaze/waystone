import { useState, useCallback, useEffect } from 'react';
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { LogicalSize } from "@tauri-apps/api/dpi"

import Card from 'moonlands/dist/esm/classes/Card';
import { Tooltip } from 'antd';
import { isTauri } from '@tauri-apps/api/core';

import Row from 'antd/es/row';
import Col from 'antd/es/col';
import Input from 'antd/es/input';
import Button from 'antd/es/button';

import Add from '../icons/Add';

import { byName, cards } from 'moonlands/dist/esm/cards';
import cn from 'classnames';
import { REGION_UNIVERSAL, TYPE_MAGI } from 'moonlands/dist/esm/const';

import CardFilter, { CardFilterType, defaultFilter } from '../CardFilter/CardFilter.jsx';
import { MAX_COPIES_IN_DECK } from '../../const';
import { DeckType } from '../../types';
import { isPlayableDeck } from '../../services/DeckKeeperService';
import DeckView from '../DeckView/DeckView';
import { camelCase } from '../../utils';

import './style.css';

type DeckEditorProps = {
	deckContents: DeckType
	onSave: (deck: DeckType) => Promise<void>
	onClose: () => void
	saving: boolean
	error: string
}

const DeckEditor = ({ deckContents, onSave, onClose, saving, error }: DeckEditorProps) => {
	const [deck, setDeck] = useState<DeckType>(deckContents);
	const [filter, setFilter] = useState<CardFilterType>(defaultFilter);
	const [search, setSearch] = useState<string>('');

	const [magiEditor, setMagiEditor] = useState<number | null>(null);

	useEffect(() => {
		if (isTauri()) {
			const appWindow = getCurrentWebviewWindow()
			appWindow.setResizable(false);
			appWindow.setSize(new LogicalSize(1080, 816));
		}
	}, []);

	const removeFromDeck = useCallback((name: string) => {
		const id = deck.cards.lastIndexOf(name);
		if (id > -1) {
			setDeck({
				...deck,
				cards: deck.cards.filter((card, i) => i !== id),
			});
		}
	}, [deck]);

	const addToDeck = useCallback((card: string) => {
		setDeck({
			...deck,
			cards: [...deck.cards, card],
		});
	}, [deck]);

	const setMagi = useCallback((card: string) => {
		const cards = [...deck.cards];
		if (typeof magiEditor == 'number') {
			cards[magiEditor] = card;
			setDeck({
				...deck,
				cards,
			});
		}
		setMagiEditor(null);
	}, [deck, magiEditor]);

	const onClearRegions = useCallback(() => {
		const fullCards = deck.cards.map(card => byName(card));
		const magiRegions = new Set(fullCards.slice(0, 3).map(card => card?.region));
		const newCards = [
			...deck.cards.slice(0, 3),
			...fullCards.slice(3).flatMap(card =>
				card && (card.region === REGION_UNIVERSAL || magiRegions.has(card.region)) ? [card.name] : []),
		];
		setDeck({
			...deck,
			cards: newCards,
		})
	}, [
		deck,
	])

	const filterFunction = useCallback(
		(card: Card) => card.type !== TYPE_MAGI && (search === '' || card.name.toLowerCase().includes(search.toLowerCase())) && filter.regions.includes(card.region) && filter.types.includes(card.type),
		[filter, search]
	);

	const magiFilterFunction = useCallback(
		(card: Card) => (search === '' || card.name.toLowerCase().includes(search.toLowerCase())) && filter.regions.includes(card.region) && card.type === TYPE_MAGI,
		[filter, search]
	);

	const canAdd = useCallback((card: string) => {
		return deck.cards.filter((c: string): boolean => c === card).length < MAX_COPIES_IN_DECK && deck.cards.length < 43;
	}, [deck]);

	const canSelectMagi = useCallback((card: string) => {
		return deck.cards.slice(0, 3).every((name, index) => name !== card || index === magiEditor);
	}, [deck, magiEditor]);

	const isDeckReadyForSaving = !!deck.name.trim() && isPlayableDeck(deck.cards);

	return (<div>
				<Row>
					<Col span={24}><Input className='deckName' aria-label="Deck name" placeholder="Deck name" value={deck.name}
						disabled={saving} onChange={event => setDeck({ ...deck, name: event.target.value })} /></Col>
				</Row>
				{error && <p role="alert">{error}</p>}
				<Row>
					<Col span={16}>
						<div>
							<section>
								<CardFilter onFilterChange={setFilter} magiMode={!(magiEditor === null)} />
								<div className='cardSearch'><Input placeholder='Card Search' onChange={e => setSearch(e.target.value)} /></div>
							</section>
							{magiEditor === null && <div className='allCardsContainer'>
								<div className='allCards'>
									{cards.filter(filterFunction).map((card) => <div key={card.name} className='cardSlot'>
										<div className={cn('cardImage', { 'canAdd': canAdd(card.name) })}>
											<img src={`/cards/${camelCase(card.name)}.jpg`} alt={card.name} />
										</div>
										{canAdd(card.name) && <div onClick={() => addToDeck(card.name)} className='addIcon'><Add size={50} fillColor={'#3f7d20'} /></div>}
									</div>)}
								</div>
							</div>}
							{!(magiEditor === null) && <div className='allCardsContainer'>
								<div className='allCards'>
									{cards.filter(magiFilterFunction).map((card) => <div key={card.name} className='cardSlot'>
										<div className={cn('cardImage', { 'canAdd': canSelectMagi(card.name) })}>
											<img src={`/cards/${camelCase(card.name)}.jpg`} alt={card.name} />
										</div>
										{canSelectMagi(card.name) && <div onClick={() => setMagi(card.name)} className='addIcon'><Add size={50} fillColor={'#3f7d20'} /></div>}
									</div>)}
								</div>
							</div>}
						</div>
					</Col>
					<Col span={8} className='deckHolderCol'>
						<div className='deckHolder'>
							<DeckView ourCards={deck.cards} addToDeck={addToDeck} onClearRegions={onClearRegions} removeFromDeck={removeFromDeck} onMagiEditor={setMagiEditor} magiEditor={magiEditor} />
						</div>
						<div className='commands'>
							<Tooltip title={isDeckReadyForSaving ? null : 'Name the deck and choose 3 Magi and 40 other cards'}><Button disabled={!isDeckReadyForSaving} loading={saving} type="primary" onClick={() => void onSave({ ...deck, name: deck.name.trim() })}>Save deck</Button></Tooltip>
							<Button disabled={saving} onClick={onClose} type="default">Close</Button>
						</div>
					</Col>
				</Row>
	</div>);
};

export default DeckEditor;
