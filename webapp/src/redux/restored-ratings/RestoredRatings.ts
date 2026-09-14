import type {GameSliceState} from "@src/redux/game/types/GameSliceState";
import type {RatedGameInProgress} from "@src/redux/ratings/types/RatedGameInProgress";
import type {RatingsSliceState} from "@src/redux/ratings/types/RatingsSliceState";
import {outcomeOf} from "@src/game/OutcomeOf";
import {ratedGameAbandoned, ratingsReducer} from "@src/redux/ratings/RatingsSlice";

/**
 * The ratings as the app opens, given the game it has come back to.
 *
 * The game on the board is kept on the device now, so a rated game left in progress when the page
 * closed is usually still there — and then it is **still in progress**: closing the page was not
 * leaving the game. Only where the game come back to is not that one — not against the bot, against
 * another strength or with the other army, not begun, already decided, or unreadable and dealt afresh —
 * has the rated game truly gone, and it is rated as abandoned, the loss starting a new game over it
 * would have been.
 */
export function restoredRatings(ratings: RatingsSliceState, game: GameSliceState, now: string): RatingsSliceState {
  const inProgress = ratings.inProgress;
  if (inProgress && isStillBeingPlayed(inProgress, game)) return ratings;

  return ratingsReducer(ratings, ratedGameAbandoned(now));
}

function isStillBeingPlayed(inProgress: RatedGameInProgress, {played, opponent}: GameSliceState): boolean {
  return (
    opponent.name === "Bot" &&
    opponent.botElo === inProgress.botElo &&
    opponent.playerSide === inProgress.playerSide &&
    played.present.format === inProgress.format &&
    played.past.length > 0 &&
    outcomeOf(played.present).kind === "undecided"
  );
}
