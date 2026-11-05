import {clockReadingOf} from "@src/redux/clock/reading/ClockReadingOf";
import {expect, it} from "vitest";

const FORMAT = {minutes: 5, periodSeconds: 30, periods: 3};
const FRESH = {freeMs: 300_000, periods: 3};

it("shows all the free time before a turn has begun", () => {
  expect(clockReadingOf(FRESH, FORMAT, 0)).toEqual({state: "free", seconds: 300, periods: 3});
});

it("rounds seconds up", () => {
  expect(clockReadingOf(FRESH, FORMAT, 1)).toEqual({state: "free", seconds: 300, periods: 3});
  expect(clockReadingOf(FRESH, FORMAT, 1000)).toEqual({state: "free", seconds: 299, periods: 3});
  expect(clockReadingOf(FRESH, FORMAT, 300_001)).toEqual({state: "overtime", seconds: 30, periods: 3});
});

it("shows a whole period the moment free time runs out", () => {
  expect(clockReadingOf(FRESH, FORMAT, 300_000)).toEqual({state: "overtime", seconds: 30, periods: 3});
});

it("counts the period down", () => {
  expect(clockReadingOf(FRESH, FORMAT, 303_000)).toEqual({state: "overtime", seconds: 27, periods: 3});
});

it("counts a period from when free time ran out, whatever length the free time was", () => {
  const unevenFormat = {minutes: 1, periodSeconds: 40, periods: 3};

  expect(clockReadingOf({freeMs: 60_000, periods: 3}, unevenFormat, 70_000)).toEqual({
    state: "overtime",
    seconds: 30,
    periods: 3,
  });
});

it("is not low in the last of its free time while periods are still to come", () => {
  expect(clockReadingOf(FRESH, FORMAT, 295_000)).toEqual({state: "free", seconds: 5, periods: 3});
});

it("starts the next period whole once one is used up", () => {
  expect(clockReadingOf(FRESH, FORMAT, 330_000)).toEqual({state: "overtime", seconds: 30, periods: 2});
});

it("reads from what a turn left behind", () => {
  expect(clockReadingOf({freeMs: 0, periods: 2}, FORMAT, 12_000)).toEqual({state: "overtime", seconds: 18, periods: 2});
});

it("is not low with another period to come", () => {
  expect(clockReadingOf({freeMs: 0, periods: 2}, FORMAT, 25_000).state).toBe("overtime");
});

it("is low in the last ten seconds of the last period, and not before", () => {
  const lastPeriod = {freeMs: 0, periods: 1};

  expect(clockReadingOf(lastPeriod, FORMAT, 19_999).state).toBe("overtime");
  expect(clockReadingOf(lastPeriod, FORMAT, 20_000)).toEqual({state: "low", seconds: 10, periods: 1});
});

it("is lost once the last period runs out", () => {
  expect(clockReadingOf({freeMs: 0, periods: 1}, FORMAT, 30_000)).toEqual({state: "lost", seconds: 0, periods: 0});
});

it("starts in the first period where there is no free time", () => {
  const noFreeTime = {minutes: 0, periodSeconds: 40, periods: 30};

  expect(clockReadingOf({freeMs: 0, periods: 30}, noFreeTime, 0)).toEqual({
    state: "overtime",
    seconds: 40,
    periods: 30,
  });
});

it("is low in the last ten seconds of free time where there are no periods, then lost", () => {
  const noPeriods = {minutes: 5, periodSeconds: 30, periods: 0};
  const armyClock = {freeMs: 300_000, periods: 0};

  expect(clockReadingOf(armyClock, noPeriods, 289_999).state).toBe("free");
  expect(clockReadingOf(armyClock, noPeriods, 290_000)).toEqual({state: "low", seconds: 10, periods: 0});
  expect(clockReadingOf(armyClock, noPeriods, 300_000).state).toBe("lost");
});
