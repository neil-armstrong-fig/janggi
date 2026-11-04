/**
 * The kinds of mark on a piece. Listed as well as typed, because a set somebody else wrote has its kind checked against it.
 * Here rather than in the webapp because the words for each are in `language/`, which reaches nothing but this package.
 */
export const PIECE_GLYPH_KINDS = ["character", "pictograph"] as const;

export type PieceGlyphKind = (typeof PIECE_GLYPH_KINDS)[number];
