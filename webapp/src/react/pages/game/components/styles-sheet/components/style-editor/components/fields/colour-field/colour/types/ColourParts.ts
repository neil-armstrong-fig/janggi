/** A colour as the editor's controls turn it: what a colour picker holds, and how see-through it is. */
export interface ColourParts {
  /** `#rrggbb`, lower case. */
  readonly hex: string;
  /** From 0, invisible, to 1, solid. */
  readonly alpha: number;
}
