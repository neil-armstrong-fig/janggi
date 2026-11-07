import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";
import {Switch} from "@src/react/pages/game/components/settings/components/switch/Switch";
import {showOpponentLookChosen} from "@src/redux/slices/preferences/PreferencesSlice";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";

/** The opponent-look preference, once there is an online friend game for it to affect. */
export function OpponentLookSwitch(): React.JSX.Element {
  const showOpponentLook = useAppSelector(state => state.preferences.showOpponentLook);
  const dispatch = useAppDispatch();
  const {look} = useMessages();

  return (
    <div className="flex flex-col gap-0.5">
      <Switch
        testId="opponent-look-toggle"
        on={showOpponentLook}
        label={look.opponentLook}
        onToggle={() => dispatch(showOpponentLookChosen(!showOpponentLook))}
      />

      <p data-testid="opponent-look-explanation" className="px-2 text-xs text-white/40">
        {look.opponentLookHelp}
      </p>
    </div>
  );
}
