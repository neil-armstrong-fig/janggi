import type {CharacterGlyphStyle, PieceBodyStyle, PieceStyle} from "@src/styles/types/PieceStyle";
import type {BuiltInPieceSetStyle} from "@src/react/pages/game/components/board/piece-styles/builtin/types/BuiltInPieceSetStyle";
import {HANJA_CHARACTERS} from "@src/react/pages/game/components/board/piece-styles/builtin/marks/HanjaCharacters";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {toPieceKey} from "@janggi/shared/janggi/pieces/ToPieceKey";

/** Turned boxwood: a warm blank, a darker cut edge, and the bevel the chamfer leaves behind. */
const BOXWOOD: PieceBodyStyle = {
  shape: "octagon",
  fill: "#efd8a6",
  stroke: "#8a6a3d",
  strokeWidth: 2,
  inlay: {inset: 0.13, stroke: "#cfae76", strokeWidth: 1.5},
};

const SERIF = "'Nanum Myeongjo', 'Noto Serif KR', 'Source Han Serif KR', 'Songti SC', 'SimSun', serif";

/**
 * Han's characters are cut in regular script and Cho's in cursive. No cursive face can be relied on
 * to be installed on a phone, so Cho's are leaned instead — an approximation, and an honest one: it
 * keeps the two armies separable at a glance, which is the job the real script difference does. A
 * bundled face would let this become the real thing.
 */
const INK: Record<Side, CharacterGlyphStyle> = {
  han: {
    kind: "character",
    characters: HANJA_CHARACTERS,
    colour: "#a3231d",
    scale: 0.5,
    fontFamily: SERIF,
    fontWeight: 700,
  },
  cho: {
    kind: "character",
    characters: HANJA_CHARACTERS,
    colour: "#0f6b46",
    scale: 0.5,
    fontFamily: SERIF,
    fontWeight: 500,
    slant: 10,
  },
};

/**
 * The three sizes a set is turned in. The general is the largest piece on the board, the four that
 * do the fighting are the middle size, and the guards and soldiers are the smallest — so rank is
 * legible by feel, before a single character has been read.
 */
const GENERAL = 0.94;
const MAJOR = 0.82;
const MINOR = 0.7;

/**
 * A real set, as it sits on a table: octagonal boxwood, ink, and three sizes.
 *
 * Both armies share the same blank — the wood is the wood — and are told apart by the colour of the
 * ink and by the character in it, exactly as they are in the hand. That is why nothing here tints
 * the bodies: doing so would answer a question the real set answers another way.
 */
export const traditionalPieces: BuiltInPieceSetStyle = {
  name: "Traditional",
  sides: {
    han: pieceOfSize("han", MAJOR),
    cho: pieceOfSize("cho", MAJOR),
  },
  pieces: {
    [toPieceKey({side: "han", type: "general"})]: pieceOfSize("han", GENERAL),
    [toPieceKey({side: "cho", type: "general"})]: pieceOfSize("cho", GENERAL),
    [toPieceKey({side: "han", type: "guard"})]: pieceOfSize("han", MINOR),
    [toPieceKey({side: "cho", type: "guard"})]: pieceOfSize("cho", MINOR),
    [toPieceKey({side: "han", type: "soldier"})]: pieceOfSize("han", MINOR),
    [toPieceKey({side: "cho", type: "soldier"})]: pieceOfSize("cho", MINOR),
  },
};

function pieceOfSize(side: Side, size: number): PieceStyle {
  return {body: BOXWOOD, glyph: INK[side], size};
}
