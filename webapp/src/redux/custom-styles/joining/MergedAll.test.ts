import type {BoardStyle} from "@src/styles/types/BoardStyle";
import {expect, it} from "vitest";
import {mergedAll} from "@src/redux/custom-styles/joining/MergedAll";

const BUILT_INS = ["Classic", "Neon"];

it("adds every style a save carries", () => {
  const kept = mergedAll([], [board("Midnight"), board("Dawn")], BUILT_INS);

  expect(kept.map(style => style.name)).toEqual(["Midnight", "Dawn"]);
});

it("adds none the player already has, exactly as the save holds them", () => {
  const kept = mergedAll([board("Midnight")], [board("Midnight"), board("Dawn")], BUILT_INS);

  expect(kept.map(style => style.name)).toEqual(["Midnight", "Dawn"]);
});

it("numbers two styles of one name carried in the same save", () => {
  const kept = mergedAll([], [board("Midnight"), board("Midnight", "#000000")], BUILT_INS);

  expect(kept.map(style => style.name)).toEqual(["Midnight", "Midnight (2)"]);
});

function board(name: string, surface = "#ffffff"): BoardStyle {
  return {
    name,
    surface,
    defaultCell: {stroke: "#000000", strokeWidth: 1},
    lastMove: {wash: "rgba(0, 0, 0, 0.2)", brackets: "#000000"},
  };
}
