import type { Socket } from 'socket.io-client';
import { ChallengesService } from '../ChallengesService';
import { DeckKeeperService, type SavedDeck } from '../DeckKeeperService';

describe('Challenge deck selection', () => {
    const host: SavedDeck = { id: 'host-deck', name: 'Arderial Starter', cards: DeckKeeperService.arderialStarterDeck };
    const guest: SavedDeck = { id: 'guest-deck', name: 'Cald Starter', cards: DeckKeeperService.caldStarterDeck };
    let socket: Socket;
    let emit: jest.Mock;

    beforeEach(() => {
        emit = jest.fn();
        socket = { emit } as unknown as Socket;
    });

    it('sends independent selected decks when creating and accepting challenges', () => {
        expect(ChallengesService.createChallenge(socket, host, '  Play with me  ')).toBe(true);
        expect(ChallengesService.acceptChallenge(socket, 'challenge-123', guest)).toBe(true);
        expect(emit.mock.calls.map(([event, payload]) => [event, JSON.parse(payload)])).toEqual([
            ['create', { deck: host.cards, comment: 'Play with me' }],
            ['accept', { challengeId: 'challenge-123', deck: guest.cards }],
        ]);
    });

    it('uses a changed selection for the next request without changing an existing challenge', () => {
        ChallengesService.createChallenge(socket, host, 'First challenge');
        ChallengesService.acceptChallenge(socket, 'other-challenge', host);
        ChallengesService.createChallenge(socket, guest, 'Second challenge');
        expect(JSON.parse(emit.mock.calls[0][1]).deck).toEqual(host.cards);
        expect(JSON.parse(emit.mock.calls[1][1]).deck).toEqual(host.cards);
        expect(JSON.parse(emit.mock.calls[2][1]).deck).toEqual(guest.cards);
    });

    it.each([undefined, { id: 'draft', name: 'Draft', cards: ['', '', ''] }])('does not submit a missing or unfinished deck: %j', deck => {
        expect(ChallengesService.createChallenge(socket, deck, 'Challenge')).toBe(false);
        expect(ChallengesService.acceptChallenge(socket, 'challenge-123', deck)).toBe(false);
        expect(emit).not.toHaveBeenCalled();
    });

    it('does not create a challenge with a blank comment, including the Enter key path', () => {
        expect(ChallengesService.createChallenge(socket, host, '   ')).toBe(false);
        expect(emit).not.toHaveBeenCalled();
    });
});
