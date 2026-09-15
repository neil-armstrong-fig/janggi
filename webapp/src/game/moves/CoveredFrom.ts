import type {GameState} from "@src/game/types/GameState";
import type {PieceLookup} from "@src/game/board/types/PieceLookup";
import type {Position} from "@src/game/board/types/Position";
import {pieceAt} from "@src/game/board/lookup/PieceAt";
import {piecesByPosition} from "@src/game/board/lookup/PiecesByPosition";
import {pseudoLegalMovesFrom} from "@src/game/moves/PseudoLegalMovesFrom";
import {toPositionKey} from "@src/game/board/PositionKeys";

/**
 * Every point of its own army the piece on one point would land on, were that one piece not standing
 * there — the half of a piece's shape `movesFrom` cannot show, since no piece may take its own.
 *
 * It exists to teach the board, not to play it: an elephant hemmed in by its own army has no move at
 * all, and showing the soldier it would otherwise land on is what makes that make sense.
 *
 * Asked by **emptying each point in turn and asking the movers again**, rather than by teaching seven
 * movers a second answer. That is exactly the question "could it move here if this were not already
 * here", and it gets every awkward case right for free: a blocking point on the way still blocks, and a
 * cannon's screen is not covered, because taking the screen away leaves it nothing to jump.
 *
 * Pseudo-legal, not legal: nothing a move would do to its own general comes into it, so a pinned piece
 * still shows its shape. Like `movesFrom`, it does not care whose turn it is.
 */
export function coveredFrom(state: GameState, from: Position): readonly Position[] {
  const pieces = piecesByPosition(state.pieces);

  const moving = pieceAt(pieces, from);
  if (!moving) return [];

  const fromKey = toPositionKey(from);

  return state.pieces
    .filter(({piece, position}) => piece.side === moving.side && toPositionKey(position) !== fromKey)
    .map(({position}) => position)
    .filter(position => isReachedOnceEmptied(pieces, from, position));
}

function isReachedOnceEmptied(pieces: PieceLookup, from: Position, point: Position): boolean {
  const key = toPositionKey(point);
  const emptied = new Map(pieces);
  emptied.delete(key);

  return pseudoLegalMovesFrom(emptied, from).some(to => toPositionKey(to) === key);
}
