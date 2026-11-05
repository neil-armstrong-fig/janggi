import {clockAfterTurn} from "@src/redux/clock/spending/ClockAfterTurn";
import {expect, it} from "vitest";

const FORMAT = {minutes: 5, periodSeconds: 30, periods: 3};

it("spends free time first, leaving the periods alone", () => {
  expect(clockAfterTurn({freeMs: 300_000, periods: 3}, FORMAT, 12_345)).toEqual({freeMs: 287_655, periods: 3});
});

it("is out of free time, with every period left, on spending exactly what there was", () => {
  expect(clockAfterTurn({freeMs: 10_000, periods: 3}, FORMAT, 10_000)).toEqual({freeMs: 0, periods: 3});
});

it("runs what is left over into a period, which a move in time keeps", () => {
  expect(clockAfterTurn({freeMs: 10_000, periods: 3}, FORMAT, 39_999)).toEqual({freeMs: 0, periods: 3});
});

it("keeps the period for a turn taken within it", () => {
  expect(clockAfterTurn({freeMs: 0, periods: 2}, FORMAT, 29_999)).toEqual({freeMs: 0, periods: 2});
});

it("uses a period up on reaching exactly zero", () => {
  expect(clockAfterTurn({freeMs: 0, periods: 2}, FORMAT, 30_000)).toEqual({freeMs: 0, periods: 1});
});

it("uses up several periods in one long turn", () => {
  expect(clockAfterTurn({freeMs: 10_000, periods: 3}, FORMAT, 75_000)).toEqual({freeMs: 0, periods: 1});
});

it("leaves nothing once the last period runs out", () => {
  expect(clockAfterTurn({freeMs: 0, periods: 1}, FORMAT, 30_000)).toEqual({freeMs: 0, periods: 0});
});

it("never takes the periods below nothing", () => {
  expect(clockAfterTurn({freeMs: 0, periods: 1}, FORMAT, 600_000)).toEqual({freeMs: 0, periods: 0});
});

it("spends a period from the first move where a format has no free time", () => {
  const noFreeTime = {minutes: 0, periodSeconds: 40, periods: 30};

  expect(clockAfterTurn({freeMs: 0, periods: 30}, noFreeTime, 40_000)).toEqual({freeMs: 0, periods: 29});
});

it("leaves nothing once free time runs out where a format has no periods", () => {
  const noPeriods = {minutes: 5, periodSeconds: 30, periods: 0};

  expect(clockAfterTurn({freeMs: 1000, periods: 0}, noPeriods, 1000)).toEqual({freeMs: 0, periods: 0});
});
