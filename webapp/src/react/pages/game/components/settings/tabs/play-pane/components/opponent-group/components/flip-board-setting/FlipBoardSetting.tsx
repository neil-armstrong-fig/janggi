import {ExplainedSwitch} from "@src/react/pages/game/components/settings/tabs/play-pane/components/explained-switch/ExplainedSwitch";
import {flipBoardForHanChosen} from "@src/redux/slices/preferences/PreferencesSlice";
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
    <div hidden={!isHuman}>
      <ExplainedSwitch
        id="flip-board"
        on={flipBoardForHan}
        label={play.flipBoard}
        explanation={play.flipBoardHelp}
        onToggle={() => dispatch(flipBoardForHanChosen(!flipBoardForHan))}
      />
    </div>
  );
}
