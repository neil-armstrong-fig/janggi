import type {CellShape, Diagonal, Orthogonal} from "@src/react/pages/game/components/board/types/CellShape";
import {FILE_COUNT, RANK_COUNT} from "@src/react/pages/game/components/board/utils/BoardDimensions";
import type {Position} from "@src/react/pages/game/components/board/types/Position";

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
 * The palace (궁) is a 3x3 block of intersections on the centre files, against a player's back edge,
 * crossed by an X of diagonals from its centre to its four corners. So the centre carries all four
 * segments, each corner carries the one pointing back at the centre, and the four mid-edge
 * intersections carry none.
 */
function palaceDiagonalsAt(position: Position): Diagonal[] {
  const centre = palaceCentreContaining(position);
  if (!centre) return [];

  const fileOffset = position.file - centre.file;
  const rankOffset = position.rank - centre.rank;

  if (fileOffset === 0 && rankOffset === 0) return ["northWest", "northEast", "southWest", "southEast"];
  if (fileOffset === 0 || rankOffset === 0) return [];

  return [diagonalTowards(-fileOffset, -rankOffset)];
}

function palaceCentreContaining(position: Position): Position | undefined {
  return PALACE_CENTRES.find(
    centre => Math.abs(position.file - centre.file) <= 1 && Math.abs(position.rank - centre.rank) <= 1,
  );
}

function diagonalTowards(fileStep: number, rankStep: number): Diagonal {
  if (rankStep < 0) return fileStep < 0 ? "northWest" : "northEast";
  return fileStep < 0 ? "southWest" : "southEast";
}

/** One palace against each back edge, centred on file 5. */
const PALACE_CENTRES: readonly Position[] = [
  {file: 5, rank: 2},
  {file: 5, rank: 9},
];
