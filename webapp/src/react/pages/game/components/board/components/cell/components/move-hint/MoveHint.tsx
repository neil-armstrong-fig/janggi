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
 */
interface Props {
  readonly overPiece: boolean;
}

export function MoveHint({overPiece}: Props): React.JSX.Element {
  return (
    <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
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
