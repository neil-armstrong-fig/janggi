import type {BotDuty} from "@src/react/pages/game/types/BotDuty";
import type {TurnQuestion} from "@src/bot/types/TurnQuestion";

/**
 * What the bot is asked whenever the game is waiting on it — a turn's question plus what it is being
 * waited on *for*, since a duty may be a layout rather than a move.
 */
export interface ReplyQuestion extends TurnQuestion {
  readonly duty: BotDuty;
  /** Stops a layout part-way through the searches it asks; a turn is stopped through the engine. */
  readonly signal: AbortSignal;
}
