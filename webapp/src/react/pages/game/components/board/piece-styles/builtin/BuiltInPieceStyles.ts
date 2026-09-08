import type {BuiltInPieceSetStyle} from "@src/react/pages/game/components/board/piece-styles/builtin/types/BuiltInPieceSetStyle";
import {hangulPieces} from "@src/react/pages/game/components/board/piece-styles/builtin/hangul/HangulPieces";
import {hanjaPieces} from "@src/react/pages/game/components/board/piece-styles/builtin/hanja/HanjaPieces";
import {modernPieces} from "@src/react/pages/game/components/board/piece-styles/builtin/modern/ModernPieces";
import {traditionalPieces} from "@src/react/pages/game/components/board/piece-styles/builtin/traditional/TraditionalPieces";

/**
 * The piece sets that ship with the app. Add one by writing another set in this folder, listing it
 * here, and adding its name to `PieceSetName` in `@janggi/shared` — the same arrangement, and for
 * the same reason, as the cell styles next door.
 *
 * Ordered by how much of the real game they keep: the board as it actually looks, then its
 * characters on a body a phone can render, then those characters spelled out in hangul, and last
 * the drawings, which ask nothing of the reader and teach them nothing either.
 */
export const BUILT_IN_PIECE_STYLES: readonly BuiltInPieceSetStyle[] = [
  traditionalPieces,
  hanjaPieces,
  hangulPieces,
  modernPieces,
];

export const DEFAULT_PIECE_STYLE: BuiltInPieceSetStyle = traditionalPieces;
