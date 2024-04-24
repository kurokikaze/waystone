import MessageIcon from './MessageIcon.jsx';
import Relic from '../icons/Relic.tsx';

export default function RelicMessage({ card, player }) {
	return (card &&
		<div className="BaseMessage">
			<MessageIcon icon={<Relic />} />
			<div className='BaseMessage__message'>
				{player == 1 ? 'Player' : 'Opponent'} plays relic <span className="RelicMessage__relic">{card}</span>
			</div>
		</div>
	);
}