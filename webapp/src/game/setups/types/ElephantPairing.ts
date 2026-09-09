/**
 * How two chosen arrangements sit against each other, once both players have put one elephant out by
 * a chariot and one in beside a guard — `docs/opening-setups.md` §5 and §7.
 *
 * - **엇상 (eotsang)** — both armies developed the outer elephant on the same wing of the board. The
 *   two arrangements are translations of each other.
 * - **맞상 (matsang)** — opposite wings, so the two outer elephants look straight down the diagonal
 *   at each other and must trade. The arrangements are 180-degree rotations of each other.
 *
 * Romanised the way `Outcome`'s `bikjang` is: a Korean term of art with no English equivalent keeps
 * its own name in the code, and a screen translates at the edge.
 */
export type ElephantPairing = "matsang" | "eotsang";
