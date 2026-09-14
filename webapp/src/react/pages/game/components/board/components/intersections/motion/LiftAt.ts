import type {PieceLift} from "@src/react/pages/game/components/board/types/PieceLift";
import type {PositionKey} from "@src/game/board/types/Position";

/**
 * How far the piece on a point stands off the board: lifted in hand, nudged under the pointer, or flat.
 *
 * Flat everywhere while effects are reduced, because a lift is motion — the piece in hand is still
 * marked, by the cell it stands in.
 */
export function liftAt(
  key: PositionKey,
  heldKey: PositionKey | undefined,
  hoveredKey: PositionKey | undefined,
  animated: boolean,
): PieceLift {
  if (!animated) return "resting";
  if (key === heldKey) return "held";
  if (key === hoveredKey) return "hovered";

  return "resting";
}
