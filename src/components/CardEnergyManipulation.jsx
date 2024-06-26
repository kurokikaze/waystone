/* globals */
import { useSelector, useDispatch } from 'react-redux';
import { RESTRICTION_EXCEPT_SOURCE } from 'moonlands/src/const';
import cn from 'classnames';
import { plusEnergyOnCreature, minusEnergyOnCreature } from '../actions';
import { getPromptGeneratedBy } from '../selectors';

export const SimpleButton = ({name, disabled, style, onClick}) =>
	(
		<div className={cn('simpleButton', { 'disabled': disabled })} style={style} onClick={onClick}>{name}</div>
	);

// eslint-disable-next-line react/display-name
export const withEnergyManipulation = Component => ({ id, data, card, ...props }) => {
	const dispatch = useDispatch();
	const freeEnergy = useSelector(state => state.energyPrompt.freeEnergy);
	const currentEnergy = useSelector(state => state.energyPrompt.cards[id]) || 0;
	const restriction = useSelector(state => state.promptParams?.restriction);
	const generatedBy = useSelector(getPromptGeneratedBy);

	const handlePlusEnergy = () => {
		if (freeEnergy > 0) {
			dispatch(plusEnergyOnCreature(id));
		}
	};

	const handleMinusEnergy = () => {
		if (currentEnergy > 0) {
			dispatch(minusEnergyOnCreature(id));
		}
	};
	
	const thisIsNotTheSource = restriction !== RESTRICTION_EXCEPT_SOURCE || id !== generatedBy;
	const ableToParticipate = !data.energyStasis;
	return <div>
		<Component
			id={id}
			data={data}
      card={card}
			{...props}
		/>
		{(thisIsNotTheSource && ableToParticipate) && <div className="energyManipulation">
			<SimpleButton name="-" style={{ color: currentEnergy === 0 ? '#ccc': '#000', cursor: 'pointer' }} onClick={handleMinusEnergy} disabled={currentEnergy === 0} />
			<div className="currentEnergy">{currentEnergy}</div>
			<SimpleButton name="+" style={{ color: currentEnergy === 0 ? '#ccc': '#000', cursor: 'pointer' }} onClick={handlePlusEnergy} disabled={freeEnergy === 0} />
		</div>}
	</div>;
};
