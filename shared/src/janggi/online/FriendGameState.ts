/**
 * Where a game against a friend has got to, as the page says it and a spec asserts it: no room yet, a room waiting for the
 * friend to arrive, both seated and choosing their arrangements, the game being played, the other player gone from it (for
 * a while), and the game over.
 */
export const FRIEND_GAME_STATES = [
  "idle",
  "waiting-for-a-friend",
  "choosing-setups",
  "playing",
  "opponent-left",
  "over",
] as const;

export type FriendGameState = (typeof FRIEND_GAME_STATES)[number];
