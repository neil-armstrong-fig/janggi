import {CellLines} from "@src/react/pages/game/components/board/components/cell/components/cell-lines/CellLines";
import {Marker} from "@src/react/pages/game/components/board/components/cell/components/marker/Marker";
import {CELL_SVG_PROPS} from "@src/react/pages/game/components/board/components/cell/utils/CellViewBox";
import {resolveCellStyle} from "@src/react/pages/game/components/board/components/cell/utils/ResolveCellStyle";
import type {BoardStyle} from "@src/react/pages/game/components/board/cell-styles/types/BoardStyle";
import type {Position} from "@src/react/pages/game/components/board/types/Position";
import {cellShapeAt} from "@src/react/pages/game/components/board/utils/CellShapes";
import {toPositionKey} from "@src/react/pages/game/components/board/utils/PositionKeys";

/**
 * One intersection. Takes its geometry from the board and its appearance from the style, and is the
 * only thing that knows how to turn a `CellStyle` into pixels — which is what lets a style be plain
 * data a user can author.
 */
interface Props {
  readonly position: Position;
  readonly style: BoardStyle;
}

export function Cell({position, style}: Props): React.JSX.Element {
  const cellStyle = resolveCellStyle(style, position);

  return (
    <div
      data-testid={`cell-${toPositionKey(position)}`}
      className="h-full w-full"
      style={{background: cellStyle.surface}}
    >
      <svg {...CELL_SVG_PROPS} className="h-full w-full">
        <CellLines shape={cellShapeAt(position)} style={cellStyle} />

        {cellStyle.marker && <Marker marker={cellStyle.marker} />}
      </svg>
    </div>
  );
}
