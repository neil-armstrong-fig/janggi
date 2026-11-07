import {usePlayGroup} from "@src/react/pages/game/components/settings/tabs/play-pane/hooks/use-play-group/UsePlayGroup";
import {sheetClosed} from "@src/redux/slices/settings/SettingsSlice";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";
import {inTheTutorial} from "@src/redux/slices/tutorial/selecting/InTheTutorial";
import {TutorialHoldsPlay} from "@src/react/pages/game/components/settings/tabs/play-pane/components/tutorial-holds-play/TutorialHoldsPlay";
import {FormatGroup} from "@src/react/pages/game/components/settings/tabs/play-pane/components/format-group/FormatGroup";
import {GamesSetting} from "@src/react/pages/game/components/settings/tabs/play-pane/components/games-setting/GamesSetting";
import {NewGameButton} from "@src/react/pages/game/components/settings/tabs/play-pane/components/new-game-button/NewGameButton";
import {OpponentGroup} from "@src/react/pages/game/components/settings/tabs/play-pane/components/opponent-group/OpponentGroup";
import {RecordButton} from "@src/react/pages/game/components/settings/tabs/play-pane/components/record-button/RecordButton";
import {SetupGroup} from "@src/react/pages/game/components/settings/tabs/play-pane/components/setup-group/SetupGroup";
import {SettingsPane} from "@src/react/pages/game/components/settings/components/settings-pane/SettingsPane";

/**
 * The Play tab: what a player opens the sheet for before a game. Which game is on the board sits on top, always in
 * sight, as the way between the player's own game and a friend's. Beneath it the game is **folded into groups**: who the
 * opponent is (including the clock between two people at one device), the format, and both armies' setups. Each is one line saying
 * what it is set to, and opens in place to change it.
 *
 * **One group is open at a time**, so a phone's short sheet holds the whole game at a glance and the settings being
 * changed. A new device starts with all groups collapsed. Each explicit open or close is remembered across refreshes
 * and new games. During play a group still opens with its settings locked, so a format can still be explained.
 *
 * **New game and Your record sit in the pane's footer**, outside the scrolling settings, so they are
 * in the thumb's reach however far the settings above have been scrolled. New game deals from the
 * settings above it, which is why it lives beside them and not in the row of controls under the board.
 *
 * **While the tutorial has the board** the tab holds only the way out of it (`TutorialHoldsPlay`): every setting here
 * deals a game, which would land on the tutorial's.
 *
 * It is layout, and only layout: each setting reads and dispatches for itself. What it is handed is
 * whether its tab is showing; what it keeps is which group is open, which no other part of the page asks.
 */
interface Props {
  readonly selected: boolean;
}

export function PlayPane({selected}: Props): React.JSX.Element {
  const dispatch = useAppDispatch();
  const tutorial = useAppSelector(inTheTutorial);
  const {open, toggle} = usePlayGroup();

  if (tutorial) {
    return (
      <SettingsPane name="Play" selected={selected}>
        <TutorialHoldsPlay />
      </SettingsPane>
    );
  }

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

      <div className="flex flex-col gap-2">
        <OpponentGroup open={open === "Opponent"} onToggle={() => toggle("Opponent")} />

        <FormatGroup open={open === "Format"} onToggle={() => toggle("Format")} />

        <SetupGroup open={open === "Setup"} onToggle={() => toggle("Setup")} />
      </div>
    </SettingsPane>
  );
}
