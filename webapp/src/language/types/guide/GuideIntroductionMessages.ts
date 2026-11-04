import type {MarkedText} from "@src/language/types/guide/MarkedText";

export interface GuideIntroductionMessages {
  readonly eyebrow: string;
  readonly heading: string;
  /** What the game is, with its name set in bold. */
  readonly game: MarkedText;
  readonly board: string;
}
