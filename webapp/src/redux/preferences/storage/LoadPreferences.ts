import {PREFERENCES_STORAGE_KEY} from "@src/redux/preferences/storage/PreferencesStorageKey";
import type {PreferencesSliceState} from "@src/redux/preferences/types/PreferencesSliceState";
import {readJson} from "@src/redux/device-storage/ReadJson";
import {storedPreferencesFrom} from "@src/redux/preferences/preferences-from/StoredPreferencesFrom";

/** The preferences kept on the device; `storedPreferencesFrom` says what is kept of what is found. */
export function loadPreferences(storage: Pick<Storage, "getItem"> | undefined): PreferencesSliceState {
  return storedPreferencesFrom(readJson(storage, PREFERENCES_STORAGE_KEY));
}
