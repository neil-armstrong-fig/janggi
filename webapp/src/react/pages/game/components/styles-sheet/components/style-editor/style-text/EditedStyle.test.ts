import {classicStyle} from "@src/react/pages/game/components/board/cell-styles/builtin/ClassicStyle";
import {editedStyle} from "@src/react/pages/game/components/styles-sheet/components/style-editor/style-text/EditedStyle";
import {expect, it} from "vitest";
import {hangulPieces} from "@src/react/pages/game/components/board/piece-styles/builtin/hangul/HangulPieces";

const boardJson = JSON.stringify({...classicStyle, name: undefined});

it("makes a board style of the JSON, under the name given", () => {
  expect(editedStyle("Board", "Mine", boardJson)).toEqual({kind: "board", style: {...classicStyle, name: "Mine"}});
});

it("makes a piece set of the JSON, under the name given", () => {
  expect(editedStyle("Pieces", "Mine", JSON.stringify(hangulPieces))).toEqual({
    kind: "pieces",
    style: {...hangulPieces, name: "Mine"},
  });
});

it("takes the name from the name box over any name written in the JSON", () => {
  expect(editedStyle("Board", "Mine", JSON.stringify({...classicStyle, name: "Other"}))).toEqual({
    kind: "board",
    style: {...classicStyle, name: "Mine"},
  });
});

it("says so when the JSON will not parse", () => {
  expect(editedStyle("Board", "Mine", "{")).toEqual({kind: "refused", reason: expect.stringContaining("not JSON")});
});

it("refuses JSON that is not one object", () => {
  expect(editedStyle("Board", "Mine", "[]")).toEqual({
    kind: "refused",
    reason: expect.stringContaining("one JSON object"),
  });
});

it("refuses a built-in's name, of the kind being made", () => {
  expect(editedStyle("Board", " Classic ", boardJson)).toEqual({
    kind: "refused",
    reason: expect.stringContaining("Classic"),
  });
  expect(editedStyle("Pieces", "Hangul", JSON.stringify(hangulPieces))).toEqual({
    kind: "refused",
    reason: expect.stringContaining("Hangul"),
  });
});

it("allows a piece set a name only a board style has", () => {
  expect(editedStyle("Pieces", "Neon", JSON.stringify(hangulPieces))).toMatchObject({kind: "pieces"});
});

it("says what is wrong with a style that does not check out", () => {
  const tooWide = JSON.stringify({...classicStyle, defaultCell: {stroke: "#000", strokeWidth: 99}});

  expect(editedStyle("Board", "Mine", tooWide)).toEqual({
    kind: "refused",
    reason: expect.stringContaining("style.defaultCell.strokeWidth"),
  });
});

it("asks for a name where the box is empty, in words of its own", () => {
  for (const name of ["", "   "]) {
    expect(editedStyle("Board", name, boardJson)).toEqual({
      kind: "refused",
      reason: "Give your style a name before saving it.",
    });
  }
});
