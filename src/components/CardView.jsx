import {camelCase} from '../utils';

// eslint-disable-next-line react/display-name
export const withView = Component => (props) => {
	return (
		<div className='cardViewHolder fadeInDown'>
			{props.card && <div className='cardView'>
				<img src={`/cards/${camelCase(props.card.name)}.jpg`} alt={props.card.name} />
			</div>}
			<Component 
				{...props} 
			/>
		</div>
	);
};
