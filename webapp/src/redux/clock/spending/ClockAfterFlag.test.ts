import {clockAfterFlag} from "@src/redux/clock/spending/ClockAfterFlag";
import {expect, it} from "vitest";
import type {ClockSliceState} from "@src/redux/clock/types/ClockSliceState";

const FRESH = {freeMs: 300_000, periods: 3};
const RUNNING: ClockSliceState = {
  name: "5 min",
  formatWhenOn: "5 min",
  custom: {minutes: 10, periodSeconds: 30, periods: 3},
  armies: {cho: FRESH, han: FRESH},
  turnStartedAt: 1000,
};

it("leaves that army nothing, and stops", () => {
  const flagged = clockAfterFlag(RUNNING, "han");

  expect(flagged.armies).toEqual({cho: FRESH, han: {freeMs: 0, periods: 0}});
  expect(flagged.turnStartedAt).toBeUndefined();
});

it("has no time to run out where the clock is off", () => {
  const off = {...RUNNING, armies: undefined};

  expect(clockAfterFlag(off, "han")).toBe(off);
});
