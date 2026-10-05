import {ENGLISH} from "@src/language/english/English";
import {KOREAN} from "@src/language/korean/Korean";
import type {LanguageName} from "@janggi/shared/janggi/settings/LanguageName";
import type {Messages} from "@src/language/types/Messages";

/** Every word of the game, in the language asked for. */
export function messagesOf(language: LanguageName): Messages {
  return LANGUAGES[language];
}

const LANGUAGES: Record<LanguageName, Messages> = {en: ENGLISH, ko: KOREAN};
