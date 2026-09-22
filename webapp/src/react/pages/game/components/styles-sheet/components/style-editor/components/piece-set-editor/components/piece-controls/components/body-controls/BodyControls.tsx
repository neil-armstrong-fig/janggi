import {ChoiceField} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/fields/choice-field/ChoiceField";
import {ColourField} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/fields/colour-field/ColourField";
import {ControlGroup} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/fields/control-group/ControlGroup";
import {InlayControls} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/components/piece-controls/components/body-controls/components/inlay-controls/InlayControls";
import {PIECE_BODY_SHAPES} from "@src/styles/types/PieceStyle";
import type {PieceStyle} from "@src/styles/types/PieceStyle";
import {STYLE_LIMITS} from "@src/styles/limits/StyleLimits";
import {SliderField} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/fields/slider-field/SliderField";

/** The body a piece's mark is put on — its shape, colours, outline and how big it is — and the inlay drawn inside it. */
interface Props {
  readonly pieceStyle: PieceStyle;
  readonly onChange: (update: (pieceStyle: PieceStyle) => PieceStyle) => void;
}

export function BodyControls({pieceStyle, onChange}: Props): React.JSX.Element {
  const {body} = pieceStyle;

  return (
    <>
      <ControlGroup title="Body">
        <ChoiceField
          id="body-shape"
          label="Shape"
          options={PIECE_BODY_SHAPES}
          value={body.shape}
          onChange={shape =>
            onChange(currentPieceStyle => ({...currentPieceStyle, body: {...currentPieceStyle.body, shape}}))
          }
        />

        <SliderField
          id="piece-size"
          label="Size"
          numberRange={STYLE_LIMITS.pieceSize}
          step={0.01}
          value={pieceStyle.size}
          onChange={size => onChange(currentPieceStyle => ({...currentPieceStyle, size}))}
        />

        <ColourField
          id="piece-fill"
          label="Fill"
          value={body.fill}
          translucent
          onChange={fill =>
            onChange(currentPieceStyle => ({...currentPieceStyle, body: {...currentPieceStyle.body, fill}}))
          }
        />

        <ColourField
          id="piece-outline"
          label="Outline"
          value={body.stroke}
          onChange={stroke =>
            onChange(currentPieceStyle => ({...currentPieceStyle, body: {...currentPieceStyle.body, stroke}}))
          }
        />

        <SliderField
          id="piece-outline-width"
          label="Outline width"
          numberRange={STYLE_LIMITS.lineWidth}
          step={0.1}
          value={body.strokeWidth}
          onChange={strokeWidth =>
            onChange(currentPieceStyle => ({...currentPieceStyle, body: {...currentPieceStyle.body, strokeWidth}}))
          }
        />
      </ControlGroup>

      <InlayControls
        pieceBodyStyle={body}
        onChange={pieceBodyStyle => onChange(currentPieceStyle => ({...currentPieceStyle, body: pieceBodyStyle}))}
      />
    </>
  );
}
