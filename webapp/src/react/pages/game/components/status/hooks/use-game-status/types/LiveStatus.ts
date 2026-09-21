import type {BotEngineSliceState} from "@src/redux/bot-engine/types/BotEngineSliceState";
import type {GameStatus} from "@src/react/pages/game/components/status/utils/GameStatusOf";

/** What the game is doing right now, as the frame around the board reads it. */
export interface LiveStatus {
  readonly status: GameStatus;
  /** Whether the board is waiting on the bot to play. */
  readonly botsTurn: boolean;
  /** Whether the bot is holding the game's first move until the player lets it start. */
  readonly awaitingGoAhead: boolean;
  /** Whether the game is held, board and all, until the bot's engine is ready. */
  readonly engineHoldsPlay: boolean;
  /** How the bot's engine is doing — what the hold is waiting for, or why it cannot end. */
  readonly botEngine: BotEngineSliceState;
}
