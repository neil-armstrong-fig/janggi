/**
 * Every sound effect the game makes, one per thing a player should hear happen.
 *
 * Kept to the events a player acts on or needs told about. A sound for every hover would be the
 * effects turning into noise — a quiet move is heard sixty times a game, and each extra sound on top
 * of it is heard as often.
 */
export const CUE_NAMES = [
  "pieceLifted",
  "piecePlaced",
  "pieceTaken",
  "turnRested",
  "turnTakenBack",
  "check",
  "checkmate",
  "pointsWin",
  "bikjang",
  "dealt",
  "controlPressed",
] as const;

export type CueName = (typeof CUE_NAMES)[number];
