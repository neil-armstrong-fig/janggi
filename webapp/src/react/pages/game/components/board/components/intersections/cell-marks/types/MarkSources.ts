import type {Move} from "@src/game/types/Move";
import type {PieceLookup} from "@src/game/board/types/PieceLookup";
import type {PositionKey} from "@src/game/board/types/Position";

/**
 * Everything the marks on the board are worked out from — what stands where, what is in hand and where
 * it may go, which pieces may move, the last move, and the check — as whoever draws a board holds them.
 *
 * Keys and sets rather than positions and lists, because the board asks about every point.
 */
export interface MarkSources {
  readonly pieces: PieceLookup;
  /** The point of the piece in hand, if one is. */
  readonly heldKey: PositionKey | undefined;
  /** The points the piece in hand may move to. */
  readonly reachable: ReadonlySet<PositionKey>;
  /** The points it would land on but for a piece of its own army standing there. */
  readonly covered: ReadonlySet<PositionKey>;
  /** The pieces whose owner may move them this turn. */
  readonly movable: ReadonlySet<PositionKey>;
  readonly lastMove: Move | undefined;
  /** The point of the general in check, if there is a check. */
  readonly threatenedKey: PositionKey | undefined;
  /** The points of the pieces giving check. */
  readonly attackerKeys: ReadonlySet<PositionKey>;
  /** The points among `reachable` where the move would leave the opponent a bikjang to call. */
  readonly bikjangRiskKeys: ReadonlySet<PositionKey>;
}
