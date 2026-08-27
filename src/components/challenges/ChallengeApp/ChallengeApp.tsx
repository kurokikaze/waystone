import { Button } from 'antd';
import { DeckType } from '../../../types';
import ChallengeList from './ChallengeList';

// import 'antd/dist/antd.css';

type ChallengeAppProps = {
	playerDeck: DeckType
	onChallengeAccepted: (secret: string) => void
    onReturnToMenu: () => void
}

function ChallengeApp({ playerDeck, onChallengeAccepted, onReturnToMenu }: ChallengeAppProps) {
	return <div>
		<h2>Challenges</h2>
        <Button onClick={onReturnToMenu}>Back to menu</Button>
		<ChallengeList currentDeck={playerDeck} onChallengeAccepted={onChallengeAccepted} />
		{/* No deck selector for now */}
		{/*<DeckSelector />-*/}
	</div>;
}

export default ChallengeApp;
