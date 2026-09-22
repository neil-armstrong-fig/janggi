import type {BoardStyle} from "@src/styles/types/BoardStyle";
import type {BoardTarget} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/board-style-editor/board-target/types/BoardTarget";
import {toPositionKey} from "@src/game/board/PositionKeys";

/** Whether what is being changed is a point with a style of its own, which can be taken back. */
export function isCellOverridden(boardStyle: BoardStyle, boardTarget: BoardTarget): boolean {
  return boardTarget.kind === "point" && boardStyle.cells?.[toPositionKey(boardTarget.position)] !== undefined;
}
