/* global window */
import {
	ACTION_RESOLVE_PROMPT,
} from 'moonlands/src/const';
import { useSelector } from 'react-redux';
import { getAlternatives, getPlayerNumber } from '../../selectors';
import { EngineConnector } from '../../types';

type Props = {
  engineConnector: EngineConnector
}

function PromptAlternatives({engineConnector}: Props) {
  const alternatives = useSelector(getAlternatives);
  const playerNumber = useSelector(getPlayerNumber);

	const handleSend = (alternative: string) => {
    engineConnector.emit({
      type: ACTION_RESOLVE_PROMPT,
      alternative,
      // generatedBy,
      player: playerNumber,
    });
	};

	return (
		<div className="promptWindow promptEnergyManipulation">
      {alternatives.map(alternative => 
			<div key={alternative.value} className="buttonHolder">
        <button onClick={() => handleSend(alternative.value)}>{alternative.name}</button>
      </div>
      )}
		</div>
	);
}

export default PromptAlternatives;