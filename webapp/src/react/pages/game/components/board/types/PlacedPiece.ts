import type {Piece} from "@janggi/shared/janggi/pieces/Piece";
import type {Position} from "@src/react/pages/game/components/board/types/Position";

/** A piece and the intersection it stands on. What the board is handed in order to draw a game. */
export interface PlacedPiece {
  readonly piece: Piece;
  readonly position: Position;
}
