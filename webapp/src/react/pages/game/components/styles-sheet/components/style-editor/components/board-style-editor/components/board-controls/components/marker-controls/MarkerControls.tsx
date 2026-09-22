import {CELL_MARKER_SHAPES} from "@src/styles/types/CellStyle";
import type {CellMarker, CellStyle} from "@src/styles/types/CellStyle";
import {ChoiceField} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/fields/choice-field/ChoiceField";
import {ColourField} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/fields/colour-field/ColourField";
import {ControlGroup} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/fields/control-group/ControlGroup";
import {STYLE_LIMITS} from "@src/styles/limits/StyleLimits";
import {SliderField} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/fields/slider-field/SliderField";
import {SwitchField} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/fields/switch-field/SwitchField";
import {withMarker} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/board-style-editor/components/board-controls/components/marker-controls/cell-marker/WithMarker";

/** The shape a style may draw on the intersection itself — a ring or a dot, on the palace centres of some boards. */
interface Props {
  readonly cellStyle: CellStyle;
  readonly onChange: (update: (cellStyle: CellStyle) => CellStyle) => void;
}

export function MarkerControls({cellStyle, onChange}: Props): React.JSX.Element {
  const cellMarker = cellStyle.marker;
  const changeMarker = (update: (currentCellMarker: CellMarker) => CellMarker): void => {
    onChange(currentCellStyle =>
      currentCellStyle.marker ? withMarker(currentCellStyle, update(currentCellStyle.marker)) : currentCellStyle,
    );
  };

  return (
    <ControlGroup title="Marker">
      <SwitchField
        id="marker-on"
        label="Marker"
        value={cellMarker !== undefined}
        onChange={on =>
          onChange(currentCellStyle =>
            withMarker(
              currentCellStyle,
              on
                ? (currentCellStyle.marker ?? {
                    shape: "ring",
                    radius: 14,
                    colour: currentCellStyle.stroke,
                    strokeWidth: 2,
                  })
                : undefined,
            ),
          )
        }
      />

      {cellMarker && (
        <>
          <ChoiceField
            id="marker-shape"
            label="Shape"
            options={CELL_MARKER_SHAPES}
            value={cellMarker.shape}
            onChange={shape => changeMarker(currentCellMarker => ({...currentCellMarker, shape}))}
          />

          <SliderField
            id="marker-radius"
            label="Size"
            numberRange={STYLE_LIMITS.markerRadius}
            step={1}
            value={cellMarker.radius}
            onChange={radius => changeMarker(currentCellMarker => ({...currentCellMarker, radius}))}
          />

          <ColourField
            id="marker-colour"
            label="Colour"
            value={cellMarker.colour}
            onChange={colour => changeMarker(currentCellMarker => ({...currentCellMarker, colour}))}
          />

          {cellMarker.shape === "ring" && (
            <SliderField
              id="marker-width"
              label="Ring width"
              numberRange={STYLE_LIMITS.lineWidth}
              step={0.5}
              value={cellMarker.strokeWidth ?? 1}
              onChange={strokeWidth => changeMarker(currentCellMarker => ({...currentCellMarker, strokeWidth}))}
            />
          )}
        </>
      )}
    </ControlGroup>
  );
}
