import type {GuideAnswerMessages} from "@src/language/types/guide/GuideAnswerMessages";
import type {GuideMarkedAnswerMessages} from "@src/language/types/guide/GuideMarkedAnswerMessages";

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
