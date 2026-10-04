/**
 * How a player has dressed the game: the board and piece set they play on, as share keys (`share-keys/`), where they
 * are showing them. Sent whole whenever it changes, so a key left out is a look taken back.
 *
 * Everything here is the sender's own say-so, decoded and checked by whoever shows it.
 */
export interface Look {
  readonly boardKey?: string;
  readonly piecesKey?: string;
}
