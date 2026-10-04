import type {PieceLookup} from "@janggi/engine/board/types/PieceLookup";
import type {Position} from "@janggi/engine/board/types/Position";
import {pseudoLegalMovesFrom} from "@janggi/engine/moves/PseudoLegalMovesFrom";
import {toPositionKey} from "@janggi/engine/board/PositionKeys";

/**
 * Whether the piece on `from` attacks `target` — what it could move onto, pinned or not.
 *
 * Shared by `isInCheck`, which asks whether anything does, and `attackersOf`, which asks what. Both
 * must read `pseudoLegalMovesFrom` for the same reason, so they read it through one place.
 */
export function reaches(pieces: PieceLookup, from: Position, target: Position): boolean {
  const wanted = toPositionKey(target);

  return pseudoLegalMovesFrom(pieces, from).some(to => toPositionKey(to) === wanted);
}
