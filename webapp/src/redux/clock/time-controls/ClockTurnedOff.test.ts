import {clockTurnedOff} from "@src/redux/clock/time-controls/ClockTurnedOff";
import {expect, it} from "vitest";
import {FIRST_CLOCK} from "@src/redux/clock/first-clock/FirstClock";

it("takes away the time, and keeps the format it was on and what was written out", () => {
  const custom = {minutes: 7, periodSeconds: 40, periods: 5};
  const armyClock = {freeMs: 420_000, periods: 5};

  expect(
    clockTurnedOff({
      name: "Custom",
      formatWhenOn: "Custom",
      custom,
      armies: {cho: armyClock, han: armyClock},
      turnStartedAt: 1000,
    }),
  ).toEqual({name: "Off", formatWhenOn: "Custom", custom, armies: undefined, turnStartedAt: undefined});
});

it("lets go of what a clock waiting to be resumed was holding", () => {
  expect(clockTurnedOff({...FIRST_CLOCK, name: "5 min", heldMs: 20_000}).heldMs).toBeUndefined();
});
