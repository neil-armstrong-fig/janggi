import {BikjangHintSetting} from "@src/react/pages/game/components/settings/tabs/look-pane/components/bikjang-hint-setting/BikjangHintSetting";
import {BoardSetting} from "@src/react/pages/game/components/settings/tabs/look-pane/components/board-setting/BoardSetting";
import {EffectsSetting} from "@src/react/pages/game/components/settings/tabs/look-pane/components/effects-setting/EffectsSetting";
import {MovableHighlightSetting} from "@src/react/pages/game/components/settings/tabs/look-pane/components/movable-highlight-setting/MovableHighlightSetting";
import {OpacitySetting} from "@src/react/pages/game/components/settings/tabs/look-pane/components/opacity-setting/OpacitySetting";
import {PieceSetSetting} from "@src/react/pages/game/components/settings/tabs/look-pane/components/piece-set-setting/PieceSetSetting";
import {SettingsPane} from "@src/react/pages/game/components/settings/components/settings-pane/SettingsPane";

/**
 * The Look tab: how the game is drawn — the board, the pieces, whether the pieces that can move are
 * marked, whether a move that would hand the opponent a bikjang is flagged, and how much the board moves as
 * it is played.
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

      <MovableHighlightSetting />

      <BikjangHintSetting />

      <EffectsSetting />

      <OpacitySetting />
    </SettingsPane>
  );
}
