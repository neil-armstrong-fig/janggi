import {sheetOpened} from "@src/redux/settings/SettingsSlice";
import {useAppDispatch} from "@src/redux/Hooks";
import {tourTarget} from "@src/react/pages/game/components/tour-target/TourTarget";

/** Opens the player's own styles — to import one somebody shared, share one, or make one. */
export function StylesButton(): React.JSX.Element {
  const dispatch = useAppDispatch();

  return (
    <button
      type="button"
      data-testid="styles-open"
      {...tourTarget("styles")}
      onClick={() => dispatch(sheetOpened("styles"))}
      className="h-11 cursor-pointer rounded-xl bg-black/25 text-sm font-semibold tracking-wide text-white/80 uppercase transition-[transform,background-color] duration-150 hover:bg-black/35 active:scale-[0.98] motion-reduce:transition-none"
    >
      Your styles
    </button>
  );
}
