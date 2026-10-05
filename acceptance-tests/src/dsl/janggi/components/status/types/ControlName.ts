/** The controls in the row under the board, by what each does. */
export const CONTROL_NAMES = ["pass", "bikjang", "draw", "undo", "redo", "settings"] as const;

export type ControlName = (typeof CONTROL_NAMES)[number];
