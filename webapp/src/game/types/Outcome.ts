import type {Side} from "@janggi/shared/janggi/pieces/Side";

/** Nothing has ended the game: there is still a turn to take. */
interface Undecided {
  readonly kind: "undecided";
}

/** 외통 — the general is attacked and nothing on offer answers it. The complete win, 완승. */
interface Checkmate {
  readonly kind: "checkmate";
  readonly winner: Side;
}

/** What each army was worth when the game stopped, Han's 덤 counted in. */
type Scores = Record<Side, number>;

/**
 * Both players rested a move in turn, so the game stops and is settled on what is left standing —
 * 점수승. The 덤 is half a point, so this can never come out level.
 */
interface PointsWin {
  readonly kind: "pointsWin";
  readonly winner: Side;
  readonly scores: Scores;
}

/**
 * 빅장 — the two generals came to face each other down an open file and the call was made, in a
 * game being played casually. The one drawn ending janggi has, and only in that format: the scored
 * format abolishes the draw, so a called bikjang there is a `PointsWin` like any other.
 */
interface Bikjang {
  readonly kind: "bikjang";
}

/**
 * How a game of janggi has ended, or that it has not.
 *
 * Three endings. Checkmate is the one janggi is normally won by; a points win is what two
 * consecutive passes reach, and what a bikjang comes to in a scored game; a bikjang called in a
 * casual game is the only draw, which is why the kind names the ending rather than the result.
 *
 * Repetition is deliberately not here. `docs/rules.md` §6.4 decided that the engine reports a
 * repetition and refuses the move that would make one, but does not end a game on it — who is at
 * fault is clause ②'s judgement about intent, and that is a referee's to make.
 */
export type Outcome = Undecided | Checkmate | PointsWin | Bikjang;
