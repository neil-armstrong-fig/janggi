/** A game as the engine is shown it: a position, and every turn played from it since. */
export interface History {
  readonly fen: string;
  readonly moves: readonly string[];
}
