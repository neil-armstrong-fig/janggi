/** A low string the bass plucks. */
export interface BassNote {
  /** A degree of 평조, counted up from the bass's root. */
  readonly degree: number;
  /** How many steps the string is left ringing. */
  readonly steps: number;
  /** From nought to one. */
  readonly weight: number;
}
