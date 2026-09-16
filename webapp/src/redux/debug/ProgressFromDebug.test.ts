import {expect, it} from "vitest";
import {freshProgress} from "@src/redux/progress/fresh-progress/FreshProgress";
import {progressFromDebug} from "@src/redux/debug/ProgressFromDebug";

it("takes a bare amount of XP, as a developer types one", () => {
  expect(progressFromDebug(640)).toEqual({xp: 640, beaten: freshProgress().beaten});
  expect(progressFromDebug("640")).toEqual({xp: 640, beaten: freshProgress().beaten});
});

it("takes a whole progress, for a test that needs bots beaten as well", () => {
  const progress = {xp: 30, beaten: {Casual: {cho: [800], han: []}, Scored: {cho: [], han: []}}};

  expect(progressFromDebug(progress)).toEqual(progress);
  expect(progressFromDebug(JSON.stringify(progress))).toEqual(progress);
});

it("asks for nothing where nothing was set", () => {
  expect(progressFromDebug(undefined)).toBeUndefined();
  expect(progressFromDebug("")).toBeUndefined();
  expect(progressFromDebug(null)).toBeUndefined();
});

it("asks for nothing where what was set makes no sense", () => {
  expect(progressFromDebug("lots, please")).toBeUndefined();
  expect(progressFromDebug("{not json")).toBeUndefined();
});

it("drops what the app does not offer, as any other reading from outside does", () => {
  expect(progressFromDebug({xp: -5, beaten: {Casual: {cho: [1234], han: [800]}}})).toEqual({
    xp: 0,
    beaten: {Casual: {cho: [], han: [800]}, Scored: {cho: [], han: []}},
  });
});
