import type {Piece} from "@janggi/shared/janggi/pieces/Piece";
import type {PieceLookup} from "@src/react/pages/game/components/board/types/PieceLookup";
import type {Position} from "@src/react/pages/game/components/board/types/Position";
import {toPositionKey} from "@src/react/pages/game/components/board/utils/PositionKeys";

/** What stands on one intersection. Nothing stands on most of the board, hence the undefined. */
export function pieceAt(pieces: PieceLookup, position: Position): Piece | undefined {
  return pieces.get(toPositionKey(position));
}
