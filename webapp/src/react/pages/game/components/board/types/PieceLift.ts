/**
 * How far a piece stands off the board: flat on it, nudged up under a pointer resting on it, or lifted
 * right off it while it is in hand.
 */
export type PieceLift = "resting" | "hovered" | "held";
