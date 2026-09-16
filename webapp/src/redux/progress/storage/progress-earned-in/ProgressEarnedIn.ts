import {MATCH_FORMATS} from "@janggi/shared/janggi/settings/MatchFormat";
import type {ProgressSliceState} from "@src/redux/progress/types/ProgressSliceState";
import type {RatingsSliceState} from "@src/redux/ratings/types/RatingsSliceState";
import {freshProgress} from "@src/redux/progress/fresh-progress/FreshProgress";
import {progressReducer, xpEarned} from "@src/redux/progress/ProgressSlice";

/**
 * The progress a record of games against the bot would have earned, had progress been kept while they
 * were played: every decided game credited exactly as one decided now is, through the slice itself.
 * A game abandoned was worth nothing then and is worth nothing now.
 */
export function progressEarnedIn(ratings: RatingsSliceState): ProgressSliceState {
  return MATCH_FORMATS.flatMap(format => ratings.byFormat[format].games)
    .filter(game => game.ending !== "abandoned")
    .reduce((progress, game) => progressReducer(progress, xpEarned(game)), freshProgress());
}
