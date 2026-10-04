import type {PieceLookup} from "@janggi/engine/board/types/PieceLookup";
import type {Position} from "@janggi/engine/board/types/Position";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {pieceAt} from "@janggi/engine/board/lookup/PieceAt";

/**
 * Whether a piece of this army may finish a move on this point: it is either empty, or the enemy is
 * standing there and will be taken.
 *
 * The one rule every piece on the board shares, and the only way a piece is ever captured — there
 * is no taking in passing in janggi. The cannon is the single exception, since it may not take
 * another cannon, and it says so itself rather than here.
 */
export function canLandOn(pieces: PieceLookup, position: Position, side: Side): boolean {
  return pieceAt(pieces, position)?.side !== side;
}
