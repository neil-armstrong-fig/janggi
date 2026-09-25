import {clsx} from "clsx";
import {flipBoardForHanChosen} from "@src/redux/preferences/PreferencesSlice";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";
import {usePreferences} from "@src/react/pages/game/hooks/use-preferences/UsePreferences";

/**
 * Whether the pieces turn to face Han's player whenever it is Han's move, for two people playing
 * across one phone or tablet. A preference, worn the moment it is chosen, but laid out only while the
 * opponent is a person — against the bot there is no one across the table.
 *
 * **It stays in the page, only hidden**, as `BotSettings` does, so what it is set to is still there to be
 * read and survives the opponent being changed back and forth.
 */
export function FlipBoardSetting(): React.JSX.Element {
  const {flipBoardForHan} = usePreferences();
  const isHuman = useAppSelector(state => state.game.opponent.name === "Human");
  const dispatch = useAppDispatch();

  return (
    <div hidden={!isHuman} className="flex flex-col gap-0.5">
      <button
        type="button"
        data-testid="flip-board-toggle"
        aria-pressed={flipBoardForHan}
        onClick={() => dispatch(flipBoardForHanChosen(!flipBoardForHan))}
        className={clsx(
          "flex h-9 cursor-pointer items-center gap-2 self-start rounded-lg px-2 text-xs transition-colors duration-150 motion-reduce:transition-none",
          flipBoardForHan && "bg-wood/20 text-wood",
          !flipBoardForHan && "text-white/60 hover:bg-white/10",
        )}
      >
        <span aria-hidden>{flipBoardForHan ? "☑" : "☐"}</span>
        Flip board for Han
      </button>

      <p className="px-2 text-xs text-white/40">
        Turns the pieces to face Han's player on Han's move, for the player sat across from you.
      </p>
    </div>
  );
}
