import type {MarkedText} from "@src/language/guide/types/MarkedText";

export interface GuideWinningMessages {
  readonly eyebrow: string;
  readonly heading: string;
  /** How a game is won, with checkmate set in bold. */
  readonly objective: MarkedText;
  readonly captures: string;
}
