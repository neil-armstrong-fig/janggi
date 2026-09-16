import type {PayloadAction} from "@reduxjs/toolkit";
import type {RatedGameFinish} from "@src/redux/ratings/types/RatedGameFinish";
import type {RatedGameInProgress} from "@src/redux/ratings/types/RatedGameInProgress";
import type {RatingsSliceState} from "@src/redux/ratings/types/RatingsSliceState";
import {createSlice} from "@reduxjs/toolkit";
import {freshRatings} from "@src/redux/ratings/fresh-ratings/FreshRatings";
import {rated} from "@src/redux/ratings/recording/Rated";

/**
 * The player's ratings against the bot, and the one game that may be under way.
 *
 * A game is **started** on its first turn, held as in progress, and **finished** or **abandoned** —
 * and it is only ever rated once, when it leaves that state. Holding it rather than rating at the end
 * alone is what lets a game the player walked away from, by reloading or closing the page, still be
 * rated as the loss it was: the store is loaded with it still in progress, and the page abandons it.
 *
 * Starting a game while another is in progress abandons the first, so no path can drop a game unrated.
 */
export const ratingsSlice = createSlice({
  name: "ratings",
  initialState: freshRatings(),
  reducers: {
    ratedGameStarted: (state, action: PayloadAction<RatedGameInProgress>): RatingsSliceState => ({
      ...rated(state, {result: "lost", ending: "abandoned", finishedAt: action.payload.startedAt}),
      inProgress: action.payload,
    }),

    ratedGameFinished: (state, action: PayloadAction<RatedGameFinish>): RatingsSliceState =>
      rated(state, action.payload),

    ratedGameAbandoned: (state, action: PayloadAction<string>): RatingsSliceState =>
      rated(state, {result: "lost", ending: "abandoned", finishedAt: action.payload}),

    /**
     * The player starting their record again: both formats back to where a newcomer starts, and every
     * game forgotten. A game still being played is not part of the record yet, so it stays in progress
     * and is rated into the fresh one when it ends — resetting is not a way out of a game going badly.
     */
    recordReset: (state): RatingsSliceState => ({byFormat: freshRatings().byFormat, inProgress: state.inProgress}),
  },
});

export const {ratedGameStarted, ratedGameFinished, ratedGameAbandoned, recordReset} = ratingsSlice.actions;

export const ratingsReducer = ratingsSlice.reducer;
