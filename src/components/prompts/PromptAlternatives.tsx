/* global window */
import { byName } from 'moonlands/src/cards';
import {
	ACTION_RESOLVE_PROMPT,
} from 'moonlands/src/const';
import { useSelector } from 'react-redux';
import { getPromptMagi, getAlternatives } from '../../selectors';
import { EngineConnector } from '../../types';

type Props = {
  engineConnector: EngineConnector
}

function PromptAlternatives({engineConnector}: Props) {
  const alternatives = useSelector(getAlternatives);

	const handleSend = (alternative: string) => {
    engineConnector.emit({
      type: ACTION_RESOLVE_PROMPT,
      alternative,
      // generatedBy,
      player: 1,
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