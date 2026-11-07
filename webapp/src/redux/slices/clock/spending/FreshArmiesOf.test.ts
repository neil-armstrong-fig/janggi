import {expect, it} from "vitest";
import {freshArmiesOf} from "@src/redux/slices/clock/spending/FreshArmiesOf";

it("gives both armies all their free time and every period", () => {
  const armyClock = {freeMs: 300_000, periods: 3};

  expect(freshArmiesOf({minutes: 5, periodSeconds: 30, periods: 3})).toEqual({cho: armyClock, han: armyClock});
});

it("gives neither army anything where the clock is off", () => {
  expect(freshArmiesOf(undefined)).toBeUndefined();
});
