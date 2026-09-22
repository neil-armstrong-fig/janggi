import {colourPartsOf} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/fields/colour-field/colour/ColourPartsOf";
import {expect, it} from "vitest";

it("reads a hex colour as it is, solid", () => {
  expect(colourPartsOf("#4a3116")).toEqual({hex: "#4a3116", alpha: 1});
});

it("reads a short hex colour in full", () => {
  expect(colourPartsOf("#fa0")).toEqual({hex: "#ffaa00", alpha: 1});
});

it("reads a hex colour with its own transparency", () => {
  expect(colourPartsOf("#ff000080")).toEqual({hex: "#ff0000", alpha: 0.5});
});

it("reads rgb() and rgba(), as the built-in washes are written", () => {
  expect(colourPartsOf("rgb(74, 49, 22)")).toEqual({hex: "#4a3116", alpha: 1});
  expect(colourPartsOf("rgba(74, 49, 22, 0.2)")).toEqual({hex: "#4a3116", alpha: 0.2});
  expect(colourPartsOf("rgba(0,0,0,.45)")).toEqual({hex: "#000000", alpha: 0.45});
});

it("ignores capitals and the space around it", () => {
  expect(colourPartsOf("  #FFAA00 ")).toEqual({hex: "#ffaa00", alpha: 1});
});

it("gives up on what a colour picker could only flatten", () => {
  for (const css of [
    "linear-gradient(#000, #fff)",
    "white",
    "var(--color-wood)",
    "url(#grain)",
    "#12",
    "rgb(300, 0, 0)",
  ]) {
    expect(colourPartsOf(css)).toBeUndefined();
  }
});

it("gives up on transparency beyond solid", () => {
  expect(colourPartsOf("rgba(0, 0, 0, 2)")).toBeUndefined();
});
