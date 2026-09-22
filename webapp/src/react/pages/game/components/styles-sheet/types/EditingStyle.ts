import type {BoardStyle} from "@src/styles/types/BoardStyle";
import type {PieceSetStyle} from "@src/styles/types/PieceSetStyle";

/** A board being made, and the board it was started from. */
interface EditingBoard {
  readonly kind: "Board";
  readonly from: BoardStyle;
}

/** A piece set being made, and the set it was started from. */
interface EditingPieces {
  readonly kind: "Pieces";
  readonly from: PieceSetStyle;
}

/** The style being made in the editor, of whichever kind, and what it began as. */
export type EditingStyle = EditingBoard | EditingPieces;
