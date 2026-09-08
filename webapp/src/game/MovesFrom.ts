import type {GameState} from "@src/game/types/GameState";
import type {Position} from "@src/game/board/types/Position";
import {isInCheck} from "@src/game/IsInCheck";
import {pieceAt} from "@src/game/board/utils/PieceAt";
import {piecesByPosition} from "@src/game/board/utils/PiecesByPosition";
import {positionAfter} from "@src/game/utils/PositionAfter";
import {pseudoLegalMovesFrom} from "@src/game/moves/PseudoLegalMovesFrom";

/**
 * Everywhere the piece on one point may legally go, and nothing at all where no piece stands.
 *
 * Legal, not merely possible: a move that would leave its own general attacked is not on offer, so
 * a pinned piece cannot step off the pin and a general cannot walk onto a point the enemy covers.
 * That filter lives here, in one place, rather than in each of the seven movers.
 *
 * It deliberately does **not** care whose turn it is. "Where could this piece go" is the question a
 * board asks in order to light up the points a player may tap, and it is worth answering for either
 * army — so the filter is about the moving piece's own general, not about the side to move. Whose
 * turn it is becomes a rule one layer up, in `applyMove`.
 */
export function movesFrom(state: GameState, from: Position): readonly Position[] {
  const pieces = piecesByPosition(state.pieces);

  const moving = pieceAt(pieces, from);
  if (!moving) return [];

  return pseudoLegalMovesFrom(pieces, from).filter(to => !isInCheck(positionAfter(state, {from, to}), moving.side));
}
