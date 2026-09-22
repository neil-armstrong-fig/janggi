import type {Side} from "@janggi/shared/janggi/pieces/Side";

/** One army's piece set, chosen apart from the other's. */
export interface ArmyPieceSetChoice {
  readonly side: Side;
  /** The name of a built-in piece set or one of the player's own. */
  readonly name: string;
}
