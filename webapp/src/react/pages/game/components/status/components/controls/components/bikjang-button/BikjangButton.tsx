import {ControlButton} from "@src/react/pages/game/components/status/components/controls/components/control-button/ControlButton";

/**
 * Calls the bikjang — 빅장, the two generals come to face each other down an open file and either
 * player may stop the game on it. See `docs/rules.md` §6.2.
 *
 * A control rather than a gesture on the board, for the reason `PassButton` is one: calling a
 * bikjang moves nothing, so there is no intersection for it to be a tap on. The generals are already
 * standing where they need to stand — what is missing is somebody saying so.
 *
 * Disabled rather than hidden when there is nothing to call, so the row does not reflow under a
 * thumb every time a general steps off a file. It is disabled far more often than `Pass` is: in a
 * casual game whenever the generals are not facing, and in a scored one until both armies are under
 * thirty points as well.
 */
interface Props {
  readonly enabled: boolean;
  readonly onCall: () => void;
}

export function BikjangButton({enabled, onCall}: Props): React.JSX.Element {
  return <ControlButton testId="bikjang" label="Bikjang" icon={FACING} enabled={enabled} onPress={onCall} />;
}

/** Two generals at either end of one open file — the position being called. */
const FACING = (
  <>
    <circle cx="12" cy="5" r="2.5" />

    <circle cx="12" cy="19" r="2.5" />

    <path d="M12 8.5v7" />
  </>
);
