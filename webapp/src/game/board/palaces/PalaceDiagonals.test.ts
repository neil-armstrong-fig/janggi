import {expect, it} from "vitest";
import {palaceDiagonalStepsAt} from "@src/game/board/palaces/PalaceDiagonals";

it("draws all four diagonals from the centre of a palace", () => {
  expect(palaceDiagonalStepsAt({file: 5, rank: 9})).toHaveLength(4);
});

it("draws one diagonal at a palace corner, and it points back at the centre", () => {
  expect(palaceDiagonalStepsAt({file: 4, rank: 8})).toEqual([{fileStep: 1, rankStep: 1}]);
  expect(palaceDiagonalStepsAt({file: 6, rank: 10})).toEqual([{fileStep: -1, rankStep: -1}]);
});

it("draws no diagonal at the middle of a palace edge", () => {
  expect(palaceDiagonalStepsAt({file: 5, rank: 8})).toEqual([]);
  expect(palaceDiagonalStepsAt({file: 4, rank: 9})).toEqual([]);
});

it("draws no diagonal anywhere outside a palace", () => {
  expect(palaceDiagonalStepsAt({file: 5, rank: 5})).toEqual([]);
  expect(palaceDiagonalStepsAt({file: 1, rank: 1})).toEqual([]);
});

it("draws the same X in both palaces", () => {
  expect(palaceDiagonalStepsAt({file: 4, rank: 1})).toEqual([{fileStep: 1, rankStep: 1}]);
  expect(palaceDiagonalStepsAt({file: 5, rank: 2})).toHaveLength(4);
});
