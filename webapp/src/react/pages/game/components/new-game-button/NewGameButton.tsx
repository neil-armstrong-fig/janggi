/**
 * Deals a fresh game, abandoning whatever was being played.
 *
 * There is no other way out of a finished game: janggi ends in checkmate, and the board does not
 * clear itself. It doubles as the way back to the setup pickers, which lock once a move has been
 * played because a back rank is arranged strictly before play.
 */
interface Props {
  readonly onStart: () => void;
}

export function NewGameButton({onStart}: Props): React.JSX.Element {
  return (
    <button
      type="button"
      data-testid="new-game"
      onClick={onStart}
      className="shrink-0 cursor-pointer rounded-full border border-white/20 px-3 py-1 text-[11px] tracking-wide text-white/70 uppercase"
    >
      New game
    </button>
  );
}
