import {configureStore} from "@reduxjs/toolkit";
import type {GameSliceState} from "@src/redux/game/types/GameSliceState";
import {gameReducer} from "@src/redux/game/GameSlice";

export const store = createStore();

/**
 * Every slice of the store, spelled out rather than inferred.
 *
 * `ReturnType<typeof configureStore>` — the unparameterised generic — was what stood here, and it
 * left `RootState` as an unnarrowed record, so `state.game.turnsTaken` type-checked as `any` and a
 * typo in a selector went unnoticed. Naming the shape is what makes `useAppSelector` useful.
 */
export interface RootState {
  readonly game: GameSliceState;
}

export type AppStore = ReturnType<typeof configureStore<RootState>>;
export type AppDispatch = AppStore["dispatch"];

export function createStore(): AppStore {
  return configureStore({
    reducer: {
      game: gameReducer,
    },
  });
}
