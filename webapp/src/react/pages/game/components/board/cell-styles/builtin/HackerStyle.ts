import type {BuiltInBoardStyle} from "@src/react/pages/game/components/board/cell-styles/builtin/types/BuiltInBoardStyle";
import type {CellStyle} from "@src/styles/types/CellStyle";
import {toPositionKey} from "@src/game/board/PositionKeys";

const TRACE: CellStyle = {
  stroke: "#00ff66",
  strokeWidth: 0.8,
  diagonalStroke: "#00b347",
};

/**
 * A terminal: phosphor green on black, with the scanlines of a screen that was never flat. The palace
 * centres blink nothing, but they are ringed like a cursor waiting for input.
 *
 * The last theme on the ladder, priced at a million XP — which is to say, priced for whoever opens the
 * dev tools rather than for whoever plays twenty-five thousand games. See `UNLOCK_PRICES`.
 */
export const hackerStyle: BuiltInBoardStyle = {
  name: "Hacker",
  surface: "repeating-linear-gradient(0deg, rgba(0, 255, 102, 0.05) 0 1px, transparent 1px 3px), #050805",
  defaultCell: TRACE,
  cells: {
    [toPositionKey({file: 5, rank: 2})]: cursor(),
    [toPositionKey({file: 5, rank: 9})]: cursor(),
  },
  lastMove: {
    wash: "rgba(0, 255, 102, 0.14)",
    brackets: "#00ff66",
  },
};

function cursor(): CellStyle {
  return {...TRACE, marker: {shape: "ring", radius: 12, colour: "#00ff66", strokeWidth: 1.5}};
}
