import {VolumeSlider} from "@src/react/pages/game/components/settings/tabs/sound-pane/components/volume-slider/VolumeSlider";
import {usePreferences} from "@src/react/pages/game/hooks/use-preferences/UsePreferences";
import {useAppDispatch} from "@src/redux/Hooks";
import {musicVolumeChanged} from "@src/redux/preferences/PreferencesSlice";
import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";

/** How loudly the adaptive music under the game is played. */
export function MusicSetting(): React.JSX.Element {
  const {musicVolume} = usePreferences();
  const dispatch = useAppDispatch();
  const {sound} = useMessages();

  return (
    <VolumeSlider
      id="music"
      label={sound.music}
      muteLabel={sound.muteMusic}
      volume={musicVolume}
      onChange={volume => dispatch(musicVolumeChanged(volume))}
    />
  );
}
