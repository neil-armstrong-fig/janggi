import type {CharacterGlyphStyle} from "@src/styles/types/PieceStyle";
import type {WritingName} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/components/piece-controls/components/glyph-controls/components/character-controls/writing/WritingName";
import {WRITINGS} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/components/piece-controls/components/glyph-controls/components/character-controls/writing/Writings";

/** The glyph with everything written on its pieces swapped for one of the writings the app ships. */
export function withWriting(characterGlyphStyle: CharacterGlyphStyle, writingName: WritingName): CharacterGlyphStyle {
  return {...characterGlyphStyle, characters: WRITINGS[writingName]};
}
