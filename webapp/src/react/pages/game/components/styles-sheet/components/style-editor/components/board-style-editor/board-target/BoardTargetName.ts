import type {BoardTarget} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/board-style-editor/board-target/types/BoardTarget";
import {toPositionKey} from "@src/game/board/PositionKeys";

/** What the board controls are changing, as the editor says it. */
export function boardTargetName(boardTarget: BoardTarget): string {
  return boardTarget.kind === "default" ? "Every point" : `Point ${toPositionKey(boardTarget.position)}`;
}
