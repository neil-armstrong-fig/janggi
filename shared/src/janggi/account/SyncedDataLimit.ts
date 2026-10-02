/**
 * The most the player's synced document may hold, in characters. A row in D1 may hold 2 MB, and one maximal piece set is
 * about 280 KB, so this is room for a few of them with the record beside them.
 *
 * Shared because both ends hold to it: the API refuses a longer document, and the app says so and stops trying rather
 * than being told, over and over, that it will not be kept.
 */
export const MAX_SYNCED_DATA_LENGTH = 1_000_000;
