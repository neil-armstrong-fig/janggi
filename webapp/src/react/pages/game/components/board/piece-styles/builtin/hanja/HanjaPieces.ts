import type {BuiltInPieceSetStyle} from "@src/react/pages/game/components/board/piece-styles/builtin/types/BuiltInPieceSetStyle";
import type {CharacterGlyphStyle} from "@src/react/pages/game/components/board/piece-styles/types/PieceStyle";
import {
  GENERAL_SIZE,
  MODERN_SANS,
  STANDARD_SIZE,
  modernBody,
} from "@src/react/pages/game/components/board/piece-styles/builtin/utils/ModernSet";
import {HANJA_CHARACTERS} from "@src/react/pages/game/components/board/piece-styles/builtin/marks/HanjaCharacters";
import {toPieceKey} from "@janggi/shared/janggi/pieces/ToPieceKey";

/** White on a solid disc: the highest contrast available, which is what a small piece needs. */
const MARK: CharacterGlyphStyle = {
  kind: "character",
  characters: HANJA_CHARACTERS,
  colour: "#ffffff",
  scale: 0.52,
  fontFamily: MODERN_SANS,
  fontWeight: 700,
};

/**
 * The real characters, on the modern body.
 *
 * For a player who wants what is actually written on a board without giving up the contrast a phone
 * screen needs. Both armies set their characters identically here — the traditional set's
 * regular-against-cursive distinction belongs to a carved set, and imitating it on a flat disc would
 * only cost legibility when the colour of the body has already said which army a piece is.
 */
export const hanjaPieces: BuiltInPieceSetStyle = {
  name: "Hanja",
  sides: {
    han: {body: modernBody("han"), glyph: MARK, size: STANDARD_SIZE},
    cho: {body: modernBody("cho"), glyph: MARK, size: STANDARD_SIZE},
  },
  pieces: {
    [toPieceKey({side: "han", type: "general"})]: {body: modernBody("han"), glyph: MARK, size: GENERAL_SIZE},
    [toPieceKey({side: "cho", type: "general"})]: {body: modernBody("cho"), glyph: MARK, size: GENERAL_SIZE},
  },
};
