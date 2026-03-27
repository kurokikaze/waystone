import {cloneElement} from 'react';
import Power from './icons/Power.tsx';

type PropTypes = {
	active?: boolean
	number?: number | string | null
	icon?: JSX.Element | null
	activeColor?: string
	inactiveColor?: string
}
function CreaturePowerIcon({active = false, icon = null, number = null, activeColor = '#F8E71C', inactiveColor = '#9A9A8F'}: PropTypes) {
	const fillColor = active ? activeColor : inactiveColor;

	return (
		<div className="creaturePowerIcon">
			{icon && cloneElement(icon, {fillColor, size: 20})}
			{!icon && <Power size={20} fillColor={fillColor} />}
			{number && <div className='iconNumber'>{number}</div>}
		</div>
	);
}

export default CreaturePowerIcon;
