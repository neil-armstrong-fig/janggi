import type {Piece} from "@janggi/shared/janggi/pieces/Piece";
import type {PieceOverrides, PieceSetStyle} from "@src/styles/types/PieceSetStyle";
import {toPieceKey} from "@janggi/shared/janggi/pieces/ToPieceKey";

/** The set with a piece's own style taken back, so it wears what the rest of its army do. */
export function withoutPieceOverride(pieceSetStyle: PieceSetStyle, piece: Piece): PieceSetStyle {
  if (pieceSetStyle.pieces === undefined) return pieceSetStyle;

  const key = toPieceKey(piece);
  const remainingPieceOverrides: PieceOverrides = Object.fromEntries(
    Object.entries(pieceSetStyle.pieces).filter(([own]) => own !== key),
  );
  const {pieces: _, ...withoutPieces} = pieceSetStyle;

  return Object.keys(remainingPieceOverrides).length === 0
    ? withoutPieces
    : {...pieceSetStyle, pieces: remainingPieceOverrides};
}
