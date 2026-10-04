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
 * The same position stood a third time where nothing refuses it — each army under thirty points, so
 * the repeat is allowed and nothing else would ever stop the game. A draw in a casual game; a scored
 * game has none to reach, and settles the same stop on points as a `PointsWin`. `docs/rules.md` §6.4.
 */
interface Repetition {
  readonly kind: "repetition";
}

/**
 * The players agreed to a draw — 합의 무승부, which friendly janggi allows and a tournament does not.
 * Casual only, since only a casual game can be offered one.
 */
interface Agreement {
  readonly kind: "agreement";
}

/**
 * How a game of janggi has ended, or that it has not.
 *
 * Checkmate is the one janggi is normally won by; a points win is what two consecutive passes reach,
 * and what a bikjang or a repetition comes to in a scored game. The three draws — a called bikjang, a
 * repetition, an agreement — are all casual, and each kind names the ending rather than the result.
 *
 * A repetition ends a game only where it is allowed, under thirty points a side. Above that
 * `docs/rules.md` §6.4 has the engine refuse the move that would make one, and who is at fault stays
 * a referee's call, because clause ② is a judgement about intent.
 */
export type Outcome = Undecided | Checkmate | PointsWin | Bikjang | Repetition | Agreement;
