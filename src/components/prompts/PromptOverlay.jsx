import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import {
	PROMPT_TYPE_CHOOSE_CARDS,
	PROMPT_TYPE_NUMBER,
	PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
	PROMPT_TYPE_MAY_ABILITY,
	PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES,
	PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES,
	PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES,
	PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE,
	PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE,
	PROMPT_TYPE_DISTRUBUTE_CARDS_IN_ZONES,
	PROMPT_TYPE_PLAYER,
	PROMPT_TYPE_ALTERNATIVE,
	PROMPT_TYPE_POWER_ON_MAGI,
} from 'moonlands/src/const';

import PromptChooseCards from './PromptChooseCards.jsx';
import PromptChooseCardsInZone from './PromptChooseCardsInZone.jsx';
import PromptChooseUpToNCardsInZone from './PromptChooseUpToNCardsInZone.jsx';
import PromptChooseNumber from './PromptChooseNumber.jsx';
import PromptMayEffect from './PromptMayEffect.jsx';
import PromptEnergyManipulation from './PromptEnergyManipulation.jsx';
import PromptEnergyDistribution from './PromptEnergyDistribution.jsx';
import PromptDamageDistribution from './PromptDamageDistribution.jsx';
import PromptRearrangeCards from './PromptRearrangeCards.jsx';
import PromptDistributeCards from './PromptDistributeCards.tsx';
import PromptChoosePlayer from './PromptChoosePlayer';
import PromptAlternatives from './PromptAlternatives.tsx';
import PromptChoosePowerOnMagi from './PromptChoosePowerOnMagi.tsx';
import { getPromptType, getPromptMessage } from '../../selectors';

import './style.css';

function PromptOverlay({ engineConnector }) {
	const promptType = useSelector(getPromptType);
	const promptMessage = useSelector(getPromptMessage);

	const overlay = useRef();

	useEffect(() => {
		setTimeout(() => {
			if (overlay.current) {
				overlay.current.classList.add('prompt-animation');
			}
		}, 0);
	}, [overlay]);

	return (
		<div className="promptOverlay" ref={overlay}>
			{promptMessage && <h1 className="promptMessage">{promptMessage}</h1>}
			{promptType === PROMPT_TYPE_CHOOSE_CARDS && <PromptChooseCards engineConnector={engineConnector} />}
			{promptType === PROMPT_TYPE_NUMBER && <PromptChooseNumber engineConnector={engineConnector} />}
			{promptType === PROMPT_TYPE_MAY_ABILITY && <PromptMayEffect engineConnector={engineConnector} />}
			{promptType === PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE && <PromptChooseCardsInZone engineConnector={engineConnector} />}
			{promptType === PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE && <PromptChooseUpToNCardsInZone engineConnector={engineConnector} />}
			{promptType === PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES && <PromptEnergyManipulation engineConnector={engineConnector} />}
			{promptType === PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES && <PromptEnergyDistribution engineConnector={engineConnector} />}
			{promptType === PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES && <PromptDamageDistribution engineConnector={engineConnector} />}
			{promptType === PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE && <PromptRearrangeCards engineConnector={engineConnector} />}
			{promptType === PROMPT_TYPE_DISTRUBUTE_CARDS_IN_ZONES && <PromptDistributeCards engineConnector={engineConnector} />}
			{promptType === PROMPT_TYPE_PLAYER && <PromptChoosePlayer engineConnector={engineConnector} />}
			{promptType === PROMPT_TYPE_POWER_ON_MAGI && <PromptChoosePowerOnMagi engineConnector={engineConnector} />}
			{promptType === PROMPT_TYPE_ALTERNATIVE && <PromptAlternatives engineConnector={engineConnector} />}
		</div>
	);
}

export default PromptOverlay;