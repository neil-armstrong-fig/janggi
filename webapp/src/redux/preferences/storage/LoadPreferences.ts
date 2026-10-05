import {LANGUAGE_NAMES} from "@janggi/shared/janggi/settings/LanguageName";
import {PREFERENCES_STORAGE_KEY} from "@src/redux/preferences/storage/PreferencesStorageKey";
import type {PreferencesSliceState} from "@src/redux/preferences/types/PreferencesSliceState";
import {isAmong} from "@src/redux/untrusted/IsAmong";
import {isObject} from "@src/redux/untrusted/IsObject";
import {languageOfBrowser} from "@src/redux/preferences/language/LanguageOfBrowser";
import {readJson} from "@src/redux/device-storage/ReadJson";
import {storedPreferencesFrom} from "@src/redux/preferences/preferences-from/StoredPreferencesFrom";

/**
 * The preferences kept on the device; `storedPreferencesFrom` says what is kept of what is found.
 *
 * Where no language has been chosen yet, the browser's own preference stands in for it — a first visit from
 * a Korean browser is read in Korean — and from the first choice on, the choice is what is kept.
 */
export function loadPreferences(
  storage: Pick<Storage, "getItem"> | undefined,
  browserLanguages: readonly string[] = [],
): PreferencesSliceState {
  const stored = readJson(storage, PREFERENCES_STORAGE_KEY);
  const preferences = storedPreferencesFrom(stored);
  if (isObject(stored) && isAmong(LANGUAGE_NAMES, stored.language)) return preferences;

  return {...preferences, language: languageOfBrowser(browserLanguages)};
}
