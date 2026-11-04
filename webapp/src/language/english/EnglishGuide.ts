import type {GuideMessages} from "@src/language/types/guide/GuideMessages";

/** The guide in English: the original, which the Korean is translated from. It carries no translation notice. */
export const ENGLISH_GUIDE: GuideMessages = {
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
  pieces: {
    eyebrow: "03 · Seven kinds of piece",
    heading: "How the pieces move",
    introduction:
      "Every piece captures the same way it normally moves. A piece may never land on a point occupied by its own army. Tap a piece below to see its movement on a small board.",
    styleLabel: "Piece style",
    styleGroupLabel: "Choose how the example pieces look",
    styles: {traditional: "Traditional", hangul: "Hangul", modern: "Modern"},
    pieces: {
      general: {
        name: "General",
        mark: "궁 · 장",
        description:
          "Moves one point along any drawn line and may never leave its own palace. Checkmate this piece to win.",
        caption: "One step along a palace line. The general stays inside its own palace.",
      },
      guard: {
        name: "Guard",
        mark: "사",
        description: "Moves exactly like the general: one point along a line, always inside its own palace.",
        caption: "One step along a palace line, without leaving the palace.",
      },
      chariot: {
        name: "Chariot",
        mark: "차",
        description:
          "Moves any distance horizontally or vertically, or along a straight palace diagonal, until blocked.",
        caption: "Any distance in a straight line, plus the straight diagonals drawn through a palace.",
      },
      cannon: {
        name: "Cannon",
        mark: "포",
        description:
          "Moves like a chariot after jumping exactly one piece. That piece cannot be another cannon, and a cannon cannot capture a cannon.",
        caption: "It must jump one piece. The outlined points are the pieces it jumps over.",
      },
      horse: {
        name: "Horse",
        mark: "마",
        description: "Steps one point straight, then one diagonally outward. Any piece on the first point blocks it.",
        caption: "One step straight, then one step diagonally out. The first step can be blocked.",
      },
      elephant: {
        name: "Elephant",
        mark: "상",
        description: "Steps one point straight, then two diagonally outward. Either point on its route can block it.",
        caption: "One step straight, then two diagonally out. Either point on the route can be blocked.",
      },
      soldier: {
        name: "Soldier",
        mark: "졸 · 병",
        description:
          "Steps one point forward or sideways, never back. In the enemy palace it can also follow a forward diagonal.",
        caption: "One step forward or sideways, plus a forward palace diagonal. Never backwards.",
      },
    },
    valuesLabel: "Janggi piece values",
    values: {
      before: "",
      marked: "Traditional values:",
      after: " chariot 13 · cannon 7 · horse 5 · elephant 3 · guard 3 · soldier 2",
    },
    sources: {
      start: "Movement and values are based on the ",
      firstLink: "Korea Janggi Association’s piece rules",
      middle: ". The ",
      secondLink: "rules research for this game",
      end: " records the translations, comparisons and decisions behind this summary.",
    },
  },
  rules: {
    eyebrow: "04 · What makes it different",
    heading: "Rules unique to Janggi",
    noRiver: {
      title: "There is no river",
      body: "The full board is open from the start. Soldiers can move sideways straight away, and elephants can cross into the opposing half.",
    },
    cannons: {
      title: "Cannons must jump",
      body: "A cannon must jump exactly one piece even for an ordinary move. It cannot jump over another cannon, and one cannon can never capture another.",
    },
    palaces: {
      title: "Palaces have active diagonals",
      body: "Generals and guards use their own palace lines. Chariots and cannons can use the diagonals in either palace, while invading soldiers can step diagonally forward.",
    },
    openings: {
      title: "You choose the opening arrangement",
      body: "Before play, each army chooses how its two horses and two elephants alternate on the back rank. The four standard arrangements change which side of the board develops first.",
    },
    passing: {
      title: "You may pass",
      body: "You can skip a turn unless your general is in check. That is why the game has no stalemate.",
    },
    bikjang: {
      title: "Facing generals create bikjang",
      body: {
        before: "When the two generals face down an open file, a player may call ",
        marked: "bikjang",
        after: " (빅장). What that call decides depends on the match format.",
      },
    },
    sources: {
      start: "The ",
      firstLink: "rules and match sources",
      middle: " cover palace lines, cannons, passing and bikjang. The ",
      secondLink: "opening research",
      end: " explains how the four starting arrangements were compared and named.",
    },
  },
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
  questions: {
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
  },
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
