/**
 * How much the board moves as a game is played: pieces flying between points, captures landing,
 * the board shaken by a heavy one.
 *
 * "Reduced" keeps every mark that carries information — where the last move went, which general is
 * attacked — and drops the motion. Every game starts in "Full".
 */
export const EFFECTS_NAMES = ["Full", "Reduced"] as const;

export type EffectsName = (typeof EFFECTS_NAMES)[number];
