import type {GuideRulesMessages} from "@src/language/guide/guide-rules-messages/GuideRulesMessages";

/** The guide's rules section, in English. */
export const ENGLISH_GUIDE_RULES_MESSAGES: GuideRulesMessages = {
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
  repetition: {
    title: "Repeating a position",
    body: "A move that would bring the same position back a third time is not allowed. In chess that repetition would be a draw; here the move is simply not on offer. Once both sides are under 30 points it is allowed, and it ends the game: drawn in casual play, decided on points in scored play.",
  },
  sources: {
    start: "The ",
    firstLink: "rules and match sources",
    middle: " cover palace lines, cannons, passing and bikjang. The ",
    secondLink: "opening research",
    end: " explains how the four starting arrangements were compared and named.",
  },
};
