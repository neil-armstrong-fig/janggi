import type {BoardStyle} from "@src/styles/types/BoardStyle";
import {DEFAULT_BOARD_MARKS} from "@src/styles/defaults/DefaultBoardMarks";
import {combinedBoardStyle} from "@src/styles/board-halves/CombinedBoardStyle";
import {expect, it} from "vitest";

function board(name: string, stroke: string, checkColour: string): BoardStyle {
  return {
    name,
    ...DEFAULT_BOARD_MARKS,
    check: {colour: checkColour},
    surface: `${name}-surface`,
    defaultCell: {stroke, strokeWidth: 1},
    lastMove: {wash: "rgba(0, 0, 0, 0.2)", brackets: "#000000"},
  };
}

const neon = board("Neon", "#2f6f8f", "#111111");
const classic = board("Classic", "#4a3116", "#222222");

it("is the board itself where both armies wear the same one", () => {
  expect(combinedBoardStyle({han: classic, cho: classic})).toBe(classic);
});

it("draws each half as its own board does", () => {
  const combined = combinedBoardStyle({han: neon, cho: classic});

  expect(combined.cells?.f5r2).toEqual(neon.defaultCell);
  expect(combined.cells?.f5r9).toBeUndefined();
  expect(combined.defaultCell).toBe(classic.defaultCell);
});

it("takes the surface, the marks and the name from cho's board, named for both", () => {
  const combined = combinedBoardStyle({han: neon, cho: classic});

  expect(combined.surface).toBe(classic.surface);
  expect(combined.check).toBe(classic.check);
  expect(combined.name).toBe("Neon and Classic");
});
