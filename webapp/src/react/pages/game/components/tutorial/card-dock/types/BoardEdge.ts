/** An edge of the board, as it is drawn: Han's side at the top, the tutorial never turning the board. */
export const BOARD_EDGES = ["top", "bottom"] as const;

export type BoardEdge = (typeof BOARD_EDGES)[number];
