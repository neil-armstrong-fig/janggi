import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";

/** The tray's place for one kind of piece, and how many of that kind an army has lost. */
export interface TakenSlot {
  readonly type: PieceType;
  readonly count: number;
}
