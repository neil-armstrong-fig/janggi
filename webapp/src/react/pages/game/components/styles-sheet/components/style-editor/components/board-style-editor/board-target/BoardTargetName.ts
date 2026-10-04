import type {BoardTarget} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/board-style-editor/board-target/types/BoardTarget";
import {toPositionKey} from "@janggi/engine/board/PositionKeys";

/** What the board controls are changing, as the editor says it. */
export function boardTargetName(boardTarget: BoardTarget): string {
  if (boardTarget.kind === "default") {
    return "Every point";
  }

  return `Point ${toPositionKey(boardTarget.position)}`;
}
