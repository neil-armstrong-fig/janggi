import type {Position} from "@src/game/board/types/Position";

/**
 * How long after a game is dealt the piece on a point drops into place, in milliseconds.
 *
 * Each army is set out the way it is set out by hand — its back rank first, then the ranks towards the
 * river — and each rank from the middle file outwards, so the general's rank lands before the chariots
 * at its edges. Both armies are set out at once, mirrored, which is how two players lay out a board
 * across a table from each other.
 */
export function dealDelay(position: Position): number {
  const fromBack = position.rank <= HAN_LAST_RANK ? position.rank - 1 : BOARD_LAST_RANK - position.rank;
  const fromMiddle = Math.abs(position.file - MIDDLE_FILE);

  return fromBack * PER_RANK_MS + fromMiddle * PER_FILE_MS;
}

/** Han's half of the board is ranks 1-5, and Cho's is 6-10. */
const HAN_LAST_RANK = 5;
const BOARD_LAST_RANK = 10;
const MIDDLE_FILE = 5;

const PER_RANK_MS = 90;
const PER_FILE_MS = 18;
