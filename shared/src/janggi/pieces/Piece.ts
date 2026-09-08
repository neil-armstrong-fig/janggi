import type {PieceType} from "./PieceType.js";
import type {Side} from "./Side.js";

/** A piece's identity: which army it belongs to, and what it is. */
export interface Piece {
  readonly side: Side;
  readonly type: PieceType;
}
