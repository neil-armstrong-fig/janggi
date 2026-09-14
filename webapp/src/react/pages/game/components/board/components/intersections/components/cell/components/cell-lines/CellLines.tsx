import {Segment} from "@src/react/pages/game/components/board/components/intersections/components/cell/components/cell-lines/components/segment/Segment";
import type {CellStyle} from "@src/react/pages/game/components/board/cell-styles/types/CellStyle";
import type {CellShape} from "@src/react/pages/game/components/board/components/intersections/components/cell/types/CellShape";

/**
 * The lines of one intersection, drawn from the centre of the cell out to its edges, so that the
 * halves drawn by two neighbours meet and read as one continuous line.
 *
 * Which lines exist is geometry; how they look is the cell's style. Neither is decided here.
 */
interface Props {
  readonly shape: CellShape;
  readonly style: CellStyle;
}

export function CellLines({shape, style}: Props): React.JSX.Element {
  const diagonalStroke = style.diagonalStroke ?? style.stroke;
  const diagonalStrokeWidth = style.diagonalStrokeWidth ?? style.strokeWidth;

  return (
    <>
      {shape.orthogonals.map(direction => (
        <Segment key={direction} towards={direction} stroke={style.stroke} strokeWidth={style.strokeWidth} />
      ))}

      {shape.diagonals.map(direction => (
        <Segment key={direction} towards={direction} stroke={diagonalStroke} strokeWidth={diagonalStrokeWidth} />
      ))}
    </>
  );
}
