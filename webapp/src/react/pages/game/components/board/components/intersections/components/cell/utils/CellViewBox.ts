/**
 * The coordinate space every cell draws in: a 100x100 square stretched to fill a cell that is
 * actually wider than it is tall.
 *
 * `preserveAspectRatio="none"` is what does the stretching, and it is why a palace diagonal lands on
 * the neighbouring intersection rather than running at 45 degrees. `overflow` lets a stroke spill
 * past the cell's edge, which `Segment` relies on to close hairline gaps between neighbours.
 */
export const CELL_SVG_PROPS = {
  viewBox: "0 0 100 100",
  preserveAspectRatio: "none" as const,
  overflow: "visible" as const,
};

/** The intersection itself — where the lines meet and a marker is centred. */
export const CENTRE = 50;
