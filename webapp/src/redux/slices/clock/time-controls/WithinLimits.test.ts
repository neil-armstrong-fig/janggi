import {expect, it} from "vitest";
import {withinLimits} from "@src/redux/slices/clock/time-controls/WithinLimits";

it("leaves a format within its limits alone", () => {
  const format = {minutes: 7, periodSeconds: 40, periods: 5};

  expect(withinLimits(format)).toEqual(format);
});

it("allows five minutes and thirty periods of thirty seconds", () => {
  const format = {minutes: 5, periodSeconds: 30, periods: 30};

  expect(withinLimits(format)).toEqual(format);
});

it("brings each figure down to its most", () => {
  expect(withinLimits({minutes: 999, periodSeconds: 999, periods: 999})).toEqual({
    minutes: 180,
    periodSeconds: 120,
    periods: 60,
  });
});

it("brings each figure up to its least", () => {
  expect(withinLimits({minutes: -1, periodSeconds: 2, periods: 3})).toEqual({
    minutes: 0,
    periodSeconds: 5,
    periods: 3,
  });
});

it("drops anything after the point", () => {
  expect(withinLimits({minutes: 1.5, periodSeconds: 30.9, periods: 2.2})).toEqual({
    minutes: 1,
    periodSeconds: 30,
    periods: 2,
  });
});

it("gives one period to a format with no time in it", () => {
  expect(withinLimits({minutes: 0, periodSeconds: 30, periods: 0})).toEqual({
    minutes: 0,
    periodSeconds: 30,
    periods: 1,
  });
});

it("allows no free time, with periods", () => {
  const format = {minutes: 0, periodSeconds: 40, periods: 30};

  expect(withinLimits(format)).toEqual(format);
});

it("allows no periods, with free time", () => {
  const format = {minutes: 5, periodSeconds: 30, periods: 0};

  expect(withinLimits(format)).toEqual(format);
});
