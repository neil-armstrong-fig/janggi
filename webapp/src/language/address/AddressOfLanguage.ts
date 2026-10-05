import {DEFAULT_LANGUAGE} from "@janggi/shared/janggi/settings/LanguageName";
import type {LanguageName} from "@janggi/shared/janggi/settings/LanguageName";

/** Where the game is in a language: English at the root, any other in a folder of its own (`/ko/`). */
export function addressOfLanguage(language: LanguageName, base: string): string {
  if (language === DEFAULT_LANGUAGE) {
    return base;
  }

  return `${base}${language}/`;
}
