import type {Position} from "@src/game/board/types/Position";
import {toPositionKey} from "@src/game/board/PositionKeys";
import type {BoardStyle} from "@src/styles/types/BoardStyle";
import type {CellStyle} from "@src/styles/types/CellStyle";

/** The style this one intersection is painted with: its own override, or the board's default. */
export function resolveCellStyle(style: BoardStyle, position: Position): CellStyle {
  return style.cells?.[toPositionKey(position)] ?? style.defaultCell;
}
