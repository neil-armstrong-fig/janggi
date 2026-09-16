import type {PayloadAction} from "@reduxjs/toolkit";
import type {ProgressSliceState} from "@src/redux/progress/types/ProgressSliceState";
import type {RewardedGame} from "@src/redux/progress/types/RewardedGame";
import {createSlice} from "@reduxjs/toolkit";
import {freshProgress} from "@src/redux/progress/fresh-progress/FreshProgress";
import {saveLoaded} from "@src/redux/saves/SaveLoaded";
import {withBeaten} from "@src/redux/progress/climbing/WithBeaten";
import {xpFor} from "@src/redux/progress/xp/XpFor";

/**
 * The player's progress: XP earned by every decided game against the bot, and the strengths beaten on
 * each of the four ladders — each army, in each format — which is what opens the rung above.
 *
 * A win is recorded on the ladder it was won on and nowhere else: the format it was played in, and the
 * army that played it. `BeatenLadders` says why.
 *
 * Nothing here is taken away by starting the record again — see `ProgressSliceState` — and a save key
 * loaded on the device replaces all of it.
 */
export const progressSlice = createSlice({
  name: "progress",
  initialState: freshProgress(),
  reducers: {
    xpEarned: (state, action: PayloadAction<RewardedGame>): ProgressSliceState => {
      const {format, botElo, playerSide, result} = action.payload;

      return {
        xp: Math.min(state.xp + xpFor(format, result), Number.MAX_SAFE_INTEGER),
        beaten: result === "won" ? withBeaten(state.beaten, format, playerSide, botElo) : state.beaten,
      };
    },
  },
  extraReducers: builder => {
    builder.addCase(saveLoaded, (_state, action): ProgressSliceState => action.payload.progress);
  },
});

export const {xpEarned} = progressSlice.actions;

export const progressReducer = progressSlice.reducer;
