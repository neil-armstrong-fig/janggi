import type {LastMoveEnd} from "@src/react/pages/game/components/board/components/intersections/types/LastMoveEnd";
import type {MovableEmphasis} from "@src/react/pages/game/components/board/components/intersections/types/MovableEmphasis";
import type {Piece} from "@janggi/shared/janggi/pieces/Piece";

/** What a single intersection is marked with, and what stands on it. */
export interface CellMarks {
  readonly piece: Piece | undefined;
  readonly selected: boolean;
  readonly canMoveTo: boolean;
  /** Whether the piece in hand would land here, but for the piece of its own army standing here. */
  readonly covered: boolean;
  readonly movable: MovableEmphasis | undefined;
  readonly lastMove: LastMoveEnd | undefined;
  readonly underAttack: boolean;
  readonly attacking: boolean;
  /** Whether the piece in question moving here would leave the opponent a bikjang to call. */
  readonly bikjangRisk: boolean;
}
