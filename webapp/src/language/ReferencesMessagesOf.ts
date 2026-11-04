import {ENGLISH_REFERENCES} from "@src/language/english/EnglishReferences";
import {KOREAN_REFERENCES} from "@src/language/korean/KoreanReferences";
import type {LanguageName} from "@janggi/shared/janggi/settings/LanguageName";
import type {ReferencesMessages} from "@src/language/types/references/ReferencesMessages";

/** Every word of the references page, in the language asked for. */
export function referencesMessagesOf(language: LanguageName): ReferencesMessages {
  return REFERENCES[language];
}

const REFERENCES: Record<LanguageName, ReferencesMessages> = {en: ENGLISH_REFERENCES, ko: KOREAN_REFERENCES};
