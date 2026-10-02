import {Progress} from "@src/react/pages/game/components/settings/tabs/progress-pane/components/progress/Progress";
import {SaveTransfer} from "@src/react/pages/game/components/settings/tabs/progress-pane/components/save-transfer/SaveTransfer";
import {SettingsPane} from "@src/react/pages/game/components/settings/components/settings-pane/SettingsPane";
import {StylesButton} from "@src/react/pages/game/components/settings/tabs/progress-pane/components/styles-button/StylesButton";

/**
 * The Progress tab: the player's XP and next unlock, the styles XP lets them make, and the save key
 * that carries that progress to another device without an account. Handed only whether its tab is showing.
 */
interface Props {
  readonly selected: boolean;
}

export function ProgressPane({selected}: Props): React.JSX.Element {
  return (
    <SettingsPane name="Progress" selected={selected}>
      <Progress />

      <StylesButton />

      <SaveTransfer />
    </SettingsPane>
  );
}
