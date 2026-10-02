import type {PreferencesSliceState} from "@src/redux/preferences/types/PreferencesSliceState";
import {SYNCED_PREFERENCE_NAMES} from "@src/redux/preferences/synced/SyncedPreferenceNames";

/**
 * Whether any preference that follows the player between devices differs between two states of them — and so whether
 * a change to the preferences is one the server needs to hear of. A volume turned down on a phone is not.
 */
export function haveSyncedPreferencesChanged(previous: PreferencesSliceState, current: PreferencesSliceState): boolean {
  return SYNCED_PREFERENCE_NAMES.some(name => previous[name] !== current[name]);
}
