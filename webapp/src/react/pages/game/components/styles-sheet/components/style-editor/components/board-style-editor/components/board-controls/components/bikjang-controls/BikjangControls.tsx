import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";
import type {BikjangStyle} from "@src/styles/types/board-marks/BikjangStyle";
import {ColourField} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/fields/colour-field/ColourField";
import {ControlGroup} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/fields/control-group/ControlGroup";
import {STYLE_LIMITS} from "@src/styles/limits/StyleLimits";
import {SliderField} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/fields/slider-field/SliderField";

/** The line down the open file between two generals, once a bikjang has been called. */
interface Props {
  readonly bikjangStyle: BikjangStyle;
  readonly onChange: (bikjangStyle: BikjangStyle) => void;
  /** Called as focus enters the group, so the preview can be turned to where a bikjang is on show. */
  readonly onFocus: () => void;
}

export function BikjangControls({bikjangStyle, onChange, onFocus}: Props): React.JSX.Element {
  const words = useMessages().styles.board;
  return (
    <ControlGroup title={words.bikjang} onFocus={onFocus}>
      <ColourField
        id="bikjang-colour"
        label={words.lineColour}
        value={bikjangStyle.colour}
        onChange={colour => onChange({...bikjangStyle, colour})}
      />

      <SliderField
        id="bikjang-width"
        label={words.lineWidth}
        numberRange={STYLE_LIMITS.bikjangWidth}
        step={0.5}
        value={bikjangStyle.width}
        onChange={width => onChange({...bikjangStyle, width})}
      />
    </ControlGroup>
  );
}
