/**
 * Where the progress is kept in `localStorage`. Versioned, so a later change to its shape can be read
 * under a new key rather than misread under this one.
 *
 * Named in the one hint the app prints to the console, and in the comment on `UNLOCK_PRICES`: this is
 * the number a player edits to reach the Hacker theme without playing twenty-five thousand games.
 */
export const PROGRESS_STORAGE_KEY = "janggi.progress.v1";
