import MessageIcon from './MessageIcon.jsx';
import Creature from '../icons/Creature.tsx';
import { useSelector } from 'react-redux';
import { getPlayerNumber } from '../../selectors/index.ts';

export default function CreatureMessage ({card, player}) {
	const playerNumber = useSelector(getPlayerNumber);
	return (card ?
		<div className="BaseMessage">
			<MessageIcon icon={<Creature />} />
			<div className='BaseMessage__message'>
				{player == playerNumber ? 'Player' : 'Opponent'} plays creature <span className="CreatureMessage__creature">{card.card}</span>
			</div>
		</div>
		: null
	);
}