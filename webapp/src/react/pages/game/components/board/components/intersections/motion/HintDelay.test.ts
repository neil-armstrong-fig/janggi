import {expect, it} from "vitest";
import {hintDelay} from "@src/react/pages/game/components/board/components/intersections/motion/HintDelay";

const HELD = {file: 1, rank: 10} as const;

it("shows the marks next to the piece straight away", () => {
  expect(hintDelay(HELD, {file: 1, rank: 9})).toBe(0);
  expect(hintDelay(HELD, {file: 2, rank: 10})).toBe(0);
});

it("shows a further mark later than a nearer one", () => {
  expect(hintDelay(HELD, {file: 1, rank: 5})).toBeGreaterThan(hintDelay(HELD, {file: 1, rank: 8}));
});

it("shows marks the same distance away together, whichever way they lie", () => {
  expect(hintDelay({file: 5, rank: 5}, {file: 5, rank: 2})).toBe(hintDelay({file: 5, rank: 5}, {file: 8, rank: 5}));
});

it("shows even the furthest mark within a fifth of a second", () => {
  expect(hintDelay(HELD, {file: 1, rank: 1})).toBeLessThanOrEqual(200);
});
