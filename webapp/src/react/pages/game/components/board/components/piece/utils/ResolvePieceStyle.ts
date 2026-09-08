import type {Piece} from "@janggi/shared/janggi/pieces/Piece";
import type {PieceSetStyle} from "@src/react/pages/game/components/board/piece-styles/types/PieceSetStyle";
import type {PieceStyle} from "@src/react/pages/game/components/board/piece-styles/types/PieceStyle";
import {toPieceKey} from "@janggi/shared/janggi/pieces/ToPieceKey";

/** The style one piece is painted with: its own override, or whatever its side wears by default. */
export function resolvePieceStyle(style: PieceSetStyle, piece: Piece): PieceStyle {
  return style.pieces?.[toPieceKey(piece)] ?? style.sides[piece.side];
}
