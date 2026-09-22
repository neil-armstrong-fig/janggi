import {JANGGI_PICTOGRAPHS} from "@src/react/pages/game/components/board/piece-styles/builtin/modern/marks/JanggiPictographs";
import {expect, it} from "vitest";
import type {PictographGlyphStyle} from "@src/styles/types/PieceStyle";
import {withPictograph} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/components/piece-controls/components/glyph-controls/components/pictograph-controls/pictograph/WithPictograph";

const pictographGlyphStyle: PictographGlyphStyle = {
  kind: "pictograph",
  pictographs: JANGGI_PICTOGRAPHS,
  colour: "#ffffff",
  scale: 0.7,
};

it("replaces the drawing of one kind of piece", () => {
  expect(withPictograph(pictographGlyphStyle, "horse", "M0 0 L10 10 Z").pictographs.horse).toBe("M0 0 L10 10 Z");
});

it("leaves the other six drawings, and the rest of the glyph, as they were", () => {
  const changedPictographGlyphStyle = withPictograph(pictographGlyphStyle, "horse", "M0 0 L10 10 Z");

  expect(changedPictographGlyphStyle.pictographs.chariot).toBe(JANGGI_PICTOGRAPHS.chariot);
  expect({...changedPictographGlyphStyle, pictographs: undefined}).toEqual({
    ...pictographGlyphStyle,
    pictographs: undefined,
  });
});
