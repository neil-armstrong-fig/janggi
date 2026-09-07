import {configureStore} from "@reduxjs/toolkit";
import {gameReducer} from "@src/redux/game/GameSlice";

export const store = createStore();

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export function createStore(): ReturnType<typeof configureStore> {
  return configureStore({
    reducer: {
      game: gameReducer,
    },
  });
}
