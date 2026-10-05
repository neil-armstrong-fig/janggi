import {LANGUAGE_NAMES} from "@janggi/shared/janggi/settings/LanguageName";
import {OptionPicker} from "@src/react/pages/game/components/settings/components/option-picker/OptionPicker";
import {languageChosen} from "@src/redux/preferences/PreferencesSlice";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";
import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";

/**
 * Which language the game is read in. Each option is named in its own language, whatever the page is
 * in now, so a player who cannot read the rest of it can still find theirs — and it is the first thing on
 * the You tab for the same reason.
 */
export function LanguageSetting(): React.JSX.Element {
  const language = useAppSelector(state => state.preferences.language);
  const messages = useMessages();
  const dispatch = useAppDispatch();

  return (
    <OptionPicker
      id="language"
      label={messages.language.label}
      ariaLabel="Language / 언어"
      options={OPTIONS}
      selected={{name: language}}
      labelOf={option => messages.language.names[option.name]}
      onSelect={option => dispatch(languageChosen(option.name))}
    />
  );
}

const OPTIONS = LANGUAGE_NAMES.map(name => ({name}));
