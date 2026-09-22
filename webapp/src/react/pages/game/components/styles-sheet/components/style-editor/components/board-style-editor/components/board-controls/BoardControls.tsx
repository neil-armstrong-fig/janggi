import type {BoardStyle} from "@src/styles/types/BoardStyle";
import type {BoardTarget} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/board-style-editor/board-target/types/BoardTarget";
import {BikjangControls} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/board-style-editor/components/board-controls/components/bikjang-controls/BikjangControls";
import {CellControls} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/board-style-editor/components/board-controls/components/cell-controls/CellControls";
import type {CellStyle} from "@src/styles/types/CellStyle";
import {CheckControls} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/board-style-editor/components/board-controls/components/check-controls/CheckControls";
import {ColourField} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/fields/colour-field/ColourField";
import {ControlGroup} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/fields/control-group/ControlGroup";
import {HintsControls} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/board-style-editor/components/board-controls/components/hints-controls/HintsControls";
import {LastMoveControls} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/board-style-editor/components/board-controls/components/last-move-controls/LastMoveControls";
import {MarkerControls} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/board-style-editor/components/board-controls/components/marker-controls/MarkerControls";
import type {SceneName} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/preview-scenes/types/SceneName";
import {cellStyleAt} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/board-style-editor/cell-style/CellStyleAt";
import {withCellStyle} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/board-style-editor/cell-style/WithCellStyle";

/**
 * Every setting of a board style. The lines, background and marker are the target's — every point without a
 * style of its own, or the one tapped — and the rest are the board's: its surface and the marks it draws
 * over its points. Focusing a group turns the preview to the position that shows its marks.
 */
interface Props {
  readonly boardStyle: BoardStyle;
  readonly boardTarget: BoardTarget;
  readonly onChange: (update: (boardStyle: BoardStyle) => BoardStyle) => void;
  readonly onScene: (sceneName: SceneName) => void;
}

export function BoardControls({boardStyle, boardTarget, onChange, onScene}: Props): React.JSX.Element {
  const cellStyle = cellStyleAt(boardStyle, boardTarget);
  const changeCell = (update: (currentCellStyle: CellStyle) => CellStyle): void => {
    onChange(currentBoardStyle => withCellStyle(currentBoardStyle, boardTarget, update));
  };

  return (
    <div className="flex flex-col gap-4">
      <ControlGroup title="Board">
        <ColourField
          id="surface-colour"
          label="Board colour"
          value={boardStyle.surface}
          onChange={surface => onChange(currentBoardStyle => ({...currentBoardStyle, surface}))}
        />
      </ControlGroup>

      <CellControls cellStyle={cellStyle} onChange={changeCell} />

      <MarkerControls cellStyle={cellStyle} onChange={changeCell} />

      <LastMoveControls
        lastMoveStyle={boardStyle.lastMove}
        onChange={lastMove => onChange(currentBoardStyle => ({...currentBoardStyle, lastMove}))}
        onFocus={() => onScene("opening")}
      />

      <BikjangControls
        bikjangStyle={boardStyle.bikjang}
        onChange={bikjang => onChange(currentBoardStyle => ({...currentBoardStyle, bikjang}))}
        onFocus={() => onScene("bikjang")}
      />

      <CheckControls
        checkStyle={boardStyle.check}
        onChange={check => onChange(currentBoardStyle => ({...currentBoardStyle, check}))}
        onFocus={() => onScene("check")}
      />

      <HintsControls
        hintsStyle={boardStyle.hints}
        onChange={hints => onChange(currentBoardStyle => ({...currentBoardStyle, hints}))}
        onFocus={() => onScene("hints")}
      />
    </div>
  );
}
