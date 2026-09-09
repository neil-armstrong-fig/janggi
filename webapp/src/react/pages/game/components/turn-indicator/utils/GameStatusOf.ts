import type {GameState} from "@src/game/types/GameState";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {isInCheck} from "@src/game/IsInCheck";
import {outcomeOf} from "@src/game/OutcomeOf";

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

/** The game is over on a checkmate — 외통, the complete win. */
interface Won {
  readonly kind: "won";
  readonly by: Side;
}

/** Both players rested a turn, so the game stopped and the score settled it — 점수승. */
interface WonOnPoints {
  readonly kind: "wonOnPoints";
  readonly by: Side;
}

/**
 * The two generals faced each other and the call was made, in a game being played casually — 빅장,
 * and the one drawn ending janggi has. A scored game reaches `WonOnPoints` from the same call
 * instead, there being no draw in that format to reach.
 */
interface Drawn {
  readonly kind: "drawn";
}

export type GameStatus = ToMove | InCheck | Won | WonOnPoints | Drawn;

/**
 * What the game has to say about itself, in the one form a player needs told.
 *
 * Derived rather than stored: `GameState` carries no result, because a result is a fact about the
 * position rather than a separate thing to keep in step with it.
 *
 * **How a game ends is the engine's to say, not this one's** — `outcomeOf` decides it and this only
 * dresses the answer for the screen, adding the one state the engine has no opinion about, that a
 * general is under attack while the game goes on. A second copy of "who won" living here is exactly
 * what would drift.
 *
 * A pure function rather than logic inside the component, because a checkmate cannot be tapped out
 * in a readable number of moves and so cannot be reached by an acceptance test. This is where that
 * case is covered.
 */
export function gameStatusOf(game: GameState): GameStatus {
  const outcome = outcomeOf(game);

  if (outcome.kind === "checkmate") return {kind: "won", by: outcome.winner};

  if (outcome.kind === "pointsWin") return {kind: "wonOnPoints", by: outcome.winner};

  if (outcome.kind === "bikjang") return {kind: "drawn"};

  if (isInCheck(game, game.sideToMove)) return {kind: "inCheck", side: game.sideToMove};

  return {kind: "toMove", side: game.sideToMove};
}
