import type {Position} from "@src/game/board/types/Position";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/**
 * The palace (궁성) is the 3x3 block of intersections on the centre files against a player's own
 * edge. The general and the guards may never leave it, and it is the only place on the board where
 * diagonals are drawn.
 *
 * One palace per army, centred on file 5, named by the point at its middle — everything else about
 * a palace is that point plus or minus one. Han holds the top of the board and Cho the bottom, so
 * the general each starts on stands one rank in from its own back rank rather than on it.
 */
const PALACE_CENTRES: Record<Side, Position> = {
  han: {file: 5, rank: 2},
  cho: {file: 5, rank: 9},
};

/** Whether a point lies inside that army's own palace. */
export function isInPalace(position: Position, side: Side): boolean {
  return isPalacePoint(position, PALACE_CENTRES[side]);
}

/**
 * The centre of whichever palace this point belongs to, or undefined out on the open board.
 *
 * Asked rather than told, because most rules that reach for a palace do not care whose it is: a
 * chariot uses the diagonals of either palace, and a soldier only the enemy's.
 */
export function palaceCentreContaining(position: Position): Position | undefined {
  return PALACE_CENTRE_LIST.find(centre => isPalacePoint(position, centre));
}

function isPalacePoint(position: Position, centre: Position): boolean {
  return Math.abs(position.file - centre.file) <= 1 && Math.abs(position.rank - centre.rank) <= 1;
}

const PALACE_CENTRE_LIST: readonly Position[] = Object.values(PALACE_CENTRES);
