import { DeckType } from '../../../types';
import ChallengeList from './ChallengeList';

// import 'antd/dist/antd.css';

type ChallengeAppProps = {
	playerDeck: DeckType
}

function ChallengeApp({ playerDeck }: ChallengeAppProps) {
	return <div>
		<h2>Challenges</h2>
		<ChallengeList currentDeck={playerDeck} />
		{/* No deck selector for now */}
		{/*<DeckSelector />-*/}
	</div>;
}

export default ChallengeApp;
