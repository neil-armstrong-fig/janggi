// @vitest-environment jsdom
import "@src/testing/SetupDomTest";
import {expect, it} from "vitest";
import {shapePathOf} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/components/piece-controls/components/glyph-controls/components/pictograph-controls/svg-import/svg-paths/ShapePathOf";

function shape(markup: string): Element {
  const parsed = new DOMParser().parseFromString(
    `<svg xmlns="http://www.w3.org/2000/svg">${markup}</svg>`,
    "image/svg+xml",
  );
  const found = parsed.documentElement.firstElementChild;
  if (!found) throw new Error("No shape was written");

  return found;
}

it("gives a path's own data", () => {
  expect(shapePathOf(shape('<path d="M0 0 L1 1 Z"/>'))).toBe("M0 0 L1 1 Z");
});

it("writes a rectangle as a path", () => {
  expect(shapePathOf(shape('<rect x="1" y="2" width="3" height="4"/>'))).toBe("M1 2 h3 v4 h-3 Z");
});

it("takes a rectangle's position as the origin where it gives none, and lengths in px", () => {
  expect(shapePathOf(shape('<rect width="3px" height="4"/>'))).toBe("M0 0 h3 v4 h-3 Z");
});

it("writes a circle as two arcs", () => {
  expect(shapePathOf(shape('<circle cx="5" cy="5" r="2"/>'))).toBe("M3 5 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0 Z");
});

it("writes an ellipse as two arcs, with its own two radii", () => {
  expect(shapePathOf(shape('<ellipse cx="5" cy="5" rx="4" ry="2"/>'))).toBe("M1 5 a4 2 0 1 0 8 0 a4 2 0 1 0 -8 0 Z");
});

it("closes a polygon and leaves a polyline open", () => {
  expect(shapePathOf(shape('<polygon points="0,0 10,0 5,10"/>'))).toBe("M0 0 L10 0 5 10 Z");
  expect(shapePathOf(shape('<polyline points="0 0 10 0 5 10"/>'))).toBe("M0 0 L10 0 5 10");
});

it("leaves out an outline, which has nothing filled", () => {
  expect(shapePathOf(shape('<path fill="none" d="M0 0 L1 1 Z"/>'))).toBeUndefined();
});

it("gives up on a shape it cannot read the size of, and on anything that is not a shape", () => {
  expect(shapePathOf(shape('<rect width="3"/>'))).toBeUndefined();
  expect(shapePathOf(shape('<circle cx="1" cy="1" r="50%"/>'))).toBeUndefined();
  expect(shapePathOf(shape('<polygon points="0,0 10"/>'))).toBeUndefined();
  expect(shapePathOf(shape("<text>hi</text>"))).toBeUndefined();
});
