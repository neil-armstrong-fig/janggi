import type {ResultMessages} from "@src/language/status/result-messages/ResultMessages";
import {englishSideName} from "@src/language/sides/english/EnglishSideName";

/** The result banner, and its explanations, in English. */
export const ENGLISH_RESULT_MESSAGES: ResultMessages = {
  won: side => `${englishSideName(side)} wins by checkmate`,
  wonOnPoints: side => `${englishSideName(side)} wins on points`,
  lostOnTime: side => `${englishSideName(side)} lost on time`,
  drawn: {bikjang: "Drawn by bikjang", repetition: "Drawn by repetition", agreement: "Drawn by agreement"},
  newGame: "New game",
  unlocked: unlocks => `🔓 Unlocked: ${unlocks}`,
  showBoard: "Show board",
  newGameAt: botElo => `New game at ${botElo}`,
  botPlaying: side => `The bot, playing ${englishSideName(side)},`,
  bikjangExplanation: (caller, drawn) => {
    const called = `${caller} called bikjang: the two generals stood facing each other down an open file, with nothing between them.`;
    if (drawn) {
      return `${called} Unlike chess, janggi lets the player to move call that a draw, so leaving the generals facing hands the other player the call.`;
    }

    return `${called} In a scored game that call ends the game, and it is settled on points.`;
  },
  repetitionExplanation: drawn => {
    const cause =
      "The same position stood a third time. With each army under thirty points, repeating is allowed, so nothing else would end it.";
    if (drawn) return `${cause} A casual game is drawn.`;

    return `${cause} A scored game has no draw, so it stops and the points decide it.`;
  },
};
