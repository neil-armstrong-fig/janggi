/**
 * A point on the board as it crosses the wire: plain numbers, because what arrives is untrusted until the receiver has
 * checked it against the board's own `File` and `Rank` (the engine's, which `shared` may not import).
 */
export interface WirePoint {
  readonly file: number;
  readonly rank: number;
}
