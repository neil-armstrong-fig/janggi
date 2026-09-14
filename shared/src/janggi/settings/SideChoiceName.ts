/**
 * Which army the player takes against the bot. Random is settled when the game is dealt, so a
 * game in progress always has a definite side.
 */
export const SIDE_CHOICE_NAMES = ["Cho", "Han", "Random"] as const;

export type SideChoiceName = (typeof SIDE_CHOICE_NAMES)[number];

export const DEFAULT_SIDE_CHOICE: SideChoiceName = "Cho";
