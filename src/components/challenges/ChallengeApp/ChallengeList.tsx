import { useDispatch, useSelector } from 'react-redux';
import { fetch } from '@tauri-apps/plugin-http';
import { acceptChallenge, createChallenge, cancelChallenge } from '../../../actions/index.js';
import { ChallengeType, DeckType } from '../../../types.js';
import { useEffect, useState } from 'react';
import { ChallengesService } from '../../../services/ChallengesService.js';

const serverAddress = 'localhost:3000'

type ChallengeListProps = {
	currentDeck: DeckType
}
export default function ChallengeList({ currentDeck }: ChallengeListProps) {
	const [challenges, setChallenges] = useState<ChallengeType[]>([])
	const hasChallenged = challenges.some(challenge => challenge.own);

	const dispatch = useDispatch()

	const loadChallenges = async () => {
		const challengeService = new ChallengesService()
		const challenges = await challengeService.getChallenges()

		setChallenges(challenges)
	}
	useEffect(() => {
		loadChallenges()
	}, [])
	const handleAcceptChallenge = (challenge: string) => dispatch(acceptChallenge(challenge))
	const handleCancelChallenge = () => dispatch(cancelChallenge())
	const handleCreateChallenge = () => dispatch(createChallenge('challenge', currentDeck.cards))

	useEffect(() => {
		fetch(`http://${serverAddress}/challenges/list`)
			.then(challenges => {
				console.dir(challenges)
			})
			.catch((error) => {
				console.log(`Request error`)
				console.dir(error)
			})
	}, [])
	return <div className='challenges'>
		{challenges.map(challenge => (<div className='challenge' key={challenge.id || 'test'}>
			<div>{challenge.name}</div>
			{/* <div>{challenge.deck}</div> */}
			<div>{challenge.own ?
				<button onClick={handleCancelChallenge}>Cancel</button> :
				<button onClick={() => handleAcceptChallenge(challenge.id)}>Accept!</button>}</div>
		</div>))}
		{!hasChallenged && <div className='create_challenge'>
			<button onClick={handleCreateChallenge}>Create challenge!</button>
		</div>}
	</div>;
}

// function mapStateToProps(state) {
// 	return {
// 		challenges: state.challenges,
// 		currentDeck: state.currentDeck,
// 		username: state.username,
// 	};
// }

// function mapDispatchToProps(dispatch) {
// 	return {
// 		cancelChallenge: () => dispatch(cancelChallenge()),
// 		acceptChallenge: (name, deck) => dispatch(acceptChallenge(name, deck)),
// 		createChallenge: (deckId) => dispatch(createChallenge(deckId)),
// 	};
// }

// const enhance = connect(mapStateToProps, mapDispatchToProps);

// export {ChallengeList as Base};

// export default enhance(ChallengeList);
