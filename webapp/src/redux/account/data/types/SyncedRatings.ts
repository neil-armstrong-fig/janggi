import type {FormatRating} from "@src/redux/ratings/types/FormatRating";
import type {MatchFormat} from "@janggi/shared/janggi/settings/MatchFormat";

/** The player's record against the bot as the sync holds it. */
export interface SyncedRatings {
  readonly byFormat: Readonly<Record<MatchFormat, FormatRating>>;
  /** Games finished before this are of a record the player has since started again. */
  readonly resetAt: string | undefined;
}
