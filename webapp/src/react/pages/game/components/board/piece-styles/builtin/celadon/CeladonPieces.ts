import type {BuiltInPieceSetStyle} from "@src/react/pages/game/components/board/piece-styles/builtin/types/BuiltInPieceSetStyle";
import {HANGUL_CHARACTERS} from "@src/react/pages/game/components/board/piece-styles/builtin/marks/HangulCharacters";
import type {PieceStyle} from "@src/styles/types/PieceStyle";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {toPieceKey} from "@janggi/shared/janggi/pieces/ToPieceKey";

const SERIF = "'Nanum Myeongjo', 'Noto Serif KR', 'Source Han Serif KR', serif";

/**
 * The two slips a celadon potter inlaid with: iron, which fires to a brick red, and the cobalt that
 * came later. Han takes the red and Cho the blue-black, keeping each army near its usual colour.
 */
const INLAY: Record<Side, string> = {
  han: "#8a3324",
  cho: "#1f4557",
};

/**
 * Glazed jade discs, each with its word inlaid rather than painted — 상감, the Goryeo technique of
 * cutting a design and filling it with coloured slip before the glaze goes on. The generals are turned a
 * size larger, like the rest of a real set.
 */
export const celadonPieces: BuiltInPieceSetStyle = {
  name: "Celadon",
  sides: {
    han: glazed("han", 0.84),
    cho: glazed("cho", 0.84),
  },
  pieces: {
    [toPieceKey({side: "han", type: "general"})]: glazed("han", 0.94),
    [toPieceKey({side: "cho", type: "general"})]: glazed("cho", 0.94),
  },
};

function glazed(side: Side, size: number): PieceStyle {
  return {
    body: {
      shape: "disc",
      // A rim as dark as the board's lines: a glazed disc the colour of the glaze under it would vanish.
      fill: "#c7e0cf",
      stroke: "#2f5546",
      strokeWidth: 3.5,
      inlay: {inset: 0.12, stroke: "#dcebe1", strokeWidth: 1.5},
    },
    glyph: {
      kind: "character",
      characters: HANGUL_CHARACTERS,
      colour: INLAY[side],
      scale: 0.54,
      fontFamily: SERIF,
      fontWeight: 700,
    },
    size,
  };
}
