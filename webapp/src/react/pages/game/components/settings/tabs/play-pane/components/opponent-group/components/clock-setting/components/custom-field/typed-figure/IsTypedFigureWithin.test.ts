import {expect, it} from "vitest";
import {isTypedFigureWithin} from "@src/react/pages/game/components/settings/tabs/play-pane/components/opponent-group/components/clock-setting/components/custom-field/typed-figure/IsTypedFigureWithin";

const LIMIT = {min: 5, max: 120};

it("takes a figure inside the limits", () => {
  expect(isTypedFigureWithin("30", LIMIT)).toBe(true);
});

it("takes a figure on either limit", () => {
  expect(isTypedFigureWithin("5", LIMIT)).toBe(true);
  expect(isTypedFigureWithin("120", LIMIT)).toBe(true);
});

it("refuses a figure below the limits, such as the 3 on the way to 30", () => {
  expect(isTypedFigureWithin("3", LIMIT)).toBe(false);
});

it("refuses a figure above the limits", () => {
  expect(isTypedFigureWithin("121", LIMIT)).toBe(false);
});

it("refuses a blank, which would otherwise read as 0 where 0 is allowed", () => {
  expect(isTypedFigureWithin("", {min: 0, max: 60})).toBe(false);
});
