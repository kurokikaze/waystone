/* global window */
import { byName } from 'moonlands/dist/cards';
import {
	ACTION_RESOLVE_PROMPT,
} from 'moonlands/dist/const';
import { useSelector } from 'react-redux';
import { getPromptMagi } from '../../selectors';
import { EngineConnector } from '../../types';

type Props = {
  engineConnector: EngineConnector
}

function PromptChoosePowerOnMagi({engineConnector}: Props) {
  const magi = useSelector(getPromptMagi);
  const magiCard = byName(magi?.card || 'Grega');
  const magiPowers = magiCard?.data.powers || []

	const handleSend = (powerName: string) => {
    engineConnector.emit({
      type: ACTION_RESOLVE_PROMPT,
      // promptType: PROMPT_TYPE_PLAYER,
      power: powerName,
      // generatedBy,
      player: 1,
    });
	};

	return (
		<div className="promptWindow promptEnergyManipulation">
      {magiPowers.map(power => 
			<div className="buttonHolder">
        <button onClick={() => handleSend(power.name)}>{power.name}</button>
        <p>{power.text}</p>
      </div>
      )}
		</div>
	);
}

export default PromptChoosePowerOnMagi;