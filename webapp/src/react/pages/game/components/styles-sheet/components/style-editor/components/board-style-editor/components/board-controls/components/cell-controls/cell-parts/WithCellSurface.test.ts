import {expect, it} from "vitest";
import {withCellSurface} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/board-style-editor/components/board-controls/components/cell-controls/cell-parts/WithCellSurface";

const CELL = {stroke: "#111111", strokeWidth: 1};

it("paints a background behind the cell", () => {
  expect(withCellSurface(CELL, "#222222")).toEqual({...CELL, surface: "#222222"});
});

it("lets the board's show through again", () => {
  expect(withCellSurface({...CELL, surface: "#222222"}, undefined)).toEqual(CELL);
});
