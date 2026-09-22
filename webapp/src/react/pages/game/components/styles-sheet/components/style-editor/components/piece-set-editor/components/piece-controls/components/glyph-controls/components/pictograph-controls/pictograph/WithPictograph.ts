import type {PictographGlyphStyle} from "@src/styles/types/PieceStyle";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";

/** The glyph with the drawing of one kind of piece replaced, and the other six as they were. */
export function withPictograph(
  pictographGlyphStyle: PictographGlyphStyle,
  pieceType: PieceType,
  path: string,
): PictographGlyphStyle {
  return {...pictographGlyphStyle, pictographs: {...pictographGlyphStyle.pictographs, [pieceType]: path}};
}
