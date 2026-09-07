import type {Position} from "@src/react/pages/game/components/board/types/Position";
import {toPositionKey} from "@src/react/pages/game/components/board/utils/PositionKeys";
import type {BoardStyle} from "@src/react/pages/game/components/board/cell-styles/types/BoardStyle";
import type {CellStyle} from "@src/react/pages/game/components/board/cell-styles/types/CellStyle";

/** The style this one intersection is painted with: its own override, or the board's default. */
export function resolveCellStyle(style: BoardStyle, position: Position): CellStyle {
  return style.cells?.[toPositionKey(position)] ?? style.defaultCell;
}
