/** One rung of the unlock ladder: an amount of XP, and everything that opens at it. */
export interface UnlockStep {
  readonly xp: number;
  /** As a player reads them — "Neon board", "Diagram theme", "Creating your own styles". */
  readonly labels: readonly string[];
}
