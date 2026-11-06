import type {MarkedText} from "@src/language/guide/types/MarkedText";

export interface GuideQuestionsMessages {
  readonly eyebrow: string;
  readonly heading: string;
  readonly chineseChess: GuideAnswerMessages;
  /** Answered with the button that saves the game to the device set in bold. */
  readonly free: GuideMarkedAnswerMessages;
  readonly firstMove: GuideAnswerMessages;
  readonly passing: GuideAnswerMessages;
  /** Answered with the engine that plays the bot, linked. */
  readonly computer: GuideMarkedAnswerMessages;
}

/** A question people ask about janggi, and the answer in plain text. */
interface GuideAnswerMessages {
  readonly question: string;
  readonly answer: string;
}

/** A question people ask about janggi, and an answer that sets one phrase apart, as bold text or as a link. */
interface GuideMarkedAnswerMessages {
  readonly question: string;
  readonly answer: MarkedText;
}
