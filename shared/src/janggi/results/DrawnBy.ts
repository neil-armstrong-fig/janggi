/**
 * The three ways a game of janggi is drawn, all of them in a casual game only — the scored format
 * has no draw, and each of these settles on points there instead. A bikjang is called, a repetition
 * happens to the players once each side is under thirty points, and an agreement is a draw offered
 * and accepted. `docs/rules.md` §6.2 and §6.4 have the sources.
 *
 * Vocabulary rather than a rule: which position draws is the engine's, but the turn line names the
 * ending and a spec asserts it, so both need the same three words.
 */
export const DRAWN_BY = ["bikjang", "repetition", "agreement"] as const;

export type DrawnBy = (typeof DRAWN_BY)[number];
