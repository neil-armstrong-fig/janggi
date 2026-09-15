import type {Rhythm} from "@src/audio/music/rhythm/types/Rhythm";

/** One step of the music, handed to every layer to play whatever falls on it. */
export interface Step {
  /**
   * Counted from nought since the music started, so a layer can tell where in its bar, its round or
   * its phrase it is.
   */
  readonly index: number;
  /** When the step starts, on the audio context's own clock. */
  readonly time: number;
  /** How long the step lasts, in seconds — the tempo, as it stands for this bar. */
  readonly seconds: number;
  /** How tense the game is as the step is scheduled. */
  readonly tension: number;
  /** Whether a game is under way, or the waiting theme is playing. */
  readonly underWay: boolean;
  /** The 장단 the game's music is in for this round. */
  readonly rhythm: Rhythm;
  /** The 장단 the next round will be in, as the game stands — the same as `rhythm` unless it is to change. */
  readonly nextRhythm: Rhythm;
}
