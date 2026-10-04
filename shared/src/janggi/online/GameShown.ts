/**
 * Which of a player's games is on the board while one with a friend is on: their own — against the bot, or two people at the
 * one device — or the one with the friend. The other waits, and the friend's goes on being played by the room meanwhile.
 */
export const GAMES_SHOWN = ["local", "friend"] as const;

export type GameShown = (typeof GAMES_SHOWN)[number];
