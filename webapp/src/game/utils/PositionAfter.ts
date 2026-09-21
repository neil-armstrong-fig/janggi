import type {GameState} from "@src/game/types/GameState";
import type {Move} from "@src/game/types/Move";
import type {PlacedPiece} from "@src/game/board/types/PlacedPiece";
import {opponentOf} from "@src/game/utils/OpponentOf";
import {pieceAt} from "@src/game/board/lookup/PieceAt";
import {piecesByPosition} from "@src/game/board/lookup/PiecesByPosition";
import {standingOf} from "@src/game/utils/StandingOf";
import {toPositionKey} from "@src/game/board/PositionKeys";

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
 * It also keeps the three things the rules cannot read off the board. The position being left joins
 * `seen`, unless the move took a piece — a capture cannot be undone by playing on, so nothing from
 * before one can come round again and the list starts over. And whether the piece that took was a
 * general is remembered for the one ply the bikjang exception lasts.
 *
 * Returns the state unchanged if nothing stands on `from`, since there is no move to make.
 */
export function positionAfter(state: GameState, move: Move): GameState {
  const pieces = piecesByPosition(state.pieces);

  const moving = pieceAt(pieces, move.from);
  if (!moving) return state;

  const taken = pieceAt(pieces, move.to);

  return {
    pieces: [...state.pieces.filter(stillStanding(move)), {piece: moving, position: move.to}],
    sideToMove: opponentOf(state.sideToMove),
    format: state.format,
    consecutivePasses: 0,
    seen: taken ? [] : [...state.seen, standingOf(state)],
    reachedByAGeneralCapture: taken !== undefined && moving.type === "general",
    bikjangCalled: false,
    drawAgreed: false,
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
