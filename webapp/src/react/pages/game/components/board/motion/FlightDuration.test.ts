import {expect, it} from "vitest";
import {flightDuration} from "@src/react/pages/game/components/board/motion/FlightDuration";

it("takes about a fifth of a second for a single step", () => {
  const step = flightDuration({from: {file: 1, rank: 7}, to: {file: 1, rank: 6}});

  expect(step).toBeGreaterThanOrEqual(150);
  expect(step).toBeLessThanOrEqual(250);
});

it("takes longer the further a piece travels", () => {
  const short = flightDuration({from: {file: 1, rank: 10}, to: {file: 1, rank: 8}});
  const long = flightDuration({from: {file: 1, rank: 10}, to: {file: 1, rank: 4}});

  expect(long).toBeGreaterThan(short);
});

it("never takes longer than a third of a second, however far", () => {
  expect(flightDuration({from: {file: 1, rank: 10}, to: {file: 1, rank: 1}})).toBeLessThanOrEqual(334);
});

it("counts a step down a palace diagonal as one point, like a step along a line", () => {
  const diagonal = flightDuration({from: {file: 4, rank: 8}, to: {file: 5, rank: 9}});
  const straight = flightDuration({from: {file: 4, rank: 8}, to: {file: 4, rank: 9}});

  expect(diagonal).toBe(straight);
});
