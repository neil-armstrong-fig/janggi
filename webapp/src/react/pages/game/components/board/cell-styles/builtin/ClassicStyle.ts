import {DEFAULT_BOARD_MARKS} from "@src/styles/defaults/DefaultBoardMarks";
import type {BuiltInBoardStyle} from "@src/react/pages/game/components/board/cell-styles/builtin/types/BuiltInBoardStyle";

/** Wood and ink: the board as it looks sitting on a table. */
export const classicStyle: BuiltInBoardStyle = {
  name: "Classic",
  ...DEFAULT_BOARD_MARKS,
  surface: "#e7c88f",
  defaultCell: {
    stroke: "#4a3116",
    strokeWidth: 1.25,
  },
  // Ink rather than light: a pale or warm mark vanishes into pale wood, and a darker one reads against it.
  lastMove: {
    wash: "rgba(74, 49, 22, 0.2)",
    brackets: "#2b1a0b",
  },
};
