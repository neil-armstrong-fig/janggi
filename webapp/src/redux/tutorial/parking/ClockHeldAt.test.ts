import {expect, it} from "vitest";
import {FIRST_CLOCK} from "@src/redux/clock/first-clock/FirstClock";
import {clockHeldAt} from "@src/redux/tutorial/parking/ClockHeldAt";

it("holds what a timed turn has spent, and stops timing it", () => {
  const held = clockHeldAt({...FIRST_CLOCK, turnStartedAt: 1_000}, 4_500);

  expect(held.turnStartedAt).toBeUndefined();
  expect(held.heldMs).toBe(3_500);
});

it("leaves a clock that is timing no turn as it is", () => {
  const clock = {...FIRST_CLOCK, heldMs: 200};

  expect(clockHeldAt(clock, 4_500)).toBe(clock);
});
