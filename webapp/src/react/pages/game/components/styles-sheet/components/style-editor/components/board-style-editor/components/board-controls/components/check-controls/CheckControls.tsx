import type {CheckStyle} from "@src/styles/types/board-marks/CheckStyle";
import {ColourField} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/fields/colour-field/ColourField";
import {ControlGroup} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/fields/control-group/ControlGroup";

/** The colour a check is marked in: the line from each attacker to the general, and the rings round both. */
interface Props {
  readonly checkStyle: CheckStyle;
  readonly onChange: (checkStyle: CheckStyle) => void;
  /** Called as focus enters the group, so the preview can be turned to where a check is on show. */
  readonly onFocus: () => void;
}

export function CheckControls({checkStyle, onChange, onFocus}: Props): React.JSX.Element {
  return (
    <ControlGroup title="Check" onFocus={onFocus}>
      <ColourField
        id="check-colour"
        label="Colour"
        value={checkStyle.colour}
        onChange={colour => onChange({...checkStyle, colour})}
      />
    </ControlGroup>
  );
}
