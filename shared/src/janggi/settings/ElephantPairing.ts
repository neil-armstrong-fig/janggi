/**
 * How two chosen arrangements sit against each other, once both players have put one elephant out
 * by a chariot and one in beside a guard — `docs/opening-setups.md` §5 and §7.
 *
 * - **엇상 (eotsang)** — both armies developed the outer elephant on the same wing of the board.
 * - **맞상 (matsang)** — opposite wings, so the two outer elephants look straight down the diagonal
 *   at each other and must trade.
 *
 * Neither is a setting a player picks: this is read off the two arrangements, and a pairing of two
 * symmetric setups is neither. It is here rather than in the engine for the reason `MatchFormat` is
 * — the name is the vocabulary a screen shows and a spec asserts, while the *rule* that decides
 * which of the two a board has come to stays in `webapp/src/game/setups/ElephantPairingOf.ts`.
 *
 * Romanised the way `Outcome`'s `bikjang` is: a Korean term of art with no English equivalent keeps
 * its own name, and the screen shows the Korean beside a plain-English gloss.
 */
export const ELEPHANT_PAIRINGS = ["matsang", "eotsang"] as const;

export type ElephantPairing = (typeof ELEPHANT_PAIRINGS)[number];
