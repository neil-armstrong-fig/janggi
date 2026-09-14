/** How a rated game went, from the player's side of the board. */
export const GAME_RESULTS = ["won", "drawn", "lost"] as const;

export type GameResult = (typeof GAME_RESULTS)[number];
