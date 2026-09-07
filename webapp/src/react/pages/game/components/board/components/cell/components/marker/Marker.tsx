import {CENTRE} from "@src/react/pages/game/components/board/components/cell/utils/CellViewBox";
import type {CellMarker} from "@src/react/pages/game/components/board/cell-styles/types/CellStyle";

/** The shape a style can put on the intersection itself, drawn over the lines. */
interface Props {
  readonly marker: CellMarker;
}

export function Marker({marker}: Props): React.JSX.Element {
  const filled = marker.shape === "dot";

  return (
    <circle
      cx={CENTRE}
      cy={CENTRE}
      r={marker.radius}
      fill={filled ? marker.colour : "none"}
      stroke={filled ? "none" : marker.colour}
      strokeWidth={marker.strokeWidth ?? 1}
      vectorEffect="non-scaling-stroke"
    />
  );
}
