import type {MarkedText} from "@src/language/types/guide/MarkedText";

/** A question people ask about janggi, and an answer that sets one phrase apart, as bold text or as a link. */
export interface GuideMarkedAnswerMessages {
  readonly question: string;
  readonly answer: MarkedText;
}
