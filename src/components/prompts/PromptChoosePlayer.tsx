/* global window */
import { useSelector } from 'react-redux';
import {
	ACTION_RESOLVE_PROMPT,
} from 'moonlands/dist/esm/const';
import { EngineConnector } from '../../types';
import { getPlayerNumber, getPromptGeneratedBy } from '../../selectors';

type Props = {
	engineConnector: EngineConnector
}
function PromptChoosePlayer({ engineConnector }: Props) {
	const playerNumber = useSelector(getPlayerNumber);
	const generatedBy = useSelector(getPromptGeneratedBy);
	const opponent = playerNumber === 1 ? 2 : 1;
	const handleSend = (player: number) => {
		engineConnector.emit({
			type: ACTION_RESOLVE_PROMPT,
			targetPlayer: player,
			generatedBy: generatedBy ?? undefined,
			player: playerNumber,
		});
	};

	return (
		<div className="promptWindow promptEnergyManipulation">
			<div className="buttonHolder">
				<button onClick={() => handleSend(opponent)}>Opponent</button>
			</div>
			<div className="buttonHolder">
				<button onClick={() => handleSend(playerNumber)}>You</button>
			</div>
		</div>
	);
}

export default PromptChoosePlayer;
