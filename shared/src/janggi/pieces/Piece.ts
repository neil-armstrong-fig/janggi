import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/** A piece's identity: which army it belongs to, and what it is. */
export interface Piece {
  readonly side: Side;
  readonly type: PieceType;
}
