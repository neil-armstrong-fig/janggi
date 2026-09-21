import {OptionPicker} from "@src/react/pages/game/components/settings/components/option-picker/OptionPicker";
import {MOVABLE_HIGHLIGHTS} from "@src/react/pages/game/utils/MovableHighlights";
import {usePreferences} from "@src/react/pages/game/hooks/use-preferences/UsePreferences";
import {useAppDispatch} from "@src/redux/Hooks";
import {movableHighlightChosen} from "@src/redux/preferences/PreferencesSlice";

/** Whether pieces that may move this turn are marked on the board. */
export function MovableHighlightSetting(): React.JSX.Element {
  const {movableHighlight} = usePreferences();
  const dispatch = useAppDispatch();

  return (
    <OptionPicker
      id="movable-highlight"
      label="Movable pieces"
      ariaLabel="Highlight the pieces that can move"
      options={MOVABLE_HIGHLIGHTS}
      selected={movableHighlight}
      onSelect={highlight => dispatch(movableHighlightChosen(highlight.name))}
    />
  );
}
