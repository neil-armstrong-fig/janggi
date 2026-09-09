import type {Side} from "@janggi/shared/janggi/pieces/Side";

/**
 * How the board stands: every piece on its point, and whose turn it is. A position's identity, for
 * telling whether the game has come round to somewhere it has already been.
 *
 * Opaque. `standingOf` builds one and they are only ever compared with each other, never parsed
 * back — nothing needs reading out of it that the `GameState` it came from does not already say.
 *
 * **Why not a union of the values it can take**, the way `PositionKey` enumerates all ninety points?
 * Because there is no list to enumerate. A standing is up to thirty-two placements, sorted and
 * joined, so its value space is combinatorial rather than finite-and-small, and a template literal
 * type cannot express a variadic join in the first place. What it *can* pin is the shape: the side
 * to move on the end. That is enough to stop an arbitrary string being mistaken for a standing —
 * which is the whole of what a union would have bought here — while leaving the rest opaque.
 *
 * It is not called a position key because `Position` in this codebase is one intersection of the
 * board and `toPositionKey` names one, so the whole arrangement needed a word of its own. 동일수 —
 * the "same move" repetition bars — is a question about this. See `docs/rules.md` §6.4.
 */
export type Standing = `${string}:${Side}`;
