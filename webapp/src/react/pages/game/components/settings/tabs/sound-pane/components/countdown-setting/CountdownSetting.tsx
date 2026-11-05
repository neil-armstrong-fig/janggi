import {Switch} from "@src/react/pages/game/components/settings/components/switch/Switch";
import {countdownChosen} from "@src/redux/preferences/PreferencesSlice";
import {useAppDispatch} from "@src/redux/Hooks";
import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";
import {usePreferences} from "@src/react/pages/game/hooks/use-preferences/UsePreferences";

/**
 * Whether a clock's last ten seconds tick out, one drum beat a second. On unless turned off: it tells a player time is
 * short without their looking, but some find it stressful.
 */
export function CountdownSetting(): React.JSX.Element {
  const {countdown} = usePreferences();
  const dispatch = useAppDispatch();
  const {sound} = useMessages();

  return (
    <Switch
      testId="countdown-toggle"
      on={countdown}
      label={sound.countdown}
      onToggle={() => dispatch(countdownChosen(!countdown))}
    />
  );
}
