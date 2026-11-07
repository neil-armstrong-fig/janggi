import {clockAfterCharge} from "@src/redux/slices/clock/spending/ClockAfterCharge";
import {expect, it} from "vitest";
import type {ClockSliceState} from "@src/redux/slices/clock/types/ClockSliceState";

const RUNNING: ClockSliceState = {
  name: "5 min",
  formatWhenOn: "5 min",
  custom: {minutes: 10, periodSeconds: 30, periods: 3},
  armies: {cho: {freeMs: 300_000, periods: 3}, han: {freeMs: 300_000, periods: 3}},
  turnStartedAt: 1000,
};

it("charges only the army that took the turn, and runs on from when it ended", () => {
  const charged = clockAfterCharge(RUNNING, {side: "han", at: 61_000, runsOn: true});

  expect(charged.armies).toEqual({cho: {freeMs: 300_000, periods: 3}, han: {freeMs: 240_000, periods: 3}});
  expect(charged.turnStartedAt).toBe(61_000);
});

it("stops where the game has ended", () => {
  expect(clockAfterCharge(RUNNING, {side: "han", at: 61_000, runsOn: false}).turnStartedAt).toBeUndefined();
});

it("stops where the turn overran", () => {
  const charged = clockAfterCharge(RUNNING, {side: "han", at: 1_000_000, runsOn: true});

  expect(charged.armies?.han).toEqual({freeMs: 0, periods: 0});
  expect(charged.turnStartedAt).toBeUndefined();
});

it("has nothing to charge where no clock is running", () => {
  const stopped = {...RUNNING, turnStartedAt: undefined};

  expect(clockAfterCharge(stopped, {side: "han", at: 61_000, runsOn: true})).toBe(stopped);
});

it("has nothing to charge where the clock is off", () => {
  const off: ClockSliceState = {...RUNNING, name: "Off", armies: undefined};

  expect(clockAfterCharge(off, {side: "han", at: 61_000, runsOn: true})).toBe(off);
});
