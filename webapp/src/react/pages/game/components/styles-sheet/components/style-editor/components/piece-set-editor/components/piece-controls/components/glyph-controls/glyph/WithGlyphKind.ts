import type {
  CharacterGlyphStyle,
  PictographGlyphStyle,
  PieceGlyphKind,
  PieceGlyphStyle,
} from "@src/styles/types/PieceStyle";
import {HANJA_CHARACTERS} from "@src/react/pages/game/components/board/piece-styles/builtin/marks/HanjaCharacters";
import {JANGGI_PICTOGRAPHS} from "@src/react/pages/game/components/board/piece-styles/builtin/modern/marks/JanggiPictographs";
import {FONT_STACKS} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/components/piece-controls/components/glyph-controls/font/FontStacks";

/**
 * The mark on a piece changed from writing to drawings, or back — keeping its colour and its size, and
 * beginning from the writing (hanja) or the drawings the app ships with, which the controls then change.
 * A glyph that is already that kind is returned as it is.
 */
export function withGlyphKind(pieceGlyphStyle: PieceGlyphStyle, pieceGlyphKind: PieceGlyphKind): PieceGlyphStyle {
  if (pieceGlyphStyle.kind === pieceGlyphKind) return pieceGlyphStyle;

  if (pieceGlyphStyle.kind === "character") return pictographs(pieceGlyphStyle);

  return characters(pieceGlyphStyle);
}

function pictographs({colour, scale}: CharacterGlyphStyle): PictographGlyphStyle {
  return {kind: "pictograph", pictographs: JANGGI_PICTOGRAPHS, colour, scale};
}

function characters({colour, scale}: PictographGlyphStyle): CharacterGlyphStyle {
  return {
    kind: "character",
    characters: HANJA_CHARACTERS,
    colour,
    scale,
    fontFamily: FONT_STACKS[0].css,
    fontWeight: 600,
  };
}
