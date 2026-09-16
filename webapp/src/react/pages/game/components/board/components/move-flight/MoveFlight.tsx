import type {Move} from "@src/game/types/Move";
import {Piece} from "@src/react/pages/game/components/board/components/piece/Piece";
import type {Piece as PieceIdentity} from "@janggi/shared/janggi/pieces/Piece";
import type {PieceSetStyle} from "@src/styles/types/PieceSetStyle";
import {flightDuration} from "@src/react/pages/game/components/board/motion/FlightDuration";
import {pointBox} from "@src/react/pages/game/components/board/motion/PointBox";
import {useEffect, useEffectEvent, useRef} from "react";

/**
 * A piece shown travelling from one point to another, drawn over the board while the point it is
 * going to keeps its own copy hidden.
 *
 * It is lifted as it goes and set down at the end — scaled up and shadowed at the middle of the
 * flight, squashed a touch on landing — the way a piece is picked up off a real board and put back
 * on it, rather than slid across the wood.
 *
 * Placed on the point it is **going to** and started offset back to where it came from, so its
 * resting place needs no arithmetic at all, and every frame of the flight is a GPU-composited
 * `transform` rather than a layout. The offset is written inline too, so the very first frame — before
 * the animation has started — already shows the piece where it came from, and not on its destination.
 *
 * Inert to the pointer: a player may make their next tap while a piece is still in the air.
 */
interface Props {
  readonly piece: PieceIdentity;
  /** Facing the way the piece travels. */
  readonly move: Move;
  readonly style: PieceSetStyle;
  /** Called once, when the piece touches down. */
  readonly onLanded: () => void;
}

export function MoveFlight({piece, move, style, onLanded}: Props): React.JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const land = useEffectEvent(onLanded);
  const box = pointBox(move.to);
  const start = startingOffset(move);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const origin = startingOffset(move);
    const animation = element.animate(
      [
        {transform: `translate(${origin.x}%, ${origin.y}%) scale(1)`, filter: GROUNDED},
        {transform: `translate(${origin.x / 2}%, ${origin.y / 2}%) scale(1.14)`, filter: LIFTED, offset: 0.5},
        {transform: "translate(0%, 0%) scale(0.92)", filter: GROUNDED, offset: 0.86},
        {transform: "translate(0%, 0%) scale(1)", filter: GROUNDED},
      ],
      {duration: flightDuration(move), easing: "cubic-bezier(0.3, 0.7, 0.4, 1)", fill: "forwards"},
    );

    animation.finished.then(
      () => land(),
      () => undefined,
    );

    return () => animation.cancel();
  }, [move]);

  return (
    <div
      ref={ref}
      data-testid="move-flight"
      className="pointer-events-none absolute z-20"
      style={{
        left: percent(box.left),
        top: percent(box.top),
        width: percent(box.width),
        height: percent(box.height),
        transform: `translate(${start.x}%, ${start.y}%)`,
      }}
    >
      <Piece piece={piece} style={style} emphasised={false} />
    </div>
  );
}

/** How far back the piece starts from its destination, in percent of its own box — one cell per 100. */
function startingOffset(move: Move): {x: number; y: number} {
  return {x: (move.from.file - move.to.file) * 100, y: (move.from.rank - move.to.rank) * 100};
}

function percent(fraction: number): string {
  return `${fraction * 100}%`;
}

const GROUNDED = "drop-shadow(0 0 0 rgb(0 0 0 / 0))";
const LIFTED = "drop-shadow(0 6px 5px rgb(0 0 0 / 0.45))";
