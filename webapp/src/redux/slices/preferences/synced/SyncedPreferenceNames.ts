/**
 * The preferences that follow a player from device to device: how the game is played, which does not depend on the screen
 * in the hand. Everything else about a player's preferences is that device's own — the sound (a phone on the bus, a laptop at
 * home), the look of the board and pieces, the motion, the sheet's see-through-ness, and whether the board turns for a
 * second player sat across the device — so choosing it on one device changes nothing on another.
 *
 * The list is the source and the type is read off it. Adding a preference here is what sends it to the server.
 */
export const SYNCED_PREFERENCE_NAMES = ["movableHighlight", "bikjangHint"] as const;

export type SyncedPreferenceName = (typeof SYNCED_PREFERENCE_NAMES)[number];
