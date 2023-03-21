import {cloneElement, ReactElement} from 'react';

type StepIconProps = {
  icon: ReactElement,
  active?: boolean,
  activeColor?: string
  inactiveColor?: string
}

function StepIcon({icon, active = false, activeColor = '#F8E71C', inactiveColor = '#9A9A8F'}: StepIconProps) {
	const fillColor = active ? activeColor : inactiveColor;

	return (
		<div className="stepIcon">
			{cloneElement(icon, {fillColor})}
		</div>
	);
}

export default StepIcon;