import {ColourField} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/fields/colour-field/ColourField";
import {ControlGroup} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/fields/control-group/ControlGroup";
import type {HintsStyle} from "@src/styles/types/board-marks/HintsStyle";

/** The marks that help a player choose a move: where the piece in hand may go, and the wash over the piece itself. */
interface Props {
  readonly hintsStyle: HintsStyle;
  readonly onChange: (hintsStyle: HintsStyle) => void;
  /** Called as focus enters the group, so the preview can be turned to where the hints are on show. */
  readonly onFocus: () => void;
}

export function HintsControls({hintsStyle, onChange, onFocus}: Props): React.JSX.Element {
  return (
    <ControlGroup title="Hints" onFocus={onFocus}>
      <ColourField
        id="hints-colour"
        label="Colour"
        value={hintsStyle.colour}
        onChange={colour => onChange({...hintsStyle, colour})}
      />

      <ColourField
        id="hints-outline"
        label="Outline"
        value={hintsStyle.outline}
        onChange={outline => onChange({...hintsStyle, outline})}
      />

      <ColourField
        id="hints-selection"
        label="Piece in hand"
        value={hintsStyle.selection}
        translucent
        onChange={selection => onChange({...hintsStyle, selection})}
      />
    </ControlGroup>
  );
}
