import type {Piece} from "./Piece.js";
import type {PieceKey} from "./PieceKey.js";

/** A piece's identity as one string. The inverse of `parsePieceKey`. */
export function toPieceKey({side, type}: Piece): PieceKey {
  return `${side}-${type}`;
}
