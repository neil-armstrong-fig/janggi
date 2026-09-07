import type {BoardStyle} from "@src/react/pages/game/components/board/cell-styles/types/BoardStyle";
import {resolveCellStyle} from "@src/react/pages/game/components/board/components/cell/utils/ResolveCellStyle";
import {expect, it} from "vitest";

const style: BoardStyle = {
  name: "Test",
  surface: "black",
  defaultCell: {stroke: "grey", strokeWidth: 1},
  cells: {f5r2: {stroke: "red", strokeWidth: 2}},
};

it("uses the board default where a position has no override", () => {
  expect(resolveCellStyle(style, {file: 1, rank: 1})).toBe(style.defaultCell);
});

it("prefers the override for a position that has one", () => {
  expect(resolveCellStyle(style, {file: 5, rank: 2})).toEqual({stroke: "red", strokeWidth: 2});
});

it("falls back to the default when a style declares no overrides at all", () => {
  const bare: BoardStyle = {name: "Bare", surface: "white", defaultCell: style.defaultCell};

  expect(resolveCellStyle(bare, {file: 5, rank: 2})).toBe(bare.defaultCell);
});
