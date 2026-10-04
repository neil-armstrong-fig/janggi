import {BoardHints} from "@src/react/pages/game/components/settings/tabs/look-pane/components/board-hints/BoardHints";
import {BoardSetting} from "@src/react/pages/game/components/settings/tabs/look-pane/components/board-setting/BoardSetting";
import {OpacitySetting} from "@src/react/pages/game/components/settings/tabs/look-pane/components/opacity-setting/OpacitySetting";
import {OpponentLookSetting} from "@src/react/pages/game/components/settings/tabs/look-pane/components/opponent-look-setting/OpponentLookSetting";
import {PieceSetSetting} from "@src/react/pages/game/components/settings/tabs/look-pane/components/piece-set-setting/PieceSetSetting";
import {SettingsPane} from "@src/react/pages/game/components/settings/components/settings-pane/SettingsPane";
import {StylesButton} from "@src/react/pages/game/components/settings/tabs/look-pane/components/styles-button/StylesButton";

/**
 * The Look tab: how the game is drawn — the board and the pieces, the styles a player makes of their
 * own, what the board marks and how much it moves, and how a friend's game is drawn.
 *
 * Effects are here rather than under Sound because they are motion, not audio. Each is worn the moment
 * it is chosen, which is what the see-through sheet is for: the board is behind it. The sheet's own
 * opacity is here too, being the one setting about the sheet's own chrome rather than the board's.
 *
 * Handed only whether its tab is showing.
 */
interface Props {
  readonly selected: boolean;
}

export function LookPane({selected}: Props): React.JSX.Element {
  return (
    <SettingsPane name="Look" selected={selected}>
      <BoardSetting />

      <PieceSetSetting />

      <StylesButton />

      <BoardHints />

      <OpponentLookSetting />

      <OpacitySetting />
    </SettingsPane>
  );
}
