import {expect, it} from "vitest";
import {withCharacter} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/components/piece-controls/components/glyph-controls/components/character-controls/character-glyph/WithCharacter";
import type {CharacterGlyphStyle} from "@src/styles/types/PieceStyle";
import {hangulPieces} from "@src/react/pages/game/components/board/piece-styles/builtin/hangul/HangulPieces";

const characterGlyphStyle = hangulPieces.sides.cho.glyph as CharacterGlyphStyle;

it("writes something else on one kind of piece, and leaves the rest as they were", () => {
  const changedCharacterGlyphStyle = withCharacter(characterGlyphStyle, {side: "cho", type: "chariot"}, "X");

  expect(changedCharacterGlyphStyle.characters.chariot).toBe("X");
  expect(changedCharacterGlyphStyle.characters.horse).toBe(characterGlyphStyle.characters.horse);
});

it("changes only the army asked for, where a piece is written differently for each", () => {
  const split = {
    ...characterGlyphStyle,
    characters: {...characterGlyphStyle.characters, general: {han: "漢", cho: "楚"}},
  };

  expect(withCharacter(split, {side: "cho", type: "general"}, "X").characters.general).toEqual({han: "漢", cho: "X"});
});
