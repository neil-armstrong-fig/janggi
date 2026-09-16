import type {Setup} from "@src/game/setups/types/Setup";

/** A setup the bot might lay out, and how good the engine judged it for the bot's army. */
export interface SetupRating {
  readonly setup: Setup;
  /** Centipawns from the bot's side — higher is better for it. */
  readonly score: number;
}
