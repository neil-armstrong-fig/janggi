import {EFFECTS_NAMES} from "@janggi/shared/janggi/settings/EffectsName";
import {FULL_VOLUME, MUTED_VOLUME} from "@janggi/shared/janggi/settings/Volume";
import {LANGUAGE_NAMES} from "@janggi/shared/janggi/settings/LanguageName";
import {MOVABLE_HIGHLIGHT_NAMES} from "@janggi/shared/janggi/settings/MovableHighlightName";
import {SOUND_CHOICE_NAMES} from "@janggi/shared/janggi/onboarding/SoundChoiceName";
import type {SoundChoiceName} from "@janggi/shared/janggi/onboarding/SoundChoiceName";
import type {Volume} from "@janggi/shared/janggi/settings/Volume";
import {WelcomeChoice} from "@src/react/pages/game/components/onboarding/components/welcome/components/welcome-choice/WelcomeChoice";
import {
  effectsChosen,
  languageChosen,
  movableHighlightChosen,
  musicVolumeChanged,
  soundEffectsVolumeChanged,
} from "@src/redux/preferences/PreferencesSlice";
import {useAppDispatch} from "@src/redux/Hooks";
import {usePreferences} from "@src/react/pages/game/hooks/use-preferences/UsePreferences";
import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";

interface Props {
  readonly onStartTour: () => void;
}

/**
 * The welcome's second screen: the five choices worth making before the first tap — the language, the music, the
 * sound effects, the animations and the mark on a piece that can move. The language comes first, each in its own
 * name, so a player who cannot read the rest of the screen can find theirs. Each is worn as it is pressed, so Off is
 * silent at once. The rest of Settings is left out on purpose; it would be a wall.
 */
export function WelcomeChoices({onStartTour}: Props): React.JSX.Element {
  const dispatch = useAppDispatch();
  const {welcome, language} = useMessages();
  const preferences = usePreferences();
  const {musicVolume, soundEffectsVolume, effects, movableHighlight} = preferences;

  return (
    <>
      <h2
        id="welcome-title"
        tabIndex={-1}
        autoFocus
        className="text-lg font-semibold tracking-wide text-wood outline-none"
      >
        {welcome.choicesTitle}
      </h2>

      <WelcomeChoice
        label={language.label}
        testId="language"
        names={LANGUAGE_NAMES}
        selected={preferences.language}
        onSelect={name => dispatch(languageChosen(name))}
        labelOf={name => language.names[name]}
      />

      <WelcomeChoice
        label={welcome.music}
        testId="music"
        names={SOUND_CHOICE_NAMES}
        selected={soundChoiceOf(musicVolume)}
        onSelect={choice => dispatch(musicVolumeChanged(volumeOf(choice)))}
        labelOf={name => welcome.answers[name]}
      />

      <WelcomeChoice
        label={welcome.soundEffects}
        testId="sound-effects"
        names={SOUND_CHOICE_NAMES}
        selected={soundChoiceOf(soundEffectsVolume)}
        onSelect={choice => dispatch(soundEffectsVolumeChanged(volumeOf(choice)))}
        labelOf={name => welcome.answers[name]}
      />

      <WelcomeChoice
        label={welcome.animations}
        testId="animations"
        names={EFFECTS_NAMES}
        selected={effects.name}
        onSelect={name => dispatch(effectsChosen(name))}
        labelOf={name => welcome.answers[name]}
      />

      <WelcomeChoice
        label={welcome.showWhereAPieceCanMove}
        testId="movable-highlight"
        names={MOVABLE_HIGHLIGHT_NAMES}
        selected={movableHighlight.name}
        onSelect={name => dispatch(movableHighlightChosen(name))}
        labelOf={name => welcome.answers[name]}
      />

      <p className="text-xs text-white/50">{welcome.changeAnyTime}</p>

      <button
        type="button"
        data-testid="welcome-start-tour"
        onClick={onStartTour}
        className="cursor-pointer rounded-lg bg-gold px-4 py-3 font-semibold text-ink"
      >
        {welcome.takeTheTour}
      </button>
    </>
  );
}

function soundChoiceOf(volume: Volume): SoundChoiceName {
  if (volume === MUTED_VOLUME) {
    return "Off";
  }

  return "On";
}

function volumeOf(choice: SoundChoiceName): Volume {
  if (choice === "On") {
    return FULL_VOLUME;
  }

  return MUTED_VOLUME;
}
