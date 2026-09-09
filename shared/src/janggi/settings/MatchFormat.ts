/**
 * The two games janggi is played as.
 *
 * Both are here because the sources describe genuinely different rules rather than the same rule
 * differently, and the split is by match format rather than by who is right: 대한장기협회 runs
 * 승부제 and 점수제 separately — the friendly decisive game, and the scored tournament game — and
 * both bikjang and repetition are gated in the second and unrestricted in the first. Picking one
 * silently would decide the game for every player, so the player says which. See `docs/rules.md`
 * §6.2 and §6.4.
 *
 * Unlike board and piece styles there is no user-authored case: a format is a rule of the game
 * rather than a skin, so this list is the whole set.
 */
export const MATCH_FORMATS = ["Casual", "Scored"] as const;

export type MatchFormat = (typeof MATCH_FORMATS)[number];
