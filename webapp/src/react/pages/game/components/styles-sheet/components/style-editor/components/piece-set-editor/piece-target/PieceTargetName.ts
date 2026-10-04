import type {PieceTarget} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/piece-target/types/PieceTarget";
import {pieceName} from "@src/react/pages/game/components/board/components/piece/utils/PieceNames";
import {sideName} from "@src/react/pages/game/utils/SideNames";

/** What the piece controls are changing, as the editor says it: `Cho`, or `Cho general`. */
export function pieceTargetName(pieceTarget: PieceTarget): string {
  if (pieceTarget.kind === "side") {
    return sideName(pieceTarget.side);
  }

  return pieceName(pieceTarget.piece);
}
