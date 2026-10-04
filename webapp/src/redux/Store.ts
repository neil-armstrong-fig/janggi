import {configureStore} from "@reduxjs/toolkit";
import {ACCOUNT_STORAGE_KEY} from "@src/redux/account/storage/AccountStorageKey";
import type {AccountSliceState} from "@src/redux/account/types/AccountSliceState";
import type {AppStartListening} from "@src/redux/account/listening/AppStartListening";
import {accountReducer} from "@src/redux/account/AccountSlice";
import {SYNC_LEDGER_STORAGE_KEY} from "@src/redux/account/ledger/storage/SyncLedgerStorageKey";
import type {SyncLedgerSliceState} from "@src/redux/account/ledger/types/SyncLedgerSliceState";
import {caughtUpLedger} from "@src/redux/account/stamping/CaughtUpLedger";
import {createListenerMiddleware} from "@reduxjs/toolkit";
import {keepInStep} from "@src/redux/account/syncing/KeepInStep";
import {loadSyncLedger} from "@src/redux/account/ledger/storage/LoadSyncLedger";
import {stampChanges} from "@src/redux/account/stamping/StampChanges";
import {syncLedgerReducer} from "@src/redux/account/ledger/SyncLedgerSlice";
import {loadAccount} from "@src/redux/account/storage/LoadAccount";
import {restoreSession} from "@src/redux/account/actions/RestoreSession";
import type {BotEngineSliceState} from "@src/redux/bot-engine/types/BotEngineSliceState";
import {CUSTOM_STYLES_STORAGE_KEY} from "@src/redux/custom-styles/storage/CustomStylesStorageKey";
import type {CustomStylesSliceState} from "@src/redux/custom-styles/types/CustomStylesSliceState";
import {GAME_STORAGE_KEY} from "@src/redux/game/storage/GameStorageKey";
import {ONBOARDING_STORAGE_KEY} from "@janggi/shared/janggi/onboarding/OnboardingStorage";
import {PROGRESS_STORAGE_KEY} from "@src/redux/progress/storage/ProgressStorageKey";
import type {OnboardingSliceState} from "@src/redux/onboarding/types/OnboardingSliceState";
import type {SettingsSliceState} from "@src/redux/settings/types/SettingsSliceState";
import type {ProgressSliceState} from "@src/redux/progress/types/ProgressSliceState";
import {toastReducer} from "@src/redux/toast/ToastSlice";
import type {ToastSliceState} from "@src/redux/toast/types/ToastSliceState";
import {botEngineReducer} from "@src/redux/bot-engine/BotEngineSlice";
import {botKeptWithinReach} from "@src/redux/game/GameSlice";
import {customStylesReducer} from "@src/redux/custom-styles/CustomStylesSlice";
import {loadCustomStyles} from "@src/redux/custom-styles/storage/LoadCustomStyles";
import {loadProgress} from "@src/redux/progress/storage/LoadProgress";
import {progressFromDebug} from "@src/redux/debug/ProgressFromDebug";
import {progressReducer} from "@src/redux/progress/ProgressSlice";
import type {GameSliceState} from "@src/redux/game/types/GameSliceState";
import {PREFERENCES_STORAGE_KEY} from "@src/redux/preferences/storage/PreferencesStorageKey";
import type {PreferencesSliceState} from "@src/redux/preferences/types/PreferencesSliceState";
import {RATINGS_STORAGE_KEY} from "@src/redux/ratings/storage/RatingsStorageKey";
import type {RatingsSliceState} from "@src/redux/ratings/types/RatingsSliceState";
import {gameReducer} from "@src/redux/game/GameSlice";
import {loadGame} from "@src/redux/game/storage/LoadGame";
import {loadOnboarding} from "@src/redux/onboarding/storage/LoadOnboarding";
import {loadPreferences} from "@src/redux/preferences/storage/LoadPreferences";
import {loadRatings} from "@src/redux/ratings/storage/LoadRatings";
import {settingsReducer} from "@src/redux/settings/SettingsSlice";
import {onboardingReducer} from "@src/redux/onboarding/OnboardingSlice";
import {preferencesReducer} from "@src/redux/preferences/PreferencesSlice";
import {ratingsReducer} from "@src/redux/ratings/RatingsSlice";
import {friendReducer} from "@src/redux/online/FriendSlice";
import type {FriendSliceState} from "@src/redux/online/types/FriendSliceState";
import {FRIEND_STORAGE_KEY} from "@src/redux/online/storage/FriendStorageKey";
import {loadFriend} from "@src/redux/online/storage/LoadFriend";
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
  readonly progress: ProgressSliceState;
  readonly customStyles: CustomStylesSliceState;
  readonly botEngine: BotEngineSliceState;
  readonly onboarding: OnboardingSliceState;
  readonly settings: SettingsSliceState;
  readonly account: AccountSliceState;
  readonly syncLedger: SyncLedgerSliceState;
  readonly friend: FriendSliceState;
  readonly toast: ToastSliceState;
}

/**
 * The slices that are written to the device. The engine's is not, being what this page has started, and nor
 * are the sheets' or the toast's: a page opens with none up.
 */
type KeptSlice = Exclude<keyof RootState, "botEngine" | "settings" | "toast">;

/** What is compared, to know a slice has changed, and then written: a slice itself, except where what is kept is less than the slice (`keptValue`). */
type KeptValue = RootState[KeptSlice] | string | undefined;

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
 *
 * The progress is read in the light of the record, which a device that has never kept progress is
 * credited from (`loadProgress`); and the game in the light of the progress, so a game not yet begun is
 * never left set against a bot the player has not reached (`botKeptWithinReach`).
 *
 * **`VITE_DEBUG_XP` opens the app at whatever progress it names**, over whatever is stored —
 * `VITE_DEBUG_XP=640 pnpm start`, or a whole progress as JSON for one that has beaten bots as well. It is
 * for working on what XP unlocks without playing to it; what it sets is then kept on the device like any
 * other progress, so unset it and reload to go back to what was there. `ListenForDebugMessages` is the
 * same door at runtime, which is the one the acceptance tests use.
 */
export function createStore(storage?: Storage): AppStore {
  const ratings = loadRatings(storage);
  const progress = progressFromDebug(import.meta.env.VITE_DEBUG_XP) ?? loadProgress(storage, ratings);
  const game = gameReducer(loadGame(storage), botKeptWithinReach(progress.beaten));

  const listening = createListenerMiddleware();
  const created = configureStore({
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(listening.middleware),
    reducer: {
      game: gameReducer,
      preferences: preferencesReducer,
      ratings: ratingsReducer,
      progress: progressReducer,
      customStyles: customStylesReducer,
      botEngine: botEngineReducer,
      onboarding: onboardingReducer,
      settings: settingsReducer,
      account: accountReducer,
      syncLedger: syncLedgerReducer,
      friend: friendReducer,
      toast: toastReducer,
    },
    preloadedState: {
      game,
      preferences: loadPreferences(storage),
      ratings: restoredRatings(ratings, game, new Date().toISOString()),
      progress,
      customStyles: loadCustomStyles(storage),
      onboarding: loadOnboarding(storage),
      account: loadAccount(storage),
      syncLedger: loadSyncLedger(storage),
      friend: loadFriend(storage),
    },
  });

  keptOnTheDevice(created, storage);
  stampChanges(listening.startListening as AppStartListening);
  keepInStep(listening.startListening as AppStartListening);
  caughtUpLedger(created);
  if (created.getState().account.status !== "signed-out") void created.dispatch(restoreSession());

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
  const slices: readonly KeptSlice[] = [
    "game",
    "preferences",
    "ratings",
    "progress",
    "customStyles",
    "onboarding",
    "syncLedger",
    "account",
    "friend",
  ];
  const keys: Record<KeptSlice, string> = {
    friend: FRIEND_STORAGE_KEY,
    game: GAME_STORAGE_KEY,
    preferences: PREFERENCES_STORAGE_KEY,
    ratings: RATINGS_STORAGE_KEY,
    progress: PROGRESS_STORAGE_KEY,
    customStyles: CUSTOM_STYLES_STORAGE_KEY,
    onboarding: ONBOARDING_STORAGE_KEY,
    account: ACCOUNT_STORAGE_KEY,
    syncLedger: SYNC_LEDGER_STORAGE_KEY,
  };

  let saved = kept.getState();
  slices.forEach(slice => saveJson(storage, keys[slice], writtenOf(slice, keptValue(saved, slice))));

  kept.subscribe(() => {
    const state = kept.getState();

    slices.forEach(slice => {
      const value = keptValue(state, slice);
      if (value !== keptValue(saved, slice)) saveJson(storage, keys[slice], writtenOf(slice, value));
    });

    saved = state;
  });

  // Firefox for Android commits `localStorage` to disk five seconds after the last write, and a swipe
  // away from the app switcher kills the page with no warning, so a game started in the last five
  // seconds is lost and the one before it comes back. Writing everything again as the page is hidden is
  // the last chance a page is given. Best effort: the browser decides when the disk sees it.
  const writeAll = (): void => {
    return slices.forEach(slice => saveJson(storage, keys[slice], writtenOf(slice, keptValue(kept.getState(), slice))));
  };
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") writeAll();
  });
  window.addEventListener("pagehide", writeAll);
}

/**
 * What is kept of a slice. Nearly always the slice; but while a friend game is on the board, **the game kept is the one it
 * set aside**, so a reload brings back the player's own game rather than a friend's — which the room holds, and puts back
 * (`friend/FriendSlice.ts`). And of the friend slice only the room's code is kept.
 */
function keptValue(state: RootState, slice: KeptSlice): KeptValue {
  if (slice === "game") {
    if (state.friend.viewing === "friend") return state.friend.parkedGame ?? state.game;

    return state.game;
  }

  if (slice === "friend") return state.friend.code;

  return state[slice];
}

function writtenOf(slice: KeptSlice, value: KeptValue): unknown {
  if (slice === "friend") return {code: value};

  return value;
}

/** `localStorage`, where there is one to reach — reading the property itself throws where it is blocked. */
function deviceStorage(): Storage | undefined {
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
}
