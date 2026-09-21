import type {DrawnBy} from "@janggi/shared/janggi/results/DrawnBy";
import type {GameState} from "@src/game/types/GameState";
import type {SetupPhase} from "@src/game/setups/types/SetupPhase";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {isArranged} from "@src/game/setups/IsArranged";
import {isInCheck} from "@src/game/check/IsInCheck";
import {outcomeOf} from "@src/game/OutcomeOf";

/**
 * The board is still being laid out — 판차림 — and this is the army it is waiting on. Only a scored
 * game ever reaches it: `docs/rules.md` §6.6's order is a regulation of official play, so a casual
 * game is dealt with both back ranks already out and never sits here.
 */
interface LayingOut {
  readonly kind: "layingOut";
  readonly side: Side;
}

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
 * The game was drawn, which only a casual one can be: the two generals faced each other and the call
 * was made — 빅장 — or a position stood a third time where nothing refuses it, or the players agreed.
 * A scored game reaches `WonOnPoints` from the first two instead, there being no draw in that format
 * to reach, and cannot be offered the third.
 */
interface Drawn {
  readonly kind: "drawn";
  readonly by: DrawnBy;
}

export type GameStatus = LayingOut | ToMove | InCheck | Won | WonOnPoints | Drawn;

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
 *
 * The phase is asked **first**, and outranks everything the position has to say. A board still being
 * laid out has a `GameState` only because something has to be drawn — `BoardShownFor.ts` — and
 * announcing "Cho to move" over a game nobody has arranged yet would be a lie about a board that
 * will not answer a tap.
 */
export function gameStatusOf(game: GameState, phase: SetupPhase): GameStatus {
  if (!isArranged(phase)) return {kind: "layingOut", side: layingOutNext(phase)};

  const outcome = outcomeOf(game);

  if (outcome.kind === "checkmate") return {kind: "won", by: outcome.winner};

  if (outcome.kind === "pointsWin") return {kind: "wonOnPoints", by: outcome.winner};

  if (outcome.kind === "bikjang" || outcome.kind === "repetition" || outcome.kind === "agreement") {
    return {kind: "drawn", by: outcome.kind};
  }

  if (isInCheck(game, game.sideToMove)) return {kind: "inCheck", side: game.sideToMove};

  return {kind: "toMove", side: game.sideToMove};
}

/**
 * Which army the board is waiting on. Han lays out first — 후수자가 먼저 기물을 차리고 — so an
 * unfinished phase is waiting on Han until Han has chosen, and on Cho after that.
 */
function layingOutNext(phase: SetupPhase): Side {
  return phase.hanSetup === undefined ? "han" : "cho";
}
