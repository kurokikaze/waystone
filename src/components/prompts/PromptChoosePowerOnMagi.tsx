/* global window */
import { byName } from 'moonlands/dist/esm/cards';
import {
    ACTION_RESOLVE_PROMPT,
    COST_X,
} from 'moonlands/dist/esm/const';
import { useSelector } from 'react-redux';
import { getPlayerNumber, getPromptGeneratedBy, getPromptMagi } from '../../selectors';
import { EngineConnector } from '../../types';

type Props = {
    engineConnector: EngineConnector
}

function PromptChoosePowerOnMagi({ engineConnector }: Props) {
    const magi = useSelector(getPromptMagi);
    const magiCard = magi ? byName(magi.card) : undefined;
    const energy = magi?.data.energy ?? 0;
    const magiPowers = magiCard?.data.powers?.filter(power => energy >= (power.cost === COST_X ? 3 : power.cost + 2)) ?? [];
    const playerNumber = useSelector(getPlayerNumber)
    const generatedBy = useSelector(getPromptGeneratedBy);

    const handleSend = (powerName: string) => {
        engineConnector.emit({
            type: ACTION_RESOLVE_PROMPT,
            power: powerName,
            generatedBy: generatedBy ?? undefined,
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
