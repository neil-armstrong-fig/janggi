import type {BotElo} from "@janggi/shared/janggi/settings/BotElo";
import type {GameEnding} from "@src/redux/ratings/types/GameEnding";
import type {GameResult} from "@src/redux/ratings/types/GameResult";
import type {MatchFormat} from "@janggi/shared/janggi/settings/MatchFormat";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/** A game against the bot has had its first turn. */
interface Started {
  readonly kind: "started";
  readonly format: MatchFormat;
  readonly botElo: BotElo;
  readonly playerSide: Side;
}

/** The game in progress has been decided. */
interface Finished {
  readonly kind: "finished";
  readonly result: GameResult;
  readonly ending: GameEnding;
}

/** A new game was dealt over the one in progress. */
interface Abandoned {
  readonly kind: "abandoned";
}

/** What one change to the record means for the player's rating. Timestamps are the caller's to add. */
export type RatingEvent = Started | Finished | Abandoned;
