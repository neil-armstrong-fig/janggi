/**
 * Who the other army is played by: someone else at the same device, or the bot.
 *
 * Like the match format this is part of the game rather than a preference, so it is dealt — changing
 * it starts a fresh game — and it is settled before play.
 */
export const OPPONENT_NAMES = ["Human", "Bot"] as const;

export type OpponentName = (typeof OPPONENT_NAMES)[number];

export const DEFAULT_OPPONENT: OpponentName = "Human";
