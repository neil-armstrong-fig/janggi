import {CENTRE} from "@src/react/pages/game/components/board/components/piece/utils/PieceViewBox";
import {octagonPoints} from "@src/react/pages/game/components/board/components/piece/components/piece-body/components/body-shape/utils/OctagonPoints";
import type {PieceBodyStyle} from "@src/styles/types/PieceStyle";

/**
 * One outline of a piece, at whatever radius it is asked for. The body and its inlay are the same
 * shape drawn twice, so the choice between an octagon and a circle is made once, here.
 */
interface Props {
  readonly shape: PieceBodyStyle["shape"];
  readonly radius: number;
  readonly fill: string;
  readonly stroke: string;
  readonly strokeWidth: number;
}

export function BodyShape({shape, radius, fill, stroke, strokeWidth}: Props): React.JSX.Element {
  if (shape === "disc") {
    return <circle cx={CENTRE} cy={CENTRE} r={radius} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />;
  }

  return (
    <polygon
      points={octagonPoints(radius)}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
  );
}
