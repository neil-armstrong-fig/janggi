import type {CharacterGlyphStyle} from "@src/styles/types/PieceStyle";
import {expect, it} from "vitest";
import {hangulPieces} from "@src/react/pages/game/components/board/piece-styles/builtin/hangul/HangulPieces";
import {withWriting} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/components/piece-controls/components/glyph-controls/components/character-controls/character-glyph/WithWriting";
import {WRITINGS} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/components/piece-controls/components/glyph-controls/components/character-controls/writing/Writings";

const characterGlyphStyle = hangulPieces.sides.cho.glyph as CharacterGlyphStyle;

it("swaps everything written on the pieces for a shipped writing, and nothing else", () => {
  const changedCharacterGlyphStyle = withWriting(characterGlyphStyle, "Hanja");

  expect(changedCharacterGlyphStyle.characters).toBe(WRITINGS.Hanja);
  expect({...changedCharacterGlyphStyle, characters: undefined}).toEqual({
    ...characterGlyphStyle,
    characters: undefined,
  });
});
