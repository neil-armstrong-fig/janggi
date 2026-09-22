/** Where a drawing lands when it is moved into the piece's 100-unit box: scaled about the origin, then shifted. */
export interface Placement {
  readonly scale: number;
  readonly dx: number;
  readonly dy: number;
}
