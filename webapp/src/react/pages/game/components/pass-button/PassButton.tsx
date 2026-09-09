/**
 * Rests the turn — 한수쉼, which a player traditionally signals by lifting the general off the board
 * and setting it back down.
 *
 * It has to be a control rather than a gesture on the board, because resting a turn is the one
 * thing a player does that touches no intersection. It is also the only way out of a position with
 * nothing to play: janggi has no stalemate, so a player with no legal move is not lost, merely
 * stuck until they pass. See `docs/rules.md` §6.3.
 *
 * Disabled rather than hidden when the turn may not be rested — while a check is waiting to be
 * answered, or once the game is over — so the control does not appear and vanish under a thumb.
 */
interface Props {
  readonly enabled: boolean;
  readonly onPass: () => void;
}

export function PassButton({enabled, onPass}: Props): React.JSX.Element {
  return (
    <button
      type="button"
      data-testid="pass"
      disabled={!enabled}
      onClick={onPass}
      className="shrink-0 rounded-full border border-white/20 px-3 py-1 text-[11px] tracking-wide text-white/70 uppercase enabled:cursor-pointer disabled:opacity-30"
    >
      Pass
    </button>
  );
}
