import type {PieceSetStyle} from "@src/styles/types/PieceSetStyle";
import type {PieceStyle} from "@src/styles/types/PieceStyle";
import type {PieceTarget} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/piece-target/types/PieceTarget";
import {resolvePieceStyle} from "@src/react/pages/game/components/board/components/piece/utils/ResolvePieceStyle";

/** The style the controls show for what they are changing: a piece's own, or what it wears without one. */
export function pieceStyleAt(pieceSetStyle: PieceSetStyle, pieceTarget: PieceTarget): PieceStyle {
  return pieceTarget.kind === "side"
    ? pieceSetStyle.sides[pieceTarget.side]
    : resolvePieceStyle(pieceSetStyle, pieceTarget.piece);
}
