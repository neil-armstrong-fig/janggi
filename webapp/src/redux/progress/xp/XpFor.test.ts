import {expect, it} from "vitest";
import {xpFor} from "@src/redux/progress/xp/XpFor";

it("gives a casual game 10 XP for seeing it through, however it went", () => {
  expect(xpFor("Casual", "lost")).toBe(10);
  expect(xpFor("Casual", "drawn")).toBe(10);
});

it("gives 20 XP more for a win", () => {
  expect(xpFor("Casual", "won")).toBe(30);
});

it("gives 10 XP more for a scored game", () => {
  expect(xpFor("Scored", "lost")).toBe(20);
  expect(xpFor("Scored", "won")).toBe(40);
});
