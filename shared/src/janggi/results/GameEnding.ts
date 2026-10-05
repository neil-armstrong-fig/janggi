/**
 * How a rated game came to an end: one of the engine's decided outcomes, or the player leaving
 * before there was one — which counts as a loss. A repetition or an agreement ends a casual game as a
 * draw; a scored game stopped by a repetition is a points win like any other.
 */
export const GAME_ENDINGS = ["checkmate", "points", "bikjang", "repetition", "agreement", "abandoned"] as const;

export type GameEnding = (typeof GAME_ENDINGS)[number];
