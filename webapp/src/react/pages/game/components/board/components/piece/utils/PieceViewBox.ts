/**
 * The coordinate space every piece draws in: a 100x100 square with the piece centred in it.
 *
 * Unlike a cell, a piece keeps its aspect ratio — a cell is stretched to fill a board that is wider
 * than it is tall, and stretching a piece with it would turn every disc into an ellipse. So a piece
 * is drawn in its own square element laid over the cell rather than inside the cell's own `<svg>`.
 */
export const PIECE_SVG_PROPS = {
  viewBox: "0 0 100 100",
};

export const CENTRE = 50;

/**
 * How big the body is drawn inside the box. Short of 50 so that a stroke on the outer edge, and any
 * shadow under it, has somewhere to land.
 */
export const RADIUS = 46;
