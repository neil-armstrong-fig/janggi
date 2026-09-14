import {expect, it} from "vitest";
import {uciOf} from "@src/bot/notation/UciOf";

it("writes cho's left chariot stepping up as Fairy-Stockfish lists it from the opening", () => {
  expect(uciOf({from: {file: 1, rank: 10}, to: {file: 1, rank: 9}})).toBe("a1a2");
});

it("counts ranks up from cho's edge, so han's back rank is the tenth", () => {
  expect(uciOf({from: {file: 2, rank: 1}, to: {file: 3, rank: 3}})).toBe("b10c8");
});

it("letters the files a to i from left to right", () => {
  expect(uciOf({from: {file: 9, rank: 7}, to: {file: 8, rank: 7}})).toBe("i4h4");
});
