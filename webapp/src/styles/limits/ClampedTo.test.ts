import {clampedTo} from "@src/styles/limits/ClampedTo";
import {expect, it} from "vitest";

const RANGE = {least: 1, most: 10};

it("leaves a number in the range as it is", () => {
  expect(clampedTo(RANGE, 4.5)).toBe(4.5);
  expect(clampedTo(RANGE, 1)).toBe(1);
  expect(clampedTo(RANGE, 10)).toBe(10);
});

it("brings a number too large down to the largest", () => {
  expect(clampedTo(RANGE, 99)).toBe(10);
});

it("brings a number too small up to the smallest", () => {
  expect(clampedTo(RANGE, -3)).toBe(1);
});
