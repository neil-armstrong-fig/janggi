import {ENGLISH_MESSAGES} from "@src/language/messages/english/EnglishMessages";
import {KOREAN_MESSAGES} from "@src/language/messages/korean/KoreanMessages";
import type {LanguageName} from "@janggi/shared/janggi/settings/LanguageName";
import type {Messages} from "@src/language/messages/Messages";

/** Every word of the game, in the language asked for. */
export function messagesOf(language: LanguageName): Messages {
  return LANGUAGES[language];
}

const LANGUAGES: Record<LanguageName, Messages> = {en: ENGLISH_MESSAGES, ko: KOREAN_MESSAGES};
