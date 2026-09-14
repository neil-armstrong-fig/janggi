import type {LastMoveEnd} from "@src/react/pages/game/components/board/components/intersections/types/LastMoveEnd";
import type {Move} from "@src/game/types/Move";
import type {Position} from "@src/game/board/types/Position";
import {toPositionKey} from "@src/game/board/PositionKeys";

/** Which end of the last move a point was, or undefined where there was no last move or it did not touch the point. */
export function lastMoveEndAt(lastMove: Move | undefined, position: Position): LastMoveEnd | undefined {
  if (!lastMove) return undefined;

  const key = toPositionKey(position);
  if (toPositionKey(lastMove.from) === key) return "from";
  if (toPositionKey(lastMove.to) === key) return "to";

  return undefined;
}
