import type {GameState} from "@src/game/types/GameState";
import type {PieceLookup} from "@src/game/board/types/PieceLookup";
import type {Position} from "@src/game/board/types/Position";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {piecesByPosition} from "@src/game/board/utils/PiecesByPosition";
import {pseudoLegalMovesFrom} from "@src/game/moves/PseudoLegalMovesFrom";
import {toPositionKey} from "@src/game/board/utils/PositionKeys";

/**
 * Whether that army's general stands on a point the enemy attacks.
 *
 * Asked of what a piece **attacks**, not of what it may legally play: a piece pinned against its own
 * general still gives check, so this reads `pseudoLegalMovesFrom` rather than `movesFrom`. Reading
 * `movesFrom` would also be circular, since that is the thing defined in terms of this.
 *
 * An army with no general on the board is not in check — there is nothing left to threaten. That
 * only happens in a hand-built position or once a general has been taken, which the rules do not
 * allow but the engine does not yet prevent. See `docs/rules.md` §6.1.
 */
export function isInCheck(state: GameState, side: Side): boolean {
  const general = state.pieces.find(({piece}) => piece.side === side && piece.type === "general");
  if (!general) return false;

  const pieces = piecesByPosition(state.pieces);

  return state.pieces
    .filter(({piece}) => piece.side !== side)
    .some(({position}) => reaches(pieces, position, general.position));
}

function reaches(pieces: PieceLookup, from: Position, target: Position): boolean {
  const wanted = toPositionKey(target);

  return pseudoLegalMovesFrom(pieces, from).some(to => toPositionKey(to) === wanted);
}
