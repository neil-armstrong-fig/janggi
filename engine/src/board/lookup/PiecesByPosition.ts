import type {PieceLookup} from "@janggi/engine/board/types/PieceLookup";
import type {PlacedPiece} from "@janggi/engine/board/types/PlacedPiece";
import {toPositionKey} from "@janggi/engine/board/PositionKeys";

/**
 * The pieces, indexed by where they stand.
 *
 * The board draws 90 cells and is handed at most 32 pieces, so asking each cell to search the list
 * would be 90 scans of it on every render. Indexing once is one pass.
 */
export function piecesByPosition(pieces: readonly PlacedPiece[]): PieceLookup {
  return new Map(pieces.map(({piece, position}) => [toPositionKey(position), piece]));
}
