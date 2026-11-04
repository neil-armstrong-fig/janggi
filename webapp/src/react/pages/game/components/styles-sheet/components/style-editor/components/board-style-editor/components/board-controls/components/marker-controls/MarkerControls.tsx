import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";
import {CELL_MARKER_SHAPES} from "@janggi/shared/janggi/styles/CellMarkerShape";
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
  const words = useMessages().styles.board;
  const cellMarker = cellStyle.marker;
  const changeMarker = (update: (currentCellMarker: CellMarker) => CellMarker): void => {
    onChange(currentCellStyle => {
      if (currentCellStyle.marker) {
        return withMarker(currentCellStyle, update(currentCellStyle.marker));
      }

      return currentCellStyle;
    });
  };

  return (
    <ControlGroup title={words.marker}>
      <SwitchField
        id="marker-on"
        label={words.marker}
        value={cellMarker !== undefined}
        onChange={on => {
          return onChange(currentCellStyle => {
            return withMarker(
              currentCellStyle,
              on
                ? (currentCellStyle.marker ?? {
                    shape: "ring",
                    radius: 14,
                    colour: currentCellStyle.stroke,
                    strokeWidth: 2,
                  })
                : undefined,
            );
          });
        }}
      />

      {cellMarker && (
        <>
          <ChoiceField
            id="marker-shape"
            label={words.shape}
            options={CELL_MARKER_SHAPES}
            labelOf={shape => words.markerShapes[shape]}
            value={cellMarker.shape}
            onChange={shape => changeMarker(currentCellMarker => ({...currentCellMarker, shape}))}
          />

          <SliderField
            id="marker-radius"
            label={words.size}
            numberRange={STYLE_LIMITS.markerRadius}
            step={1}
            value={cellMarker.radius}
            onChange={radius => changeMarker(currentCellMarker => ({...currentCellMarker, radius}))}
          />

          <ColourField
            id="marker-colour"
            label={words.colour}
            value={cellMarker.colour}
            onChange={colour => changeMarker(currentCellMarker => ({...currentCellMarker, colour}))}
          />

          {cellMarker.shape === "ring" && (
            <SliderField
              id="marker-width"
              label={words.ringWidth}
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
