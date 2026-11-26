import { Button } from 'antd';
import type { SavedDeck } from '../../../services/DeckKeeperService';
import ChallengeList from './ChallengeList';

// import 'antd/dist/antd.css';

type ChallengeAppProps = {
	decks: SavedDeck[]
	initialDeckId: string
	onChallengeAccepted: (secret: string) => void
    onReturnToMenu: () => void
}

function ChallengeApp({ decks, initialDeckId, onChallengeAccepted, onReturnToMenu }: ChallengeAppProps) {
	return <div>
		<h2>Challenges</h2>
        <Button onClick={onReturnToMenu}>Back to menu</Button>
		<ChallengeList decks={decks} initialDeckId={initialDeckId} onChallengeAccepted={onChallengeAccepted} />
	</div>;
}

export default ChallengeApp;
