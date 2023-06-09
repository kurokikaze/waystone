import MessageIcon from './MessageIcon.jsx';
import Power from '../icons/Power.tsx';

export default function PowerMessage ({card, power, onBreak}) {
	return ((card) ?
		<div className="BaseMessage">
			<MessageIcon icon={<Power />} />
      <div className='BaseMessage__message'>
        <span className="PowerMessage__source">{card.card}</span> uses power <span className="PowerMessage__power">{power}</span>
      </div>
      <div onClick={onBreak} className="BaseMessage__close">&#10006;</div>
		</div>
		: null
	);
}