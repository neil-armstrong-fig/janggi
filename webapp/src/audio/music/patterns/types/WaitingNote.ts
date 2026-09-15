/** A string the waiting theme plucks. */
export interface WaitingNote {
  /** A degree of 평조, counted up from the plucked line's root. */
  readonly degree: number;
  /** How many steps the string is left ringing. */
  readonly steps: number;
  /** From nought to one. */
  readonly weight: number;
}
