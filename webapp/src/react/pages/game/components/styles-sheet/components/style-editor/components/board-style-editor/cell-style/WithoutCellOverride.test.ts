import {classicStyle} from "@src/react/pages/game/components/board/cell-styles/builtin/ClassicStyle";
import {expect, it} from "vitest";
import {withoutCellOverride} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/board-style-editor/cell-style/WithoutCellOverride";

const OWN = {stroke: "#00ff00", strokeWidth: 2};

it("takes back a point's own style, leaving the others", () => {
  const board = {...classicStyle, cells: {f5r5: OWN, f1r1: OWN}};

  expect(withoutCellOverride(board, {file: 5, rank: 5}).cells).toEqual({f1r1: OWN});
});

it("leaves no empty list of overrides behind when it was the only one", () => {
  const board = {...classicStyle, cells: {f5r5: OWN}};

  expect(withoutCellOverride(board, {file: 5, rank: 5})).not.toHaveProperty("cells");
});

it("leaves a board as it is when the point had no style of its own", () => {
  expect(withoutCellOverride(classicStyle, {file: 5, rank: 5})).toBe(classicStyle);
  expect(withoutCellOverride({...classicStyle, cells: {f1r1: OWN}}, {file: 5, rank: 5}).cells).toEqual({f1r1: OWN});
});
