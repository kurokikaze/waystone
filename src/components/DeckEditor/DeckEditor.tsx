import { useState, useCallback, useEffect } from 'react';
import { appWindow, LogicalSize } from "@tauri-apps/api/window";

import Row from 'antd/es/row';
import Col from 'antd/es/col';
import Input from 'antd/es/input';
import Spin from 'antd/es/spin';
import Button from 'antd/es/button';
import Space from 'antd/es/space';
import { cards } from 'moonlands/dist/cards';
import cn from 'classnames';
import { TYPE_MAGI } from 'moonlands/dist/const';

import Add from '../icons/Add';
import CardFilter, { CardFilterType, defaultFilter } from '../CardFilter/CardFilter.jsx';
import DeckView from '../DeckView/DeckView';
import { camelCase } from '../../utils';

import './style.css';
import Card from 'moonlands/dist/classes/Card';

export type DeckType = {
  cards: string[]
  name: string
}

type DeckEditorProps = {
  deckContents: DeckType
  onSave: (deck: string[]) => void
  onClose: () => void
}

const DeckEditor = ({deckContents, onSave, onClose}: DeckEditorProps) => {
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [savingNew, setSavingNew] = useState(false);
	const [deck, setDeck] = useState<DeckType>(deckContents);
	const [filter, setFilter] = useState<CardFilterType>(defaultFilter);
	const [search, setSearch] = useState<string>('');

	const [magiEditor, setMagiEditor] = useState<number|null>(null);

  useEffect(() => {
    appWindow.setResizable(false);
    appWindow.setSize(new LogicalSize(1250, 816));
  }, []);

	const handleSave = useCallback(() => {
		setSaving(true);
    onSave(deck.cards);
    setSaving(false);
	}, [deck]);

	const removeFromDeck = useCallback((name: string) => {
		const id = deck.cards.lastIndexOf(name);
		if (id > -1) {
			setDeck({
				...deck,
				cards: deck.cards.filter((card, i) => i !== id),
			});
		}
	}, [deck]);

	const addToDeck = useCallback((card: string)  => {
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

	const setName = (name: string) => setDeck(oldDeck => ({
		...oldDeck,
		name,
	}));

	const filterFunction = useCallback(
		(card: Card) => (search === '' || card.name.toLowerCase().includes(search.toLowerCase())) && filter.regions.includes(card.region) && filter.types.includes(card.type),
		[filter, search]
	);
	
	const magiFilterFunction = useCallback(
		(card: Card) => (search === '' || card.name.toLowerCase().includes(search.toLowerCase())) && filter.regions.includes(card.region) && card.type === TYPE_MAGI,
		[filter, search]
	);

	const canAdd = useCallback((card: string) => {
		return deck.cards.filter((c: string): boolean => c === card).length < 3 && deck.cards.length < 43;
	}, [deck]);

	const canSelectMagi = useCallback((card: string) => {
    // @ts-ignore
		return (deck.cards[0] !== card && deck.cards[1] !== card && deck.cards[2] !== card) || deck.cards[magiEditor] === card;
	}, [deck, magiEditor]);

	const isDeckReadyForSaving = deck && (deck.name !== '' && deck.cards.length === 43);

	return (<div>
		{loading ? <Spin size='large' /> :
			<>
				<Row>
					<Col span={24}><Input className='deckName' /*onChange={(e: React.FormEvent<HTMLInputElement>) => setName(e.currentTarget.value)}*/ disabled defaultValue={deck.name} /></Col>
				</Row>
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
										<div className={cn('cardImage', {'canAdd': canAdd(card.name)})}>
											<img src={`/cards/${camelCase(card.name)}.jpg`} alt={card.name} />
										</div>
										{canAdd(card.name) && <div onClick={() => addToDeck(card.name)} className='addIcon'><Add size={50} fillColor={'green'} /></div>}
									</div>)}
								</div>
							</div>}
							{!(magiEditor === null) && <div className='allCardsContainer'>
								<div className='allCards'>
									{cards.filter(magiFilterFunction).map((card) => <div key={card.name} className='cardSlot'>
										<div className={cn('cardImage', {'canAdd': canSelectMagi(card.name)})}>
											<img src={`/cards/${camelCase(card.name)}.jpg`} alt={card.name} />
										</div>
										{canSelectMagi(card.name) && <div onClick={() => setMagi(card.name)} className='addIcon'><Add size={50} fillColor={'green'} /></div>}
									</div>)}
								</div>
							</div>}
						</div>
					</Col>
					<Col span={8}>
						<div className='deckHolder'>
							<DeckView ourCards={deck.cards} addToDeck={addToDeck} removeFromDeck={removeFromDeck} onMagiEditor={setMagiEditor} magiEditor={magiEditor} />
						</div>
						<div>
							<Space>
								<Button disabled={!isDeckReadyForSaving} loading={saving} type="primary" onClick={handleSave}>Save deck</Button>
								<Button loading={savingNew} onClick={onClose} type="default">Close</Button>
							</Space>
						</div>
					</Col>
				</Row>
			</>
		}
	</div>);
};

export default DeckEditor;
