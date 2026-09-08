import type {BuiltInPieceSetStyle} from "@src/react/pages/game/components/board/piece-styles/builtin/types/BuiltInPieceSetStyle";
import type {CharacterGlyphStyle} from "@src/react/pages/game/components/board/piece-styles/types/PieceStyle";
import {
  GENERAL_SIZE,
  MODERN_SANS,
  STANDARD_SIZE,
  modernBody,
} from "@src/react/pages/game/components/board/piece-styles/builtin/utils/ModernSet";
import {HANGUL_CHARACTERS} from "@src/react/pages/game/components/board/piece-styles/builtin/hangul/marks/HangulCharacters";
import {toPieceKey} from "@janggi/shared/janggi/pieces/ToPieceKey";

/**
 * Set a little larger than the hanja mark. A hangul syllable is two or three strokes where a hanja
 * character can be a dozen, so it carries the extra size without crowding and gains from it at the
 * distance a piece is actually read from.
 */
const MARK: CharacterGlyphStyle = {
  kind: "character",
  characters: HANGUL_CHARACTERS,
  colour: "#ffffff",
  scale: 0.58,
  fontFamily: MODERN_SANS,
  fontWeight: 700,
};

/**
 * The same words, in the Korean alphabet.
 *
 * The piece a Korean speaker would name out loud — 마 is *ma*, the horse — written so it can be
 * sounded out rather than recognised. It sits between the hanja and the drawings on purpose: a
 * player who cannot read 馬 can still learn seven syllables in an afternoon, and having done so is
 * reading the pieces by their real names rather than by a picture someone drew for them.
 */
export const hangulPieces: BuiltInPieceSetStyle = {
  name: "Hangul",
  sides: {
    han: {body: modernBody("han"), glyph: MARK, size: STANDARD_SIZE},
    cho: {body: modernBody("cho"), glyph: MARK, size: STANDARD_SIZE},
  },
  pieces: {
    [toPieceKey({side: "han", type: "general"})]: {body: modernBody("han"), glyph: MARK, size: GENERAL_SIZE},
    [toPieceKey({side: "cho", type: "general"})]: {body: modernBody("cho"), glyph: MARK, size: GENERAL_SIZE},
  },
};
