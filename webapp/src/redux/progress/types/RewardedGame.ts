import type {BotElo} from "@janggi/shared/janggi/settings/BotElo";
import type {GameResult} from "@src/redux/ratings/types/GameResult";
import type {MatchFormat} from "@janggi/shared/janggi/settings/MatchFormat";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/**
 * A decided game against the bot, as far as progress cares: what it was worth, and whether it beat a
 * strength of bot with an army. A `GameRecord` is one, which is how a record is credited.
 */
export interface RewardedGame {
  readonly format: MatchFormat;
  readonly botElo: BotElo;
  readonly playerSide: Side;
  readonly result: GameResult;
}
