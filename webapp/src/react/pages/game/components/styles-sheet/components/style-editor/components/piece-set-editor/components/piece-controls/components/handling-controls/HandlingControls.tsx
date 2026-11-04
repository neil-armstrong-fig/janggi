import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";
import {ColourField} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/fields/colour-field/ColourField";
import {ControlGroup} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/fields/control-group/ControlGroup";
import type {PieceHandlingStyle} from "@src/styles/types/PieceHandlingStyle";
import {STYLE_LIMITS} from "@src/styles/limits/StyleLimits";
import {SliderField} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/fields/slider-field/SliderField";

/** How the whole set answers being touched: the shadow of the piece in hand, and how the outline thickens under the pointer. */
interface Props {
  readonly pieceHandlingStyle: PieceHandlingStyle;
  readonly onChange: (pieceHandlingStyle: PieceHandlingStyle) => void;
}

export function HandlingControls({pieceHandlingStyle, onChange}: Props): React.JSX.Element {
  const words = useMessages().styles.pieces;
  return (
    <ControlGroup title={words.handling}>
      <ColourField
        id="handling-shadow"
        label={words.heldShadow}
        value={pieceHandlingStyle.shadow}
        translucent
        onChange={shadow => onChange({...pieceHandlingStyle, shadow})}
      />

      <SliderField
        id="hover-outline"
        label={words.hoverOutline}
        numberRange={STYLE_LIMITS.hoverOutline}
        step={0.05}
        value={pieceHandlingStyle.hoverOutline}
        onChange={hoverOutline => onChange({...pieceHandlingStyle, hoverOutline})}
      />
    </ControlGroup>
  );
}
