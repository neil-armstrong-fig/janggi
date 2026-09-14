import {cellShapeAt} from "@src/react/pages/game/components/board/components/intersections/components/cell/utils/CellShapes";
import {expect, it} from "vitest";

it("leads nowhere off the board, so the outer border is drawn by the edge cells", () => {
  expect(cellShapeAt({file: 1, rank: 1}).orthogonals).toEqual(["south", "east"]);
  expect(cellShapeAt({file: 9, rank: 10}).orthogonals).toEqual(["north", "west"]);
});

it("crosses four ways in the middle of the board", () => {
  expect(cellShapeAt({file: 5, rank: 5}).orthogonals).toEqual(["north", "south", "west", "east"]);
});

it("has no diagonals outside a palace", () => {
  expect(cellShapeAt({file: 5, rank: 5}).diagonals).toEqual([]);
  expect(cellShapeAt({file: 3, rank: 2}).diagonals).toEqual([]);
});

it("draws the full X at the centre of each palace", () => {
  expect(cellShapeAt({file: 5, rank: 2}).diagonals).toHaveLength(4);
  expect(cellShapeAt({file: 5, rank: 9}).diagonals).toHaveLength(4);
});

it("points each palace corner back at its centre", () => {
  expect(cellShapeAt({file: 4, rank: 1}).diagonals).toEqual(["southEast"]);
  expect(cellShapeAt({file: 6, rank: 1}).diagonals).toEqual(["southWest"]);
  expect(cellShapeAt({file: 4, rank: 3}).diagonals).toEqual(["northEast"]);
  expect(cellShapeAt({file: 6, rank: 10}).diagonals).toEqual(["northWest"]);
});

it("leaves the palace edge midpoints off the X", () => {
  expect(cellShapeAt({file: 5, rank: 1}).diagonals).toEqual([]);
  expect(cellShapeAt({file: 4, rank: 2}).diagonals).toEqual([]);
});
