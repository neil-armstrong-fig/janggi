import {expect, it} from "vitest";
import {withDiagonals} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/board-style-editor/components/board-controls/components/cell-controls/cell-parts/WithDiagonals";

const GRID = {stroke: "#111111", strokeWidth: 1.5};

it("picks the diagonals out as the grid's own line to begin with, so nothing changes yet", () => {
  expect(withDiagonals(GRID, true)).toEqual({...GRID, diagonalStroke: "#111111", diagonalStrokeWidth: 1.5});
});

it("has them match the grid again by taking their own line back", () => {
  const picked = {...GRID, diagonalStroke: "#ff0000", diagonalStrokeWidth: 3};

  expect(withDiagonals(picked, false)).toEqual(GRID);
});
