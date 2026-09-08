import type {PayloadAction} from "@reduxjs/toolkit";
import {createSlice} from "@reduxjs/toolkit";
import {DEFAULT_SETUP} from "@src/game/setups/Setups";
import type {GameSliceState} from "@src/redux/game/types/GameSliceState";
import type {Move} from "@src/game/types/Move";
import type {Setup} from "@src/game/setups/types/Setup";
import {applyMove} from "@src/game/ApplyMove";
import {dealtGame} from "@src/redux/game/utils/DealtGame";

/**
 * Every reducer returns a new state rather than mutating the draft Immer hands it. The engine
 * already works that way — `applyMove` takes a state and returns one — so letting it do the work
 * and replacing the slice wholesale keeps the rules in one place and avoids threading a
 * `WritableDraft` through anything.
 */
export const gameSlice = createSlice({
  name: "game",
  initialState: dealtGame(DEFAULT_SETUP, DEFAULT_SETUP),
  reducers: {
    moved: (state, action: PayloadAction<Move>): GameSliceState => ({
      ...state,
      game: applyMove(state.game, action.payload),
      movesPlayed: state.movesPlayed + 1,
    }),

    hanSetupChosen: (state, action: PayloadAction<Setup>): GameSliceState => dealtGame(action.payload, state.choSetup),

    choSetupChosen: (state, action: PayloadAction<Setup>): GameSliceState => dealtGame(state.hanSetup, action.payload),

    restarted: (state): GameSliceState => dealtGame(state.hanSetup, state.choSetup),
  },
});

export const {moved, hanSetupChosen, choSetupChosen, restarted} = gameSlice.actions;

export const gameReducer = gameSlice.reducer;
