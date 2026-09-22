import type {BoardMarks} from "@src/styles/types/board-marks/BoardMarks";

/**
 * The marks as they were drawn before a style could choose them, and what a style that says nothing of
 * them gets — so a style written earlier, or one somebody shares from an older copy of the app, looks
 * exactly as it always did.
 */
export const DEFAULT_BOARD_MARKS: BoardMarks = {
  bikjang: {colour: "#f4c95d", width: 4},
  check: {colour: "#f0524a"},
  hints: {colour: "#ffffff", outline: "#000000", selection: "rgba(255, 255, 255, 0.2)"},
};
