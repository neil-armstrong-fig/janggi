import {VolumeSlider} from "@src/react/pages/game/components/settings/components/volume-slider/VolumeSlider";
import {usePreferences} from "@src/react/pages/game/hooks/use-preferences/UsePreferences";
import {useAppDispatch} from "@src/redux/Hooks";
import {musicVolumeChanged} from "@src/redux/preferences/PreferencesSlice";

/** How loudly the adaptive music under the game is played. */
export function MusicSetting(): React.JSX.Element {
  const {musicVolume} = usePreferences();
  const dispatch = useAppDispatch();

  return (
    <VolumeSlider
      id="music"
      label="Music"
      volume={musicVolume}
      onChange={volume => dispatch(musicVolumeChanged(volume))}
    />
  );
}
