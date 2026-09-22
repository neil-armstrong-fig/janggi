import type {Piece} from "@janggi/shared/janggi/pieces/Piece";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/** All of one army's pieces that have no style of their own. */
interface SideTarget {
  readonly kind: "side";
  readonly side: Side;
}

/** One piece, given a style of its own. */
interface SinglePieceTarget {
  readonly kind: "piece";
  readonly piece: Piece;
}

/** What the piece controls are changing: what an army wears unless told otherwise, or one piece. */
export type PieceTarget = SideTarget | SinglePieceTarget;
