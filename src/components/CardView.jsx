import {camelCase} from '../utils';
import cn from 'classnames';

// eslint-disable-next-line react/display-name
export const withView = (Component, onTop = false) => (props) => {
	return (
		<div className={cn('cardViewHolder fadeInDown', {'showOnTop': onTop})}>
			{props.card && <div className='cardView'>
				<img src={`/cards/${camelCase(props.card.name)}.jpg`} alt={props.card.name} />
			</div>}
			<Component 
				{...props} 
			/>
		</div>
	);
};
