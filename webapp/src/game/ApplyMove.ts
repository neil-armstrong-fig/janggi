import type {GameState} from "@src/game/types/GameState";
import type {Move} from "@src/game/types/Move";
import type {PlacedPiece} from "@src/game/board/types/PlacedPiece";
import {movesFrom} from "@src/game/MovesFrom";
import {opponentOf} from "@src/game/utils/OpponentOf";
import {pieceAt} from "@src/game/board/utils/PieceAt";
import {piecesByPosition} from "@src/game/board/utils/PiecesByPosition";
import {toPositionKey} from "@src/game/board/utils/PositionKeys";

/**
 * The game after a move: the piece stands somewhere new, anything of the enemy's it landed on is
 * gone, and it is the other army's turn.
 *
 * The state handed in is never touched — a new one comes back — which is what keeps a move list
 * replayable and lets a caller hold on to any position it likes.
 *
 * **It throws on an illegal move rather than returning undefined.** `parsePieceKey` returns
 * undefined because its input is a string off a DOM attribute and genuinely untrusted; a move is
 * not, because the caller has just been handed the legal destinations by `movesFrom`. An illegal
 * move here is a bug at the call site, and a `GameState | undefined` would push a case that cannot
 * happen onto everything downstream.
 */
export function applyMove(state: GameState, move: Move): GameState {
  const moving = pieceAt(piecesByPosition(state.pieces), move.from);

  if (!moving) throw new Error(`No piece stands on ${toPositionKey(move.from)}`);

  if (moving.side !== state.sideToMove) {
    throw new Error(`It is ${state.sideToMove} to move, so the ${moving.side} ${moving.type} may not`);
  }

  if (!canReach(state, move)) {
    throw new Error(
      `A ${moving.side} ${moving.type} cannot move from ${toPositionKey(move.from)} to ${toPositionKey(move.to)}`,
    );
  }

  return {
    pieces: [...state.pieces.filter(stillStanding(move)), {piece: moving, position: move.to}],
    sideToMove: opponentOf(state.sideToMove),
  };
}

function canReach(state: GameState, move: Move): boolean {
  const destination = toPositionKey(move.to);

  return movesFrom(state, move.from).some(reachable => toPositionKey(reachable) === destination);
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
