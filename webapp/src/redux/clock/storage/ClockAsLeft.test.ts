import {clockAsLeft} from "@src/redux/clock/storage/ClockAsLeft";
import {expect, it} from "vitest";
import {FIRST_CLOCK} from "@src/redux/clock/first-clock/FirstClock";

it("stamps a clock with a turn being timed", () => {
  const running = {...FIRST_CLOCK, turnStartedAt: 1000};

  expect(clockAsLeft(running, 5000)).toEqual({...running, leftAt: 5000});
});

it("leaves a clock with nothing being timed as it is", () => {
  expect(clockAsLeft(FIRST_CLOCK, 5000)).toBe(FIRST_CLOCK);
});
