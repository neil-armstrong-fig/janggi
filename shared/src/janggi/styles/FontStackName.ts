/**
 * What each face a piece may be written in is known by.
 * Here rather than in the webapp because the words for each are in `language/`, which reaches nothing but this package.
 */
export const FONT_STACK_NAMES = ["Serif", "Sans", "Mono"] as const;

export type FontStackName = (typeof FONT_STACK_NAMES)[number];
