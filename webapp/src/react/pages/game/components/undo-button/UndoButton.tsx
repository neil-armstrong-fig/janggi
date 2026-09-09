/**
 * Takes the last turn back, whether that was a move or a rested one.
 *
 * Taking a move back is no part of the rules of janggi — over a board you would have to ask your
 * opponent, and in a scored game the answer is no. On a phone there is nobody to ask and a mis-tap
 * is a slip rather than a decision, so the control is offered unconditionally.
 *
 * Disabled rather than hidden when there is nothing to take back, matching `PassButton`, so the row
 * of controls does not reflow under a thumb. Unlike Pass it stays *enabled* once the game is over,
 * which is the whole point of it: the turn most worth taking back is usually the one that ended the
 * game.
 */
interface Props {
  readonly enabled: boolean;
  readonly onUndo: () => void;
}

export function UndoButton({enabled, onUndo}: Props): React.JSX.Element {
  return (
    <button
      type="button"
      data-testid="undo"
      disabled={!enabled}
      onClick={onUndo}
      className="shrink-0 rounded-full border border-white/20 px-3 py-1 text-[11px] tracking-wide text-white/70 uppercase enabled:cursor-pointer disabled:opacity-30"
    >
      Undo
    </button>
  );
}
