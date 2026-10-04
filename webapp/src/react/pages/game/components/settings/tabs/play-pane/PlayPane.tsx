import {sheetClosed} from "@src/redux/settings/SettingsSlice";
import {useAppDispatch} from "@src/redux/Hooks";
import {BotSettings} from "@src/react/pages/game/components/settings/tabs/play-pane/components/bot-settings/BotSettings";
import {ElephantPairingLine} from "@src/react/pages/game/components/settings/tabs/play-pane/components/elephant-pairing-line/ElephantPairingLine";
import {FlipBoardSetting} from "@src/react/pages/game/components/settings/tabs/play-pane/components/flip-board-setting/FlipBoardSetting";
import {GamesSetting} from "@src/react/pages/game/components/settings/tabs/play-pane/components/games-setting/GamesSetting";
import {MatchFormatSetting} from "@src/react/pages/game/components/settings/tabs/play-pane/components/match-format-setting/MatchFormatSetting";
import {NewGameButton} from "@src/react/pages/game/components/settings/tabs/play-pane/components/new-game-button/NewGameButton";
import {OpponentSetting} from "@src/react/pages/game/components/settings/tabs/play-pane/components/opponent-setting/OpponentSetting";
import {PlayAFriendEntry} from "@src/react/pages/game/components/settings/tabs/play-pane/components/play-a-friend-entry/PlayAFriendEntry";
import {RecordButton} from "@src/react/pages/game/components/settings/tabs/play-pane/components/record-button/RecordButton";
import {SettingsPane} from "@src/react/pages/game/components/settings/components/settings-pane/SettingsPane";
import {SetupSettings} from "@src/react/pages/game/components/settings/tabs/play-pane/components/setup-settings/SetupSettings";

/**
 * The Play tab: what a player opens the sheet for before a game — the format, who the opponent is,
 * whether the board turns for Han's player when that is a person, how strongly the bot plays and which army the player takes against it, and each army's opening
 * setup, with the 맞상/엇상 line those two choices come to.
 *
 * **New game and Your record sit in the pane's footer**, outside the scrolling settings, so they are
 * in the thumb's reach however far the settings above have been scrolled. New game deals from the
 * settings above it, which is why it lives beside them and not in the row of controls under the board.
 *
 * It is layout, and only layout: each setting reads and dispatches for itself. What it is handed is
 * what the store does not hold — whether its tab is showing, and what to do once a game has been dealt
 * or the record is asked for, both of which are the page's sheets to close and open.
 */
interface Props {
  readonly selected: boolean;
}

export function PlayPane({selected}: Props): React.JSX.Element {
  const dispatch = useAppDispatch();

  return (
    <SettingsPane
      name="Play"
      selected={selected}
      footer={
        <div className="flex items-start gap-2">
          {/* Once a new game has been dealt, the sheet that held the control closes. */}
          <NewGameButton onStarted={() => dispatch(sheetClosed())} />

          <RecordButton />
        </div>
      }
    >
      <GamesSetting />

      <MatchFormatSetting />

      <OpponentSetting />

      <PlayAFriendEntry />

      <FlipBoardSetting />

      <BotSettings />

      <SetupSettings />

      <ElephantPairingLine />
    </SettingsPane>
  );
}
