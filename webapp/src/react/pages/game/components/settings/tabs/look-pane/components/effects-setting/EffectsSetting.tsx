import {EFFECTS} from "@src/react/pages/game/utils/EffectsOptions";
import {Switch} from "@src/react/pages/game/components/settings/components/switch/Switch";
import {effectsChosen} from "@src/redux/preferences/PreferencesSlice";
import {useAppDispatch} from "@src/redux/Hooks";
import {usePreferences} from "@src/react/pages/game/hooks/use-preferences/UsePreferences";
import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";

/** Whether the board's flights, flourishes and shakes accompany its permanent marks. */
export function EffectsSetting(): React.JSX.Element {
  const {effects} = usePreferences();
  const dispatch = useAppDispatch();
  const {look} = useMessages();

  return (
    <Switch
      testId="effects-toggle"
      on={effects.full}
      label={look.motion}
      onToggle={() => {
        const other = EFFECTS.find(option => option.full !== effects.full);
        if (other) dispatch(effectsChosen(other.name));
      }}
    />
  );
}
