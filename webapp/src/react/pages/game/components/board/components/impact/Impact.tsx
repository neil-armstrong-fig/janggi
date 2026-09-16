import type {Move} from "@src/game/types/Move";
import {Piece} from "@src/react/pages/game/components/board/components/piece/Piece";
import type {Piece as PieceIdentity} from "@janggi/shared/janggi/pieces/Piece";
import type {PieceSetStyle} from "@src/styles/types/PieceSetStyle";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {Vector} from "@src/react/pages/game/components/board/types/Vector";
import {chipPaths} from "@src/react/pages/game/components/board/components/impact/utils/ChipPaths";
import {flightDuration} from "@src/react/pages/game/components/board/motion/FlightDuration";
import {headingOf} from "@src/react/pages/game/components/board/components/impact/utils/HeadingOf";
import {pointBox} from "@src/react/pages/game/components/board/motion/PointBox";
import {shakeImpulse} from "@src/react/pages/game/components/board/components/impact/utils/ShakeImpulse";
import {useEffect, useEffectEvent, useMemo, useRef} from "react";

/**
 * A capture landing: the taken piece stands its ground while the capturing one flies in, then is
 * knocked off the point — thrown on in the direction of the blow, spinning, shrinking and darkening —
 * while a ring breaks outward from the point and chips of wood fly ahead of it.
 *
 * The taken piece is already gone from the position by the time this is drawn, so this is where it is
 * drawn instead, for as long as it takes to be knocked away. That is what lets it be hit at all.
 *
 * There is a short hold between the capturing piece touching down and the taken one moving — the
 * hit-stop, a few frames in which the blow has landed and nothing has given yet — and the board is
 * shoved at the end of it, which is the moment the blow reads as struck.
 *
 * How much of all this there is follows what was taken: a soldier throws three chips, a chariot ten,
 * and the shove is as hard as the piece was worth.
 */
interface Props {
  /** The capturing move, facing the way it travelled. */
  readonly move: Move;
  readonly taken: PieceIdentity;
  readonly style: PieceSetStyle;
  /** Scatters the chips, so each capture's are its own and the same on every render. */
  readonly seed: number;
  /** Called once, as the blow lands and the taken piece gives, with the shove it gives the board. */
  readonly onStrike: (impulse: Vector) => void;
  /** Called once, when everything thrown off has come to rest. */
  readonly onSettled: () => void;
}

export function Impact({move, taken, style, seed, onStrike, onSettled}: Props): React.JSX.Element {
  const pieceRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const strike = useEffectEvent(() => onStrike(shakeImpulse(move, taken.type)));
  const settle = useEffectEvent(onSettled);

  const box = pointBox(move.to);
  const heading = headingOf(move);
  const chips = useMemo(() => chipPaths(CHIPS[taken.type], headingOf(move), seed), [move, taken.type, seed]);

  useEffect(() => {
    const delay = flightDuration(move) + HIT_STOP_MS;
    const ahead = headingOf(move);
    const animations: Animation[] = [];

    const knocked = pieceRef.current?.animate(
      [
        {transform: "translate(0%, 0%) rotate(0deg) scale(1)", opacity: 1, filter: "brightness(1)"},
        {
          transform: `translate(${ahead.x * 45}%, ${ahead.y * 45}%) rotate(${ahead.x >= 0 ? 50 : -50}deg) scale(0.35)`,
          opacity: 0,
          filter: "brightness(0.4)",
        },
      ],
      {duration: KNOCK_MS, delay, easing: "cubic-bezier(0.3, 0, 0.8, 0.6)", fill: "forwards"},
    );
    if (knocked) animations.push(knocked);

    const ring = ringRef.current?.animate(
      [
        {transform: "scale(0.35)", opacity: 0.9},
        {transform: "scale(1.7)", opacity: 0},
      ],
      {duration: RING_MS, delay, easing: "cubic-bezier(0.1, 0.6, 0.3, 1)", fill: "forwards"},
    );
    if (ring) animations.push(ring);

    Array.from(chipsRef.current?.children ?? []).forEach((element, index) => {
      const chip = chips[index];
      if (!chip) return;

      animations.push(
        element.animate(
          [
            {transform: "translate(0%, 0%) rotate(0deg)", opacity: 1},
            {transform: `translate(${chip.across * 100}%, ${chip.down * 100}%) rotate(${chip.spin}deg)`, opacity: 0},
          ],
          {duration: CHIP_MS, delay, easing: "cubic-bezier(0.1, 0.7, 0.4, 1)", fill: "forwards"},
        ),
      );
    });

    const timer = window.setTimeout(() => strike(), delay);

    Promise.all(animations.map(animation => animation.finished)).then(
      () => settle(),
      () => undefined,
    );

    return () => {
      window.clearTimeout(timer);
      animations.forEach(animation => animation.cancel());
    };
  }, [move, chips]);

  return (
    <div
      data-testid="impact"
      data-heading={`${heading.x},${heading.y}`}
      className="pointer-events-none absolute z-10"
      style={{left: percent(box.left), top: percent(box.top), width: percent(box.width), height: percent(box.height)}}
    >
      <div ref={pieceRef} className="absolute inset-0">
        <Piece piece={taken} style={style} emphasised={false} />
      </div>

      <span className="absolute inset-0 flex items-center justify-center">
        <span
          ref={ringRef}
          className="block h-[90%] rounded-full border-[3px] border-white opacity-0"
          style={{aspectRatio: 1}}
        />
      </span>

      <div ref={chipsRef}>
        {chips.map(chip => (
          <span key={chip.id} className="absolute inset-0 flex items-center justify-center opacity-0">
            <span className="block h-[14%] w-[8%] rounded-[1px] bg-wood shadow-sm shadow-black/40" />
          </span>
        ))}
      </div>
    </div>
  );
}

function percent(fraction: number): string {
  return `${fraction * 100}%`;
}

/** How many chips each kind of piece throws off when it is taken, a soldier fewest and a chariot most. */
const CHIPS: Record<PieceType, number> = {
  general: 12,
  chariot: 10,
  cannon: 8,
  horse: 6,
  elephant: 5,
  guard: 5,
  soldier: 3,
};

/** The hold between the blow landing and anything giving — long enough to feel, short enough not to wait on. */
const HIT_STOP_MS = 60;

const KNOCK_MS = 380;
const RING_MS = 420;
const CHIP_MS = 460;
