import type {CharacterGlyphStyle} from "@src/styles/types/PieceStyle";

/** The characters leaning, or upright where `slant` is undefined. */
export function withSlant(characterGlyphStyle: CharacterGlyphStyle, slant: number | undefined): CharacterGlyphStyle {
  if (slant !== undefined) return {...characterGlyphStyle, slant};

  const {slant: _, ...upright} = characterGlyphStyle;

  return upright;
}
