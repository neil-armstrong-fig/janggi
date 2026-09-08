import type {Piece} from "@janggi/shared/janggi/pieces/Piece";
import type {PositionKey} from "@src/game/board/types/Position";

/**
 * The pieces on a board, indexed by the intersection each one stands on.
 *
 * Named because it is passed around: the board builds one and every cell reads from it, and
 * spelling the map out at each of those would say the same thing three times without ever saying
 * what it is.
 */
export type PieceLookup = ReadonlyMap<PositionKey, Piece>;
