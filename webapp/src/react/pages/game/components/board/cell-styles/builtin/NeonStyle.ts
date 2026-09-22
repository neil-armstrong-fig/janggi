import {DEFAULT_BOARD_MARKS} from "@src/styles/defaults/DefaultBoardMarks";
import type {BuiltInBoardStyle} from "@src/react/pages/game/components/board/cell-styles/builtin/types/BuiltInBoardStyle";
import type {CellStyle} from "@src/styles/types/CellStyle";
import {toPositionKey} from "@src/game/board/PositionKeys";

const NEON_CELL: CellStyle = {
  stroke: "#2f6f8f",
  strokeWidth: 1,
  diagonalStroke: "#f472b6",
  diagonalStrokeWidth: 1.5,
};

/**
 * Deliberately unlike a real board, to prove a style imposes nothing on the grid: its own surface,
 * palace diagonals in their own colour, and two intersections marked through `cells`.
 */
export const neonStyle: BuiltInBoardStyle = {
  name: "Neon",
  ...DEFAULT_BOARD_MARKS,
  surface: "linear-gradient(160deg, #0b1220, #131c2e)",
  defaultCell: NEON_CELL,
  cells: {
    [toPositionKey({file: 5, rank: 2})]: palaceCentreCell(),
    [toPositionKey({file: 5, rank: 9})]: palaceCentreCell(),
  },
  lastMove: {
    wash: "rgba(56, 189, 248, 0.16)",
    brackets: "#38bdf8",
  },
};

/** One cell, styled on its own — the whole point of the per-position override map. */
function palaceCentreCell(): CellStyle {
  return {...NEON_CELL, marker: {shape: "ring", radius: 18, colour: "#38bdf8", strokeWidth: 2}};
}
