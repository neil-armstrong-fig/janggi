import type {Side} from "@janggi/shared/janggi/pieces/Side";

/** The Look tab: the board and pieces, and what the board marks and does. Style names are the styles' own and are not here. */
export interface LookMessages {
  readonly board: string;
  readonly pieces: string;
  readonly boardOf: (side: Side) => string;
  readonly piecesOf: (side: Side) => string;
  readonly differentBoard: string;
  readonly differentPieces: string;
  readonly yourStyles: string;
  readonly onTheBoard: string;
  readonly markMovable: string;
  readonly labelBikjang: string;
  readonly bikjangHintNote: string;
  readonly motion: string;
  readonly transparency: string;
}
