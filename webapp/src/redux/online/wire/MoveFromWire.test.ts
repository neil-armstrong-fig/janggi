import {expect, it} from "vitest";
import {moveFromWire} from "@src/redux/online/wire/MoveFromWire";

it("reads a move on the board", () => {
  expect(moveFromWire({from: {file: 1, rank: 7}, to: {file: 9, rank: 10}})).toEqual({
    from: {file: 1, rank: 7},
    to: {file: 9, rank: 10},
  });
});

it.each([
  [{file: 0, rank: 1}],
  [{file: 10, rank: 1}],
  [{file: 1, rank: 0}],
  [{file: 1, rank: 11}],
  [{file: 1.5, rank: 1}],
  [{file: Number.NaN, rank: 1}],
])("refuses a point off the board, %j, at either end", point => {
  expect(moveFromWire({from: point, to: {file: 1, rank: 1}})).toBeUndefined();
  expect(moveFromWire({from: {file: 1, rank: 1}, to: point})).toBeUndefined();
});
