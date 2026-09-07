/** A line running to an orthogonally adjacent intersection. */
export type Orthogonal = "north" | "south" | "east" | "west";

/** A line running to a diagonally adjacent intersection. Only ever drawn inside a palace. */
export type Diagonal = "northEast" | "northWest" | "southEast" | "southWest";

/** Which line segments meet at one intersection. Everything a cell needs in order to draw itself. */
export interface CellShape {
  readonly orthogonals: readonly Orthogonal[];
  readonly diagonals: readonly Diagonal[];
}
