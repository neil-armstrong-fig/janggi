/**
 * Whether what the device holds is known to be on the server — `idle` before the first try, `paused` where the server
 * could not be used just now and will be tried again, and `too-large` where the document is past what the server
 * keeps, which trying again does not change until the player has less of it.
 */
export const SYNC_STATES = ["idle", "synced", "paused", "too-large"] as const;

export type SyncState = (typeof SYNC_STATES)[number];
