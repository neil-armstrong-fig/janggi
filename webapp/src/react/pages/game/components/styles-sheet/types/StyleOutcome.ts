import type {BoardStyle} from "@src/styles/types/BoardStyle";
import type {PieceSetStyle} from "@src/styles/types/PieceSetStyle";
import type {Refused} from "@src/redux/custom-styles/untrusted/types/Checked";

/** A board style that checked out. */
interface BoardOutcome {
  readonly kind: "board";
  readonly style: BoardStyle;
}

/** A piece set that checked out. */
interface PiecesOutcome {
  readonly kind: "pieces";
  readonly style: PieceSetStyle;
}

/**
 * What came of a style a player pasted or wrote: a board style, a piece set, or the reason it is neither
 * — which is shown to them, so it says where to look.
 */
export type StyleOutcome = BoardOutcome | PiecesOutcome | Refused;
