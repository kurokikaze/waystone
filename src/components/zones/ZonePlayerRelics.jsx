/* global window */
import { useSelector } from 'react-redux';
import cn from 'classnames';
import {
	ACTION_POWER,
	ACTION_RESOLVE_PROMPT,

	TYPE_RELIC,
} from 'moonlands/src/const';
import Card from '../Card.tsx';

import {
	isPRSAvailable,
	isPromptActive,
	getPromptGeneratedBy,
	getPromptType,
	getPlayerNumber,
} from '../../selectors';
import {
	getCardDetails,
	UNFILTERED_RELIC_PROMPTS,
} from '../common';
import { CARD_STYLE_LOCKET } from '../../const.ts';
import { withAbilities } from '../CardAbilities.tsx';
import { withView } from '../CardView.jsx';

const CardWithAbilities = withAbilities(Card);
const CardWithView = withView(Card, true);

function ZonePlayerRelics({
	name,
	zoneId,
	engineConnector,
}) {
	const rawContent = useSelector(getCardDetails);
	const playerNumber = useSelector(getPlayerNumber);
	const content = rawContent.inPlay.filter(card =>
		card.card.type === TYPE_RELIC &&
		((zoneId === 'playerRelics') ? card.data.controller === playerNumber : card.data.controller !== playerNumber)
	);
	const isOnPrompt = useSelector(isPromptActive);
	const promptType = useSelector(getPromptType);
	const isOnUnfilteredPrompt = isOnPrompt && UNFILTERED_RELIC_PROMPTS.includes(promptType);
	const promptGeneratedBy = useSelector(getPromptGeneratedBy);
	const prsAvailable = useSelector(isPRSAvailable);

	const cardClickHandler = isOnPrompt ? cardId => {
		engineConnector.emit({
			type: ACTION_RESOLVE_PROMPT,
			target: cardId,
			generatedBy: promptGeneratedBy,
		});
	} : () => { };

	const abilityUseHandler = (id, powerName) => engineConnector.emit({
		type: ACTION_POWER,
		source: id,
		power: powerName,
	});

	const firstShelf = content.slice(0, 6);
	const secondShelf = content.slice(6);
	return (
		<div className={cn('zone', 'zone-relics', zoneId, { 'only-one-shelf': secondShelf.length == 0 })} data-zone-name={name}>
			{firstShelf.length ? <div className="first-shelf">
				{firstShelf.map(cardData => {
					const SelectedCard = (prsAvailable && cardData.card.data.powers) ? CardWithAbilities : CardWithView;
					return <SelectedCard
						key={cardData.id}
						id={cardData.id}
						card={cardData.card}
						data={cardData.data}
						onClick={cardClickHandler}
						isOnPrompt={isOnUnfilteredPrompt}
						actionsAvailable={prsAvailable}
						onAbilityUse={abilityUseHandler}
						cardStyle={CARD_STYLE_LOCKET}
					/>;
				})}
			</div> : null}
			{secondShelf.length ? <div className="second-shelf">
				{secondShelf.map(cardData => {
					const SelectedCard = (prsAvailable && cardData.card.data.powers) ? CardWithAbilities : CardWithView;
					return <SelectedCard
						key={cardData.id}
						id={cardData.id}
						card={cardData.card}
						data={cardData.data}
						onClick={cardClickHandler}
						isOnPrompt={isOnUnfilteredPrompt}
						actionsAvailable={prsAvailable}
						onAbilityUse={abilityUseHandler}
						cardStyle={CARD_STYLE_LOCKET}
					/>;
				})}
			</div> : null}
		</div>
	);
}

export default ZonePlayerRelics;
