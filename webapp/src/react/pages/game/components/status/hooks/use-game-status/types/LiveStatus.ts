import type {GameStatus} from "@src/react/pages/game/components/status/utils/GameStatusOf";

/** What the game is doing right now, as the frame around the board reads it. */
export interface LiveStatus {
  readonly status: GameStatus;
  /** Whether the board is waiting on the bot to play. */
  readonly botsTurn: boolean;
  /** Whether the bot is holding the game's first move until the player lets it start. */
  readonly awaitingGoAhead: boolean;
}
