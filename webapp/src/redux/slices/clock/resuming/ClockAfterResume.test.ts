import {clockAfterResume} from "@src/redux/slices/clock/resuming/ClockAfterResume";
import {expect, it} from "vitest";
import {FIRST_CLOCK} from "@src/redux/slices/clock/first-clock/FirstClock";

it("starts the turn as long ago as it had already run", () => {
  expect(clockAfterResume({...FIRST_CLOCK, heldMs: 20_000}, 100_000)).toEqual({
    ...FIRST_CLOCK,
    turnStartedAt: 80_000,
    heldMs: undefined,
  });
});

it("starts nothing where nothing is held", () => {
  expect(clockAfterResume(FIRST_CLOCK, 100_000)).toBe(FIRST_CLOCK);
});
