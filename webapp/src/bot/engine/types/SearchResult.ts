/** What the engine answered. */
export interface SearchResult {
  /** Its `bestmove`, exactly as it wrote it. Parsed by the caller, never trusted. */
  readonly bestMove: string;
  /**
   * Its last reported score, in centipawns from the point of view of the army it was asked to move for —
   * or undefined where it reported none, or only a mate distance.
   */
  readonly evaluation: number | undefined;
}
