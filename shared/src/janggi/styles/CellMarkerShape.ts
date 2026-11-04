/**
 * The shapes of the marker on a point. Listed as well as typed, because a style somebody else wrote has its shape checked
 * against it.
 * Here rather than in the webapp because the words for each are in `language/`, which reaches nothing but this package.
 */
export const CELL_MARKER_SHAPES = ["ring", "dot"] as const;

export type CellMarkerShape = (typeof CELL_MARKER_SHAPES)[number];
