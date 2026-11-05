import type {Piece} from "@janggi/shared/janggi/pieces/Piece";
import type {PieceKey} from "@janggi/shared/janggi/pieces/PieceKey";

/** A piece's identity as one string. The inverse of `parsePieceKey`. */
export function toPieceKey({side, type}: Piece): PieceKey {
  return `${side}-${type}`;
}
