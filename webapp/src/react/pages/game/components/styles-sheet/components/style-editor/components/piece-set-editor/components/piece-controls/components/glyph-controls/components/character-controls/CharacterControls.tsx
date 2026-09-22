import type {CharacterGlyphStyle} from "@src/styles/types/PieceStyle";
import {ChoiceField} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/fields/choice-field/ChoiceField";
import {FONT_STACKS} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/components/piece-controls/components/glyph-controls/font/FontStacks";
import {PIECE_TYPES} from "@janggi/shared/janggi/pieces/PieceType";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {STYLE_LIMITS} from "@src/styles/limits/StyleLimits";
import {SliderField} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/fields/slider-field/SliderField";
import {SwitchField} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/fields/switch-field/SwitchField";
import {TextField} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/fields/text-field/TextField";
import {WRITING_NAMES} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/components/piece-controls/components/glyph-controls/components/character-controls/writing/WritingName";
import {characterFor} from "@src/react/pages/game/components/board/components/piece/utils/CharacterFor";
import {withCharacter} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/components/piece-controls/components/glyph-controls/components/character-controls/character-glyph/WithCharacter";
import {withSlant} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/components/piece-controls/components/glyph-controls/components/character-controls/character-glyph/WithSlant";
import {withWriting} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/components/piece-controls/components/glyph-controls/components/character-controls/character-glyph/WithWriting";
import {writingOf} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/components/piece-controls/components/glyph-controls/components/character-controls/writing/WritingOf";

/**
 * What is written on a piece: which writing, the characters themselves, the face they are set in, how heavy
 * and whether they lean. The characters shown are the army's the controls are pointed at.
 */
interface Props {
  readonly characterGlyphStyle: CharacterGlyphStyle;
  /** The army whose characters are shown and changed, where a set writes a piece differently for each. */
  readonly side: Side;
  readonly onChange: (characterGlyphStyle: CharacterGlyphStyle) => void;
}

export function CharacterControls({characterGlyphStyle, side, onChange}: Props): React.JSX.Element {
  return (
    <>
      <ChoiceField
        id="writing"
        label="Writing"
        options={WRITING_NAMES}
        value={writingOf(characterGlyphStyle.characters)}
        onChange={writingName => onChange(withWriting(characterGlyphStyle, writingName))}
      />

      {PIECE_TYPES.map(pieceType => (
        <TextField
          key={pieceType}
          id={`character-${pieceType}`}
          label={pieceType}
          value={characterFor(characterGlyphStyle.characters, {side, type: pieceType})}
          maxLength={MOST_CHARACTERS}
          onChange={text => onChange(withCharacter(characterGlyphStyle, {side, type: pieceType}, text))}
        />
      ))}

      <ChoiceField
        id="font"
        label="Face"
        options={FONT_STACKS.map(fontStack => fontStack.name)}
        value={FONT_STACKS.find(fontStack => fontStack.css === characterGlyphStyle.fontFamily)?.name}
        onChange={fontStackName => {
          const chosenFontStack = FONT_STACKS.find(fontStack => fontStack.name === fontStackName);
          if (chosenFontStack) onChange({...characterGlyphStyle, fontFamily: chosenFontStack.css});
        }}
      />

      <SliderField
        id="font-weight"
        label="Weight"
        numberRange={STYLE_LIMITS.fontWeight}
        step={50}
        value={characterGlyphStyle.fontWeight}
        onChange={fontWeight => onChange({...characterGlyphStyle, fontWeight})}
      />

      <SwitchField
        id="slant-on"
        label="Leaning"
        value={characterGlyphStyle.slant !== undefined}
        onChange={leaning => onChange(withSlant(characterGlyphStyle, leaning ? LEAN : undefined))}
      />

      {characterGlyphStyle.slant !== undefined && (
        <SliderField
          id="slant"
          label="Lean"
          numberRange={STYLE_LIMITS.glyphSlant}
          step={1}
          value={characterGlyphStyle.slant}
          onChange={slant => onChange(withSlant(characterGlyphStyle, slant))}
        />
      )}
    </>
  );
}

/** As many characters as `Reading.text` lets a piece carry. */
const MOST_CHARACTERS = 8;

/** A slight lean, which is what a set that has one leans its characters by. */
const LEAN = 8;
