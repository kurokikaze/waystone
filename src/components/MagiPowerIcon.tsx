import {cloneElement, ReactElement} from 'react';
import Power from './icons/Power.tsx';

type PropTypes = {
	active?: boolean
	number?: number | string | null
	icon?: JSX.Element | null
}
function MagiPowerIcon({active = false, number = null, icon = null}: PropTypes) {
	const fillColor = active ? '#F8E71C' : '#9A9A8F';

	return (
		<div className="magiPowerIcon">
			{icon && cloneElement(icon, {fillColor, size: 40})}
			{!icon && <Power size={40} fillColor={fillColor} />}
			{number && <div className='iconNumber'>{number}</div>}
		</div>
	);
}

export default MagiPowerIcon;