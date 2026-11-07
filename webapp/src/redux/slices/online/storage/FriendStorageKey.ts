/**
 * Where the code of the room a player is in is kept in `localStorage`, and nothing else of a friend game: the room holds
 * the game, and brings it back when the player does. Versioned, so a later change to its shape is read under a new key.
 */
export const FRIEND_STORAGE_KEY = "janggi.friend.v1";
