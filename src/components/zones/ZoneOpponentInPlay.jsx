/* global window */
import {useSelector} from 'react-redux';
import cn from 'classnames';
import {
	TYPE_CREATURE,
	ACTION_RESOLVE_PROMPT,
	PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES,
} from 'moonlands/dist/const';
import Card from '../Card.tsx';
import {withAbilities} from '../CardAbilities.tsx';
import {
	ANIMATION_CREATURE_DISCARDED,
	STEP_ATTACK,
} from '../../const';
import {
	getCardDetails,
	UNFILTERED_CREATURE_PROMPTS,
	FILTERED_CREATURE_PROMPTS,
	getPromptFilter,
} from '../common';
import {
	getCurrentStep,
	isOurTurn,
	getPromptGeneratedBy,
	isPromptActive,
	getPromptType,
	getPromptParams,
	getAnimation,
} from '../../selectors';
import {withEnergyManipulation} from '../CardEnergyManipulation.jsx';
import { useCallback } from 'react';

const CardWithAbilities = withAbilities(Card);
const CardWithEnergyManipulation = withEnergyManipulation(Card);

function ZoneOpponentInPlay({
	name,
	engineConnector,
}) {
	const rawContent = useSelector(getCardDetails);
	const content = rawContent.inPlay.filter(card => card.card.type === TYPE_CREATURE && card.data.controller !== 1);
	
	const currentStep = useSelector(getCurrentStep);
	const ourTurn = useSelector(isOurTurn);
	const active = ourTurn && currentStep === STEP_ATTACK;
	const promptGeneratedBy = useSelector(getPromptGeneratedBy);
	const isOnCreaturePrompt = useSelector(isPromptActive);
	const promptType = useSelector(getPromptType);
	const promptParams = useSelector(getPromptParams);
	const promptFilter = useCallback(getPromptFilter(promptType, promptParams), [promptType, promptParams]);
	const isOnUnfilteredPrompt = isOnCreaturePrompt && UNFILTERED_CREATURE_PROMPTS.includes(promptType);
	const isOnFilteredPrompt = isOnCreaturePrompt && FILTERED_CREATURE_PROMPTS.includes(promptType);
	const animation = useSelector(getAnimation);
	const defeatedId = (animation && animation.type === ANIMATION_CREATURE_DISCARDED) ? animation.target : null;

	const SelectedCard = (promptType === PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES)
		? CardWithEnergyManipulation
		: CardWithAbilities;

	const cardClickHandler = isOnCreaturePrompt ? cardId => {
		engineConnector.emit({
			type: ACTION_RESOLVE_PROMPT,
			target: cardId,
			generatedBy: promptGeneratedBy,
		});
	} : () => {};

	return (
		<div className={cn('zone', 'zone-creatures', {'zone-active' : active})} data-zone-name={name} data-items={content.length}>
			{content.length ? content.map(cardData =>
				<div key={cardData.id}>
					<SelectedCard	
						id={cardData.id}
						card={cardData.card}
						data={cardData.data}
						isDefeated={defeatedId === cardData.id}
						modifiedData={cardData.card.data}
						onClick={cardClickHandler}
						isOnPrompt={isOnUnfilteredPrompt || (isOnFilteredPrompt && promptFilter(cardData))}
						droppable={active && cardData.card.type === TYPE_CREATURE}
						target={active && cardData.card.type === TYPE_CREATURE}
						engineConnector={engineConnector}
						className={cn({'attackTarget': animation && animation.target === cardData.id, 'attackSource': animation && animation.source === cardData.id, 'additionalAttacker': animation && animation.additionalAttacker === cardData.id})}
						attacker={animation && animation.source === cardData.id}
						attackNumber={cardData.data.attacked}
					/>
				</div>,
			) : null}
		</div>
	);
}

export default ZoneOpponentInPlay;
