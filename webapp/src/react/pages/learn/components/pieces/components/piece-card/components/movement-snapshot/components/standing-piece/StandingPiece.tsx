import type {MovementPoint} from "@src/react/pages/learn/components/pieces/components/piece-card/components/movement-snapshot/types/MovementPoint";
import {Piece} from "@src/react/pages/game/components/board/components/piece/Piece";
import type {Piece as PieceIdentity} from "@janggi/shared/janggi/pieces/Piece";
import type {PieceSetStyle} from "@src/styles/types/PieceSetStyle";
import {clsx} from "clsx";
import {pointAt} from "@src/react/pages/learn/components/pieces/components/piece-card/components/movement-snapshot/geometry/PointAt";

interface Props {
  readonly at: MovementPoint;
  readonly piece: PieceIdentity;
  readonly name: string;
  readonly style: PieceSetStyle;
  readonly testId: string;
  /** How it comes and goes in the example's loop, where it is not there throughout. */
  readonly motion?: string;
  /** Left out of what is read aloud, where the figure's caption already says what it is for. */
  readonly unspoken?: boolean;
}

/** A piece drawn standing on one point of the crop, over its lines. */
export function StandingPiece({at, piece, name, style, testId, motion, unspoken}: Props): React.JSX.Element {
  return (
    <div
      className={clsx(
        "absolute z-1 aspect-square w-[15%] -translate-x-1/2 -translate-y-1/2",
        motion,
        "motion-reduce:animate-none",
      )}
      style={{left: `${pointAt(at.file)}%`, top: `${pointAt(at.rank)}%`}}
      data-testid={testId}
      aria-hidden={unspoken}
    >
      <Piece piece={piece} name={name} style={style} emphasised={false} />
    </div>
  );
}
