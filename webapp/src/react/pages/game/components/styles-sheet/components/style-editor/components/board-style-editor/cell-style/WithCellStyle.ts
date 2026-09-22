import type {BoardStyle, CellOverrides} from "@src/styles/types/BoardStyle";
import type {BoardTarget} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/board-style-editor/board-target/types/BoardTarget";
import type {CellStyle} from "@src/styles/types/CellStyle";
import {cellStyleAt} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/board-style-editor/cell-style/CellStyleAt";
import {toPositionKey} from "@src/game/board/PositionKeys";

/**
 * The board with what is being changed changed by `update`.
 *
 * "Every point" is every point: the default cell, and every point that has a style of its own, which most
 * built-in boards give a few — a palace's centre, a checkered square. Changing the lines' colour that left
 * those behind would leave the board half changed. A single point is changed alone, and one that had no
 * style of its own is given one, made from what it wore, so changing one thing leaves the rest as it was.
 */
export function withCellStyle(
  boardStyle: BoardStyle,
  boardTarget: BoardTarget,
  update: (cellStyle: CellStyle) => CellStyle,
): BoardStyle {
  if (boardTarget.kind === "point") {
    const changedCellStyle = update(cellStyleAt(boardStyle, boardTarget));

    return {...boardStyle, cells: {...boardStyle.cells, [toPositionKey(boardTarget.position)]: changedCellStyle}};
  }

  const cellOverrides: CellOverrides | undefined =
    boardStyle.cells &&
    Object.fromEntries(Object.entries(boardStyle.cells).map(([point, cell]) => [point, update(cell)]));

  return {
    ...boardStyle,
    defaultCell: update(boardStyle.defaultCell),
    ...(cellOverrides === undefined ? {} : {cells: cellOverrides}),
  };
}
