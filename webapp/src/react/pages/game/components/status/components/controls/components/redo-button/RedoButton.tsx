import {ControlButton} from "@src/react/pages/game/components/status/components/controls/components/control-button/ControlButton";

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
  return <ControlButton testId="redo" label="Redo" icon={FORWARD} enabled={enabled} onPress={onRedo} />;
}

const FORWARD = (
  <>
    <path d="m15 14 5-5-5-5" />

    <path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13" />
  </>
);
