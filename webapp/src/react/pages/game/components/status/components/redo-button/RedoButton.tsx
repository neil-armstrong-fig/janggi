/**
 * Plays again the turn most recently taken back.
 *
 * Its own component rather than a mode of `UndoButton`, because the two are separate controls a
 * player presses at different moments — and one caller is still a folder of its own here.
 *
 * It goes dead the moment play goes somewhere new, because a branch nobody returned to is not a
 * move still on offer: `playMove` and `restTurn` empty what `undo` set aside.
 */
interface Props {
  readonly enabled: boolean;
  readonly onRedo: () => void;
}

export function RedoButton({enabled, onRedo}: Props): React.JSX.Element {
  return (
    <button
      type="button"
      data-testid="redo"
      disabled={!enabled}
      onClick={onRedo}
      className="shrink-0 rounded-full border border-white/20 px-3 py-1 text-[11px] tracking-wide text-white/70 uppercase enabled:cursor-pointer disabled:opacity-30"
    >
      Redo
    </button>
  );
}
