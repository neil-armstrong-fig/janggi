import {FILES, RANKS} from "@src/game/board/utils/BoardDimensions";
import type {Position} from "@src/game/board/types/Position";
import type {Step} from "@src/game/board/types/Step";

/**
 * Where one step from a point lands, or undefined where that is off the board.
 *
 * The arithmetic is trivial; validating the answer against `FILES` and `RANKS` rather than casting
 * it is the point. A `File` is a union of nine literals, so a number is not one until something has
 * checked — and doing that check here is what lets every rule above simply ask for a step and take
 * "nothing there" for an answer. Same idea as `parsePieceKey`.
 */
export function pointAfterStep({file, rank}: Position, {fileStep, rankStep}: Step): Position | undefined {
  const nextFile = FILES.find(candidate => candidate === file + fileStep);
  const nextRank = RANKS.find(candidate => candidate === rank + rankStep);
  if (!nextFile || !nextRank) return undefined;

  return {file: nextFile, rank: nextRank};
}
