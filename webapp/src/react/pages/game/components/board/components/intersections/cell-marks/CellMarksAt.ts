import type {CellMarks} from "@src/react/pages/game/components/board/components/intersections/cell-marks/types/CellMarks";
import type {MarkSources} from "@src/react/pages/game/components/board/components/intersections/cell-marks/types/MarkSources";
import type {Position} from "@src/game/board/types/Position";
import {emphasisFor} from "@src/react/pages/game/components/board/components/intersections/movable-pieces/EmphasisFor";
import {lastMoveEndAt} from "@src/react/pages/game/components/board/components/intersections/last-move/LastMoveEndAt";
import {pieceAt} from "@src/game/board/lookup/PieceAt";
import {toPositionKey} from "@src/game/board/PositionKeys";

/**
 * What one intersection is marked with, worked out from the whole board — so the board that is played on
 * and any other that shows one (the style editor's preview) mark a point by the same rules, and cannot
 * come to disagree about what a mark means.
 *
 * Only what the game and the piece in hand say. What a cell does about the pointer or a move in flight
 * is the board's own business, and stays with it.
 */
export function cellMarksAt(position: Position, markSources: MarkSources): CellMarks {
  const key = toPositionKey(position);

  return {
    piece: pieceAt(markSources.pieces, position),
    selected: markSources.heldKey === key,
    canMoveTo: markSources.reachable.has(key),
    covered: markSources.covered.has(key),
    movable: emphasisFor(markSources.movable, position, markSources.heldKey !== undefined),
    lastMove: lastMoveEndAt(markSources.lastMove, position),
    underAttack: markSources.threatenedKey === key,
    attacking: markSources.attackerKeys.has(key),
    bikjangRisk: markSources.bikjangRiskKeys.has(key),
  };
}
