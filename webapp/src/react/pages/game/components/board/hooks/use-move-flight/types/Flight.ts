import type {Move} from "@src/game/types/Move";
import type {Piece} from "@janggi/shared/janggi/pieces/Piece";

/** A piece shown travelling over the board, and whatever it knocks off where it lands. */
export interface Flight {
  /** The id of the moment it shows, so a flight is started — and finished — once. */
  readonly id: number;
  readonly piece: Piece;
  /** Facing the way the piece is shown travelling, which for a move taken back is backwards. */
  readonly move: Move;
  /** What the landing takes, or undefined where it takes nothing — as a take-back never does. */
  readonly taken: Piece | undefined;
}
