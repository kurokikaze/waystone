/* global window */
import { useSelector } from 'react-redux';
import {
	ACTION_RESOLVE_PROMPT,
} from 'moonlands/src/const';
import { EngineConnector } from '../../types';
import { getPlayerNumber } from '../../selectors';

type Props = {
	engineConnector: EngineConnector
}
function PromptChoosePlayer({ engineConnector }: Props) {
	const playerNumber = useSelector(getPlayerNumber);
	const handleSend = (player: number) => {
		engineConnector.emit({
			type: ACTION_RESOLVE_PROMPT,
			// promptType: PROMPT_TYPE_PLAYER,
			targetPlayer: player,
			// generatedBy,
			player: playerNumber,
		});
	};

	return (
		<div className="promptWindow promptEnergyManipulation">
			<div className="buttonHolder">
				<button onClick={() => handleSend(2)}>Opponent</button>
			</div>
			<div className="buttonHolder">
				<button onClick={() => handleSend(1)}>You</button>
			</div>
		</div>
	);
}

export default PromptChoosePlayer;