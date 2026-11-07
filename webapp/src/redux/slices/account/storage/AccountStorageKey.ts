/**
 * Where whether the player is signed in is kept in `localStorage`. Versioned, so a later change to its shape can
 * be read under a new key rather than misread under this one.
 *
 * It is the only reason the app ever asks the server anything: a device with no such record, or one that says
 * signed out, makes no call to the API at all.
 */
export const ACCOUNT_STORAGE_KEY = "janggi.account.v1";
