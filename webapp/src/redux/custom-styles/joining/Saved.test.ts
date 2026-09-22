import {DEFAULT_BOARD_MARKS} from "@src/styles/defaults/DefaultBoardMarks";
import type {BoardStyle} from "@src/styles/types/BoardStyle";
import {expect, it} from "vitest";
import {saved} from "@src/redux/custom-styles/joining/Saved";

const BUILT_INS = ["Classic", "Neon"];

it("replaces the player's own style of that name, where it leaves it standing", () => {
  const kept = saved([board("Midnight"), board("Dawn")], board("Midnight", "#000000"), BUILT_INS);

  expect(kept).toEqual([board("Midnight", "#000000"), board("Dawn")]);
});

it("adds a style whose name nothing answers to", () => {
  expect(saved([board("Midnight")], board("Dawn"), BUILT_INS).map(style => style.name)).toEqual(["Midnight", "Dawn"]);
});

it("never takes a built-in's name over, numbering it instead", () => {
  expect(saved([], board("Neon"), BUILT_INS).map(style => style.name)).toEqual(["Neon (2)"]);
});

function board(name: string, surface = "#ffffff"): BoardStyle {
  return {
    name,
    ...DEFAULT_BOARD_MARKS,
    surface,
    defaultCell: {stroke: "#000000", strokeWidth: 1},
    lastMove: {wash: "rgba(0, 0, 0, 0.2)", brackets: "#000000"},
  };
}
