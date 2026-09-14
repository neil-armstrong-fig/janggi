import type {Position} from "@src/game/board/types/Position";
import type {Step} from "@src/game/board/types/Step";
import {palaceCentreContaining} from "@src/game/board/palaces/Palaces";

/**
 * The diagonals a piece may travel along from one point, as the steps leading away from it.
 *
 * Four diagonals are drawn inside each palace, from its centre out to its four corners. **A piece
 * may only move diagonally where a diagonal is actually drawn**, so this is the whole of the rule:
 * the centre carries all four, each corner carries the one pointing back at the centre, and the
 * four mid-edge points carry none at all. Everywhere else on the board there are no diagonals.
 *
 * The board draws its palace X from this same list, so what is painted and what is legal cannot
 * drift apart. See `docs/rules.md` §2.
 */
export function palaceDiagonalStepsAt(position: Position): readonly Step[] {
  const centre = palaceCentreContaining(position);
  if (!centre) return [];

  const fileOffset = position.file - centre.file;
  const rankOffset = position.rank - centre.rank;

  if (fileOffset === 0 && rankOffset === 0) return DIAGONAL_STEPS;

  // A mid-edge point is level with the centre on one axis, and no diagonal reaches it.
  if (fileOffset === 0 || rankOffset === 0) return [];

  return [{fileStep: -fileOffset, rankStep: -rankOffset}];
}

/** The four diagonals, as seen from the centre of a palace. */
const DIAGONAL_STEPS: readonly Step[] = [
  {fileStep: -1, rankStep: -1},
  {fileStep: 1, rankStep: -1},
  {fileStep: -1, rankStep: 1},
  {fileStep: 1, rankStep: 1},
];
