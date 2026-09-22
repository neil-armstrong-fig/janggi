import type {PieceSetStyle} from "@src/styles/types/PieceSetStyle";
import type {PieceTarget} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/piece-target/types/PieceTarget";
import {toPieceKey} from "@janggi/shared/janggi/pieces/ToPieceKey";

/** Whether what is being changed is a piece with a style of its own, which can be taken back. */
export function isPieceOverridden(pieceSetStyle: PieceSetStyle, pieceTarget: PieceTarget): boolean {
  return pieceTarget.kind === "piece" && pieceSetStyle.pieces?.[toPieceKey(pieceTarget.piece)] !== undefined;
}
