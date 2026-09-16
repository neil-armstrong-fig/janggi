/**
 * The piece sets that ship with the app, in the order a player meets them. The three open from the
 * start come first: the board as it really looks, its characters spelled out in hangul, and drawings
 * that ask nothing of the reader. Hanja follows as the first set earned with XP.
 *
 * After those four come the themes, in the order they are unlocked, each named for the board style it
 * was made to be worn on.
 */
export const PIECE_SET_NAMES = [
  "Traditional",
  "Hangul",
  "Modern",
  "Hanja",
  "Diagram",
  "Tournament",
  "Celadon",
  "Dancheong",
  "Hacker",
] as const;

export type PieceSetName = (typeof PIECE_SET_NAMES)[number];
