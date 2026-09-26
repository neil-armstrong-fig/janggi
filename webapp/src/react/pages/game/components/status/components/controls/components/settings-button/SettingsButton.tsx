import {ControlButton} from "@src/react/pages/game/components/status/components/controls/components/control-button/ControlButton";

/**
 * Opens the settings sheet.
 *
 * In the status row rather than in `Settings` because it is reached for the way the other controls
 * are — by the thumb, under the board — while the sheet it opens is `Settings`' own. `GamePage` holds
 * whether the sheet is open, being the nearest place both can reach.
 */
interface Props {
  readonly onOpen: () => void;
}

export function SettingsButton({onOpen}: Props): React.JSX.Element {
  return (
    <ControlButton testId="settings-open" label="Settings" icon={SLIDERS} tourTarget="settings" onPress={onOpen} />
  );
}

const SLIDERS = (
  <>
    <path d="M4 7h9M19 7h1M4 17h3M13 17h7" />

    <circle cx="16" cy="7" r="2.5" />

    <circle cx="10" cy="17" r="2.5" />
  </>
);
