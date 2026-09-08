import {expect, it} from "vitest";
import {pointAfterStep} from "@src/game/moves/utils/PointAfterStep";

it("takes one step in the direction it is given", () => {
  expect(pointAfterStep({file: 5, rank: 5}, {fileStep: 1, rankStep: -1})).toEqual({file: 6, rank: 4});
});

it("crosses several files and ranks in one step", () => {
  expect(pointAfterStep({file: 3, rank: 10}, {fileStep: 2, rankStep: -3})).toEqual({file: 5, rank: 7});
});

it("finds nothing past the end of a file", () => {
  expect(pointAfterStep({file: 5, rank: 1}, {fileStep: 0, rankStep: -1})).toBeUndefined();
  expect(pointAfterStep({file: 5, rank: 10}, {fileStep: 0, rankStep: 1})).toBeUndefined();
});

it("finds nothing past the edge of a rank", () => {
  expect(pointAfterStep({file: 1, rank: 5}, {fileStep: -1, rankStep: 0})).toBeUndefined();
  expect(pointAfterStep({file: 9, rank: 5}, {fileStep: 1, rankStep: 0})).toBeUndefined();
});

it("finds nothing when only one of the two axes leaves the board", () => {
  expect(pointAfterStep({file: 9, rank: 5}, {fileStep: 1, rankStep: -1})).toBeUndefined();
});
