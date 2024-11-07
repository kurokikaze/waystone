/* global window */
import { byName } from 'moonlands/src/cards';
import {
    ACTION_RESOLVE_PROMPT,
} from 'moonlands/src/const';
import { useSelector } from 'react-redux';
import { getPlayerNumber, getPromptMagi } from '../../selectors';
import { EngineConnector } from '../../types';

type Props = {
    engineConnector: EngineConnector
}

function PromptChoosePowerOnMagi({ engineConnector }: Props) {
    const magi = useSelector(getPromptMagi);
    const magiCard = byName(magi?.card || 'Grega');
    const magiPowers = magiCard?.data.powers || []
    const playerNumber = useSelector(getPlayerNumber)

    const handleSend = (powerName: string) => {
        engineConnector.emit({
            type: ACTION_RESOLVE_PROMPT,
            // promptType: PROMPT_TYPE_PLAYER,
            power: powerName,
            // generatedBy,
            player: playerNumber,
        });
    };

    return (
        <div className="promptWindow promptEnergyManipulation">
            {magiPowers.map(power =>
                <div key={power.name} className="buttonHolder">
                    <button onClick={() => handleSend(power.name)}>{power.name}</button>
                    <p>{power.text}</p>
                </div>
            )}
        </div>
    );
}

export default PromptChoosePowerOnMagi;