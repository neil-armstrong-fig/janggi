/** The writings the app ships, which a piece's characters may be swapped for whole. */
export const WRITING_NAMES = ["Hanja", "Hangul"] as const;

export type WritingName = (typeof WRITING_NAMES)[number];
