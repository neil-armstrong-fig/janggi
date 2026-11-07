import type {PreferencesSliceState} from "@src/redux/slices/preferences/types/PreferencesSliceState";
import type {SyncedPreferenceName} from "@src/redux/slices/preferences/synced/SyncedPreferenceNames";

/** The part of a player's preferences that follows them between devices. */
export type SyncedPreferenceValues = Pick<PreferencesSliceState, SyncedPreferenceName>;
