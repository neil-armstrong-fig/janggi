import {BotSettings} from "@src/react/pages/game/components/settings/tabs/game-pane/components/bot-settings/BotSettings";
import {ElephantPairingLine} from "@src/react/pages/game/components/settings/tabs/game-pane/components/elephant-pairing-line/ElephantPairingLine";
import {FlipBoardSetting} from "@src/react/pages/game/components/settings/tabs/game-pane/components/flip-board-setting/FlipBoardSetting";
import {MatchFormatSetting} from "@src/react/pages/game/components/settings/tabs/game-pane/components/match-format-setting/MatchFormatSetting";
import {NewGameButton} from "@src/react/pages/game/components/settings/tabs/game-pane/components/new-game-button/NewGameButton";
import {OpponentSetting} from "@src/react/pages/game/components/settings/tabs/game-pane/components/opponent-setting/OpponentSetting";
import {RecordButton} from "@src/react/pages/game/components/settings/tabs/game-pane/components/record-button/RecordButton";
import {SettingsPane} from "@src/react/pages/game/components/settings/components/settings-pane/SettingsPane";
import {SetupSettings} from "@src/react/pages/game/components/settings/tabs/game-pane/components/setup-settings/SetupSettings";

/**
 * The Game tab: what a player opens the sheet for before a game — the format, who the opponent is,
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
  /** Called once a new game has been dealt, so the sheet that held the control can close. */
  readonly onStarted: () => void;
  readonly onOpenRecord: () => void;
}

export function GamePane({selected, onStarted, onOpenRecord}: Props): React.JSX.Element {
  return (
    <SettingsPane
      name="Game"
      selected={selected}
      footer={
        <div className="flex items-start gap-2">
          <NewGameButton onStarted={onStarted} />

          <RecordButton onOpen={onOpenRecord} />
        </div>
      }
    >
      <MatchFormatSetting />

      <OpponentSetting />

      <FlipBoardSetting />

      <BotSettings />

      <SetupSettings />

      <ElephantPairingLine />
    </SettingsPane>
  );
}
