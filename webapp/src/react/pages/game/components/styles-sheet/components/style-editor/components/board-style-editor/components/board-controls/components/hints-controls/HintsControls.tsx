import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";
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
  const words = useMessages().styles.board;
  return (
    <ControlGroup title={words.hints} onFocus={onFocus}>
      <ColourField
        id="hints-colour"
        label={words.colour}
        value={hintsStyle.colour}
        onChange={colour => onChange({...hintsStyle, colour})}
      />

      <ColourField
        id="hints-outline"
        label={words.outline}
        value={hintsStyle.outline}
        onChange={outline => onChange({...hintsStyle, outline})}
      />

      <ColourField
        id="hints-selection"
        label={words.pieceInHand}
        value={hintsStyle.selection}
        translucent
        onChange={selection => onChange({...hintsStyle, selection})}
      />
    </ControlGroup>
  );
}
