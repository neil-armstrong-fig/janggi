import {expect, it} from "vitest";
import {freshProgress} from "@src/redux/progress/fresh-progress/FreshProgress";
import {progressFrom} from "@src/redux/progress/progress-from/ProgressFrom";

it("reads back progress as it was written", () => {
  const progress = {
    xp: 120,
    beaten: {Casual: {cho: [800, 1000], han: [800]}, Scored: {cho: [800], han: []}},
  };

  expect(progressFrom(progress)).toEqual(progress);
});

it("is nothing where what was read is not an object", () => {
  expect(progressFrom("120")).toBeUndefined();
  expect(progressFrom([120])).toBeUndefined();
  expect(progressFrom(null)).toBeUndefined();
});

it("takes any amount of XP as it stands, however large", () => {
  expect(progressFrom({xp: 1_000_000_000})?.xp).toBe(1_000_000_000);
});

it("starts the XP again where it is not an amount of XP, and keeps the ladders", () => {
  for (const xp of [-1, "500", Number.NaN, null, undefined]) {
    expect(progressFrom({xp, beaten: {Casual: {cho: [800], han: []}}})).toEqual({
      xp: 0,
      beaten: {Casual: {cho: [800], han: []}, Scored: {cho: [], han: []}},
    });
  }
});

it("rounds XP down to a whole amount", () => {
  expect(progressFrom({xp: 10.7})?.xp).toBe(10);
});

it("starts every ladder from the bottom where none was written", () => {
  expect(progressFrom({xp: 50})).toEqual({xp: 50, beaten: freshProgress().beaten});
});

it("leaves behind a format the app does not play, and keeps the one it does", () => {
  const stored = {xp: 0, beaten: {Casual: {cho: [800], han: []}, Blitz: {cho: [2850], han: []}}};

  expect(progressFrom(stored)?.beaten).toEqual({Casual: {cho: [800], han: []}, Scored: {cho: [], han: []}});
});

it("drops a strength of bot the app does not offer, and keeps the rest", () => {
  const stored = {xp: 0, beaten: {Casual: {cho: [800, 1234, "1000"], han: [1200]}}};

  expect(progressFrom(stored)?.beaten.Casual).toEqual({cho: [800], han: [1200]});
});

it("keeps each strength beaten once", () => {
  expect(progressFrom({xp: 0, beaten: {Casual: {cho: [800, 800], han: []}}})?.beaten.Casual.cho).toEqual([800]);
});

it("starts a ladder again where it is not a list, and keeps the XP", () => {
  expect(progressFrom({xp: 50, beaten: "all of them"})).toEqual({xp: 50, beaten: freshProgress().beaten});
  expect(progressFrom({xp: 50, beaten: {Casual: "every bot"}})).toEqual({xp: 50, beaten: freshProgress().beaten});
});
