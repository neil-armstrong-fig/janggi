import type {BoardStyle} from "@src/styles/types/BoardStyle";
import {added} from "@src/redux/custom-styles/joining/Added";
import {expect, it} from "vitest";

const BUILT_INS = ["Classic", "Neon"];

it("adds a style under its own name", () => {
  expect(added([], board("Midnight"), BUILT_INS)).toEqual([board("Midnight")]);
});

it("keeps what is already there, in the order it arrived", () => {
  const kept = added([board("Midnight")], board("Dawn"), BUILT_INS);

  expect(kept.map(style => style.name)).toEqual(["Midnight", "Dawn"]);
});

it("numbers a style whose name one of the player's own already answers to", () => {
  const kept = added([board("Midnight")], board("Midnight", "#000000"), BUILT_INS);

  expect(kept.map(style => style.name)).toEqual(["Midnight", "Midnight (2)"]);
});

it("numbers a style that arrives under a built-in's name", () => {
  expect(added([], board("Neon"), BUILT_INS)[0]?.name).toBe("Neon (2)");
});

it("changes nothing about the style but its name", () => {
  expect(added([], board("Neon", "#123456"), BUILT_INS)[0]).toEqual({...board("Neon", "#123456"), name: "Neon (2)"});
});

function board(name: string, surface = "#ffffff"): BoardStyle {
  return {
    name,
    surface,
    defaultCell: {stroke: "#000000", strokeWidth: 1},
    lastMove: {wash: "rgba(0, 0, 0, 0.2)", brackets: "#000000"},
  };
}
