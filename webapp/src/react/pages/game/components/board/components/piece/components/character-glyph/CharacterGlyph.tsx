import {CENTRE} from "@src/react/pages/game/components/board/components/piece/utils/PieceViewBox";
import type {CharacterGlyphStyle} from "@src/styles/types/PieceStyle";

/**
 * One character, centred on the piece — what is actually written on a board you can hold.
 *
 * It is handed the character rather than looking one up, so it draws whatever a style writes on a
 * piece without knowing that hanja or hangul exist.
 */
interface Props {
  readonly character: string;
  readonly glyph: CharacterGlyphStyle;
}

export function CharacterGlyph({character, glyph}: Props): React.JSX.Element {
  return (
    <text
      x={CENTRE}
      y={CENTRE}
      textAnchor="middle"
      dominantBaseline="central"
      fill={glyph.colour}
      fontFamily={glyph.fontFamily}
      fontWeight={glyph.fontWeight}
      fontSize={glyph.scale * 100}
      transform={glyph.slant ? `skewX(${-glyph.slant}) translate(${slantOffset(glyph.slant)} 0)` : undefined}
    >
      {character}
    </text>
  );
}

/**
 * A skew pivots on the box's origin rather than on the character, so a leaned character drifts left
 * by roughly the distance the skew moves its own centre. Pushing it back keeps it on the piece.
 */
function slantOffset(slant: number): number {
  return CENTRE * Math.tan((slant * Math.PI) / 180);
}
