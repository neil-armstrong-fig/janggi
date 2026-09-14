/**
 * Where one intersection's cell sits on the board, each measure a fraction of the board's own width
 * or height — so it holds at any size the board is drawn, and can be written straight into a
 * percentage.
 */
export interface PointBox {
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
}
