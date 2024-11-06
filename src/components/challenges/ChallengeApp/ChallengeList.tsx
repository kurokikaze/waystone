import { useDispatch } from 'react-redux';
import { UserOutlined } from '@ant-design/icons';
import { Alert, Avatar, Button, Input, List } from 'antd';
import { acceptChallenge, createChallenge, cancelChallenge } from '../../../actions/index.js';
import { ChallengeType, DeckType } from '../../../types.js';
import { useEffect, useRef, useState } from 'react';
import { ChallengesService } from '../../../services/ChallengesService.js';
import { Socket } from 'socket.io-client';

type ChallengeListProps = {
    currentDeck: DeckType
    onChallengeAccepted: (secret: string) => void
}

export default function ChallengeList({ currentDeck, onChallengeAccepted }: ChallengeListProps) {
    const [challenges, setChallenges] = useState<ChallengeType[]>([])
    const [challengeComment, setChallengeComment] = useState<string>('')
    const hasChallenged = challenges.some(challenge => challenge.own);

    const connection = useRef<Socket>()

    const dispatch = useDispatch()

    const handleAcceptChallenge = (challengeId: string) => {
        if (connection.current) {
            connection.current.emit('accept', JSON.stringify({
                challengeId,
                deck: currentDeck.cards,
            }))
        }
        dispatch(acceptChallenge(challengeId))
    }
    const handleCancelChallenge = () => {
        if (connection.current) {
            connection.current.emit('delete')
        }
    }
    const handleCreateChallenge = () => {
        if (connection.current) {
            connection.current.emit('create', JSON.stringify({
                deck: currentDeck.cards,
                comment: challengeComment
            }))
            setChallengeComment('')
        }
        dispatch(createChallenge('challenge', currentDeck.cards))
    }

    useEffect(() => {
        const challengesService = new ChallengesService()
        connection.current = challengesService.connectToChallenges(setChallenges, onChallengeAccepted)
    }, [])

    return <div className='challenges'>
        <Alert message="As multiple decks are not yet implemented, you create and accept the challenges using your current deck" type="warning" />
        <List
            itemLayout="horizontal"
            style={{ width: '80%' }}
            dataSource={challenges}
            renderItem={(challenge) => (
                <List.Item
                    actions={challenge.own ? [<Button key={`${challenge.id}-actions-cancel`} onClick={handleCancelChallenge}>Cancel</Button>] : [<Button key={`${challenge.id}-actions-accept`} onClick={() => handleAcceptChallenge(challenge.id)}>Accept</Button>]}
                    key={`${challenge.id}-actions`}
                >
                    <List.Item.Meta
                        avatar={<Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />}
                        title={<b>{challenge.name}</b>}
                        key={challenge.id}
                    />
                </List.Item>
            )}
        />
        {!hasChallenged && <div className='create_challenge'>
            <Input
                value={challengeComment}
                onChange={event => setChallengeComment(event.target.value)}
                onPressEnter={handleCreateChallenge}
                style={{ width: 400, marginRight: 80 }}
            />
            <Button onClick={handleCreateChallenge} disabled={challengeComment == ''}>Create challenge!</Button>
        </div>}
    </div>;
}
