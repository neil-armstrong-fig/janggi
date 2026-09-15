/**
 * A note across the top of the board while the army to move has a move the repetition rule is holding
 * back — "동일한 수를 3회 이상 반복할 수 없다", `docs/rules.md` §6.4.
 *
 * The move itself is simply not offered, the way a move into check is not, and to a player who knows
 * chess — where a third repetition is a draw — a point that will not light up looks like a bug. So it is
 * said in words, for exactly as long as it is true.
 *
 * At the top edge rather than over the middle, so the pieces a player is weighing stay in sight, and
 * nothing here takes a tap.
 */
export function RepetitionNotice(): React.JSX.Element {
  return (
    <div
      data-testid="repetition-notice"
      role="status"
      className="pointer-events-none absolute inset-x-2 top-2 z-20 flex justify-center"
    >
      <p className="max-w-sm rounded-xl border border-white/15 bg-ground/85 px-3 py-1.5 text-center text-xs leading-snug text-white/80 shadow-lg shadow-black backdrop-blur-sm">
        <span lang="ko" className="font-semibold text-wood">
          반복 금지
        </span>{" "}
        · A move that would repeat a position a third time is not allowed. Unlike chess, repeating is no draw: the move
        is held back and the game carries on.
      </p>
    </div>
  );
}
