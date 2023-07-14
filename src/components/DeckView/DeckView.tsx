import { byName, cards } from 'moonlands/dist/cards';
import cn from 'classnames';
import { camelCase } from '../../utils';
// @ts-ignore
import CardView from '../CardView/CardView.jsx';
// @ts-ignore
import Remove from '../icons/Remove.jsx';
import Add from '../icons/Add.jsx';
import { Tooltip } from 'antd';

import './style.css';
import Cards from '../icons/Cards';
import { CardType, Region } from 'moonlands/dist/types';
import { REGION_UNIVERSAL, TYPE_CREATURE, TYPE_RELIC, TYPE_SPELL } from 'moonlands';
import Creature from '../icons/Creature';
import Relic from '../icons/Relic';
import Spell from '../icons/Spell';
import { REGION_ARDERIAL } from 'moonlands/dist/const';

type MagiViewProps = {
	name: string
	id: number
	chosenMagi: boolean
	onMagiEditor: (place: number|null) => void
}

const MAX_COPIES_IN_DECK = 10;

type Props = {
	ourCards: string[]
	addToDeck: (card: string) => void
	removeFromDeck: (card: string) => void
	onClearRegions: () => void
	onMagiEditor: (place: number|null) => void
	magiEditor: number | null
}

const types: Record<string, CardType> = {}
cards.forEach(card => types[card.name] = card.type)

function MagiView({name, id, chosenMagi, onMagiEditor}: MagiViewProps) {
	const magi = cards.find(card => card.name === name);
	return (<div className='magiCard'>
		<div
			onClick={() => onMagiEditor((!chosenMagi) ? id : null)}
			className={cn('magiVignette', {'chosenMagi': chosenMagi})}
			style={{backgroundImage: `url("/cards/${camelCase(name)}.jpg")`}}
		>
		</div>
		<CardView name={name} className='deckView' top={false} />
		{magi && <Tooltip title='Starting energy' placement='bottom'><div className='startingEnergy'>{magi.data.startingEnergy}</div></Tooltip>}
		{magi && <Tooltip title='Energize rate' placement='bottom'><div className='energizeRate'>+{magi.data.energize}</div></Tooltip>}
	</div>);
}

type SimpleCardViewProps = {
  card: string,
  className: string,
  startingCard: boolean
  invalidCard: boolean
}

function CardTypeIcon({card, startingCard, invalid}: {card: string, startingCard: boolean, invalid: boolean}) {
  if (card in types) {
    switch (types[card]) {
      case TYPE_CREATURE: {
        const title = startingCard ? 'Creature, starting card' : 'Creature'
        return <Tooltip placement='left' title={title}><div><Creature size={22} fillColor={startingCard ? '#3f7d20' : '#9a9a9a'} /></div></Tooltip>
      }
      case TYPE_RELIC: {
        const title = invalid ? 'Relic, unusable by your Magi' : (startingCard ? 'Relic, starting card' : 'Relic')
        return <Tooltip placement='left' title={title}><div><Relic size={22} fillColor={startingCard ? '#3f7d20' : (invalid ? '#990033' : '#9a9a9a')} /></div></Tooltip>
      }
      case TYPE_SPELL: {
        const title = startingCard ? 'Spell, starting card' : 'Spell'
        return <Tooltip placement='left' title={title}><div><Spell size={22} fillColor={startingCard ? '#3f7d20' : '#9a9a9a'} /></div></Tooltip>
      }
    }
  }
  return null
}

function SimpleCardView({card, className, startingCard, invalidCard}: SimpleCardViewProps) {
  return <div className='simpleCard'>
    <div className='typeIcon'><CardTypeIcon card={card} startingCard={startingCard} invalid={invalidCard} /></div>
    <div className={className}><CardView name={card} top={false} /></div></div>;
}

export default function DeckView({ourCards, addToDeck, onClearRegions, removeFromDeck, onMagiEditor, magiEditor}: Props) {
	const magiOne = ourCards[0];
	const magiTwo = ourCards[1];
	const magiThree = ourCards[2];

  const magi = [magiOne, magiTwo, magiThree]
  const magiRegions = new Set<Region>([...magi.map(card => byName(card)?.region || REGION_ARDERIAL), REGION_UNIVERSAL])

	// @ts-ignore
	const startingCards = new Set([magiOne, magiTwo, magiThree].map(magi => cards.find(card => card.name === magi).data.startingCards).flat());
	const deckCards = ourCards.slice(3);

	const distinctCards: string[] = deckCards.filter((card, i) => deckCards.indexOf(card) === i);

	return (
		<div>
			<div style={{lineHeight: '22px'}}><Cards size={20} color={ourCards.length === 43 ? '#3f7d20' : '#990033' }/> {ourCards.length}</div>
			<div className='magiHolder'>
				<MagiView name={magiOne} id={0} onMagiEditor={onMagiEditor} chosenMagi={magiEditor === 0} />
				<MagiView name={magiTwo} id={1} onMagiEditor={onMagiEditor} chosenMagi={magiEditor === 1} />
				<MagiView name={magiThree} id={2} onMagiEditor={onMagiEditor} chosenMagi={magiEditor === 2} />
			</div>
      <div className='commands'><button onClick={onClearRegions}>Keep only the cards of Magi regions</button></div>
			<div className='deckView'>
				<ul>
					{distinctCards.map(card => {
            const fullCard = byName(card)
            const invalidCard = fullCard && fullCard.type == TYPE_RELIC && fullCard.region !== REGION_UNIVERSAL && !magiRegions.has(fullCard.region)
            return (<li key={card}>
                <SimpleCardView card={card} className={cn('deckView', {'startingCard': startingCards.has(card)})} startingCard={startingCards.has(card)} invalidCard={Boolean(invalidCard)}/>
                <div className='cardActions'>
                  <div className='cardCount'>[{deckCards.filter(c => c === card).length}]</div>
                  <div className='cardRemove' onClick={() => removeFromDeck(card)}><Remove size={20} color={'#990033'} /></div>
                  {deckCards.filter(c => c === card).length < MAX_COPIES_IN_DECK && ourCards.length < 43 && <div className='cardAdd active' onClick={() => addToDeck(card)}><Add size={20} fillColor='#3f7d20' /></div>}
                  {(deckCards.filter(c => c === card).length === MAX_COPIES_IN_DECK || ourCards.length >= 43) && <div className='cardAdd'><Add size={20} fillColor='grey' /></div>}
                </div>
              </li>)
            })
          }
				</ul>
			</div>
		</div>
	);
}
