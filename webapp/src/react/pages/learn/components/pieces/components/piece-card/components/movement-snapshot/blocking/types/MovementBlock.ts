import type {MovementPoint} from "@src/react/pages/learn/components/pieces/components/piece-card/components/movement-snapshot/types/MovementPoint";

/** The two turns an example takes at standing a piece in the way, one after the other. Still, both stand at once. */
export type BlockTurn = "first" | "second";

/** A piece stood in the way of a horse or elephant, for one turn of the example's loop. */
export interface MovementBlock {
  readonly turn: BlockTurn;
  readonly at: MovementPoint;
}
