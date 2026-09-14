/** One chip of wood thrown off a capture, and where it ends up. */
export interface Chip {
  readonly id: string;
  /** How far it is thrown on each axis, as a fraction of the cell it was thrown from. */
  readonly across: number;
  readonly down: number;
  /** How far it turns as it flies, in degrees. */
  readonly spin: number;
}
