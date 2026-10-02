import type {PreferencesSliceState} from "@src/redux/preferences/types/PreferencesSliceState";
import {SYNCED_PREFERENCE_NAMES} from "@src/redux/preferences/synced/SyncedPreferenceNames";
import type {SyncedPreferenceValues} from "@src/redux/preferences/synced/types/SyncedPreferenceValues";

/** The preferences that follow the player between devices, picked out of all of them, in the order of the list. */
export function syncedPreferencesOf(preferences: PreferencesSliceState): SyncedPreferenceValues {
  return Object.fromEntries(
    SYNCED_PREFERENCE_NAMES.map(name => [name, preferences[name]]),
  ) as unknown as SyncedPreferenceValues;
}
