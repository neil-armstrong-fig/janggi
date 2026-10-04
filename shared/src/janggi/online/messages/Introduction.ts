/**
 * What a player tells the other when they sit down: the name to show, and — only if they have not turned it off, and
 * only if they are wearing one of their own — the board and piece set they play on, as share keys (`share-keys/`).
 *
 * Everything here is the sender's own say-so. The name is cleaned and the keys decoded and checked by whoever shows
 * them, and each side's setting decides whether the other's keys are used at all.
 */
export interface Introduction {
  readonly displayName: string;
  readonly boardKey?: string;
  readonly piecesKey?: string;
}
