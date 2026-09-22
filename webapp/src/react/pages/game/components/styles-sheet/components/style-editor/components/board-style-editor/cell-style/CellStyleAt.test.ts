import {cellStyleAt} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/board-style-editor/cell-style/CellStyleAt";
import {classicStyle} from "@src/react/pages/game/components/board/cell-styles/builtin/ClassicStyle";
import {expect, it} from "vitest";

const OWN = {stroke: "#00ff00", strokeWidth: 2};
const board = {...classicStyle, cells: {f5r5: OWN}};

it("is what every point wears, for every point", () => {
  expect(cellStyleAt(board, {kind: "default"})).toBe(board.defaultCell);
});

it("is a point's own style where it has one, and what it wears otherwise", () => {
  expect(cellStyleAt(board, {kind: "point", position: {file: 5, rank: 5}})).toBe(OWN);
  expect(cellStyleAt(board, {kind: "point", position: {file: 1, rank: 1}})).toBe(board.defaultCell);
});
