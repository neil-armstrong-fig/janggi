import type {Side} from "@janggi/shared/janggi/pieces/Side";

/** A turn an army has finished: when it ended, and whether the other army's clock runs on from there. */
export interface ChargedTurn {
  readonly side: Side;
  readonly at: number;
  readonly runsOn: boolean;
}
