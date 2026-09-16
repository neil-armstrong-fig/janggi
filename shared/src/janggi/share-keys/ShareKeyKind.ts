/**
 * What a share key carries, which is also the word it opens with — `janggi-save:`, `janggi-board:`,
 * `janggi-pieces:` — so a key pasted into the wrong box is told apart before anything is decoded.
 */
export const SHARE_KEY_KINDS = ["save", "board", "pieces"] as const;

export type ShareKeyKind = (typeof SHARE_KEY_KINDS)[number];
