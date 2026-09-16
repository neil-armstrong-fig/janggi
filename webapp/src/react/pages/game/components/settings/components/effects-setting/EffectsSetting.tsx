import {OptionPicker} from "@src/react/pages/game/components/settings/components/option-picker/OptionPicker";
import {EFFECTS} from "@src/react/pages/game/utils/EffectsOptions";
import {usePreferences} from "@src/react/pages/game/hooks/use-preferences/UsePreferences";
import {useAppDispatch} from "@src/redux/Hooks";
import {effectsChosen} from "@src/redux/preferences/PreferencesSlice";

/** Whether the board's flights, flourishes and shakes accompany its permanent marks. */
export function EffectsSetting(): React.JSX.Element {
  const {effects} = usePreferences();
  const dispatch = useAppDispatch();

  return (
    <OptionPicker
      id="effects"
      label="Effects"
      ariaLabel="How much the board moves as the game is played"
      options={EFFECTS}
      selected={effects}
      onSelect={chosen => dispatch(effectsChosen(chosen.name))}
    />
  );
}
