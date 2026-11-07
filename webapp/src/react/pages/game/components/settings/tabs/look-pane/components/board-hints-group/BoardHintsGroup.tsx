import {SettingsGroup} from "@src/react/pages/game/components/settings/components/settings-group/SettingsGroup";
import {BoardHints} from "@src/react/pages/game/components/settings/tabs/look-pane/components/board-hints-group/components/board-hints/BoardHints";
import {usePreferences} from "@src/react/pages/game/hooks/use-preferences/UsePreferences";
import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";

interface Props {
  readonly open: boolean;
  readonly onToggle: () => void;
}

export function BoardHintsGroup({open, onToggle}: Props): React.JSX.Element {
  const {movableHighlight, bikjangHint, effects} = usePreferences();
  const {look} = useMessages();
  const hints = Number(movableHighlight.shown) + Number(bikjangHint.shown);

  return (
    <SettingsGroup
      name="BoardHints"
      label={look.onTheBoard}
      summary={look.hintsSummary(hints, effects.full)}
      open={open}
      onToggle={onToggle}
    >
      <BoardHints />
    </SettingsGroup>
  );
}
