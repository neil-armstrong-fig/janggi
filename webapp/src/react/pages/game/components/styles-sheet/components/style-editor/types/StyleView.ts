/** The two ways to see a style being made: turned by hand, or as the raw JSON. Listed as well as typed, so the switch is read off the list. */
export const STYLE_VIEWS = ["controls", "raw"] as const;

export type StyleView = (typeof STYLE_VIEWS)[number];
