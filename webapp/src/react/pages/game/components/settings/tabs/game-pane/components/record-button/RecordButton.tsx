import {sheetOpened} from "@src/redux/settings/SettingsSlice";
import {useAppDispatch} from "@src/redux/Hooks";

/** Opens the player's record against the bot — their rating in each format and every game behind it. */
export function RecordButton(): React.JSX.Element {
  const dispatch = useAppDispatch();

  return (
    <button
      type="button"
      data-testid="record-open"
      onClick={() => dispatch(sheetOpened("record"))}
      className="h-12 shrink-0 cursor-pointer self-start rounded-xl bg-black/25 px-4 text-sm font-semibold tracking-wide text-white/80 uppercase transition-[transform,background-color] duration-150 hover:bg-black/35 active:scale-[0.98] motion-reduce:transition-none"
    >
      Your record
    </button>
  );
}
