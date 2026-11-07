/**
 * The groups the Play tab is folded into, each one line saying what it is set to and opening in place to change it,
 * one open at a time. These are ids: a spec says which group it means by them, and the tab draws each under its
 * translated name.
 */
export const PLAY_GROUP_NAMES = ["Opponent", "Format", "Setup"] as const;

export type PlayGroupName = (typeof PLAY_GROUP_NAMES)[number];
