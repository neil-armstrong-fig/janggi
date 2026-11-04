import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";
import type {CellStyle} from "@src/styles/types/CellStyle";
import {ColourField} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/fields/colour-field/ColourField";
import {ControlGroup} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/fields/control-group/ControlGroup";
import {STYLE_LIMITS} from "@src/styles/limits/StyleLimits";
import {SliderField} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/fields/slider-field/SliderField";
import {SwitchField} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/fields/switch-field/SwitchField";
import {withCellSurface} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/board-style-editor/components/board-controls/components/cell-controls/cell-parts/WithCellSurface";
import {withDiagonals} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/board-style-editor/components/board-controls/components/cell-controls/cell-parts/WithDiagonals";

/**
 * The lines of one intersection, and the background behind it, for whichever the controls are pointed at:
 * every point that has no style of its own, or the one point tapped on the preview.
 */
interface Props {
  readonly cellStyle: CellStyle;
  readonly onChange: (update: (cellStyle: CellStyle) => CellStyle) => void;
}

export function CellControls({cellStyle, onChange}: Props): React.JSX.Element {
  const words = useMessages().styles.board;
  const ownDiagonals = cellStyle.diagonalStroke !== undefined || cellStyle.diagonalStrokeWidth !== undefined;

  return (
    <>
      <ControlGroup title={words.lines}>
        <ColourField
          id="line-colour"
          label={words.lineColour}
          value={cellStyle.stroke}
          onChange={stroke => onChange(currentCellStyle => ({...currentCellStyle, stroke}))}
        />

        <SliderField
          id="line-width"
          label={words.lineWidth}
          numberRange={STYLE_LIMITS.lineWidth}
          step={0.05}
          value={cellStyle.strokeWidth}
          onChange={strokeWidth => onChange(currentCellStyle => ({...currentCellStyle, strokeWidth}))}
        />

        <SwitchField
          id="diagonals-own"
          label={words.ownDiagonals}
          value={ownDiagonals}
          onChange={own => onChange(currentCellStyle => withDiagonals(currentCellStyle, own))}
        />

        {ownDiagonals && (
          <>
            <ColourField
              id="diagonal-colour"
              label={words.diagonalColour}
              value={cellStyle.diagonalStroke ?? cellStyle.stroke}
              onChange={diagonalStroke => onChange(currentCellStyle => ({...currentCellStyle, diagonalStroke}))}
            />

            <SliderField
              id="diagonal-width"
              label={words.diagonalWidth}
              numberRange={STYLE_LIMITS.lineWidth}
              step={0.05}
              value={cellStyle.diagonalStrokeWidth ?? cellStyle.strokeWidth}
              onChange={diagonalStrokeWidth => {
                return onChange(currentCellStyle => ({...currentCellStyle, diagonalStrokeWidth}));
              }}
            />
          </>
        )}
      </ControlGroup>

      <ControlGroup title={words.background}>
        <SwitchField
          id="cell-surface-own"
          label={words.ownBackground}
          value={cellStyle.surface !== undefined}
          onChange={own => {
            return onChange(currentCellStyle => withCellSurface(currentCellStyle, own ? OWN_BACKGROUND : undefined));
          }}
        />

        {cellStyle.surface !== undefined && (
          <ColourField
            id="cell-surface-colour"
            label={words.background}
            value={cellStyle.surface}
            translucent
            onChange={surface => onChange(currentCellStyle => withCellSurface(currentCellStyle, surface))}
          />
        )}
      </ControlGroup>
    </>
  );
}

/** Faint, so switching it on shows where it is without hiding the lines. */
const OWN_BACKGROUND = "rgba(255, 255, 255, 0.1)";
