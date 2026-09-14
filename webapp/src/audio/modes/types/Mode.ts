/**
 * A five-note mode: the notes of one octave, each counted in semitones up from the root. The music
 * only ever plays notes from a mode, so any two notes played together belong together.
 */
export interface Mode {
  readonly name: string;
  readonly steps: readonly number[];
}
