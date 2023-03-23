/* global window */
import {useState} from 'react';
import {useSelector} from 'react-redux';
import {
	ACTION_RESOLVE_PROMPT,
	PROMPT_TYPE_CHOOSE_CARDS,
} from 'moonlands/src/const.ts';
import cn from 'classnames';
import Card from '../Card.tsx';
import {getStartingCards, getPromptGeneratedBy, getActivePlayerMagi, getAvailableCards} from '../../selectors';

function PromptChooseCards({engineConnector}) {
	const cards = useSelector(getStartingCards);
	const generatedBy = useSelector(getPromptGeneratedBy);
	const magi = useSelector(getActivePlayerMagi);
	const availableCards = useSelector(getAvailableCards);

	const [selected, setSelected] = useState([]);

	const triggerElement = cardName =>
		availableCards.includes(cardName) && setSelected(selected => selected.includes(cardName) ? selected.filter(e => e !== cardName): [...selected, cardName]);

	const handleSend = () => {
		engineConnector.emit({
			type: ACTION_RESOLVE_PROMPT,
			promptType: PROMPT_TYPE_CHOOSE_CARDS,
			cards: selected,
			generatedBy,
			player: 1,
		});
	};

	return (
		<div className="promptWindow promptChooseCards">
			<div className='promptMagi'>
				<Card
					id={magi.id}
					card={{name: magi.card}}
					data={{}}
				/>
			</div>
			<h1>Choose starting cards</h1>
			<div className="cardsRow">
				{cards.map(card => (
					<div className={cn('cardSelect', {'chosen': selected.includes(card), 'notAvailable': !availableCards.includes(card)})} key={card}>
						<Card
							id={`test_${card}`}
							card={{ name: card }}
							data={{}}
							onClick={() => triggerElement(card)}
						/>
					</div>
				))}
			</div>
			<div className="buttonHolder">
				<button onClick={handleSend}>OK</button>
			</div>
		</div>
	);
}

export default PromptChooseCards;