import {CharacterControls} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/components/piece-controls/components/glyph-controls/components/character-controls/CharacterControls";
import {ChoiceField} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/fields/choice-field/ChoiceField";
import {ColourField} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/fields/colour-field/ColourField";
import {ControlGroup} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/fields/control-group/ControlGroup";
import {PIECE_GLYPH_KINDS} from "@src/styles/types/PieceStyle";
import {PictographControls} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/components/piece-controls/components/glyph-controls/components/pictograph-controls/PictographControls";
import type {PieceStyle} from "@src/styles/types/PieceStyle";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {STYLE_LIMITS} from "@src/styles/limits/StyleLimits";
import {SliderField} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/fields/slider-field/SliderField";
import {withGlyphKind} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/components/piece-controls/components/glyph-controls/glyph/WithGlyphKind";

/**
 * What is marked on a piece: writing or drawings, in what colour and how big — and then whichever it is,
 * the writing's own controls or the drawings'. The characters shown are the army's the controls are
 * pointed at.
 */
interface Props {
  readonly pieceStyle: PieceStyle;
  /** The army whose characters are shown and changed, where a set writes a piece differently for each. */
  readonly side: Side;
  readonly onChange: (update: (pieceStyle: PieceStyle) => PieceStyle) => void;
}

export function GlyphControls({pieceStyle, side, onChange}: Props): React.JSX.Element {
  const {glyph} = pieceStyle;

  return (
    <ControlGroup title="Mark">
      <ChoiceField
        id="glyph-kind"
        label="Kind"
        options={PIECE_GLYPH_KINDS}
        value={glyph.kind}
        onChange={pieceGlyphKind =>
          onChange(currentPieceStyle => ({
            ...currentPieceStyle,
            glyph: withGlyphKind(currentPieceStyle.glyph, pieceGlyphKind),
          }))
        }
      />

      <ColourField
        id="glyph-colour"
        label="Colour"
        value={glyph.colour}
        onChange={colour =>
          onChange(currentPieceStyle => ({...currentPieceStyle, glyph: {...currentPieceStyle.glyph, colour}}))
        }
      />

      <SliderField
        id="glyph-scale"
        label="Size"
        numberRange={STYLE_LIMITS.glyphScale}
        step={0.01}
        value={glyph.scale}
        onChange={scale =>
          onChange(currentPieceStyle => ({...currentPieceStyle, glyph: {...currentPieceStyle.glyph, scale}}))
        }
      />

      {glyph.kind === "pictograph" && (
        <PictographControls
          pictographGlyphStyle={glyph}
          onChange={update =>
            onChange(currentPieceStyle =>
              currentPieceStyle.glyph.kind === "pictograph"
                ? {...currentPieceStyle, glyph: update(currentPieceStyle.glyph)}
                : currentPieceStyle,
            )
          }
        />
      )}

      {glyph.kind === "character" && (
        <CharacterControls
          characterGlyphStyle={glyph}
          side={side}
          onChange={characterGlyphStyle =>
            onChange(currentPieceStyle => ({...currentPieceStyle, glyph: characterGlyphStyle}))
          }
        />
      )}
    </ControlGroup>
  );
}
