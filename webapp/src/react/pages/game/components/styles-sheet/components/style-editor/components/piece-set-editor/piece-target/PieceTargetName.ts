import type {PieceTarget} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/piece-target/types/PieceTarget";
import type {Messages} from "@src/language/messages/Messages";

/** What the piece controls are changing, as the editor says it: `Cho`, or `Cho general`. */
export function pieceTargetName(pieceTarget: PieceTarget, messages: Messages): string {
  if (pieceTarget.kind === "side") {
    return messages.sides[pieceTarget.side];
  }

  return messages.pieceName(pieceTarget.piece);
}
