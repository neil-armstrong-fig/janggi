import {DEFAULT_LANGUAGE, LANGUAGE_NAMES} from "@janggi/shared/janggi/settings/LanguageName";
import type {LanguageName} from "@janggi/shared/janggi/settings/LanguageName";
import {isAmong} from "@src/redux/untrusted/IsAmong";

/**
 * The language a first visit is read in: the first of the browser's preferred languages the game has,
 * by its primary subtag (`ko-KR` is Korean), and English where it has none. Only asked while the player has not
 * chosen one, so a choice is never overruled by a browser setting.
 */
export function languageOfBrowser(preferred: readonly string[]): LanguageName {
  for (const tag of preferred) {
    const primary = tag.toLowerCase().split("-")[0];
    if (isAmong(LANGUAGE_NAMES, primary)) return primary;
  }

  return DEFAULT_LANGUAGE;
}
