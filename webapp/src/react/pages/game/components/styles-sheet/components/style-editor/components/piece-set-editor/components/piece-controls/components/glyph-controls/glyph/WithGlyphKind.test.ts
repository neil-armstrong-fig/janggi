import {JANGGI_PICTOGRAPHS} from "@src/react/pages/game/components/board/piece-styles/builtin/modern/marks/JanggiPictographs";
import {expect, it} from "vitest";
import {hangulPieces} from "@src/react/pages/game/components/board/piece-styles/builtin/hangul/HangulPieces";
import {withGlyphKind} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/components/piece-controls/components/glyph-controls/glyph/WithGlyphKind";

const writtenPieceGlyphStyle = hangulPieces.sides.cho.glyph;

it("changes writing to drawings, keeping the colour and the size", () => {
  const drawnPieceGlyphStyle = withGlyphKind(writtenPieceGlyphStyle, "pictograph");

  expect(drawnPieceGlyphStyle).toEqual({
    kind: "pictograph",
    pictographs: JANGGI_PICTOGRAPHS,
    colour: writtenPieceGlyphStyle.colour,
    scale: writtenPieceGlyphStyle.scale,
  });
});

it("changes drawings back to writing, keeping the colour and the size", () => {
  const backPieceGlyphStyle = withGlyphKind(withGlyphKind(writtenPieceGlyphStyle, "pictograph"), "character");

  expect(backPieceGlyphStyle).toMatchObject({
    kind: "character",
    colour: writtenPieceGlyphStyle.colour,
    scale: writtenPieceGlyphStyle.scale,
  });
});

it("leaves a glyph that is already that kind as it is", () => {
  expect(withGlyphKind(writtenPieceGlyphStyle, "character")).toBe(writtenPieceGlyphStyle);
});
