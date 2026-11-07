import type {Move} from "@janggi/engine/types/Move";
import type {Position} from "@janggi/engine/board/types/Position";
import type {WireMove} from "@janggi/shared/janggi/online/messages/action/WireMove";
import {FILE_COUNT, RANK_COUNT} from "@janggi/engine/board/BoardDimensions";

/** The engine's move for one off the wire, or undefined where a point is not on the board — the room checks, and so does this. */
export function moveFromWire({from, to}: WireMove): Move | undefined {
  const start = positionOf(from.file, from.rank);
  const end = positionOf(to.file, to.rank);
  if (start !== undefined && end !== undefined) {
    return {from: start, to: end};
  }

  return undefined;
}

function positionOf(file: number, rank: number): Position | undefined {
  const onBoard =
    Number.isInteger(file) &&
    Number.isInteger(rank) &&
    file >= 1 &&
    file <= FILE_COUNT &&
    rank >= 1 &&
    rank <= RANK_COUNT;
  if (onBoard) {
    return {file, rank} as Position;
  }

  return undefined;
}
