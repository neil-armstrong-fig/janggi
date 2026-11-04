/** The player's XP, how it is earned, and what it opens next. */
export interface YouProgressMessages {
  /** The XP as a heading, given the amount already written out for the language. */
  readonly xp: (amount: string) => string;
  readonly explainLabel: string;
  readonly explanation: string;
  /** What is next to unlock, given its price written out for the language and what it opens, already joined. */
  readonly nextUnlock: (xp: string, unlocks: string) => string;
  readonly allUnlocked: string;
  readonly barLabel: string;
}
