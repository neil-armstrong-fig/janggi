import {expect, it} from "vitest";
import {repeatMap} from "@janggi/shared/stdlib/Loops";

it("maps over each index", () => {
  expect(repeatMap(3, index => index * 2)).toEqual([0, 2, 4]);
});

it("returns an empty array when there is nothing to map", () => {
  expect(repeatMap(0, index => index)).toEqual([]);
});
