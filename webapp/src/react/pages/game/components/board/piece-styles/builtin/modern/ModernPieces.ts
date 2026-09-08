import type {BuiltInPieceSetStyle} from "@src/react/pages/game/components/board/piece-styles/builtin/types/BuiltInPieceSetStyle";
import {
  GENERAL_SIZE,
  STANDARD_SIZE,
  modernBody,
} from "@src/react/pages/game/components/board/piece-styles/builtin/utils/ModernSet";
import {JANGGI_PICTOGRAPHS} from "@src/react/pages/game/components/board/piece-styles/builtin/modern/marks/JanggiPictographs";
import type {PictographGlyphStyle} from "@src/react/pages/game/components/board/piece-styles/types/PieceStyle";
import {toPieceKey} from "@janggi/shared/janggi/pieces/ToPieceKey";

/** White on a solid disc: the highest contrast available, which is what a small piece needs. */
const MARK: PictographGlyphStyle = {
  kind: "pictograph",
  pictographs: JANGGI_PICTOGRAPHS,
  colour: "#ffffff",
  scale: 0.72,
};

/**
 * The set that needs no reading at all: every piece drawn as the thing it is named after, so an
 * elephant is an elephant and a cannon is a cannon without anything being looked up or sounded out.
 *
 * The last resort of the four, and the only one that teaches a player nothing about the real game.
 * The drawings are carried by the style rather than reached for from inside a component, so a set
 * someone else writes can supply its own.
 */
export const modernPieces: BuiltInPieceSetStyle = {
  name: "Modern",
  sides: {
    han: {body: modernBody("han"), glyph: MARK, size: STANDARD_SIZE},
    cho: {body: modernBody("cho"), glyph: MARK, size: STANDARD_SIZE},
  },
  pieces: {
    [toPieceKey({side: "han", type: "general"})]: {body: modernBody("han"), glyph: MARK, size: GENERAL_SIZE},
    [toPieceKey({side: "cho", type: "general"})]: {body: modernBody("cho"), glyph: MARK, size: GENERAL_SIZE},
  },
};
