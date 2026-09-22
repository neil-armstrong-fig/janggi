import {colourPartsOf} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/fields/colour-field/colour/ColourPartsOf";
import {cssColourOf} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/fields/colour-field/colour/CssColourOf";
import {expect, it} from "vitest";

it("writes a solid colour as its hex", () => {
  expect(cssColourOf({hex: "#4a3116", alpha: 1})).toBe("#4a3116");
});

it("writes a see-through one as rgba()", () => {
  expect(cssColourOf({hex: "#4a3116", alpha: 0.2})).toBe("rgba(74, 49, 22, 0.2)");
});

it("rounds transparency to two places, which is all a slider can tell apart", () => {
  expect(cssColourOf({hex: "#000000", alpha: 0.456})).toBe("rgba(0, 0, 0, 0.46)");
});

it("is undone by reading it back", () => {
  for (const parts of [
    {hex: "#4a3116", alpha: 1},
    {hex: "#4a3116", alpha: 0.2},
    {hex: "#ffffff", alpha: 0},
  ]) {
    expect(colourPartsOf(cssColourOf(parts))).toEqual(parts);
  }
});
