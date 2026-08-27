import MessageIcon from './MessageIcon.jsx';
import Spell from '../icons/Spell.tsx';
import { useSelector } from 'react-redux';
import { getPlayerNumber } from '../../selectors/index.ts';

export default function SpellMessage({ card, player }) {
	const playerNumber = useSelector(getPlayerNumber)
	return ((card) ?
		<div className="BaseMessage">
			<MessageIcon icon={<Spell />} />
			<div className='BaseMessage__message'>
				{player == playerNumber ? 'Player' : 'Opponent'} plays spell <span className="SpellMessage__spell">{card.card}</span>
			</div>
		</div>
		: null
	);
}