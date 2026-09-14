import type {UnknownAction} from "@reduxjs/toolkit";

/** What the bot answers with: the store action that plays it, and the evaluation it carries into its next turn. */
export interface BotReply {
  readonly action: UnknownAction;
  /** Centipawns from the bot's side, or undefined before the engine has reported one. */
  readonly evaluation: number | undefined;
}
