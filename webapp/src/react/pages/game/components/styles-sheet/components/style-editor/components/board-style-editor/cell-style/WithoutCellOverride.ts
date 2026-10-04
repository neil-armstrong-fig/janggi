import type {BoardStyle, CellOverrides} from "@src/styles/types/BoardStyle";
import type {Position} from "@janggi/engine/board/types/Position";
import {toPositionKey} from "@janggi/engine/board/PositionKeys";

/** The board with a point's own style taken back, so it wears what the rest do. */
export function withoutCellOverride(boardStyle: BoardStyle, position: Position): BoardStyle {
  if (boardStyle.cells === undefined) return boardStyle;

  const key = toPositionKey(position);
  const remainingCellOverrides: CellOverrides = Object.fromEntries(
    Object.entries(boardStyle.cells).filter(([point]) => point !== key),
  );
  const {cells: _, ...withoutCells} = boardStyle;

  return Object.keys(remainingCellOverrides).length === 0
    ? withoutCells
    : {...boardStyle, cells: remainingCellOverrides};
}
