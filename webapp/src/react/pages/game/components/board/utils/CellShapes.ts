import type {CellShape, Diagonal, Orthogonal} from "@src/react/pages/game/components/board/types/CellShape";
import {FILE_COUNT, RANK_COUNT} from "@src/game/board/utils/BoardDimensions";
import type {Position} from "@src/game/board/types/Position";
import {palaceDiagonalStepsAt} from "@src/game/board/utils/PalaceDiagonals";

/** Which lines meet at one intersection. Geometry only — nothing here knows how they are painted. */
export function cellShapeAt(position: Position): CellShape {
  return {
    orthogonals: orthogonalsAt(position),
    diagonals: palaceDiagonalsAt(position),
  };
}

/** An edge intersection has no line leading off the board, which is what draws the outer border. */
function orthogonalsAt({file, rank}: Position): Orthogonal[] {
  const present: Orthogonal[] = [];

  if (rank > 1) present.push("north");
  if (rank < RANK_COUNT) present.push("south");
  if (file > 1) present.push("west");
  if (file < FILE_COUNT) present.push("east");

  return present;
}

/**
 * The palace X, named for the direction each segment runs in.
 *
 * Which diagonals exist is a rule of the game rather than a drawing decision — they are the lines
 * the general, chariot, cannon and soldier travel along — so the engine owns the geometry and this
 * only puts a compass name on each step it hands back.
 */
function palaceDiagonalsAt(position: Position): Diagonal[] {
  return palaceDiagonalStepsAt(position).map(({fileStep, rankStep}) => diagonalTowards(fileStep, rankStep));
}

function diagonalTowards(fileStep: number, rankStep: number): Diagonal {
  if (rankStep < 0) return fileStep < 0 ? "northWest" : "northEast";
  return fileStep < 0 ? "southWest" : "southEast";
}
