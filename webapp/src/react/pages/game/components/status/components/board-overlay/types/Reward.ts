/** What a decided game against the bot earned, as its announcement says so. */
export interface Reward {
  readonly xp: number;
  /** Everything that XP was enough to unlock, as a player reads it — "Neon board". */
  readonly unlocked: readonly string[];
}
