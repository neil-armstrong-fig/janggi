/**
 * The writings the app ships, which a piece's characters may be swapped for whole.
 * Here rather than in the webapp because the words for each are in `language/`, which reaches nothing but this package.
 */
export const WRITING_NAMES = ["Hanja", "Hangul"] as const;

export type WritingName = (typeof WRITING_NAMES)[number];
