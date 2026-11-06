/**
 * The mark on a point a piece may not go to because the move is held back — in the tutorial, where the repetition rule
 * refuses the move back. A ring struck through, in the colour of danger: no other mark on the board is crossed out, so
 * it does not read as somewhere to go. Never in the way of a tap.
 */
export function HeldBackMark(): React.JSX.Element {
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <span className="relative block h-[70%] rounded-full border-[3px] border-danger/85" style={{aspectRatio: 1}}>
        <span className="absolute top-1/2 left-1/2 block h-[3px] w-[120%] -translate-1/2 -rotate-45 rounded-full bg-danger/85" />
      </span>
    </span>
  );
}
