import type {GameState} from "@janggi/engine/types/GameState";
import type {Move} from "@janggi/engine/types/Move";
import {legalMovesFor} from "@janggi/engine/LegalMovesFor";
import {toPositionKey} from "@janggi/engine/board/PositionKeys";

/**
 * Whether `move` may be played in `state`. The script's replies are checked before they are played, since the reducer
 * throws on a move the rules refuse: a tutorial knocked off its script by some way in not yet closed sticks rather than
 * crashing the page.
 */
export function isPlayable(state: GameState, move: Move): boolean {
  const from = toPositionKey(move.from);
  const to = toPositionKey(move.to);

  return legalMovesFor(state).some(legal => toPositionKey(legal.from) === from && toPositionKey(legal.to) === to);
}
