import {EFFECTS_NAMES} from "@janggi/shared/janggi/settings/EffectsName";
import {FULL_VOLUME, MUTED_VOLUME} from "@janggi/shared/janggi/settings/Volume";
import {MOVABLE_HIGHLIGHT_NAMES} from "@janggi/shared/janggi/settings/MovableHighlightName";
import {SOUND_CHOICE_NAMES} from "@janggi/shared/janggi/onboarding/SoundChoiceName";
import type {SoundChoiceName} from "@janggi/shared/janggi/onboarding/SoundChoiceName";
import type {Volume} from "@janggi/shared/janggi/settings/Volume";
import {WelcomeChoice} from "@src/react/pages/game/components/onboarding/components/welcome/components/welcome-choice/WelcomeChoice";
import {
  effectsChosen,
  movableHighlightChosen,
  musicVolumeChanged,
  soundEffectsVolumeChanged,
} from "@src/redux/preferences/PreferencesSlice";
import {useAppDispatch} from "@src/redux/Hooks";
import {usePreferences} from "@src/react/pages/game/hooks/use-preferences/UsePreferences";

interface Props {
  readonly onStartTour: () => void;
}

/**
 * The welcome's second screen: the four choices worth making before the first tap — the music, the sound
 * effects, the animations and the mark on a piece that can move. Each is worn as it is pressed, so Off is
 * silent at once. The rest of Settings is left out on purpose; it would be a wall.
 */
export function WelcomeChoices({onStartTour}: Props): React.JSX.Element {
  const dispatch = useAppDispatch();
  const {musicVolume, soundEffectsVolume, effects, movableHighlight} = usePreferences();

  return (
    <>
      <h2
        id="welcome-title"
        tabIndex={-1}
        autoFocus
        className="text-lg font-semibold tracking-wide text-wood outline-none"
      >
        Set it up your way
      </h2>

      <WelcomeChoice
        label="Music"
        testId="music"
        names={SOUND_CHOICE_NAMES}
        selected={soundChoiceOf(musicVolume)}
        onSelect={choice => dispatch(musicVolumeChanged(volumeOf(choice)))}
      />

      <WelcomeChoice
        label="Sound effects"
        testId="sound-effects"
        names={SOUND_CHOICE_NAMES}
        selected={soundChoiceOf(soundEffectsVolume)}
        onSelect={choice => dispatch(soundEffectsVolumeChanged(volumeOf(choice)))}
      />

      <WelcomeChoice
        label="Animations"
        testId="animations"
        names={EFFECTS_NAMES}
        selected={effects.name}
        onSelect={name => dispatch(effectsChosen(name))}
      />

      <WelcomeChoice
        label="Show where a piece can move"
        testId="movable-highlight"
        names={MOVABLE_HIGHLIGHT_NAMES}
        selected={movableHighlight.name}
        onSelect={name => dispatch(movableHighlightChosen(name))}
      />

      <p className="text-xs text-white/50">You can change all of these any time in Settings.</p>

      <button
        type="button"
        data-testid="welcome-start-tour"
        onClick={onStartTour}
        className="cursor-pointer rounded-lg bg-gold px-4 py-3 font-semibold text-ink"
      >
        Take the quick tour
      </button>
    </>
  );
}

function soundChoiceOf(volume: Volume): SoundChoiceName {
  return volume === MUTED_VOLUME ? "Off" : "On";
}

function volumeOf(choice: SoundChoiceName): Volume {
  return choice === "On" ? FULL_VOLUME : MUTED_VOLUME;
}
