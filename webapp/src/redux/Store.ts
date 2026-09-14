import {configureStore} from "@reduxjs/toolkit";
import {GAME_STORAGE_KEY} from "@src/redux/game/storage/GameStorageKey";
import type {GameSliceState} from "@src/redux/game/types/GameSliceState";
import {PREFERENCES_STORAGE_KEY} from "@src/redux/preferences/storage/PreferencesStorageKey";
import type {PreferencesSliceState} from "@src/redux/preferences/types/PreferencesSliceState";
import {RATINGS_STORAGE_KEY} from "@src/redux/ratings/storage/RatingsStorageKey";
import type {RatingsSliceState} from "@src/redux/ratings/types/RatingsSliceState";
import {gameReducer} from "@src/redux/game/GameSlice";
import {loadGame} from "@src/redux/game/storage/LoadGame";
import {loadPreferences} from "@src/redux/preferences/storage/LoadPreferences";
import {loadRatings} from "@src/redux/ratings/storage/LoadRatings";
import {preferencesReducer} from "@src/redux/preferences/PreferencesSlice";
import {ratingsReducer} from "@src/redux/ratings/RatingsSlice";
import {restoredRatings} from "@src/redux/restored-ratings/RestoredRatings";
import {saveJson} from "@src/redux/device-storage/SaveJson";

export const store = createStore(deviceStorage());

/**
 * Every slice of the store, spelled out rather than inferred.
 *
 * `ReturnType<typeof configureStore>` — the unparameterised generic — was what stood here, and it
 * left `RootState` as an unnarrowed record, so `state.game.played` type-checked as `any` and a
 * typo in a selector went unnoticed. Naming the shape is what makes `useAppSelector` useful.
 */
export interface RootState {
  readonly game: GameSliceState;
  readonly preferences: PreferencesSliceState;
  readonly ratings: RatingsSliceState;
}

export type AppStore = ReturnType<typeof configureStore<RootState>>;
export type AppDispatch = AppStore["dispatch"];

/**
 * The store, **kept on the device**: every slice is read from `storage` when the app opens and written
 * back whenever it changes, so closing the page and opening it again finds the same game on the board,
 * the same preferences, and the same record against the bot.
 *
 * Each slice is read back by its own loader, which trusts nothing it finds and falls back to a fresh
 * start for whatever does not check out. The ratings are read in the light of the game come back to —
 * a rated game still on the board is still in progress; one that is not has been abandoned
 * (`restoredRatings`).
 */
export function createStore(storage?: Storage): AppStore {
  const game = loadGame(storage);

  const created = configureStore({
    reducer: {
      game: gameReducer,
      preferences: preferencesReducer,
      ratings: ratingsReducer,
    },
    preloadedState: {
      game,
      preferences: loadPreferences(storage),
      ratings: restoredRatings(loadRatings(storage), game, new Date().toISOString()),
    },
  });

  keptOnTheDevice(created, storage);

  return created;
}

/**
 * Writes each slice to `storage` now, and again every time that slice changes. Slices are compared by
 * identity, so a preference changed writes the preferences and nothing else, and a render that changes
 * nothing writes nothing.
 */
function keptOnTheDevice(kept: AppStore, storage: Storage | undefined): void {
  // Local rather than module constants: `store` is made at the top of this module, before anything
  // declared below it with `const` exists.
  const slices: readonly (keyof RootState)[] = ["game", "preferences", "ratings"];
  const keys: Record<keyof RootState, string> = {
    game: GAME_STORAGE_KEY,
    preferences: PREFERENCES_STORAGE_KEY,
    ratings: RATINGS_STORAGE_KEY,
  };

  let saved = kept.getState();
  slices.forEach(slice => saveJson(storage, keys[slice], saved[slice]));

  kept.subscribe(() => {
    const state = kept.getState();

    slices.forEach(slice => {
      if (state[slice] !== saved[slice]) saveJson(storage, keys[slice], state[slice]);
    });

    saved = state;
  });
}

/** `localStorage`, where there is one to reach — reading the property itself throws where it is blocked. */
function deviceStorage(): Storage | undefined {
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
}
