import type {BotElo} from "@janggi/shared/janggi/settings/BotElo";
import type {GameEnding} from "@janggi/shared/janggi/results/GameEnding";
import type {GameResult} from "@janggi/shared/janggi/results/GameResult";
import type {MatchFormat} from "@janggi/shared/janggi/settings/MatchFormat";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/**
 * One rated game against the bot, as it is kept. What the record page shows — win rates, how each side
 * fares — is worked out from a list of these, never stored beside it.
 */
export interface GameRecord {
  readonly format: MatchFormat;
  readonly botElo: BotElo;
  readonly playerSide: Side;
  readonly result: GameResult;
  readonly ending: GameEnding;
  readonly eloBefore: number;
  readonly eloAfter: number;
  /** ISO 8601. */
  readonly finishedAt: string;
}
