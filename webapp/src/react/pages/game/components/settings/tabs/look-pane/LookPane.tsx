import {SettingsSection} from "@src/react/pages/game/components/settings/components/settings-section/SettingsSection";
import {BoardHintsGroup} from "@src/react/pages/game/components/settings/tabs/look-pane/components/board-hints-group/BoardHintsGroup";
import {PiecesGroup} from "@src/react/pages/game/components/settings/tabs/look-pane/components/pieces-group/PiecesGroup";
import {BoardGroup} from "@src/react/pages/game/components/settings/tabs/look-pane/components/board-group/BoardGroup";
import {useState} from "react";
import type {LookGroupName} from "@janggi/shared/janggi/settings/LookGroupName";
import {OpacitySetting} from "@src/react/pages/game/components/settings/tabs/look-pane/components/opacity-setting/OpacitySetting";
import {OpponentLookSetting} from "@src/react/pages/game/components/settings/tabs/look-pane/components/opponent-look-setting/OpponentLookSetting";
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
  const [open, setOpen] = useState<LookGroupName | undefined>(undefined);
  const toggle = (name: LookGroupName): void => {
    if (open === name) {
      setOpen(undefined);
    } else {
      setOpen(name);
    }
  };

  return (
    <SettingsPane name="Look" selected={selected}>
      <BoardGroup open={open === "Board"} onToggle={() => toggle("Board")} />

      <PiecesGroup open={open === "Pieces"} onToggle={() => toggle("Pieces")} />

      <StylesButton />

      <BoardHintsGroup open={open === "BoardHints"} onToggle={() => toggle("BoardHints")} />

      <OpponentLookSetting />

      <SettingsSection>
        <OpacitySetting />
      </SettingsSection>
    </SettingsPane>
  );
}
