import type {CharacterGlyphStyle, PieceStyle} from "@src/styles/types/PieceStyle";
import type {BuiltInPieceSetStyle} from "@src/react/pages/game/components/board/piece-styles/builtin/types/BuiltInPieceSetStyle";
import {HANJA_CHARACTERS} from "@src/react/pages/game/components/board/piece-styles/builtin/marks/HanjaCharacters";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {toPieceKey} from "@janggi/shared/janggi/pieces/ToPieceKey";

const SERIF = "'Nanum Myeongjo', 'Noto Serif KR', 'Source Han Serif KR', 'Songti SC', 'SimSun', serif";

/**
 * Hollow for the side that moves first and solid for the side that answers, the way a chess diagram
 * prints white and black — so Cho, who opens, is the outline, and Han is the filled disc. No colour at
 * all: a diagram is read in ink, and the two armies still part at a glance.
 */
const INK: Record<Side, PieceStyle> = {
  cho: {
    body: {shape: "disc", fill: "#ffffff", stroke: "#111111", strokeWidth: 3},
    glyph: glyph("#111111"),
    size: 0.82,
  },
  han: {
    body: {shape: "disc", fill: "#111111", stroke: "#111111", strokeWidth: 3},
    glyph: glyph("#ffffff"),
    size: 0.82,
  },
};

/**
 * A page out of a problem book: black and white discs with the hanja set in a book face. The generals
 * are a size up, as a diagram's kings are drawn no larger than anything else but are always found first.
 */
export const diagramPieces: BuiltInPieceSetStyle = {
  name: "Diagram",
  sides: INK,
  pieces: {
    [toPieceKey({side: "han", type: "general"})]: {...INK.han, size: 0.92},
    [toPieceKey({side: "cho", type: "general"})]: {...INK.cho, size: 0.92},
  },
};

function glyph(colour: string): CharacterGlyphStyle {
  return {kind: "character", characters: HANJA_CHARACTERS, colour, scale: 0.5, fontFamily: SERIF, fontWeight: 600};
}
