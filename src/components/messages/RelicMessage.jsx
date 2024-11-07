import MessageIcon from './MessageIcon.jsx';
import Relic from '../icons/Relic.tsx';
import { useSelector } from 'react-redux';
import { getPlayerNumber } from '../../selectors/index.ts';

export default function RelicMessage({ card, player }) {
	const playerNumber = useSelector(getPlayerNumber)
	return (card &&
		<div className="BaseMessage">
			<MessageIcon icon={<Relic />} />
			<div className='BaseMessage__message'>
				{player == playerNumber ? 'Player' : 'Opponent'} plays relic <span className="RelicMessage__relic">{card}</span>
			</div>
		</div>
	);
}