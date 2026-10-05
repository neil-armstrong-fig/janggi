import {Switch} from "@src/react/pages/game/components/settings/components/switch/Switch";
import {flipBoardForHanChosen} from "@src/redux/preferences/PreferencesSlice";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";
import {usePreferences} from "@src/react/pages/game/hooks/use-preferences/UsePreferences";
import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";

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
  const {play} = useMessages();

  return (
    <div hidden={!isHuman} className="flex flex-col gap-0.5">
      <Switch
        testId="flip-board-toggle"
        on={flipBoardForHan}
        label={play.flipBoard}
        onToggle={() => dispatch(flipBoardForHanChosen(!flipBoardForHan))}
      />

      <p className="px-2 text-xs text-white/40">
        Turns the pieces to face Han's player on Han's move, for the player sat across from you.
      </p>
    </div>
  );
}
