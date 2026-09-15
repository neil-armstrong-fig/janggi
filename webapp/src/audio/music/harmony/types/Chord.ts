/** A chord of 평조: the degree the bass plucks, and the degrees a melody may lean on over it. */
export interface Chord {
  /** The chord's root, as a degree from nought to four above the bass's root. */
  readonly root: number;
  /** Every degree in the chord, the root among them, from nought to four — any octave of each will do. */
  readonly tones: readonly number[];
}
