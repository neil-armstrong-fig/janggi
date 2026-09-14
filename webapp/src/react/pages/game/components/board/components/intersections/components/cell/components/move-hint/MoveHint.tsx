import {clsx} from "clsx";

/**
 * The mark on a point the piece in hand may move to: a dot on an empty intersection, a ring around
 * whatever is standing on one it would take.
 *
 * It draws in its own square rather than in the cell's `<svg>`, for the same reason `Piece` does —
 * that `<svg>` is `preserveAspectRatio="none"` and would stretch a circle into an ellipse. It is
 * also `pointer-events-none`, so the tap it invites lands on the cell beneath it.
 *
 * Deliberately not a `CellStyle` marker: a board style is plain data a user can author, and whose
 * turn it is has no business being written into one.
 *
 * White with a dark ring rather than one flat colour, because the board underneath it is whatever
 * style is in use — pale wood for Classic, near-black for Neon — and neither a light nor a dark
 * mark alone reads on both.
 *
 * Given a delay, it pops in after it — the nearest points first and the furthest last, so the marks
 * spread outward from the piece in hand. Given none, it is simply there.
 */
interface Props {
  readonly overPiece: boolean;
  /** How long to wait before popping in, in milliseconds, or undefined to appear at once. */
  readonly delay?: number;
}

export function MoveHint({overPiece, delay}: Props): React.JSX.Element {
  return (
    <span
      className={clsx(
        "pointer-events-none absolute inset-0 flex items-center justify-center",
        delay !== undefined && "animate-[hint-pop_260ms_cubic-bezier(0.2,1.5,0.4,1)_both]",
      )}
      style={delay === undefined ? undefined : {animationDelay: `${delay}ms`}}
    >
      {!overPiece && (
        <span className="block h-[30%] rounded-full bg-white/70 ring-1 ring-black/30" style={{aspectRatio: 1}} />
      )}

      {overPiece && (
        <span
          className="block h-[82%] rounded-full border-[3px] border-white/80 ring-1 ring-black/30"
          style={{aspectRatio: 1}}
        />
      )}
    </span>
  );
}
