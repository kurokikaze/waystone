import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Input, List, Select, Space } from 'antd';
import { ChallengeType } from '../../../types.js';
import { isPlayableDeck, type SavedDeck } from '../../../services/DeckKeeperService';
import { useEffect, useRef, useState } from 'react';
import { ChallengesService } from '../../../services/ChallengesService.js';
import { Socket } from 'socket.io-client';

type ChallengeListProps = {
    decks: SavedDeck[]
    initialDeckId: string
    onChallengeAccepted: (secret: string) => void
}

const formatter = new Intl.RelativeTimeFormat(undefined, {
    numeric: "auto",
})

const DIVISIONS = [
    { amount: 60, name: "seconds" },
    { amount: 60, name: "minutes" },
    { amount: 24, name: "hours" },
    { amount: 7, name: "days" },
    { amount: 4.34524, name: "weeks" },
    { amount: 12, name: "months" },
    { amount: Number.POSITIVE_INFINITY, name: "years" },
]

function formatTimeAgo(date: string) {
    let duration = (+(new Date(date)) - +(new Date())) / 1000

    for (let i = 0; i < DIVISIONS.length; i++) {
        const division = DIVISIONS[i]
        if (Math.abs(duration) < division.amount) {
            return formatter.format(Math.round(duration), division.name as Intl.RelativeTimeFormatUnit)
        }
        duration /= division.amount
    }
}

export default function ChallengeList({ decks, initialDeckId, onChallengeAccepted }: ChallengeListProps) {
    const [challenges, setChallenges] = useState<ChallengeType[]>([])
    const [challengeComment, setChallengeComment] = useState<string>('')
    const hasChallenged = challenges.some(challenge => challenge.own);
    const defaultDeckId = decks.find(deck => deck.id === initialDeckId && isPlayableDeck(deck.cards))?.id
        ?? decks.find(deck => isPlayableDeck(deck.cards))?.id;
    const [createDeckId, setCreateDeckId] = useState(defaultDeckId);
    const [acceptDeckId, setAcceptDeckId] = useState(defaultDeckId);
    const createDeck = decks.find(deck => deck.id === createDeckId);
    const acceptDeck = decks.find(deck => deck.id === acceptDeckId);
    const deckOptions = decks.map(deck => ({ value: deck.id, label: deck.name, disabled: !isPlayableDeck(deck.cards) }));

    const connection = useRef<Socket>()

    const handleAcceptChallenge = (challengeId: string) => {
        if (connection.current) ChallengesService.acceptChallenge(connection.current, challengeId, acceptDeck);
    }
    const handleCancelChallenge = () => {
        if (connection.current) {
            connection.current.emit('delete')
        }
    }
    const handleCreateChallenge = () => {
        if (connection.current && !hasChallenged && ChallengesService.createChallenge(connection.current, createDeck, challengeComment)) {
            setChallengeComment('')
        }
    }

    useEffect(() => {
        const challengesService = new ChallengesService()
        const socket = challengesService.connectToChallenges(setChallenges, onChallengeAccepted)
        connection.current = socket;

        return () => {
            socket.disconnect();
            connection.current = undefined;
        }
    }, [onChallengeAccepted])

    return <div className='challenges'>
        <Space style={{ margin: '16px 0' }}>
            <label id="accept-challenge-deck-label">Deck for accepting challenges</label>
            <Select aria-labelledby="accept-challenge-deck-label" style={{ minWidth: 220 }} value={acceptDeckId} options={deckOptions} onChange={setAcceptDeckId} />
        </Space>
        <List
            itemLayout="horizontal"
            style={{ width: '80%' }}
            dataSource={challenges}
            renderItem={(challenge) => (
                <List.Item
                    actions={challenge.own ? [<Button key={`${challenge.id}-actions-cancel`} onClick={handleCancelChallenge}>Cancel</Button>] : [<Button key={`${challenge.id}-actions-accept`} disabled={!acceptDeck || !isPlayableDeck(acceptDeck.cards)} onClick={() => handleAcceptChallenge(challenge.id)}>Accept</Button>]}
                    key={`${challenge.id}-actions`}
                >
                    <List.Item.Meta
                        avatar={<Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />}
                        title={<b>{challenge.name}</b>}
                        description={formatTimeAgo(challenge.created)}
                        key={challenge.id}
                    />
                </List.Item>
            )}
        />
        {!hasChallenged && <div className='create_challenge'>
            <Space style={{ margin: '16px 0' }}>
                <label id="create-challenge-deck-label">Deck for creating a challenge</label>
                <Select aria-labelledby="create-challenge-deck-label" style={{ minWidth: 220 }} value={createDeckId} options={deckOptions} onChange={setCreateDeckId} />
            </Space>
            <br />
            <Input
                value={challengeComment}
                onChange={event => setChallengeComment(event.target.value)}
                onPressEnter={handleCreateChallenge}
                style={{ width: 400, marginRight: 80 }}
            />
            <Button onClick={handleCreateChallenge} disabled={!challengeComment.trim() || !createDeck || !isPlayableDeck(createDeck.cards)}>Create challenge!</Button>
        </div>}
    </div>;
}
