/**
 * The shapes of a piece's body. Listed as well as typed, because a set somebody else wrote has its shape checked against it.
 * Here rather than in the webapp because the words for each are in `language/`, which reaches nothing but this package.
 */
export const PIECE_BODY_SHAPES = ["octagon", "disc"] as const;

export type PieceBodyShape = (typeof PIECE_BODY_SHAPES)[number];
