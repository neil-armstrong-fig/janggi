import type {Position} from "@janggi/engine/board/types/Position";

/** A line drawn across the board from the centre of one point to the centre of another. */
export interface BoardLine {
  readonly from: Position;
  readonly to: Position;
}
