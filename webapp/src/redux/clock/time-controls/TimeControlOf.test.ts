import {expect, it} from "vitest";
import {timeControlOf} from "@src/redux/clock/time-controls/TimeControlOf";

const WRITTEN_OUT = {minutes: 7, periodSeconds: 40, periods: 5};

it("is nothing when the clock is off", () => {
  expect(timeControlOf("Off", WRITTEN_OUT)).toBeUndefined();
});

it("is the free time named, with 30 seconds three times over", () => {
  expect(timeControlOf("20 min", WRITTEN_OUT)).toEqual({minutes: 20, periodSeconds: 30, periods: 3});
});

it("is what was written out for Custom", () => {
  expect(timeControlOf("Custom", WRITTEN_OUT)).toEqual(WRITTEN_OUT);
});
