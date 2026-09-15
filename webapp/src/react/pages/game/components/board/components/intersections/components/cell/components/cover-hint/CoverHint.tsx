import {clsx} from "clsx";

/**
 * The mark on a point the piece in question would land on, were a piece of its own army not already
 * standing there: a dashed ring around that piece.
 *
 * It sits beside `MoveHint` and must never be mistaken for it, since this point is not a move — so it
 * is the capture ring's size, which says "this is where it lands", broken into dashes, which says "but
 * it cannot". Dashed rather than a different colour, because the board beneath is any style and a
 * colour is one more thing to lose against it.
 *
 * Drawn as two dashed circles, a dark one under a light one on the same dashes, for the reason
 * `MoveHint` pairs white with a dark ring: neither alone reads on both pale wood and near-black. A CSS
 * dashed border cannot do that — a `ring` under it is solid and fills the gaps back in — and leaves the
 * dash length to the browser. An `<svg>` of its own, in its own square, stays round, unlike the cell's.
 *
 * Given a delay, it pops in with the move hints, spreading outward from the piece in question.
 */
interface Props {
  /** How long to wait before popping in, in milliseconds, or undefined to appear at once. */
  readonly delay?: number;
}

export function CoverHint({delay}: Props): React.JSX.Element {
  return (
    <span
      className={clsx(
        "pointer-events-none absolute inset-0 flex items-center justify-center",
        delay !== undefined && "animate-[hint-pop_260ms_cubic-bezier(0.2,1.5,0.4,1)_both]",
      )}
      style={delay === undefined ? undefined : {animationDelay: `${delay}ms`}}
    >
      <svg viewBox="0 0 100 100" className="block h-[82%]" style={{aspectRatio: 1}} aria-hidden="true">
        <circle {...DASHED_CIRCLE} className="stroke-black/50" strokeWidth={9} />

        <circle {...DASHED_CIRCLE} className="stroke-white/90" strokeWidth={5} />
      </svg>
    </span>
  );
}

/** Twelve dashes, evenly spaced whatever the ring's radius comes to, since the length is normalised. */
const DASHED_CIRCLE = {cx: 50, cy: 50, r: 45, fill: "none", pathLength: 120, strokeDasharray: "6 4"} as const;
