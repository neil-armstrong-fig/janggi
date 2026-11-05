import {expect, it} from "vitest";
import {isOutOfTime} from "@src/redux/clock/spending/IsOutOfTime";

it("is so with nothing left", () => {
  expect(isOutOfTime({freeMs: 0, periods: 0})).toBe(true);
});

it("is not so with free time or a period left", () => {
  expect(isOutOfTime({freeMs: 1, periods: 0})).toBe(false);
  expect(isOutOfTime({freeMs: 0, periods: 1})).toBe(false);
});
