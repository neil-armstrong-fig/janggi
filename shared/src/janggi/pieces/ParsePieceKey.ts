import type {Piece} from "./Piece.js";
import {PIECE_TYPES} from "./PieceType.js";
import {SIDES} from "./Side.js";

/**
 * Reads a piece back out of the key the webapp marked it with. The inverse of `toPieceKey`.
 *
 * Returns undefined rather than throwing on anything it does not recognise, and validates both
 * halves against the real unions — so a renamed piece type surfaces as "nothing is there" in a test
 * that asked for one, instead of as an object with a type that does not exist.
 */
export function parsePieceKey(key: string): Piece | undefined {
  const [side, type] = key.split("-");

  const army = SIDES.find(candidate => candidate === side);
  const kind = PIECE_TYPES.find(candidate => candidate === type);
  if (!army || !kind) return undefined;

  return {side: army, type: kind};
}
