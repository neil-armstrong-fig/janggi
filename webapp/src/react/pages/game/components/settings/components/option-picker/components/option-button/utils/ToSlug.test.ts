import {expect, it} from "vitest";
import {toSlug} from "@src/react/pages/game/components/settings/components/option-picker/components/option-button/utils/ToSlug";

it("lower cases a single word", () => {
  expect(toSlug("Traditional")).toBe("traditional");
});

it("joins the words of a name with hyphens", () => {
  expect(toSlug("Inner Elephant")).toBe("inner-elephant");
});

it("collapses a run of whitespace into one hyphen", () => {
  expect(toSlug("Central  Chariot")).toBe("central-chariot");
});
