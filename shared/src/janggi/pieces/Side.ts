/**
 * The two armies, named for the states that fought the Chu-Han contention. Han is red; Cho is
 * blue-green and moves first.
 *
 * The names are the pieces' own, not the screen's — "top" and "bottom" are a rendering decision,
 * and a board flipped for the second player must not turn a Cho piece into a Han one.
 *
 * The list is the source and the type is read off it, so the two cannot drift apart.
 */
export const SIDES = ["han", "cho"] as const;

export type Side = (typeof SIDES)[number];
