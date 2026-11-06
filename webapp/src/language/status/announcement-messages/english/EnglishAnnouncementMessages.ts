import type {AnnouncementMessages} from "@src/language/status/announcement-messages/AnnouncementMessages";
import {englishSideName} from "@src/language/sides/english/EnglishSideName";

/** The turn line over the board, in English. */
export const ENGLISH_ANNOUNCEMENT_MESSAGES: AnnouncementMessages = {
  botUnavailable: "Bot unavailable",
  botLoading: "Bot is loading",
  botLayingOut: "Bot is laying out",
  botThinking: "Bot is thinking",
  won: side => `${englishSideName(side)} wins`,
  wonOnPoints: side => `${englishSideName(side)} wins on points`,
  drawn: {bikjang: "Drawn by bikjang", repetition: "Drawn by repetition", agreement: "Drawn by agreement"},
  inCheck: side => `${englishSideName(side)} is in check`,
  toMove: side => `${englishSideName(side)} to move`,
  layingOut: side => `${englishSideName(side)} to lay out`,
};
