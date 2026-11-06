import type {RecordMessages} from "@src/language/record/record-messages/RecordMessages";
import {englishSideName} from "@src/language/sides/english/EnglishSideName";

/** The record sheet, in English. */
export const ENGLISH_RECORD_MESSAGES: RecordMessages = {
  title: "Your record",
  closeLabel: "Close your record",
  rating: format => `${format} Elo`,
  bot: "Bot",
  games: "Games",
  winsDrawsLosses: "W-D-L",
  winRate: "Win",
  winRateAs: side => `Win rate as ${englishSideName(side)}`,
  noGames: "No games against the bot yet.",
  gameLine: (botElo, side) => `Bot ${botElo} · as ${englishSideName(side)}`,
  results: {won: "Won", drawn: "Drawn", lost: "Lost"},
  endings: {
    checkmate: "checkmate",
    points: "on points",
    bikjang: "bikjang",
    repetition: "repetition",
    agreement: "agreement",
    abandoned: "left unfinished",
  },
  reset: "Reset record",
  resetLabel: "Reset your record",
  resetQuestion: "Clear your rating and every game, in both formats? This cannot be undone.",
  keepIt: "Keep it",
  resetConfirm: "Reset",
  formatsLabel: "Match format",
  credit: {
    start: "The bot is ",
    firstLink: "Fairy-Stockfish",
    middle: ", free software under the ",
    secondLink: "GPL-3.0",
    end: ". Its strengths are nominal Elo, calibrated on chess rather than janggi.",
  },
};
