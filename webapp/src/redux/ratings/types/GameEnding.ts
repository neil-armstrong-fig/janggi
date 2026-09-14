/**
 * How a rated game came to an end: one of the engine's three decided outcomes, or the player leaving
 * before there was one — which counts as a loss.
 */
export const GAME_ENDINGS = ["checkmate", "points", "bikjang", "abandoned"] as const;

export type GameEnding = (typeof GAME_ENDINGS)[number];
