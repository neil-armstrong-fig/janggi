import {expect, it} from "vitest";
import {previewPieceAt} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/preview-pieces/PreviewPieceAt";

it("names the piece standing on a point of the opening", () => {
  expect(previewPieceAt({file: 5, rank: 9})).toEqual({side: "cho", type: "general"});
  expect(previewPieceAt({file: 1, rank: 1})).toEqual({side: "han", type: "chariot"});
});

it("names nothing on an empty point", () => {
  expect(previewPieceAt({file: 5, rank: 5})).toBeUndefined();
});
