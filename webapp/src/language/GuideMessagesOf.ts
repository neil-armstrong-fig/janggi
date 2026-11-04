import {ENGLISH_GUIDE} from "@src/language/english/EnglishGuide";
import {KOREAN_GUIDE} from "@src/language/korean/KoreanGuide";
import type {GuideMessages} from "@src/language/types/guide/GuideMessages";
import type {LanguageName} from "@janggi/shared/janggi/settings/LanguageName";

/** Every word of the guide, in the language asked for. */
export function guideMessagesOf(language: LanguageName): GuideMessages {
  return GUIDES[language];
}

const GUIDES: Record<LanguageName, GuideMessages> = {en: ENGLISH_GUIDE, ko: KOREAN_GUIDE};
