import type {Piece} from "@janggi/shared/janggi/pieces/Piece";
import type {Position} from "@src/game/board/types/Position";
import {pieceAt} from "@src/game/board/lookup/PieceAt";
import {piecesByPosition} from "@src/game/board/lookup/PiecesByPosition";
import {sceneOf} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/preview-scenes/SceneOf";

/**
 * The piece standing on a point of the preview a piece set is shown on — the opening, every piece in its
 * place — or undefined for an empty point. What tapping a piece there means to the controls.
 */
export function previewPieceAt(position: Position): Piece | undefined {
  return pieceAt(OPENING, position);
}

const OPENING = piecesByPosition(sceneOf("opening").game.pieces);
