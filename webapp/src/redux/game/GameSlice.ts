import {createSlice} from "@reduxjs/toolkit";

/**
 * Placeholder slice. `configureStore` needs at least one reducer to build a valid store, so this
 * exists purely to prove the Redux wiring. Replace it with real game state.
 */
export interface GameState {
  status: "idle";
}

const initialState: GameState = {
  status: "idle",
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {},
});

export const gameReducer = gameSlice.reducer;
