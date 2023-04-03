import {useSelector} from 'react-redux';
import {byName} from 'moonlands/dist/cards';
import {
  REGION_UNIVERSAL,
	TYPE_CREATURE,
	TYPE_RELIC,
	TYPE_SPELL,
} from 'moonlands/src/const.ts';
import {cards} from 'moonlands/src/cards.ts';
import Card from '../Card.tsx';
import {getCurrentStep, isOurTurn, getActivePlayerMagi, getMagiEnergy} from '../../selectors';
import {
	STEP_CREATURES,
	STEP_PRS_FIRST,
	STEP_PRS_SECOND,
} from '../../const';
import {useCardData, useZoneContent} from '../common';

import {withView} from '../CardView.jsx';

const canCastFull = (card, magi, magiEnergy, currentStep, relics) => {
  const magiCard = byName(magi.card)
  const regionTax = (card.card.region === magiCard.region || card.card.region === REGION_UNIVERSAL) ? 0 : 1;
  if (card.card.cost + regionTax > magiEnergy) {
    return false;
  }
  if (card.card.type == TYPE_SPELL) return (currentStep === STEP_PRS_FIRST || currentStep === STEP_PRS_SECOND);
  if (card.card.type == TYPE_RELIC) return (
    (currentStep === STEP_PRS_FIRST || currentStep === STEP_PRS_SECOND) &&
    (card.card.region === magiCard.region || card.card.region === REGION_UNIVERSAL) &&
    !relics.includes(card.card.name)
    );
  if (card.card.type === TYPE_CREATURE) return currentStep == STEP_CREATURES;
}

const relicsHash = cards
	.filter(card => card.type === TYPE_RELIC)
	.map(card => card.name)
	.reduce((acc, cardName) => ({...acc, [cardName]: true}), {});

const CardWithView = withView(Card, true);

const getRelics = state => state.zones.inPlay.filter(cardData => cardData.data.controller === state.playerId && relicsHash[cardData.card]).map(cardData => cardData.card);

function ZoneHand({ name, zoneId, onCardClick }) {
	const rawContent = useZoneContent(zoneId);
	const content = useCardData(rawContent);
	const currentStep = useSelector(getCurrentStep);
	const ourTurn = useSelector(isOurTurn);
	const relics = useSelector(getRelics);
	const magiEnergy = useSelector(getMagiEnergy);
	const magi = useSelector(getActivePlayerMagi);

	return (
		<div className={`zone ${ourTurn ? 'zone-active' : ''}`} data-zone-name={name}>
			{content.length ? content.map(cardData =>
				<CardWithView
					key={cardData.id}
					id={cardData.id}
					card={cardData.card}
					data={cardData.data}
					onClick={onCardClick}
					available={ourTurn && cardData.card && canCastFull(cardData, magi, magiEnergy, currentStep, relics)}
				/>,
			) : null}
		</div>
	);
}

export default ZoneHand;
