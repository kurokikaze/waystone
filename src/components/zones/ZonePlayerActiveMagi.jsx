/* global window */
import {useCallback} from 'react';
import {useSelector} from 'react-redux';
import cn from 'classnames';
import {
	ACTION_RESOLVE_PROMPT,
	ACTION_POWER,
	PROMPT_TYPE_MAGI_WITHOUT_CREATURES,
	TYPE_CREATURE,
} from 'moonlands/dist/const';
import {byName} from 'moonlands/dist/cards';
import Card from '../Card.tsx';
import {isPRSAvailable, getIsOnMagiPrompt, getAnimation, getPromptGeneratedBy} from '../../selectors';
import {withAbilities} from '../CardAbilities.jsx';
import {useZoneContent, useCardData} from '../common';
import {ANIMATION_MAGI_DEFEATED} from '../../const';

const CardWithAbilities = withAbilities(Card);

const playerHasCreatures = state => state.zones.inPlay.some(card => byName(card.card).type === TYPE_CREATURE && card.data.controller === 1);

const isOnFilteredMagiPrompt = (state) => {
	const isOnMWCPrompt = state.prompt && state.promptType === PROMPT_TYPE_MAGI_WITHOUT_CREATURES;
	return isOnMWCPrompt && !playerHasCreatures(state);
};

function ZonePlayerActiveMagi({ name, zoneId, engineConnector }) {
	const rawContent = useZoneContent(zoneId);
	const content = useCardData(rawContent);
	const active = useSelector(isPRSAvailable);
	const isOnMagiPrompt = useSelector(getIsOnMagiPrompt);
	const isOnMWCPrompt = useSelector(isOnFilteredMagiPrompt);
	const promptGeneratedBy = useSelector(getPromptGeneratedBy);
	const animation = useSelector(getAnimation);
  const defeatedId = animation && animation.type === ANIMATION_MAGI_DEFEATED ? animation.target : null;
	const cardClickHandler = (isOnMagiPrompt || isOnMWCPrompt) ? cardId => {
		engineConnector.emit({
			type: ACTION_RESOLVE_PROMPT,
			target: cardId,
			generatedBy: promptGeneratedBy,
		});
	} : () => {};

	const abilityUseHandler = useCallback((id, powerName) => engineConnector.emit({
		type: ACTION_POWER,
		source: id,
		power: powerName,
	}), [engineConnector]);

	return (
		<div className={cn('zone', 'zone-magi', {'zone-active': active})} data-zone-name={name}>
			{content.length ? content.map(cardData =>
				<CardWithAbilities
					key={cardData.id}
					id={cardData.id}
					card={cardData.card}
					modifiedData={cardData.modifiedData}
					data={cardData.data}
          isDefeated={cardData.id === defeatedId}
					onClick={cardClickHandler}
					isOnPrompt={isOnMagiPrompt || isOnMWCPrompt}
					target={active && cardData.card.data.powers && cardData.card.data.powers.length > cardData.data.actionsUsed.length}
					onAbilityUse={abilityUseHandler}
					actionsAvailable={active}
					className={cn({'attackTarget': animation && animation.type == 'attack' && animation.target === cardData.id})}
				/>,
			) : null}
		</div>
	);
}

export default ZonePlayerActiveMagi;
