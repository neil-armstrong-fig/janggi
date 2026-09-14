import {eloAfter} from "@src/redux/ratings/elo/EloAfter";
import {expect, it} from "vitest";

it("loses twenty points for a first loss to an equal opponent", () => {
  expect(eloAfter(1200, 0, 1200, "lost")).toBe(1180);
});

it("gains twenty points for a first win over an equal opponent", () => {
  expect(eloAfter(1200, 0, 1200, "won")).toBe(1220);
});

it("stays put after a draw with an equal opponent", () => {
  expect(eloAfter(1200, 0, 1200, "drawn")).toBe(1200);
});

it("gains more for beating a stronger opponent than a weaker one", () => {
  expect(eloAfter(1200, 0, 1600, "won") - 1200).toBeGreaterThan(eloAfter(1200, 0, 800, "won") - 1200);
});

it("loses little for losing to a far stronger opponent", () => {
  expect(eloAfter(1200, 0, 2850, "lost")).toBe(1200);
});

it("gains from a draw with a stronger opponent and loses from a draw with a weaker one", () => {
  expect(eloAfter(1200, 0, 1600, "drawn")).toBeGreaterThan(1200);
  expect(eloAfter(1200, 0, 800, "drawn")).toBeLessThan(1200);
});

it("moves half as far once thirty games are behind it and the rating has settled", () => {
  expect(eloAfter(1200, 30, 1200, "lost")).toBe(1190);
});

it("still moves the full distance on the thirtieth game", () => {
  expect(eloAfter(1200, 29, 1200, "lost")).toBe(1180);
});
