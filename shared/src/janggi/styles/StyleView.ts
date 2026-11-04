/**
 * The two ways to see a style being made: turned by hand, or as the raw JSON.
 * Here rather than in the webapp because the words for each are in `language/`, which reaches nothing but this package.
 */
export const STYLE_VIEWS = ["controls", "raw"] as const;

export type StyleView = (typeof STYLE_VIEWS)[number];
