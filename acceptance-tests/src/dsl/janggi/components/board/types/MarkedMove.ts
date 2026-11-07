import type {Point} from "@src/dsl/janggi/components/types/Point";

/** The two intersections the board marks a move on. */
export interface MarkedMove {
  readonly from: Point;
  readonly to: Point;
}
