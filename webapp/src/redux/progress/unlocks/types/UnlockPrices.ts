import type {BoardStyleName} from "@janggi/shared/janggi/settings/BoardStyleName";
import type {PieceSetName} from "@janggi/shared/janggi/settings/PieceSetName";

/** What each built-in board style costs, in XP. */
export type BoardStylePrices = Readonly<Record<BoardStyleName, number>>;

/** What each built-in piece set costs, in XP. */
export type PieceSetPrices = Readonly<Record<PieceSetName, number>>;

/** Everything XP opens, and at how much. Zero is open from the first visit. */
export interface UnlockPrices {
  readonly boardStyles: BoardStylePrices;
  readonly pieceSets: PieceSetPrices;
  /** Making a style of one's own. Importing one somebody else made is never locked. */
  readonly styleEditor: number;
}
