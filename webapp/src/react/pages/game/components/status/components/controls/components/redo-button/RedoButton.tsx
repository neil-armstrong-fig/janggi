import {ControlButton} from "@src/react/pages/game/components/status/components/controls/components/control-button/ControlButton";
import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";
import {RedoIcon} from "@src/react/pages/game/components/svg-icon/icons/redo/RedoIcon";

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
  const {controls} = useMessages();

  return <ControlButton testId="redo" label={controls.redo} icon={<RedoIcon />} enabled={enabled} onPress={onRedo} />;
}
