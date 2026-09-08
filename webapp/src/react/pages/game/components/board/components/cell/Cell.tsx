import {CellLines} from "@src/react/pages/game/components/board/components/cell/components/cell-lines/CellLines";
import {CELL_SVG_PROPS} from "@src/react/pages/game/components/board/components/cell/utils/CellViewBox";
import {Marker} from "@src/react/pages/game/components/board/components/cell/components/marker/Marker";
import {Piece} from "@src/react/pages/game/components/board/components/piece/Piece";
import type {Piece as PieceIdentity} from "@janggi/shared/janggi/pieces/Piece";
import type {BoardStyle} from "@src/react/pages/game/components/board/cell-styles/types/BoardStyle";
import type {PieceSetStyle} from "@src/react/pages/game/components/board/piece-styles/types/PieceSetStyle";
import type {Position} from "@src/game/board/types/Position";
import {cellShapeAt} from "@src/react/pages/game/components/board/utils/CellShapes";
import {resolveCellStyle} from "@src/react/pages/game/components/board/components/cell/utils/ResolveCellStyle";
import {toPositionKey} from "@src/game/board/utils/PositionKeys";

/**
 * One intersection. Takes its geometry from the board and its appearance from the style, and is the
 * only thing that knows how to turn a `CellStyle` into pixels — which is what lets a style be plain
 * data a user can author.
 *
 * A piece standing here is drawn over the lines rather than among them, in its own square element,
 * so it keeps its shape on a board whose cells are wider than they are tall.
 */
interface Props {
  readonly position: Position;
  readonly style: BoardStyle;
  readonly pieceStyle: PieceSetStyle;
  readonly piece?: PieceIdentity;
}

export function Cell({position, style, pieceStyle, piece}: Props): React.JSX.Element {
  const cellStyle = resolveCellStyle(style, position);

  return (
    <div
      data-testid={`cell-${toPositionKey(position)}`}
      className="relative h-full w-full"
      style={{background: cellStyle.surface}}
    >
      <svg {...CELL_SVG_PROPS} className="h-full w-full">
        <CellLines shape={cellShapeAt(position)} style={cellStyle} />

        {cellStyle.marker && <Marker marker={cellStyle.marker} />}
      </svg>

      {piece && <Piece piece={piece} style={pieceStyle} />}
    </div>
  );
}
