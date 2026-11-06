import type {GuideQuestionsMessages} from "@src/language/guide/guide-questions-messages/GuideQuestionsMessages";

/** The guide's questions, in English. */
export const ENGLISH_GUIDE_QUESTIONS_MESSAGES: GuideQuestionsMessages = {
  eyebrow: "06 · Quick answers",
  heading: "Janggi questions",
  chineseChess: {
    question: "Is Janggi the same as Chinese chess?",
    answer:
      "No. Janggi and Chinese xiangqi are relatives, but Janggi has no river, uses longer elephant moves, lets soldiers move sideways immediately and gives cannons, palaces and opening arrangements different rules.",
  },
  free: {
    question: "Can I play Janggi online for free?",
    answer: {
      before:
        "Yes. This browser game is free, needs no account and lets you play a friend or choose from eight computer strengths. On your phone, choose ",
      marked: "Save to this device",
      after: " near the top of this page. You can then play even when you are offline.",
    },
  },
  firstMove: {
    question: "Who moves first in Janggi?",
    answer: "Cho, the blue-green army, moves first. In scored play Han receives 1.5 points for moving second.",
  },
  passing: {
    question: "Can a player skip a turn?",
    answer:
      "Yes. Passing is legal unless the general is in check. In this game, two passes in a row end the game and the points from the pieces still on the board decide the winner.",
  },
  computer: {
    question: "Can I play Janggi against the computer?",
    answer: {
      before: "Yes. The built-in ",
      marked: "Fairy-Stockfish",
      after:
        " opponent has eight strengths from beginner to expert. You can play either Cho or Han, and your record is kept on your device.",
    },
  },
};
