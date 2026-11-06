import type {MarkedText} from "@src/language/guide/types/MarkedText";

export interface GuideMatchFormatsMessages {
  readonly eyebrow: string;
  readonly heading: string;
  readonly casual: GuideFormatMessages;
  readonly scored: GuideFormatMessages;
  /** Why both are supported, linking the rule sources and research notes. */
  readonly sources: MarkedText;
}

/** One way of playing a match: what it is called in a word, what it is called in a line, and how it is played. */
interface GuideFormatMessages {
  readonly label: string;
  readonly title: string;
  readonly body: string;
}
