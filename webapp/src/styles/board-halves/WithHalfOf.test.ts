import type {BoardStyle} from "@src/styles/types/BoardStyle";
import {DEFAULT_BOARD_MARKS} from "@src/styles/defaults/DefaultBoardMarks";
import {expect, it} from "vitest";
import {withHalfOf} from "@src/styles/board-halves/WithHalfOf";

function board(name: string, stroke: string): BoardStyle {
  return {
    name,
    ...DEFAULT_BOARD_MARKS,
    surface: "#000000",
    defaultCell: {stroke, strokeWidth: 1},
    lastMove: {wash: "rgba(0, 0, 0, 0.2)", brackets: "#000000"},
  };
}

const target = board("Target", "#111111");
const source = board("Source", "#222222");

it("writes every point of the given half as an explicit override, resolved from the source", () => {
  const changed = withHalfOf(target, source, "han");

  expect(changed.cells?.f5r2).toEqual({stroke: "#222222", strokeWidth: 1});
  expect(changed.cells?.f1r1).toEqual({stroke: "#222222", strokeWidth: 1});
});

it("leaves the other half untouched, including any override it already had", () => {
  const withOwnOverride = {...target, cells: {f5r9: {stroke: "#333333", strokeWidth: 2}}};

  const changed = withHalfOf(withOwnOverride, source, "han");

  expect(changed.cells?.f5r9).toEqual({stroke: "#333333", strokeWidth: 2});
});

it("leaves an override the target already had on the given half behind — the source replaces it", () => {
  const withOwnHanOverride = {...target, cells: {f5r2: {stroke: "#444444", strokeWidth: 3}}};

  const changed = withHalfOf(withOwnHanOverride, source, "han");

  expect(changed.cells?.f5r2).toEqual({stroke: "#222222", strokeWidth: 1});
});

it("leaves everything else — the surface, the marks, the default cell, the name — as the target's own", () => {
  const changed = withHalfOf(target, source, "han");

  expect(changed.surface).toBe(target.surface);
  expect(changed.defaultCell).toBe(target.defaultCell);
  expect(changed.bikjang).toBe(target.bikjang);
  expect(changed.name).toBe(target.name);
});

it("materializes a whole half — 45 of the 90 points — even where the target had no cells at all", () => {
  const changed = withHalfOf(target, source, "cho");

  expect(Object.keys(changed.cells ?? {})).toHaveLength(45);
});

it("does not touch the styles it was given", () => {
  withHalfOf(target, source, "han");

  expect(target.cells).toBeUndefined();
});
