import type {Setup} from "@src/react/pages/game/components/board/setups/types/Setup";

/**
 * Janggi has no single fixed opening position. Before the first move each player arranges their own
 * back rank, choosing where the horses and elephants stand, and the two choices are independent —
 * so 16 opening positions are reachable. Han lays out first and may not then revise; Cho, having
 * seen it, answers, which makes Cho the one who decides what kind of game it becomes.
 *
 * The setups are named for where the elephants sit relative to the guards, because that is the only
 * thing that varies: a horse and the elephant beside it swap in pairs, so the four tournament
 * arrangements are the four ways to answer "inside or outside?" once per flank.
 */
const innerElephant: Setup = {
  name: "Inner Elephant",
  korean: "안상차림",
  description: "Both elephants beside the guards, both horses out by the chariots. The usual choice.",
  backRank: ["chariot", "horse", "elephant", "guard", undefined, "guard", "elephant", "horse", "chariot"],
};

const outerElephant: Setup = {
  name: "Outer Elephant",
  korean: "밖상차림",
  description: "Both elephants out by the chariots, leaving both horses covering the palace.",
  backRank: ["chariot", "elephant", "horse", "guard", undefined, "guard", "horse", "elephant", "chariot"],
};

const leftElephant: Setup = {
  name: "Left Elephant",
  korean: "왼상차림",
  description: "One of each: the elephant out on the player's left, in on their right.",
  backRank: ["chariot", "elephant", "horse", "guard", undefined, "guard", "elephant", "horse", "chariot"],
};

const rightElephant: Setup = {
  name: "Right Elephant",
  korean: "오른상차림",
  description: "The mirror image of the left: elephant out on the player's right, in on their left.",
  backRank: ["chariot", "horse", "elephant", "guard", undefined, "guard", "horse", "elephant", "chariot"],
};

/**
 * A fifth arrangement, dropped from South Korean tournament rules but still played casually and in
 * North Korea. Listed because a setup is a whole back rank rather than a horse-elephant swap, and
 * this is the one that proves it: no other setup moves the chariots.
 */
const centralChariot: Setup = {
  name: "Central Chariot",
  korean: "귀차차림",
  description: "Chariots drawn in beside the guards. Casual play only — not a tournament setup.",
  backRank: ["elephant", "horse", "chariot", "guard", undefined, "guard", "chariot", "horse", "elephant"],
};

export const SETUPS: readonly Setup[] = [innerElephant, outerElephant, leftElephant, rightElephant, centralChariot];

export const DEFAULT_SETUP: Setup = innerElephant;
