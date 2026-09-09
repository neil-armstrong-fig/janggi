/**
 * The two games janggi is played as: the friendly decisive game (승부제) and the scored tournament
 * game (점수제), which 대한장기협회 runs separately and which gate bikjang and repetition
 * differently. Both are here because picking one silently would decide the game for every player —
 * `docs/rules.md` §6.2 has the sources and the decision.
 *
 * Unlike board and piece styles there is no user-authored case: a format is a rule of the game
 * rather than a skin, so this list is the whole set.
 */
export const MATCH_FORMATS = ["Casual", "Scored"] as const;

export type MatchFormat = (typeof MATCH_FORMATS)[number];

/** What a player gets without saying anything: the game every online implementation plays. */
export const DEFAULT_MATCH_FORMAT: MatchFormat = "Casual";
