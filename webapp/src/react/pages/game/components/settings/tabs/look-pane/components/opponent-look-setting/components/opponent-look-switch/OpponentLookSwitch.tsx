import {Switch} from "@src/react/pages/game/components/settings/components/switch/Switch";
import {showOpponentLookChosen} from "@src/redux/preferences/PreferencesSlice";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";

/** The opponent-look preference, once there is an online friend game for it to affect. */
export function OpponentLookSwitch(): React.JSX.Element {
  const showOpponentLook = useAppSelector(state => state.preferences.showOpponentLook);
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-col gap-0.5">
      <Switch
        testId="opponent-look-toggle"
        on={showOpponentLook}
        label="Show opponent's board and pieces"
        onToggle={() => dispatch(showOpponentLookChosen(!showOpponentLook))}
      />

      <p data-testid="opponent-look-explanation" className="px-2 text-xs text-white/40">
        Online PvP only. Shows the game in your opponent&apos;s board and pieces, and shares yours with them. Turn it
        off to use your own look.
      </p>
    </div>
  );
}
