import type {BoardTarget} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/board-style-editor/board-target/types/BoardTarget";
import type {StyleEditorMessages} from "@src/language/types/styles/StyleEditorMessages";
import {toPositionKey} from "@janggi/engine/board/PositionKeys";

/** What the board controls are changing, as the editor says it. */
export function boardTargetName(boardTarget: BoardTarget, words: StyleEditorMessages): string {
  if (boardTarget.kind === "default") {
    return words.everyPoint;
  }

  return words.point(toPositionKey(boardTarget.position));
}
