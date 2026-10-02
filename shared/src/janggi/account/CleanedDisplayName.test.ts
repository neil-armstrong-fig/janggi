import {expect, it} from "vitest";
import {DISPLAY_NAME_MAX_LENGTH} from "@janggi/shared/janggi/account/DisplayNameLimits";
import {cleanedDisplayName} from "@janggi/shared/janggi/account/CleanedDisplayName";

it("accepts an ordinary name as typed", () => {
  expect(cleanedDisplayName("Admiral Yi")).toBe("Admiral Yi");
});

it("accepts any script, and the punctuation of a name", () => {
  expect(cleanedDisplayName("이순신")).toBe("이순신");
  expect(cleanedDisplayName("Yi Sun-sin (1545)")).toBe("Yi Sun-sin (1545)");
});

it("trims the ends and makes each run of spaces one", () => {
  expect(cleanedDisplayName("  Kim   Yu-sin \t ")).toBe("Kim Yu-sin");
});

it("refuses a name that is empty, or only spaces", () => {
  expect(cleanedDisplayName("")).toBeUndefined();
  expect(cleanedDisplayName("   ")).toBeUndefined();
});

it("accepts a name of exactly the longest length and refuses one a character longer", () => {
  expect(cleanedDisplayName("a".repeat(DISPLAY_NAME_MAX_LENGTH))).toBe("a".repeat(DISPLAY_NAME_MAX_LENGTH));
  expect(cleanedDisplayName("a".repeat(DISPLAY_NAME_MAX_LENGTH + 1))).toBeUndefined();
});

it("counts characters as a person does, so a name of emoji is not cut short by how they are encoded", () => {
  expect(cleanedDisplayName("🐢".repeat(DISPLAY_NAME_MAX_LENGTH))).toBe("🐢".repeat(DISPLAY_NAME_MAX_LENGTH));
});

it("refuses a line break or any other control character", () => {
  expect(cleanedDisplayName("Yi\nSun-sin")).toBeUndefined();
  expect(cleanedDisplayName("Yi\u0000Sun-sin")).toBeUndefined();
  expect(cleanedDisplayName("Yi​Sun-sin")).toBeUndefined();
});
