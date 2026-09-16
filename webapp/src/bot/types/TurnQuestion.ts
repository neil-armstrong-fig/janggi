import type {BotElo} from "@janggi/shared/janggi/settings/BotElo";
import type {PlayedGame} from "@src/game/record/types/PlayedGame";

/** What the bot is asked when its army is to move. */
export interface TurnQuestion {
  /** The record, standing at the position the bot is to play in. */
  readonly played: PlayedGame;
  readonly elo: BotElo;
  /** The evaluation the bot reached last turn, in centipawns from its side — undefined before it has one. */
  readonly evaluation: number | undefined;
}
