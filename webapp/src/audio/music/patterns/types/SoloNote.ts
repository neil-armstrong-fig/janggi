/** A string the soloist plucks. */
export interface SoloNote {
  /** A degree of 평조, counted up from the soloist's root. */
  readonly degree: number;
  /** How far into its step the note is plucked, from nought to just short of one. */
  readonly offset: number;
  /** How many steps the string is left ringing. */
  readonly steps: number;
  /** From nought to one. */
  readonly weight: number;
  /** Whether the line leans on the note, and so it is a tone of the chord, rather than passing through it. */
  readonly leaning: boolean;
}
