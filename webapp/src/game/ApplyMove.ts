import type {GameState} from "@src/game/types/GameState";
import type {Move} from "@src/game/types/Move";
import {movesFrom} from "@src/game/MovesFrom";
import {outcomeOf} from "@src/game/OutcomeOf";
import {pieceAt} from "@src/game/board/utils/PieceAt";
import {piecesByPosition} from "@src/game/board/utils/PiecesByPosition";
import {positionAfter} from "@src/game/utils/PositionAfter";
import {toPositionKey} from "@src/game/board/utils/PositionKeys";

/**
 * The game after a move: the piece stands somewhere new, anything of the enemy's it landed on is
 * gone, and it is the other army's turn.
 *
 * The state handed in is never touched — a new one comes back — which is what keeps a move list
 * replayable and lets a caller hold on to any position it likes.
 *
 * This is the rules; `positionAfter` beside it is the transition alone. Everything here is the
 * checking: that the game is still going, that a piece is there, that it is that army's turn, and
 * that the move is one the piece may make.
 *
 * The first of those is newer than the rest. Until the pass move arrived nothing needed it — after
 * a mate there are no legal moves, so every move already threw — but two rested turns stop a game
 * whose position still has plenty to play. See `docs/rules.md` §6.3.
 *
 * **It throws on an illegal move rather than returning undefined.** `parsePieceKey` returns
 * undefined because its input is a string off a DOM attribute and genuinely untrusted; a move is
 * not, because the caller has just been handed the legal destinations by `movesFrom`. An illegal
 * move here is a bug at the call site, and a `GameState | undefined` would push a case that cannot
 * happen onto everything downstream.
 */
export function applyMove(state: GameState, move: Move): GameState {
  if (outcomeOf(state).kind !== "undecided") throw new Error("The game is over, so there is nothing left to play");

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

  return positionAfter(state, move);
}

function canReach(state: GameState, move: Move): boolean {
  const destination = toPositionKey(move.to);

  return movesFrom(state, move.from).some(reachable => toPositionKey(reachable) === destination);
}
