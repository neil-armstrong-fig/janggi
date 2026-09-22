import {expect, it} from "vitest";
import {transformedPath} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/components/piece-controls/components/glyph-controls/components/pictograph-controls/svg-import/svg-paths/TransformedPath";

const SAME = {scale: 1, dx: 0, dy: 0};

it("scales and shifts every point", () => {
  expect(transformedPath("M10 10 L20 30 Z", {scale: 2, dx: 1, dy: 5})).toBe("M21 25 L41 65 Z");
});

it("only scales what is relative, since a length has no place to shift", () => {
  expect(transformedPath("m10 10 l5 5", {scale: 2, dx: 100, dy: 100})).toBe("m120 120 l10 10");
});

it("moves a horizontal or vertical line along its one axis", () => {
  expect(transformedPath("M0 0 H10 V20", {scale: 2, dx: 5, dy: 7})).toBe("M5 7 H25 V47");
  expect(transformedPath("m0 0 h10 v20", {scale: 2, dx: 5, dy: 7})).toBe("m5 7 h20 v40");
});

it("moves every point of a curve", () => {
  expect(transformedPath("C1 2 3 4 5 6", {scale: 10, dx: 1, dy: 1})).toBe("C11 21 31 41 51 61");
  expect(transformedPath("S1 2 3 4", {scale: 10, dx: 0, dy: 0})).toBe("S10 20 30 40");
  expect(transformedPath("Q1 2 3 4 T5 6", {scale: 10, dx: 0, dy: 0})).toBe("Q10 20 30 40 T50 60");
});

it("scales an arc's radii and moves only its end, leaving the rotation and flags", () => {
  expect(transformedPath("A5 6 30 1 0 10 20", {scale: 2, dx: 1, dy: 1})).toBe("A10 12 30 1 0 21 41");
});

it("reads the flags of an arc written with nothing between them", () => {
  expect(transformedPath("a1 1 0 011 1", SAME)).toBe("a1 1 0 0 1 1 1");
});

it("gives every repeated set of numbers a command of its own, a move's later points being lines", () => {
  expect(transformedPath("M0 0 10 10 20 20", SAME)).toBe("M0 0 L10 10 L20 20");
  expect(transformedPath("m0 0 10 10", SAME)).toBe("m0 0 l10 10");
  expect(transformedPath("L1 1 2 2", SAME)).toBe("L1 1 L2 2");
});

it("reads numbers run together, with signs and decimals", () => {
  expect(transformedPath("M1-2.5.5,3", SAME)).toBe("M1 -2.5 L0.5 3");
});

it("rounds to two places, and never writes an exponent", () => {
  expect(transformedPath("M0.123456 1e-7", SAME)).toBe("M0.12 0");
});

it("gives up on what is not path data", () => {
  for (const data of ["", "   ", "X1 2", "M1", "M 1 2 Q", "L a b", "hello"]) {
    expect(transformedPath(data, SAME)).toBeUndefined();
  }
});
