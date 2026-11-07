import type {BotElo} from "@janggi/shared/janggi/settings/BotElo";
import type {MatchFormat} from "@janggi/shared/janggi/settings/MatchFormat";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/**
 * A game against the bot that has begun and not yet been rated. Stored, so that a player who closes
 * the page mid-game finds it rated as the loss it was when they come back.
 */
export interface RatedGameInProgress {
  readonly format: MatchFormat;
  readonly botElo: BotElo;
  readonly playerSide: Side;
  /** ISO 8601. */
  readonly startedAt: string;
}
