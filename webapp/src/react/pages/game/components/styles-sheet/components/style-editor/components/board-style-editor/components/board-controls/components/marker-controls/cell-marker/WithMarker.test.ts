import {expect, it} from "vitest";
import {withMarker} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/board-style-editor/components/board-controls/components/marker-controls/cell-marker/WithMarker";

const CELL = {stroke: "#111111", strokeWidth: 1};
const MARKER = {shape: "ring", radius: 14, colour: "#f2c14e", strokeWidth: 2} as const;

it("puts a marker on the cell", () => {
  expect(withMarker(CELL, MARKER)).toEqual({...CELL, marker: MARKER});
});

it("takes it off again", () => {
  expect(withMarker({...CELL, marker: MARKER}, undefined)).toEqual(CELL);
});
