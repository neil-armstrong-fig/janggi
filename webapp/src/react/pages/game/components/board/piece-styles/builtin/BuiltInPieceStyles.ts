import type {BuiltInPieceSetStyle} from "@src/react/pages/game/components/board/piece-styles/builtin/types/BuiltInPieceSetStyle";
import {celadonPieces} from "@src/react/pages/game/components/board/piece-styles/builtin/celadon/CeladonPieces";
import {dancheongPieces} from "@src/react/pages/game/components/board/piece-styles/builtin/dancheong/DancheongPieces";
import {diagramPieces} from "@src/react/pages/game/components/board/piece-styles/builtin/diagram/DiagramPieces";
import {hackerPieces} from "@src/react/pages/game/components/board/piece-styles/builtin/hacker/HackerPieces";
import {hangulPieces} from "@src/react/pages/game/components/board/piece-styles/builtin/hangul/HangulPieces";
import {hanjaPieces} from "@src/react/pages/game/components/board/piece-styles/builtin/hanja/HanjaPieces";
import {modernPieces} from "@src/react/pages/game/components/board/piece-styles/builtin/modern/ModernPieces";
import {tournamentPieces} from "@src/react/pages/game/components/board/piece-styles/builtin/tournament/TournamentPieces";
import {traditionalPieces} from "@src/react/pages/game/components/board/piece-styles/builtin/traditional/TraditionalPieces";

/**
 * The piece sets that ship with the app. Add one by writing another set in this folder, listing it
 * here, adding its name to `PieceSetName` in `@janggi/shared`, and giving it a price in `UNLOCK_PRICES`
 * — the same arrangement, and for the same reason, as the cell styles next door.
 *
 * The sets open from the start come first: the board as it actually looks, its characters spelled out
 * in hangul, and drawings that ask nothing of the reader. Hanja is the first earned set, then the themes
 * follow in the order XP unlocks them.
 */
export const BUILT_IN_PIECE_STYLES: readonly BuiltInPieceSetStyle[] = [
  traditionalPieces,
  hangulPieces,
  modernPieces,
  hanjaPieces,
  diagramPieces,
  tournamentPieces,
  celadonPieces,
  dancheongPieces,
  hackerPieces,
];
