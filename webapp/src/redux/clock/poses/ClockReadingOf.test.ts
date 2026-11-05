import {clockReadingOf} from "@src/redux/clock/poses/ClockReadingOf";
import {expect, it} from "vitest";

const FIVE_MINUTES = {minutes: 5, periodSeconds: 30, periods: 3};

it("starts both armies on all their free time", () => {
  expect(clockReadingOf(FIVE_MINUTES, "Start", true)).toEqual({state: "free", seconds: 300, periods: 3});
  expect(clockReadingOf(FIVE_MINUTES, "Start", false)).toEqual({state: "free", seconds: 300, periods: 3});
});

it("starts in the first period where there is no free time", () => {
  const noFreeTime = {minutes: 0, periodSeconds: 40, periods: 30};

  expect(clockReadingOf(noFreeTime, "Start", true)).toEqual({state: "overtime", seconds: 40, periods: 30});
});

it("poses only the army to move", () => {
  expect(clockReadingOf(FIVE_MINUTES, "Time lost", true)).toEqual({state: "lost", seconds: 0, periods: 0});
  expect(clockReadingOf(FIVE_MINUTES, "Time lost", false).state).toBe("free");
});
