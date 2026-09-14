/**
 * Where the game on the board is kept in `localStorage`. Versioned, so a later change to the shape of
 * a game can be read under a new key rather than misread under this one.
 */
export const GAME_STORAGE_KEY = "janggi.game.v1";
