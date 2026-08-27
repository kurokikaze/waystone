import {useRef, useEffect} from 'react';
import {useSelector} from 'react-redux';
import cn from 'classnames';
import Button from 'antd/es/button';
import { getPlayerNumber, getWinner } from '../../selectors';

type EndgameOverlayProps = {
  onReturnToBase: () => void,
}

function EndgameOverlay({
  onReturnToBase,
}: EndgameOverlayProps) {
	const overlay = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setTimeout(() => {
			if (overlay.current) {
				overlay.current.classList.add('prompt-animation');
			}
		}, 0);
	}, [overlay]);

	const winner = useSelector(getWinner);
	const playerNumber = useSelector(getPlayerNumber)
	const youWin = winner === playerNumber;

	return (
		<div className="promptOverlay endgame" ref={overlay}>
			<h1 className={cn({'win': youWin})}>{youWin ? 'VICTORY' : 'DEFEAT'}</h1>
			<p>
				{`Player ${winner} has won`}
			</p>
      <p><Button onClick={onReturnToBase}>Return to the main menu</Button></p>
		</div>
	);
}

export default EndgameOverlay;
