import type {Position} from "@src/game/board/types/Position";

/** Every point that has no style of its own. */
interface DefaultTarget {
  readonly kind: "default";
}

/** One point, given a style of its own. */
interface PointTarget {
  readonly kind: "point";
  readonly position: Position;
}

/** What the board controls are changing: the style every point wears unless told otherwise, or one point. */
export type BoardTarget = DefaultTarget | PointTarget;
