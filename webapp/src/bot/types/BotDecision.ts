import type {BotTurn} from "@src/bot/types/BotTurn";

/** What the bot plays, and the evaluation it reached — carried into its next turn. */
export interface BotDecision {
  readonly turn: BotTurn;
  /** Centipawns from the bot's side, or undefined before the engine has reported one. */
  readonly evaluation: number | undefined;
}
