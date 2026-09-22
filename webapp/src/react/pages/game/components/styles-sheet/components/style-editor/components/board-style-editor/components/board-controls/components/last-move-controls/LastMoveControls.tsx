import {ColourField} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/fields/colour-field/ColourField";
import {ControlGroup} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/fields/control-group/ControlGroup";
import type {LastMoveStyle} from "@src/styles/types/board-marks/LastMoveStyle";

/** The two marks on the points the last move went between: the wash over them, and the brackets in their corners. */
interface Props {
  readonly lastMoveStyle: LastMoveStyle;
  readonly onChange: (lastMoveStyle: LastMoveStyle) => void;
  /** Called as focus enters the group, so the preview can be turned to where the last move is on show. */
  readonly onFocus: () => void;
}

export function LastMoveControls({lastMoveStyle, onChange, onFocus}: Props): React.JSX.Element {
  return (
    <ControlGroup title="Last move" onFocus={onFocus}>
      <ColourField
        id="last-move-wash"
        label="Wash"
        value={lastMoveStyle.wash}
        translucent
        onChange={wash => onChange({...lastMoveStyle, wash})}
      />

      <ColourField
        id="last-move-brackets"
        label="Brackets"
        value={lastMoveStyle.brackets}
        onChange={brackets => onChange({...lastMoveStyle, brackets})}
      />
    </ControlGroup>
  );
}
