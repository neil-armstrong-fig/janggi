import type {PieceBodyStyle, PieceInlayStyle} from "@src/styles/types/PieceStyle";

/** The body with an inlay drawn inside it, or without one where `inlay` is undefined. */
export function withInlay(
  pieceBodyStyle: PieceBodyStyle,
  pieceInlayStyle: PieceInlayStyle | undefined,
): PieceBodyStyle {
  if (pieceInlayStyle !== undefined) return {...pieceBodyStyle, inlay: pieceInlayStyle};

  const {inlay: _, ...bare} = pieceBodyStyle;

  return bare;
}
