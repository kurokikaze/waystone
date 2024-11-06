import { DeckType } from '../../../types';
import ChallengeList from './ChallengeList';

// import 'antd/dist/antd.css';

type ChallengeAppProps = {
	playerDeck: DeckType
	onChallengeAccepted: (secret: string) => void
}

function ChallengeApp({ playerDeck, onChallengeAccepted }: ChallengeAppProps) {
	return <div>
		<h2>Challenges</h2>
		<ChallengeList currentDeck={playerDeck} onChallengeAccepted={onChallengeAccepted} />
		{/* No deck selector for now */}
		{/*<DeckSelector />-*/}
	</div>;
}

export default ChallengeApp;
