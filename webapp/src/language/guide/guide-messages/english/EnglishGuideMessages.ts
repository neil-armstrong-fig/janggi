import type {GuideMessages} from "@src/language/guide/guide-messages/GuideMessages";
import {ENGLISH_GUIDE_PIECES_MESSAGES} from "@src/language/guide/guide-pieces-messages/english/EnglishGuidePiecesMessages";
import {ENGLISH_GUIDE_QUESTIONS_MESSAGES} from "@src/language/guide/guide-questions-messages/english/EnglishGuideQuestionsMessages";
import {ENGLISH_GUIDE_RULES_MESSAGES} from "@src/language/guide/guide-rules-messages/english/EnglishGuideRulesMessages";

/** The guide in English: the original, which the Korean is translated from. It carries no translation notice. */
export const ENGLISH_GUIDE_MESSAGES: GuideMessages = {
  skipLink: "Skip to the guide",
  translationNotice: undefined,
  header: {
    homeLabel: "Janggi game",
    logoAlt: "Janggi game logo",
    brand: "Janggi",
    tagline: "장기 · Play free",
    navigationLabel: "Guide navigation",
    pieces: "Pieces",
    questions: "Questions",
    play: "Play free",
    languageLabel: "Language",
    languageNames: {en: "English", ko: "한국어"},
  },
  hero: {
    eyebrow: "The complete beginner’s guide",
    heading: "How to play Janggi (Korean chess)",
    summary:
      "Learn the board, all seven pieces and the rules that set it apart from chess. Then play a friend or the computer.",
    play: "Play Janggi for free",
    install: "Save to this device",
    startWithRules: "Start with the rules",
    tutorial: {
      start: "Learn by playing a guided game",
      resume: "Resume the guided game",
      again: "Play the guided game again",
    },
    accountNote: "Play a friend online with a Google sign-in. The AI and offline play need no account.",
    factsLabel: "Janggi quick facts",
    facts: [
      {label: "Board", value: "9 × 10 intersections"},
      {label: "Players", value: "2 · Cho and Han"},
      {label: "Pieces", value: "16 per army"},
      {label: "Goal", value: "Checkmate the general"},
    ],
  },
  introduction: {
    eyebrow: "01 · The game",
    heading: "What is Janggi?",
    game: {
      before: "",
      marked: "Janggi (장기)",
      after:
        ", usually called Korean chess in English, is a two-player strategy board game. It belongs to the same chess family as chess, xiangqi and shogi, but plays differently: an open board, long elephants, jumping cannons and active palace diagonals.",
    },
    board:
      "Pieces stand on the intersections of nine vertical files and ten horizontal ranks. Cho’s blue-green army begins at the bottom and moves first. Han’s red army begins at the top and starts scored games with an extra 1.5 points. Each general remains inside a three-by-three palace marked with diagonal lines.",
  },
  winning: {
    eyebrow: "02 · The objective",
    heading: "How to win",
    objective: {
      before: "Players alternate turns, moving one piece or choosing to pass. You win by ",
      marked: "checkmating",
      after:
        " the opposing general: attack it in a position where the other player has no legal move that removes the threat. A move that leaves your own general attacked is not legal.",
    },
    captures:
      "Captures happen by moving onto an enemy piece. Unlike chess, stalemate does not end a Janggi game because a player may skip a turn. In this app, two passes in a row stop the game and the points from the pieces still on the board decide the result.",
  },
  pieces: ENGLISH_GUIDE_PIECES_MESSAGES,
  rules: ENGLISH_GUIDE_RULES_MESSAGES,
  matchFormats: {
    eyebrow: "05 · Choose your match",
    heading: "Casual and scored Janggi",
    casual: {
      label: "Casual",
      title: "The familiar online game",
      body: "The armies begin in the common arrangement and can be rearranged before the first move. A called bikjang ends the game as a draw, and so does an agreed draw or, once both sides are under 30 points, the same position standing a third time. It's the easiest format to learn on, and the one to use for local play.",
    },
    scored: {
      label: "Scored",
      title: "The tournament reading",
      body: "Han chooses an arrangement first, Cho responds and Han begins with an extra 1.5 points. Bikjang can normally be called only when both sides have fewer than 30 points left, and the result is decided on points. So is a game that goes round in circles under 30 points.",
    },
    sources: {
      before: "This game supports both readings because published rules describe both formats. See the ",
      marked: "rule sources and research notes",
      after: " for the primary Korean sources and translations.",
    },
  },
  questions: ENGLISH_GUIDE_QUESTIONS_MESSAGES,
  closing: {
    eyebrow: "Know the rules?",
    heading: "Start a Janggi game",
    summary: "Play across the table with a friend or choose a computer opponent in Settings.",
    play: "Play Janggi for free",
  },
  footer: {
    brand: "Janggi · 장기",
    navigationLabel: "Footer navigation",
    play: "Play",
    sources: "Sources & credits",
    sourceCode: "Source code",
  },
};
