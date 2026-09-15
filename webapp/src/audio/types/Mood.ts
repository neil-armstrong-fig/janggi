import type {Ending} from "@src/audio/types/Ending";

/**
 * How the music should feel — the one thing it follows. The page works it out and hands it over;
 * nothing here knows where it came from, and the music simply moves towards whatever it is given.
 */
export interface Mood {
  /** From nought, calm, to one, as fraught as the music gets. */
  readonly tension: number;
  /** Whether the check theme plays over the rest. */
  readonly inCheck: boolean;
  readonly ending: Ending;
  /** Whether a game is under way. Until one is, the waiting theme plays in place of the game's own music. */
  readonly underWay: boolean;
}
