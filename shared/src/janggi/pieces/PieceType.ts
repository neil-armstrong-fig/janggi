/**
 * The seven kinds of piece, in the order a set is usually described: the general first, its army
 * after.
 *
 * Named in English rather than as 궁/차/포 because this is the name every layer spells an asset, a
 * translation key and a test assertion with. The Korean, the hanja and the drawing are all
 * presentation, and a piece set decides for itself which of them to show.
 */
export const PIECE_TYPES = ["general", "guard", "horse", "elephant", "chariot", "cannon", "soldier"] as const;

export type PieceType = (typeof PIECE_TYPES)[number];
