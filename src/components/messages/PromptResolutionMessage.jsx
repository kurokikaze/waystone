import MessageIcon from './MessageIcon.jsx';
import Power from '../icons/Power.tsx';
import Spell from '../icons/Spell.tsx';

export default function PromptResolutionMessage ({type = 'power', chosenTarget = null, chosenNumber = null}) {
	return (chosenTarget || chosenNumber) ? <div className="BaseMessage">
		<MessageIcon icon={type == 'power' ? <Power /> : <Spell />} />
		<div className='BaseMessage__messages'>
			{chosenTarget && <div className='BaseMessage__target'>Chosen target is {chosenTarget.card}</div>}
			{chosenNumber !== null && <div className='BaseMessage__number'>Chosen number is {chosenNumber}</div>}
		</div>
	</div> : null;
}
