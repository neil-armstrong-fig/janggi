import {classicStyle} from "@src/react/pages/game/components/board/cell-styles/builtin/ClassicStyle";
import {expect, it} from "vitest";
import {withCellStyle} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/board-style-editor/cell-style/WithCellStyle";

const POINT = {file: 5, rank: 5} as const;
const OWN = {stroke: "#00ff00", strokeWidth: 2};
const MARKER = {shape: "dot", radius: 5, colour: "#fff"} as const;

it("changes the style every point wears, when that is what is being changed", () => {
  const changedBoardStyle = withCellStyle(classicStyle, {kind: "default"}, cellStyle => ({
    ...cellStyle,
    stroke: "#ff0000",
  }));

  expect(changedBoardStyle.defaultCell).toEqual({...classicStyle.defaultCell, stroke: "#ff0000"});
  expect(changedBoardStyle.cells).toBeUndefined();
});

it("changes every point with a style of its own as well, since every point means every point", () => {
  const board = {
    ...classicStyle,
    cells: {f5r5: OWN, f1r1: {...OWN, marker: MARKER}},
  };

  const changedBoardStyle = withCellStyle(board, {kind: "default"}, cellStyle => ({...cellStyle, stroke: "#ff0000"}));

  expect(changedBoardStyle.cells?.f5r5).toEqual({...OWN, stroke: "#ff0000"});
  expect(changedBoardStyle.cells?.f1r1).toEqual({...OWN, stroke: "#ff0000", marker: MARKER});
});

it("gives a point a style of its own, made from what it wore, changing only what was asked", () => {
  const changedBoardStyle = withCellStyle(classicStyle, {kind: "point", position: POINT}, cellStyle => ({
    ...cellStyle,
    strokeWidth: 3,
  }));

  expect(changedBoardStyle.cells).toEqual({f5r5: {...classicStyle.defaultCell, strokeWidth: 3}});
  expect(changedBoardStyle.defaultCell).toBe(classicStyle.defaultCell);
});

it("changes a point that already has a style of its own from that, and leaves the others", () => {
  const other = {stroke: "#0000ff", strokeWidth: 1};
  const board = {...classicStyle, cells: {f5r5: OWN, f1r1: other}};

  const changedBoardStyle = withCellStyle(board, {kind: "point", position: POINT}, cellStyle => ({
    ...cellStyle,
    strokeWidth: 4,
  }));

  expect(changedBoardStyle.cells).toEqual({f5r5: {...OWN, strokeWidth: 4}, f1r1: other});
});

it("does not touch the style it was given", () => {
  withCellStyle(classicStyle, {kind: "point", position: POINT}, cellStyle => ({...cellStyle, strokeWidth: 3}));

  expect(classicStyle.cells).toBeUndefined();
});
