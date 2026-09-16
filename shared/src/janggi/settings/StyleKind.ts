/**
 * The two kinds of style a player can own — a board, or a set of pieces — as the styles sheet names
 * them. Here rather than in the webapp because a spec says which kind of style it means in these words.
 */
export const STYLE_KINDS = ["Board", "Pieces"] as const;

export type StyleKind = (typeof STYLE_KINDS)[number];
