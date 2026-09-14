import type {MovableEmphasis} from "@src/react/pages/game/components/board/components/intersections/types/MovableEmphasis";
import type {Position, PositionKey} from "@src/game/board/types/Position";
import {toPositionKey} from "@src/game/board/PositionKeys";

/**
 * How loudly to mark one intersection as holding a piece its owner may move, or undefined to leave it
 * alone.
 *
 * Faint while a piece is in hand: the alternatives stay legible, which is the point of the mark
 * when a general is under attack, but the piece being held and the points it may reach are what
 * should carry the eye.
 */
export function emphasisFor(
  movable: ReadonlySet<PositionKey>,
  position: Position,
  holding: boolean,
): MovableEmphasis | undefined {
  if (!movable.has(toPositionKey(position))) return undefined;

  return holding ? "faint" : "full";
}
