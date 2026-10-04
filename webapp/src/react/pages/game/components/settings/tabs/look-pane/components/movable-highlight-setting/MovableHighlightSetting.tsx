import {MOVABLE_HIGHLIGHTS} from "@src/react/pages/game/utils/MovableHighlights";
import {Switch} from "@src/react/pages/game/components/settings/components/switch/Switch";
import {movableHighlightChosen} from "@src/redux/preferences/PreferencesSlice";
import {useAppDispatch} from "@src/redux/Hooks";
import {usePreferences} from "@src/react/pages/game/hooks/use-preferences/UsePreferences";

/** Whether pieces that may move this turn are marked on the board. */
export function MovableHighlightSetting(): React.JSX.Element {
  const {movableHighlight} = usePreferences();
  const dispatch = useAppDispatch();

  return (
    <Switch
      testId="movable-highlight-toggle"
      on={movableHighlight.shown}
      label="Mark the pieces that can move"
      onToggle={() => {
        const other = MOVABLE_HIGHLIGHTS.find(option => option.shown !== movableHighlight.shown);
        if (other) dispatch(movableHighlightChosen(other.name));
      }}
    />
  );
}
