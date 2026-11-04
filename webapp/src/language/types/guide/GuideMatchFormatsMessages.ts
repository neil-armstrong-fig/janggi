import type {GuideFormatMessages} from "@src/language/types/guide/GuideFormatMessages";
import type {MarkedText} from "@src/language/types/guide/MarkedText";

export interface GuideMatchFormatsMessages {
  readonly eyebrow: string;
  readonly heading: string;
  readonly casual: GuideFormatMessages;
  readonly scored: GuideFormatMessages;
  /** Why both are supported, linking the rule sources and research notes. */
  readonly sources: MarkedText;
}
