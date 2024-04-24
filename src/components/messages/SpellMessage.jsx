import MessageIcon from './MessageIcon.jsx';
import Spell from '../icons/Spell.tsx';

export default function SpellMessage({ card, player }) {
	return ((card) ?
		<div className="BaseMessage">
			<MessageIcon icon={<Spell />} />
			<div className='BaseMessage__message'>
				{player == 1 ? 'Player' : 'Opponent'} plays spell <span className="SpellMessage__spell">{card.card}</span>
			</div>
		</div>
		: null
	);
}