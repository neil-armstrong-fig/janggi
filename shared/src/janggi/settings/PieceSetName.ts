/**
 * The piece sets that ship with the app, in the order a player meets them: the board as it really
 * looks, then its characters on a body a phone can render, then those characters spelled out in
 * hangul, and last the drawings, which ask nothing of the reader and teach them nothing either.
 */
export const PIECE_SET_NAMES = ["Traditional", "Hanja", "Hangul", "Modern"] as const;

export type PieceSetName = (typeof PIECE_SET_NAMES)[number];
