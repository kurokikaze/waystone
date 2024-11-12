/* global window */
import { useSelector } from 'react-redux';
import {
    ACTION_RESOLVE_PROMPT,
} from 'moonlands/src/const.ts';
import { getPromptGeneratedBy, getPromptType, getPlayerNumber } from '../../selectors';

function PromptDistributeDamage({ engineConnector }) {
    const generatedBy = useSelector(getPromptGeneratedBy);

    const freeDamage = useSelector(state => state.energyPrompt.freeEnergy);
    const cards = useSelector(state => state.energyPrompt.cards);
    const promptType = useSelector(getPromptType);
    const playerNumber = useSelector(getPlayerNumber);

    const handleSend = () => {
        if (freeDamage === 0) {
            engineConnector.emit({
                type: ACTION_RESOLVE_PROMPT,
                promptType,
                damageOnCreatures: cards,
                generatedBy,
                player: playerNumber,
            });
        }
    };

    return (
        <div className="promptWindow promptEnergyManipulation">
            {(freeDamage > 0) && <div>Damage left to distribute: {freeDamage}</div>}
            <div className="buttonHolder">
                <button onClick={handleSend} disabled={freeDamage > 0}>OK</button>
            </div>
        </div>
    );
}

export default PromptDistributeDamage;