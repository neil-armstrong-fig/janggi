import type {FormatRating} from "@src/redux/ratings/types/FormatRating";
import type {RatingsSliceState} from "@src/redux/ratings/types/RatingsSliceState";

/**
 * A player who has never played the bot: the same starting rating in both formats, no games, and
 * nothing in progress. What the slice starts from, and what anything unreadable in storage falls
 * back to.
 */
export function freshRatings(): RatingsSliceState {
  return {byFormat: {Casual: freshFormat(), Scored: freshFormat()}, inProgress: undefined};
}

function freshFormat(): FormatRating {
  return {elo: STARTING_ELO, games: []};
}

/** The middle of the bot's ladder, so a first game against any rung moves the rating sensibly. */
const STARTING_ELO = 1200;
