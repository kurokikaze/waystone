/* global window */
import {useSelector} from 'react-redux';
import cn from 'classnames';
import {
	ACTION_RESOLVE_PROMPT,
	TYPE_CREATURE,
	PROMPT_TYPE_MAGI_WITHOUT_CREATURES,
} from 'moonlands/src/const';
import Card from '../Card.tsx';
import {withAbilities} from '../CardAbilities.tsx';
import {
  ANIMATION_MAGI_DEFEATED,
	STEP_ATTACK,
} from '../../const';
import {useCardData, useZoneContent, getCardDetails} from '../common';
import {isOurTurn, getCurrentStep, getPromptGeneratedBy, getIsOnMagiPrompt, getAnimation, getPlayerNumber} from '../../selectors';

const CardWithAbilities = withAbilities(Card);

const isOnFilteredMagiPrompt = (state) => {
	const isOnMWCPrompt = state.prompt && state.promptType === PROMPT_TYPE_MAGI_WITHOUT_CREATURES;
	return isOnMWCPrompt && !getCardDetails(state).inPlay.some(card => card.data.controller !== state.playerNumber && card.card.type === TYPE_CREATURE);
};

function ZoneOpponentActiveMagi({ name, zoneId, engineConnector }) {
	const rawContent = useZoneContent(zoneId);
	const content = useCardData(rawContent);
	const currentStep = useSelector(getCurrentStep);
	const ourTurn = useSelector(isOurTurn);
	const active = ourTurn && currentStep === STEP_ATTACK;
	const animation = useSelector(getAnimation);
	const inPlayContent = useSelector(getCardDetails);
	const playerNumber = useSelector(getPlayerNumber);
	const guarded = inPlayContent.inPlay.some(card => card.data.controller !== playerNumber && card.card.type === TYPE_CREATURE);
	const promptGeneratedBy = useSelector(getPromptGeneratedBy);
	const isOnMagiPrompt = useSelector(getIsOnMagiPrompt);
	const onMWCPrompt = useSelector(isOnFilteredMagiPrompt);
	const cardClickHandler = (isOnMagiPrompt || onMWCPrompt) ? cardId => {
		engineConnector.emit({
			type: ACTION_RESOLVE_PROMPT,
			target: cardId,
			generatedBy: promptGeneratedBy,
		});
	} : () => {};

  const animationData = useSelector(state => state.animation);
  const defeatedId = animationData && animationData.type === ANIMATION_MAGI_DEFEATED ? animationData.target : null; 

  return (
		<div className={cn('zone', 'zone-magi', {'zone-active': active})} data-zone-name={name}>
			{content.length ? content.map(cardData =>
				<CardWithAbilities
					key={cardData.id}
					id={cardData.id}
					card={cardData.card}
					modifiedData={cardData.modifiedData}
					isDefeated={defeatedId === cardData.id}
					data={cardData.data}
					onClick={cardClickHandler}
					isOnPrompt={isOnMagiPrompt || onMWCPrompt}
					droppable={active}
					target={active}
					guarded={guarded}
					engineConnector={engineConnector}
					className={cn({'attackTarget': animation && animation.type == 'attack' && animation.target === cardData.id})}
				/>,
			) : null}
		</div>
	);
}

export default ZoneOpponentActiveMagi;
