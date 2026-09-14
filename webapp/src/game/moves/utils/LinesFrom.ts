import type {Line} from "@src/game/moves/types/Line";
import {ORTHOGONAL_STEPS} from "@src/game/moves/utils/OrthogonalSteps";
import type {Position} from "@src/game/board/types/Position";
import type {Step} from "@src/game/board/types/Step";
import {pointAfterStep} from "@src/game/moves/utils/PointAfterStep";
import {palaceCentreContaining} from "@src/game/board/palaces/Palaces";
import {palaceDiagonalStepsAt} from "@src/game/board/palaces/PalaceDiagonals";

/**
 * Every line the chariot and the cannon travel along from one point: the four orthogonals out to
 * the edge of the board, and — only where one is drawn — the palace diagonals.
 *
 * The two pieces share this because the rules say they do. The Korea Janggi Association introduces
 * the cannon as moving "車와 같이", like the chariot, and then adds the jump; keeping the lines in
 * one place is what stops the two drifting apart. What each piece does *along* a line is its own
 * business.
 *
 * A palace diagonal stops at the palace wall. Either palace will do — a chariot that has invaded
 * uses the enemy's X too — and since the two palaces are seven ranks apart, a diagonal that starts
 * inside one cannot reach the other, so "still in a palace" is the whole of the test.
 */
export function linesFrom(from: Position): readonly Line[] {
  const orthogonals = ORTHOGONAL_STEPS.map(step => ray(from, step));
  const diagonals = palaceDiagonalStepsAt(from).map(step => ray(from, step).filter(isInsideAPalace));

  return [...orthogonals, ...diagonals];
}

function isInsideAPalace(position: Position): boolean {
  return palaceCentreContaining(position) !== undefined;
}

/**
 * Every point in one direction from where a piece stands, in order, out to the edge of the board.
 *
 * Geometry with no knowledge of what is standing on any of it — the chariot stops at the first
 * piece it meets and the cannon counts them, so both walk the same line and decide for themselves
 * where it ends.
 */
function ray(from: Position, step: Step): Line {
  const line: Position[] = [];

  for (let point = pointAfterStep(from, step); point; point = pointAfterStep(point, step)) {
    line.push(point);
  }

  return line;
}
