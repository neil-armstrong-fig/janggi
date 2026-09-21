import {MusicSetting} from "@src/react/pages/game/components/settings/tabs/sound-pane/components/music-setting/MusicSetting";
import {SettingsPane} from "@src/react/pages/game/components/settings/components/settings-pane/SettingsPane";
import {SoundEffectsSetting} from "@src/react/pages/game/components/settings/tabs/sound-pane/components/sound-effects-setting/SoundEffectsSetting";

/** The Sound tab: how loud the game's sounds are, and how loud its music. Handed only whether it is showing. */
interface Props {
  readonly selected: boolean;
}

export function SoundPane({selected}: Props): React.JSX.Element {
  return (
    <SettingsPane name="Sound" selected={selected}>
      <SoundEffectsSetting />

      <MusicSetting />
    </SettingsPane>
  );
}
