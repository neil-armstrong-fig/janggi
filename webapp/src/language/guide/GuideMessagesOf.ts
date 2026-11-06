import {ENGLISH_GUIDE_MESSAGES} from "@src/language/guide/guide-messages/english/EnglishGuideMessages";
import {KOREAN_GUIDE_MESSAGES} from "@src/language/guide/guide-messages/korean/KoreanGuideMessages";
import type {GuideMessages} from "@src/language/guide/guide-messages/GuideMessages";
import type {LanguageName} from "@janggi/shared/janggi/settings/LanguageName";

/** Every word of the guide, in the language asked for. */
export function guideMessagesOf(language: LanguageName): GuideMessages {
  return GUIDES[language];
}

const GUIDES: Record<LanguageName, GuideMessages> = {en: ENGLISH_GUIDE_MESSAGES, ko: KOREAN_GUIDE_MESSAGES};
