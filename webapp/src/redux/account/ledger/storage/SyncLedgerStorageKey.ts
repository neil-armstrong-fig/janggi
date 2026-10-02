/**
 * Where the ledger of when things changed is kept in `localStorage`. Versioned, so a later change to its shape can
 * be read under a new key rather than misread under this one.
 */
export const SYNC_LEDGER_STORAGE_KEY = "janggi.sync-ledger.v1";
