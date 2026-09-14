/**
 * Deals a fresh game, abandoning whatever was being played.
 *
 * The board does not clear itself when a game ends, so a new one has to be asked for. It doubles as
 * the way back to the setup pickers, which lock once a move has been played because a back rank is
 * arranged strictly before play.
 *
 * In the settings sheet, under the format and the two setups, rather than in the row of controls
 * under the board. It deals from those three, so it belongs beside them — and a control that throws a
 * game away is better a sheet away from a thumb that was reaching for Undo. Once a game has ended the
 * announcement of its result offers New game as well, there being nothing left to throw away.
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
      className="h-11 cursor-pointer rounded-xl border border-wood/40 text-sm font-semibold tracking-wide text-wood uppercase transition-[transform,background-color] duration-150 hover:bg-wood/10 active:scale-[0.98] motion-reduce:transition-none"
    >
      New game
    </button>
  );
}
