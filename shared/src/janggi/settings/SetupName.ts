/**
 * The arrangements a player may choose before the first move.
 *
 * Unlike board and piece styles there is no user-authored case: a setup is a rule of the game
 * rather than a skin, so this list is the whole set and a `Setup`'s own name is typed as it.
 */
export const SETUP_NAMES = [
  "Inner Elephant",
  "Outer Elephant",
  "Left Elephant",
  "Right Elephant",
  "Central Chariot",
] as const;

export type SetupName = (typeof SETUP_NAMES)[number];
