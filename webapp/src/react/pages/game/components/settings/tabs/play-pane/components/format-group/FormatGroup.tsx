import {MatchFormatSetting} from "@src/react/pages/game/components/settings/tabs/play-pane/components/format-group/components/match-format-setting/MatchFormatSetting";
import {SettingsGroup} from "@src/react/pages/game/components/settings/components/settings-group/SettingsGroup";
import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";
import {useAppSelector} from "@src/redux/Hooks";

/** Which of janggi's two games is played, named on its line. */
interface Props {
  readonly open: boolean;
  readonly onToggle: () => void;
}

export function FormatGroup({open, onToggle}: Props): React.JSX.Element {
  const format = useAppSelector(state => state.game.phase.format);
  const {play} = useMessages();

  return (
    <SettingsGroup name="Format" label={play.format} summary={play.formatNames[format]} open={open} onToggle={onToggle}>
      <MatchFormatSetting />
    </SettingsGroup>
  );
}
