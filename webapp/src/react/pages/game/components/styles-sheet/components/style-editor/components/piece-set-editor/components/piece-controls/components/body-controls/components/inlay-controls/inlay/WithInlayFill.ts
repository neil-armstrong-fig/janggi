import type {PieceInlayStyle} from "@src/styles/types/PieceStyle";

/** The inlay filled, or letting the body's own fill show through where `fill` is undefined. */
export function withInlayFill(pieceInlayStyle: PieceInlayStyle, fill: string | undefined): PieceInlayStyle {
  if (fill !== undefined) return {...pieceInlayStyle, fill};

  const {fill: _, ...open} = pieceInlayStyle;

  return open;
}
