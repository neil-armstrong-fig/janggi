import {ColourField} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/fields/colour-field/ColourField";
import {ControlGroup} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/fields/control-group/ControlGroup";
import type {PieceBodyStyle, PieceInlayStyle} from "@src/styles/types/PieceStyle";
import {STYLE_LIMITS} from "@src/styles/limits/StyleLimits";
import {SliderField} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/fields/slider-field/SliderField";
import {SwitchField} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/fields/switch-field/SwitchField";
import {withInlay} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/components/piece-controls/components/body-controls/components/inlay-controls/inlay/WithInlay";
import {withInlayFill} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/components/piece-controls/components/body-controls/components/inlay-controls/inlay/WithInlayFill";

/** The second outline drawn inside a piece's body — the bevel on a turned wooden piece, or a printed ring. */
interface Props {
  readonly pieceBodyStyle: PieceBodyStyle;
  readonly onChange: (pieceBodyStyle: PieceBodyStyle) => void;
}

export function InlayControls({pieceBodyStyle, onChange}: Props): React.JSX.Element {
  const pieceInlayStyle = pieceBodyStyle.inlay;
  const changeInlay = (update: (currentPieceInlayStyle: PieceInlayStyle) => PieceInlayStyle): void => {
    if (pieceInlayStyle) onChange(withInlay(pieceBodyStyle, update(pieceInlayStyle)));
  };

  return (
    <ControlGroup title="Inlay">
      <SwitchField
        id="inlay-on"
        label="Inlay"
        value={pieceInlayStyle !== undefined}
        onChange={on =>
          onChange(
            withInlay(pieceBodyStyle, on ? {inset: 0.12, stroke: pieceBodyStyle.stroke, strokeWidth: 1} : undefined),
          )
        }
      />

      {pieceInlayStyle && (
        <>
          <SliderField
            id="inlay-inset"
            label="Inset"
            numberRange={STYLE_LIMITS.inlayInset}
            step={0.01}
            value={pieceInlayStyle.inset}
            onChange={inset => changeInlay(currentPieceInlayStyle => ({...currentPieceInlayStyle, inset}))}
          />

          <ColourField
            id="inlay-colour"
            label="Colour"
            value={pieceInlayStyle.stroke}
            onChange={stroke => changeInlay(currentPieceInlayStyle => ({...currentPieceInlayStyle, stroke}))}
          />

          <SliderField
            id="inlay-width"
            label="Width"
            numberRange={STYLE_LIMITS.lineWidth}
            step={0.1}
            value={pieceInlayStyle.strokeWidth}
            onChange={strokeWidth => changeInlay(currentPieceInlayStyle => ({...currentPieceInlayStyle, strokeWidth}))}
          />

          <SwitchField
            id="inlay-fill-on"
            label="Filled"
            value={pieceInlayStyle.fill !== undefined}
            onChange={filled =>
              changeInlay(currentPieceInlayStyle =>
                withInlayFill(currentPieceInlayStyle, filled ? INLAY_FILL : undefined),
              )
            }
          />

          {pieceInlayStyle.fill !== undefined && (
            <ColourField
              id="inlay-fill"
              label="Fill"
              value={pieceInlayStyle.fill}
              translucent
              onChange={fill => changeInlay(currentPieceInlayStyle => withInlayFill(currentPieceInlayStyle, fill))}
            />
          )}
        </>
      )}
    </ControlGroup>
  );
}

/** Faint, so switching it on shows where it is without hiding the body. */
const INLAY_FILL = "rgba(255, 255, 255, 0.15)";
