import { useDispatch } from 'react-redux';
import { acceptChallenge, createChallenge, cancelChallenge } from '../../../actions/index.js';
import { ChallengeType, DeckType } from '../../../types.js';
import { useEffect, useState } from 'react';
import { ChallengesService } from '../../../services/ChallengesService.js';

const serverAddress = 'localhost:3000'

type ChallengeListProps = {
	currentDeck: DeckType
	onChallengeAccepted: (secret: string) => void
}

export default function ChallengeList({ currentDeck, onChallengeAccepted }: ChallengeListProps) {
	const [challenges, setChallenges] = useState<ChallengeType[]>([])
	const hasChallenged = challenges.some(challenge => challenge.own);

	const dispatch = useDispatch()

	const handleAcceptChallenge = (challenge: string) => dispatch(acceptChallenge(challenge))
	const handleCancelChallenge = () => dispatch(cancelChallenge())
	const handleCreateChallenge = () => dispatch(createChallenge('challenge', currentDeck.cards))

	useEffect(() => {
        const challengesService = new ChallengesService()
        challengesService.connectToChallenges(setChallenges, onChallengeAccepted)
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
