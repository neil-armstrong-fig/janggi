import type {PieceSetStyle} from "@src/styles/types/PieceSetStyle";
import type {PieceStyle} from "@src/styles/types/PieceStyle";
import type {PieceTarget} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/piece-target/types/PieceTarget";
import {resolvePieceStyle} from "@src/react/pages/game/components/board/components/piece/utils/ResolvePieceStyle";

/** The style the controls show for what they are changing: a piece's own, or what it wears without one. */
export function pieceStyleAt(pieceSetStyle: PieceSetStyle, pieceTarget: PieceTarget): PieceStyle {
  if (pieceTarget.kind === "side") {
    return pieceSetStyle.sides[pieceTarget.side];
  }

  return resolvePieceStyle(pieceSetStyle, pieceTarget.piece);
}
