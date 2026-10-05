import type {Side} from "@janggi/shared/janggi/pieces/Side";

/** What the game says over the board when it needs an answer or is waiting: a draw offered, the bot to start, the bot's engine. */
export interface OverlayMessages {
  /** The question over the board, after the Korean word for a draw that heads it in every language. */
  readonly drawOffer: (offeredBy: Side) => string;
  readonly drawOfferNote: string;
  readonly accept: string;
  readonly decline: string;
  /** How the bot is named in a sentence about what it has done. */
  readonly theBot: string;
  readonly drawDeclined: (who: string) => string;
  readonly botPlays: (botSide: Side) => string;
  readonly settingsStayOpen: string;
  readonly letTheBotStart: string;
  readonly wakingTheBot: string;
  readonly botCouldNotStart: string;
  readonly tryAgain: string;
  /** What the note says while a move is held back for repeating a position, after the Korean words that head it in every language. */
  readonly repetitionNotice: string;
}
