import type {Move} from "@src/game/types/Move";
import type {Vector} from "@src/react/pages/game/components/board/types/Vector";

/**
 * Which way a move travelled, one unit long — the direction a capture's blow lands in. Only the direction
 * counts: a piece taken from across the board is struck the same way as one taken from the next point.
 */
export function headingOf(move: Move): Vector {
  const across = move.to.file - move.from.file;
  const down = move.to.rank - move.from.rank;
  const length = Math.hypot(across, down) || 1;

  return {x: across / length, y: down / length};
}
