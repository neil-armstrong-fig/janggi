import {VolumeSlider} from "@src/react/pages/game/components/settings/tabs/sound-pane/components/volume-slider/VolumeSlider";
import {usePreferences} from "@src/react/pages/game/hooks/use-preferences/UsePreferences";
import {useAppDispatch} from "@src/redux/Hooks";
import {soundEffectsVolumeChanged} from "@src/redux/preferences/PreferencesSlice";

/** How loudly the game's cues are played. */
export function SoundEffectsSetting(): React.JSX.Element {
  const {soundEffectsVolume} = usePreferences();
  const dispatch = useAppDispatch();

  return (
    <VolumeSlider
      id="sound-effects"
      label="Sound effects"
      volume={soundEffectsVolume}
      onChange={volume => dispatch(soundEffectsVolumeChanged(volume))}
    />
  );
}
