import type {FormatRating} from "@src/redux/ratings/types/FormatRating";
import type {MatchFormat} from "@janggi/shared/janggi/settings/MatchFormat";
import type {RatedGameInProgress} from "@src/redux/ratings/types/RatedGameInProgress";

/**
 * The player's ratings against the bot. **Each match format is rated apart** — casual and scored are
 * different games, and a bikjang that draws one decides the other.
 *
 * The one slice kept on the device, under `RATINGS_STORAGE_KEY`.
 */
export interface RatingsSliceState {
  readonly byFormat: Record<MatchFormat, FormatRating>;
  readonly inProgress: RatedGameInProgress | undefined;
}
