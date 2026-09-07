/**
 * How one intersection is painted.
 *
 * Data, deliberately — a style has to survive being written to storage, exported, shared and edited
 * by a settings screen. Built-in styles and user-defined styles use this same schema; the only
 * difference between them is where the object came from.
 */
export interface CellStyle {
  /** Painted behind this cell. Omit to let the board's own surface show through. */
  readonly surface?: string;
  readonly stroke: string;
  readonly strokeWidth: number;
  /** Palace diagonals match the grid lines unless a style picks them out. */
  readonly diagonalStroke?: string;
  readonly diagonalStrokeWidth?: number;
  readonly marker?: CellMarker;
}

/** An optional shape drawn on the intersection itself, on top of the lines. */
export interface CellMarker {
  readonly shape: "ring" | "dot";
  readonly radius: number;
  /** The stroke of a ring, the fill of a dot. */
  readonly colour: string;
  /** Ring only. */
  readonly strokeWidth?: number;
}
