import {expect, it} from "vitest";
import {hangulPieces} from "@src/react/pages/game/components/board/piece-styles/builtin/hangul/HangulPieces";
import {piecesFromText} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/pieces-text/PiecesFromText";
import {writtenOut} from "@src/react/pages/game/components/styles-sheet/components/style-editor/hooks/use-style-draft/written-out/WrittenOut";

it("reads back a piece set as it was written out, name aside", () => {
  expect(piecesFromText(writtenOut(hangulPieces))).toEqual({
    kind: "accepted",
    value: {...hangulPieces, name: expect.any(String)},
  });
});

it("refuses a piece too big to draw, and says where", () => {
  const text = JSON.stringify({
    ...hangulPieces,
    sides: {...hangulPieces.sides, han: {...hangulPieces.sides.han, size: 3}},
  });

  expect(piecesFromText(text)).toEqual({kind: "refused", reason: expect.stringContaining("style.sides.han.size")});
});
