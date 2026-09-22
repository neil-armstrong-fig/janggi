import {FULL_OPACITY, MINIMUM_OPACITY} from "@janggi/shared/janggi/settings/Opacity";
import {sheetOpacityChanged} from "@src/redux/preferences/PreferencesSlice";
import {useAppDispatch} from "@src/redux/Hooks";
import {usePreferences} from "@src/react/pages/game/hooks/use-preferences/UsePreferences";

/**
 * How see-through the settings sheet's own panel is, from the floor a phone still reads it clearly
 * at to fully opaque. `Settings.tsx` has why only its background is affected, never its text.
 */
export function OpacitySetting(): React.JSX.Element {
  const {sheetOpacity} = usePreferences();
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <label htmlFor="sheet-opacity" className="text-xs font-medium text-white/60">
          Settings transparency
        </label>

        <span aria-hidden className="text-xs tabular-nums text-white/40">
          {sheetOpacity}%
        </span>
      </div>

      <input
        id="sheet-opacity"
        data-testid="sheet-opacity"
        type="range"
        min={MINIMUM_OPACITY}
        max={FULL_OPACITY}
        step={1}
        value={sheetOpacity}
        onChange={event => dispatch(sheetOpacityChanged(Number(event.target.value)))}
        className="h-10 w-full cursor-pointer accent-wood"
      />
    </div>
  );
}
