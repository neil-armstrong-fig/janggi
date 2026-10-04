/**
 * What stands over the board while the announcement of a result is put aside to look at it: a layer that takes the
 * whole board's tap, and a note across the top that says what the tap does.
 *
 * Nothing on the board explains that a tap brings the result back — the game is over, so the board would otherwise
 * do nothing at all, which looks broken. So the note says it in words, for as long as the result is put aside, and
 * the whole board is the target, not a corner of it, so there is no hidden spot to find. The pieces stay in sight
 * beneath it, and the note sits at the top edge as `RepetitionNotice` does.
 */
interface Props {
  readonly onTap: () => void;
}

export function BoardPeek({onTap}: Props): React.JSX.Element {
  return (
    <>
      <button
        type="button"
        data-testid="result-peek"
        aria-label="Show the result again"
        onClick={onTap}
        className="absolute inset-0 z-30 cursor-pointer"
      />

      <p
        role="status"
        className="pointer-events-none absolute inset-x-2 top-2 z-30 mx-auto w-fit max-w-sm rounded-xl border border-white/15 bg-ground/85 px-3 py-1.5 text-center text-xs leading-snug text-white/80 shadow-lg shadow-black backdrop-blur-sm"
      >
        Game over · tap the board to see the result
      </p>
    </>
  );
}
