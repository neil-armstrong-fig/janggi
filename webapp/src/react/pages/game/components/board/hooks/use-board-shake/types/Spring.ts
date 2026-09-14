import type {Vector} from "@src/react/pages/game/components/board/types/Vector";

/** How far the shaken board is pushed from where it belongs, and how fast it is moving. */
export interface Spring {
  readonly position: Vector;
  readonly velocity: Vector;
}
