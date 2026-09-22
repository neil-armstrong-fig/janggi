import type {CharacterGlyphStyle} from "@src/styles/types/PieceStyle";
import type {Piece} from "@janggi/shared/janggi/pieces/Piece";

/**
 * The glyph with what is written on one kind of piece changed for one army. A piece the set writes the same
 * for both armies is written the same still; one it writes differently keeps the other army's as it was.
 */
export function withCharacter(
  characterGlyphStyle: CharacterGlyphStyle,
  {side, type}: Piece,
  text: string,
): CharacterGlyphStyle {
  const writtenPieceCharacter = characterGlyphStyle.characters[type];
  const changed = typeof writtenPieceCharacter === "string" ? text : {...writtenPieceCharacter, [side]: text};

  return {...characterGlyphStyle, characters: {...characterGlyphStyle.characters, [type]: changed}};
}
