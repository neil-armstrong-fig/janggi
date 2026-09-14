import {CENTRE} from "@src/react/pages/game/components/board/components/intersections/components/cell/utils/CellViewBox";
import type {
  Diagonal,
  Orthogonal,
} from "@src/react/pages/game/components/board/components/intersections/components/cell/types/CellShape";
import type {SegmentEnd} from "@src/react/pages/game/components/board/components/intersections/components/cell/components/cell-lines/components/segment/types/SegmentEnd";

/** One line, drawn from the centre of the cell towards the neighbour named by `towards`. */
interface Props {
  readonly towards: Orthogonal | Diagonal;
  readonly stroke: string;
  readonly strokeWidth: number;
}

export function Segment({towards, stroke, strokeWidth}: Props): React.JSX.Element {
  const end = SEGMENT_ENDS[towards];

  return (
    <line
      x1={CENTRE}
      y1={CENTRE}
      x2={end.x}
      y2={end.y}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
    />
  );
}

/**
 * How far past its own edge a segment is drawn. Grid tracks rarely land on whole device pixels, so
 * two neighbours meeting exactly on the boundary leave hairline gaps along the diagonals; a small
 * overlap costs nothing and closes them. The cell's `<svg>` must not clip — see `CELL_SVG_PROPS`.
 */
const OVERSHOOT = 2;

const NEAR = 0 - OVERSHOOT;
const FAR = 100 + OVERSHOOT;

const SEGMENT_ENDS: Record<Orthogonal | Diagonal, SegmentEnd> = {
  north: {x: CENTRE, y: NEAR},
  south: {x: CENTRE, y: FAR},
  west: {x: NEAR, y: CENTRE},
  east: {x: FAR, y: CENTRE},
  northWest: {x: NEAR, y: NEAR},
  northEast: {x: FAR, y: NEAR},
  southWest: {x: NEAR, y: FAR},
  southEast: {x: FAR, y: FAR},
};
