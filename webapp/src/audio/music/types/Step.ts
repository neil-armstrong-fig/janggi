/** One step of the music, handed to every layer to play whatever falls on it. */
export interface Step {
  /** Counted from nought since the music started, so a layer can tell where in its bar it is. */
  readonly index: number;
  /** When the step starts, on the audio context's own clock. */
  readonly time: number;
  /** How long the step lasts, in seconds — the tempo, as it stands for this bar. */
  readonly seconds: number;
  /** How tense the game is as the step is scheduled. */
  readonly tension: number;
}
