import type {GuideClosingMessages} from "@src/language/types/guide/GuideClosingMessages";
import type {GuideFooterMessages} from "@src/language/types/guide/GuideFooterMessages";
import type {GuideHeaderMessages} from "@src/language/types/guide/GuideHeaderMessages";
import type {GuideHeroMessages} from "@src/language/types/guide/GuideHeroMessages";
import type {GuideIntroductionMessages} from "@src/language/types/guide/GuideIntroductionMessages";
import type {GuideMatchFormatsMessages} from "@src/language/types/guide/GuideMatchFormatsMessages";
import type {GuidePiecesMessages} from "@src/language/types/guide/GuidePiecesMessages";
import type {GuideQuestionsMessages} from "@src/language/types/guide/GuideQuestionsMessages";
import type {GuideRulesMessages} from "@src/language/types/guide/GuideRulesMessages";
import type {GuideWinningMessages} from "@src/language/types/guide/GuideWinningMessages";
import type {MachineTranslationNoticeMessages} from "@src/language/types/MachineTranslationNoticeMessages";

/**
 * Every word of the guide, in one language. The guide is its own page with no store, so it is not part of `Messages`
 * (which every game page would carry) and is looked up on its own by `guideMessagesOf`. A language is a value of
 * this type, so a string left out does not compile.
 */
export interface GuideMessages {
  readonly skipLink: string;
  /** Present only in a translation, which says so before anything else. The original has none. */
  readonly translationNotice: MachineTranslationNoticeMessages | undefined;
  readonly header: GuideHeaderMessages;
  readonly hero: GuideHeroMessages;
  readonly introduction: GuideIntroductionMessages;
  readonly winning: GuideWinningMessages;
  readonly pieces: GuidePiecesMessages;
  readonly rules: GuideRulesMessages;
  readonly matchFormats: GuideMatchFormatsMessages;
  readonly questions: GuideQuestionsMessages;
  readonly closing: GuideClosingMessages;
  readonly footer: GuideFooterMessages;
}
