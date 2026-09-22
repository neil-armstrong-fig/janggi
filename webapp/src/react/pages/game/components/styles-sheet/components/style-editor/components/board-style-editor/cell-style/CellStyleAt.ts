import type {BoardStyle} from "@src/styles/types/BoardStyle";
import type {BoardTarget} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/board-style-editor/board-target/types/BoardTarget";
import type {CellStyle} from "@src/styles/types/CellStyle";
import {resolveCellStyle} from "@src/react/pages/game/components/board/components/intersections/components/cell/utils/ResolveCellStyle";

/** The style the controls show for what they are changing: a point's own, or what it wears without one. */
export function cellStyleAt(boardStyle: BoardStyle, boardTarget: BoardTarget): CellStyle {
  return boardTarget.kind === "default" ? boardStyle.defaultCell : resolveCellStyle(boardStyle, boardTarget.position);
}
