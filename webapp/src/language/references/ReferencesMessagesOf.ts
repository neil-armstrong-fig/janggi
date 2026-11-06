import {ENGLISH_REFERENCES_MESSAGES} from "@src/language/references/references-messages/english/EnglishReferencesMessages";
import {KOREAN_REFERENCES_MESSAGES} from "@src/language/references/references-messages/korean/KoreanReferencesMessages";
import type {LanguageName} from "@janggi/shared/janggi/settings/LanguageName";
import type {ReferencesMessages} from "@src/language/references/references-messages/ReferencesMessages";

/** Every word of the references page, in the language asked for. */
export function referencesMessagesOf(language: LanguageName): ReferencesMessages {
  return REFERENCES[language];
}

const REFERENCES: Record<LanguageName, ReferencesMessages> = {
  en: ENGLISH_REFERENCES_MESSAGES,
  ko: KOREAN_REFERENCES_MESSAGES,
};
