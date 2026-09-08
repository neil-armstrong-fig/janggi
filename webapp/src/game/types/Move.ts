import type {Position} from "@src/game/board/types/Position";

/**
 * One move: the piece on `from` goes to `to`, taking whatever of the enemy's was standing there.
 *
 * Two points is the whole of it. Janggi has no castling, no promotion and no capture in passing, so
 * nothing else needs saying — the piece that moves is whatever is on `from`, and what it takes is
 * whatever is on `to`.
 *
 * A pass is **not** representable here, and that is deliberate: the pass move is real, is how
 * stalemate is avoided, and is not modelled yet. See `docs/rules.md` §6.3.
 */
export interface Move {
  readonly from: Position;
  readonly to: Position;
}
