import {FILE_COUNT, RANK_COUNT} from "@src/game/board/BoardDimensions";
import type {PointBox} from "@src/react/pages/game/components/board/types/PointBox";
import type {Position} from "@src/game/board/types/Position";

/**
 * The box of the cell an intersection is drawn in, as fractions of the board.
 *
 * Arithmetic rather than measurement: the board is a grid of equal cells laid out in reading order,
 * so where a cell is follows from its file and rank alone. That is what lets something drawn over the
 * board — a piece in flight, a capture landing — be put on a point without asking the DOM where the
 * point ended up.
 */
export function pointBox(position: Position): PointBox {
  return {
    left: (position.file - 1) / FILE_COUNT,
    top: (position.rank - 1) / RANK_COUNT,
    width: 1 / FILE_COUNT,
    height: 1 / RANK_COUNT,
  };
}
