import type {CueName} from "@src/audio/types/CueName";

/**
 * The last seconds before a deadline, ticked out one a second: when it falls, as `Date.now()` counts, and the sound each
 * tick makes. The page works out the deadline; nothing here knows what it is a deadline for.
 */
export interface Countdown {
  readonly endsAt: number;
  readonly cue: CueName;
}
