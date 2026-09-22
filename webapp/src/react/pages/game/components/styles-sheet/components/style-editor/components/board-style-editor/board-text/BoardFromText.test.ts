import {boardFromText} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/board-style-editor/board-text/BoardFromText";
import {classicStyle} from "@src/react/pages/game/components/board/cell-styles/builtin/ClassicStyle";
import {expect, it} from "vitest";
import {writtenOut} from "@src/react/pages/game/components/styles-sheet/components/style-editor/hooks/use-style-draft/written-out/WrittenOut";

it("reads back a style as it was written out, name aside", () => {
  expect(boardFromText(writtenOut(classicStyle))).toEqual({
    kind: "accepted",
    value: {...classicStyle, name: expect.any(String)},
  });
});

it("refuses text that is not JSON, and says so", () => {
  expect(boardFromText("{")).toEqual({kind: "refused", reason: expect.stringContaining("not JSON")});
});

it("refuses a style the import check would, and says where", () => {
  const text = JSON.stringify({...classicStyle, defaultCell: {stroke: "#000", strokeWidth: 50}});

  expect(boardFromText(text)).toEqual({
    kind: "refused",
    reason: expect.stringContaining("style.defaultCell.strokeWidth"),
  });
});
