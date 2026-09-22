// @vitest-environment jsdom
import "@src/testing/SetupDomTest";
import {expect, it} from "vitest";
import {pictographFromSvg} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/components/piece-controls/components/glyph-controls/components/pictograph-controls/svg-import/PictographFromSvg";

function svg(body: string, attributes = 'viewBox="0 0 10 10"'): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" ${attributes}>${body}</svg>`;
}

it("fits a drawing to the piece's box", () => {
  expect(pictographFromSvg(svg('<path d="M0 0 H10 V10 H0 Z"/>'))).toEqual({
    kind: "accepted",
    value: "M0 0 H100 V100 H0 Z",
  });
});

it("centres a drawing that is not square, on the side there is room on", () => {
  expect(pictographFromSvg(svg('<path d="M0 0 H10 V5 H0 Z"/>', 'viewBox="0 0 10 5"'))).toEqual({
    kind: "accepted",
    value: "M0 25 H100 V75 H0 Z",
  });
});

it("follows a viewBox that does not begin at the origin", () => {
  expect(pictographFromSvg(svg('<path d="M10 10 H20 V20 H10 Z"/>', 'viewBox="10 10 10 10"'))).toEqual({
    kind: "accepted",
    value: "M0 0 H100 V100 H0 Z",
  });
});

it("falls back on a width and a height where there is no viewBox", () => {
  expect(pictographFromSvg(svg('<path d="M0 0 H10 V10 H0 Z"/>', 'width="10" height="10"'))).toMatchObject({
    kind: "accepted",
  });
});

it("puts every filled shape in the one drawing", () => {
  const drawn = pictographFromSvg(svg('<path d="M0 0 H5 V5 Z"/><rect x="5" y="5" width="5" height="5"/>'));

  expect(drawn).toEqual({kind: "accepted", value: "M0 0 H50 V50 Z M50 50 h50 v50 h-50 Z"});
});

it("draws a circle, an ellipse, a polygon and a polyline", () => {
  for (const shape of [
    '<circle cx="5" cy="5" r="4"/>',
    '<ellipse cx="5" cy="5" rx="4" ry="2"/>',
    '<polygon points="0,0 10,0 5,10"/>',
    '<polyline points="0,0 10,0 5,10"/>',
  ]) {
    expect(pictographFromSvg(svg(shape))).toMatchObject({kind: "accepted"});
  }
});

it("leaves out shapes that are only defined, to be used elsewhere", () => {
  const drawn = pictographFromSvg(svg('<defs><path d="M0 0 H1 V1 Z"/></defs><path d="M0 0 H10 V10 Z"/>'));

  expect(drawn).toEqual({kind: "accepted", value: "M0 0 H100 V100 Z"});
});

it("leaves out outlines, which a filled drawing cannot follow", () => {
  const drawn = pictographFromSvg(svg('<path fill="none" d="M0 0 H1 V1 Z"/><path d="M0 0 H10 V10 Z"/>'));

  expect(drawn).toEqual({kind: "accepted", value: "M0 0 H100 V100 Z"});
});

it("says so when there is nothing filled in it to draw", () => {
  expect(pictographFromSvg(svg('<path fill="none" d="M0 0 H1 V1 Z"/>'))).toEqual({
    kind: "refused",
    reason: expect.stringContaining("no filled shapes"),
  });
  expect(pictographFromSvg(svg("<text>hi</text>"))).toMatchObject({kind: "refused"});
});

it("refuses a shape moved by a transform, rather than drawing it somewhere else", () => {
  expect(pictographFromSvg(svg('<g transform="translate(5 5)"><path d="M0 0 H1 V1 Z"/></g>'))).toEqual({
    kind: "refused",
    reason: expect.stringContaining("transform"),
  });
});

it("refuses a file that does not say how big it is", () => {
  expect(pictographFromSvg(svg('<path d="M0 0 H1 V1 Z"/>', ""))).toEqual({
    kind: "refused",
    reason: expect.stringContaining("viewBox"),
  });
});

it("refuses what is not an SVG, or not even XML", () => {
  for (const text of ["hello", "<html><body/></html>", "<svg", ""]) {
    expect(pictographFromSvg(text)).toEqual({kind: "refused", reason: "That is not an SVG file."});
  }
});

it("refuses a shape whose path data cannot be read", () => {
  expect(pictographFromSvg(svg('<path d="M0 0 nonsense"/>'))).toEqual({
    kind: "refused",
    reason: expect.stringContaining("cannot be read"),
  });
});

it("refuses a drawing too detailed to keep", () => {
  const detailed = Array.from({length: 4000}, (_, index) => `L${index % 10} ${index % 7}`).join(" ");

  expect(pictographFromSvg(svg(`<path d="M0 0 ${detailed}"/>`))).toEqual({
    kind: "refused",
    reason: expect.stringContaining("too detailed"),
  });
});

it("reads nothing but the shapes: a script in the file is neither kept nor run", () => {
  const drawn = pictographFromSvg(svg('<script>throw new Error("run")</script><path d="M0 0 H10 V10 Z"/>'));

  expect(drawn).toEqual({kind: "accepted", value: "M0 0 H100 V100 Z"});
});
