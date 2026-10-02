import {MAX_SYNCED_DATA_LENGTH} from "@janggi/shared/janggi/account/SyncedDataLimit";

/**
 * The most a write's body may hold, in characters: the largest document, which travels as a JSON string inside a JSON
 * body, so every quote or backslash in it is written twice. Over this is refused before it is parsed, which is what
 * keeps a client from spending the free plan's CPU on a body that was never going to be kept.
 */
export const MAX_REQUEST_LENGTH = MAX_SYNCED_DATA_LENGTH * 2 + 64;
