import type {Side} from "@janggi/shared/janggi/pieces/Side";

/** One army's board, chosen apart from the other's. */
export interface ArmyBoardStyleChoice {
  readonly side: Side;
  /** The name of a built-in board or one of the player's own. */
  readonly name: string;
}
