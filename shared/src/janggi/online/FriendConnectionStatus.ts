/**
 * How a player's own link to the room stands, as the page says it and a spec asserts it: reaching it for the first time,
 * heard from it, or dropped and trying again. Separate from `FriendGameState`, which is the game: a game can be in
 * progress while the link to it is down.
 */
export const FRIEND_CONNECTION_STATUSES = ["connecting", "connected", "reconnecting"] as const;

export type FriendConnectionStatus = (typeof FRIEND_CONNECTION_STATUSES)[number];
