import type {GameState} from "@src/game/types/GameState";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {isCheckmate} from "@src/game/IsCheckmate";
import {isInCheck} from "@src/game/IsInCheck";
import {opponentOf} from "@src/game/utils/OpponentOf";

/** Whose move it is, and nothing hanging over them. */
interface ToMove {
  readonly kind: "toMove";
  readonly side: Side;
}

/** Whose move it is, with their general under attack. */
interface InCheck {
  readonly kind: "inCheck";
  readonly side: Side;
}

/** The game is over. Janggi is won by checkmate — 외통 — and by nothing else yet. */
interface Won {
  readonly kind: "won";
  readonly by: Side;
}

export type GameStatus = ToMove | InCheck | Won;

/**
 * What the game has to say about itself, in the one form a player needs told.
 *
 * Derived rather than stored: `GameState` carries no result, because a result is a fact about the
 * position rather than a separate thing to keep in step with it. The order matters — mate is check
 * as well, so it has to be asked first.
 *
 * A pure function rather than logic inside the component, because a checkmate cannot be tapped out
 * in a readable number of moves and so cannot be reached by an acceptance test. This is where that
 * case is covered.
 */
export function gameStatusOf(game: GameState): GameStatus {
  if (isCheckmate(game, game.sideToMove)) return {kind: "won", by: opponentOf(game.sideToMove)};

  if (isInCheck(game, game.sideToMove)) return {kind: "inCheck", side: game.sideToMove};

  return {kind: "toMove", side: game.sideToMove};
}
