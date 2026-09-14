import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";

/** A lost piece, with a key numbering it among the others of its kind. */
export interface KeyedPiece {
  readonly type: PieceType;
  readonly key: string;
}
