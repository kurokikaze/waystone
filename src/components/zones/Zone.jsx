import {useSelector} from 'react-redux';
import Card from '../Card.tsx';
import {useCardData, useZoneContent} from '../common';
import {getCurrentStep, getPlayerNumber, isOurTurn} from '../../selectors';

function Zone({ zoneId, activeStep, name, onCardClick }) {
	const rawContent = useZoneContent(zoneId);
	const content = useCardData(rawContent);
	const currentStep = useSelector(getCurrentStep);
	const ourTurn = useSelector(isOurTurn);
	const playerNumber = useSelector(getPlayerNumber);
	const active = currentStep === activeStep && ourTurn;

	return (
		<div className={`zone ${active ? 'zone-active' : ''}`} data-zone-name={name}>
			{content.length ? content.map(cardData =>
				<Card
					key={cardData.id}
					id={cardData.id}
					card={cardData.card}
					data={cardData.data}
					onClick={onCardClick}
					inActiveZone={active}
					onAbilityUse={() => null}
					playerNumber={playerNumber}
				/>,
			) : null}
		</div>
	);
}

export default Zone;
