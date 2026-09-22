import {expect, it} from "vitest";
import {hanjaPieces} from "@src/react/pages/game/components/board/piece-styles/builtin/hanja/HanjaPieces";
import type {CharacterGlyphStyle} from "@src/styles/types/PieceStyle";
import {withSlant} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/components/piece-controls/components/glyph-controls/components/character-controls/character-glyph/WithSlant";

const characterGlyphStyle = hanjaPieces.sides.cho.glyph as CharacterGlyphStyle;

it("leans the characters", () => {
  expect(withSlant(characterGlyphStyle, 10).slant).toBe(10);
});

it("stands them upright again", () => {
  expect(withSlant({...characterGlyphStyle, slant: 10}, undefined)).not.toHaveProperty("slant");
});
