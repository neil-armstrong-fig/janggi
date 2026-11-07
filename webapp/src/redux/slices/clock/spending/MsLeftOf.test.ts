import {clockAfterTurn} from "@src/redux/slices/clock/spending/ClockAfterTurn";
import {expect, it} from "vitest";
import {isOutOfTime} from "@src/redux/slices/clock/spending/IsOutOfTime";
import {msLeftOf} from "@src/redux/slices/clock/spending/MsLeftOf";

const FORMAT = {minutes: 5, periodSeconds: 30, periods: 3};

it("is all the free time and every period", () => {
  expect(msLeftOf({freeMs: 10_000, periods: 2}, FORMAT)).toBe(70_000);
});

it("is exactly when the arithmetic says the army has lost", () => {
  const armyClock = {freeMs: 10_000, periods: 2};
  const msLeft = msLeftOf(armyClock, FORMAT);

  expect(isOutOfTime(clockAfterTurn(armyClock, FORMAT, msLeft - 1))).toBe(false);
  expect(isOutOfTime(clockAfterTurn(armyClock, FORMAT, msLeft))).toBe(true);
});
