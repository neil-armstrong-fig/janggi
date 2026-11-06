import type {OverlayMessages} from "@src/language/status/overlay-messages/OverlayMessages";
import {englishSideName} from "@src/language/sides/english/EnglishSideName";

/** The notices over the board, in English. */
export const ENGLISH_OVERLAY_MESSAGES: OverlayMessages = {
  drawOffer: offeredBy => `${englishSideName(offeredBy)} offers a draw`,
  drawOfferNote: "Both players have to agree to it.",
  accept: "Accept",
  decline: "Decline",
  theBot: "The bot",
  drawDeclined: who => `${who} declined the draw. The game carries on.`,
  botPlays: botSide => `The bot plays ${englishSideName(botSide)}, which moves first`,
  settingsStayOpen: "The settings stay open until it does.",
  letTheBotStart: "Let the bot start",
  wakingTheBot: "Waking the bot…",
  botCouldNotStart: "The bot could not be started",
  tryAgain: "Try again",
  repetitionNotice:
    "A move that would repeat a position a third time is not allowed. Unlike chess, repeating is no draw: the move is held back and the game carries on.",
  peekLabel: "Show the result again",
  peekNote: "Game over · tap the board to see the result",
};
