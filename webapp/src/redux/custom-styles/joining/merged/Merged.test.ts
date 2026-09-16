import type {BoardStyle} from "@src/styles/types/BoardStyle";
import {expect, it} from "vitest";
import {merged} from "@src/redux/custom-styles/joining/merged/Merged";

const BUILT_INS = ["Classic", "Neon"];

it("adds a style the player does not have", () => {
  expect(merged([board("Midnight")], board("Dawn"), BUILT_INS).map(style => style.name)).toEqual(["Midnight", "Dawn"]);
});

it("adds nothing where the very same style is already there", () => {
  const styles = [board("Midnight")];

  expect(merged(styles, board("Midnight"), BUILT_INS)).toBe(styles);
});

it("keeps both where a different style arrives under a name already taken", () => {
  const kept = merged([board("Midnight")], board("Midnight", "#000000"), BUILT_INS);

  expect(kept).toEqual([board("Midnight"), {...board("Midnight", "#000000"), name: "Midnight (2)"}]);
});

function board(name: string, surface = "#ffffff"): BoardStyle {
  return {
    name,
    surface,
    defaultCell: {stroke: "#000000", strokeWidth: 1},
    lastMove: {wash: "rgba(0, 0, 0, 0.2)", brackets: "#000000"},
  };
}
