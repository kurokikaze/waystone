import ChallengeApp from "../ChallengeApp/ChallengeApp";
import type { SavedDeck } from '../../../services/DeckKeeperService';

type ChallengeAppWrapperProps = {
  decks: SavedDeck[]
  initialDeckId: string
  onChallengeAccepted: (secret: string) => void
  onReturnToMenu: () => void
}

export const ChallengeAppWrapper = ({
  decks,
  initialDeckId,
  onChallengeAccepted,
  onReturnToMenu,
}: ChallengeAppWrapperProps) => {
  return <ChallengeApp decks={decks} initialDeckId={initialDeckId} onChallengeAccepted={onChallengeAccepted} onReturnToMenu={onReturnToMenu} />;
}
