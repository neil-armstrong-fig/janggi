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
 * How a game of janggi has ended, or that it has not.
 *
 * Two endings so far. Checkmate is the one janggi is normally won by; a points win is what two
 * consecutive passes reach, and is the only reason the 덤 exists. Bikjang and repetition would add
 * more — both are recorded in `docs/rules.md` §6.2 and §6.4 and neither is modelled.
 *
 * There is no draw here, and that is not an omission: the endings built so far cannot produce one.
 * A draw arrives with bikjang, along with the casual-or-scored setting that decides whether it is a
 * draw at all.
 */
export type Outcome = Undecided | Checkmate | PointsWin;
