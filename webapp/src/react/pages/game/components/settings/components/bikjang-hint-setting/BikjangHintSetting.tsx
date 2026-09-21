import {BIKJANG_HINTS} from "@src/react/pages/game/utils/BikjangHints";
import {BikjangHintExplanation} from "@src/react/pages/game/components/settings/components/bikjang-hint-explanation/BikjangHintExplanation";
import {OptionPicker} from "@src/react/pages/game/components/settings/components/option-picker/OptionPicker";
import {bikjangHintChosen} from "@src/redux/preferences/PreferencesSlice";
import {useAppDispatch} from "@src/redux/Hooks";
import {usePreferences} from "@src/react/pages/game/hooks/use-preferences/UsePreferences";

/**
 * Whether a move that would leave the opponent a bikjang to call is labelled on the board.
 *
 * A preference, worn the moment it is chosen — but choosing "Shown" does not make the label appear
 * against every opponent, which is why it carries a (?) that says so. It answers even in a game where
 * the label is not offered, so a player can set it before choosing a bot.
 */
export function BikjangHintSetting(): React.JSX.Element {
  const {bikjangHint} = usePreferences();
  const dispatch = useAppDispatch();

  return (
    <OptionPicker
      id="bikjang-hint"
      label="Bikjang hint"
      ariaLabel="Label the moves that could allow a bikjang"
      options={BIKJANG_HINTS}
      selected={bikjangHint}
      explanation={<BikjangHintExplanation />}
      onSelect={hint => dispatch(bikjangHintChosen(hint.name))}
    />
  );
}
