import type {GameState} from "@src/game/types/GameState";
import type {Move} from "@src/game/types/Move";
import type {PlacedPiece} from "@src/game/board/types/PlacedPiece";
import {opponentOf} from "@src/game/utils/OpponentOf";
import {pieceAt} from "@src/game/board/utils/PieceAt";
import {piecesByPosition} from "@src/game/board/utils/PiecesByPosition";
import {toPositionKey} from "@src/game/board/utils/PositionKeys";

/**
 * The board after a move, with **nothing checked** — the piece stands somewhere new, anything of
 * the enemy's it landed on is gone, and it is the other army's turn.
 *
 * Separate from `applyMove` because the two callers want different halves of it. `applyMove` wants
 * the rules enforced. A check filter wants only the transition: it has to try a move to find out
 * whether the move is allowed, so going through `applyMove` would ask `movesFrom` whether the move
 * is legal in the middle of working out whether the move is legal — and recurse forever.
 *
 * A move is what a rested turn is not, so playing one puts `consecutivePasses` back to nought: two
 * passes end a game only when nothing came between them.
 *
 * Returns the state unchanged if nothing stands on `from`, since there is no move to make.
 */
export function positionAfter(state: GameState, move: Move): GameState {
  const moving = pieceAt(piecesByPosition(state.pieces), move.from);
  if (!moving) return state;

  return {
    pieces: [...state.pieces.filter(stillStanding(move)), {piece: moving, position: move.to}],
    sideToMove: opponentOf(state.sideToMove),
    consecutivePasses: 0,
  };
}

/**
 * Everything still on the board afterwards: the two points the move touches are cleared, since the
 * piece has left one and whatever stood on the other has been taken. The moved piece is added back
 * by the caller, on its new point.
 */
function stillStanding(move: Move): (placed: PlacedPiece) => boolean {
  const emptied = new Set([toPositionKey(move.from), toPositionKey(move.to)]);

  return ({position}) => !emptied.has(toPositionKey(position));
}
