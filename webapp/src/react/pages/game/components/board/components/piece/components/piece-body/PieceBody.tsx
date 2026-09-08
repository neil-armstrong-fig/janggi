import {BodyShape} from "@src/react/pages/game/components/board/components/piece/components/piece-body/components/body-shape/BodyShape";
import {RADIUS} from "@src/react/pages/game/components/board/components/piece/utils/PieceViewBox";
import type {PieceBodyStyle} from "@src/react/pages/game/components/board/piece-styles/types/PieceStyle";

/**
 * The disc, or octagon, a piece's mark sits on, plus the optional inlay drawn inside it — which is
 * what a bevelled wooden edge and a printed ring both reduce to: the same shape at a smaller radius.
 */
interface Props {
  readonly body: PieceBodyStyle;
}

export function PieceBody({body}: Props): React.JSX.Element {
  const inlay = body.inlay;

  return (
    <>
      <BodyShape
        shape={body.shape}
        radius={RADIUS}
        fill={body.fill}
        stroke={body.stroke}
        strokeWidth={body.strokeWidth}
      />

      {inlay && (
        <BodyShape
          shape={body.shape}
          radius={RADIUS * (1 - inlay.inset)}
          fill={inlay.fill ?? "none"}
          stroke={inlay.stroke}
          strokeWidth={inlay.strokeWidth}
        />
      )}
    </>
  );
}
