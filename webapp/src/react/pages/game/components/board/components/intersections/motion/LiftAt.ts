import type {PieceLift} from "@src/react/pages/game/components/board/types/PieceLift";
import type {PositionKey} from "@src/game/board/types/Position";

/** What the board's hand is doing: which piece is held, which is under the pointer, and whether it moves. */
export interface Handling {
  readonly heldKey: PositionKey | undefined;
  readonly hoveredKey: PositionKey | undefined;
  readonly animated: boolean;
}

/**
 * How far the piece on a point stands off the board: lifted in hand, nudged under the pointer, or flat.
 *
 * Flat everywhere while effects are reduced, because a lift is motion — the piece in hand is still
 * marked, by the cell it stands in.
 */
export function liftAt(key: PositionKey, {heldKey, hoveredKey, animated}: Handling): PieceLift {
  if (!animated) return "resting";
  if (key === heldKey) return "held";
  if (key === hoveredKey) return "hovered";

  return "resting";
}
