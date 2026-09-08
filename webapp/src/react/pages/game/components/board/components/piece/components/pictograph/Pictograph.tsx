import {CENTRE} from "@src/react/pages/game/components/board/components/piece/utils/PieceViewBox";
import type {PictographGlyphStyle} from "@src/react/pages/game/components/board/piece-styles/types/PieceStyle";

/**
 * One drawing, centred on the piece, in place of the character naming it.
 *
 * It is handed the path rather than looking one up, so it draws whatever a style supplies — the set
 * that ships with the app, or one somebody else wrote — and knows nothing about which pieces exist.
 */
interface Props {
  readonly path: string;
  readonly glyph: PictographGlyphStyle;
}

export function Pictograph({path, glyph}: Props): React.JSX.Element {
  return (
    <path
      d={path}
      fill={glyph.colour}
      fillRule="nonzero"
      transform={`translate(${CENTRE} ${CENTRE}) scale(${glyph.scale}) translate(${-CENTRE} ${-CENTRE})`}
    />
  );
}
