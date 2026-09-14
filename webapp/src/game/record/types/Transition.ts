import type {Move} from "@src/game/types/Move";
import type {Piece} from "@janggi/shared/janggi/pieces/Piece";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/** A piece went from one point to another, taking whatever of the enemy's stood on the second. */
interface Moved {
  readonly kind: "moved";
  readonly move: Move;
  readonly mover: Piece;
  /** What the move took, or undefined where it landed on an empty point. */
  readonly taken: Piece | undefined;
}

/** 한수쉼 — the army that was to move rested its turn instead. */
interface Passed {
  readonly kind: "passed";
  readonly side: Side;
}

/** The players stopped the game on a bikjang. Nothing moved and nobody's turn was taken. */
interface BikjangCalled {
  readonly kind: "bikjangCalled";
}

/**
 * What one turn did, told apart by comparing the positions either side of it.
 *
 * The three kinds are the three things `record/` advances by — `playMove`, `restTurn` and
 * `callBikjangIn` — and are kept apart for the reason those are: a rested turn and a call are not
 * moves, and a union of `Move | "pass"` is exactly what `types/Move.ts` went out of its way to avoid.
 */
export type Transition = Moved | Passed | BikjangCalled;
