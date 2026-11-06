import type {CellMarkerShape} from "@janggi/shared/janggi/styles/CellMarkerShape";

/** The controls for a board style. */
export interface BoardControlMessages {
  readonly board: string;
  readonly boardColour: string;
  readonly lines: string;
  readonly lineColour: string;
  readonly lineWidth: string;
  readonly ownDiagonals: string;
  readonly diagonalColour: string;
  readonly diagonalWidth: string;
  readonly background: string;
  readonly ownBackground: string;
  readonly marker: string;
  readonly shape: string;
  readonly markerShapes: Record<CellMarkerShape, string>;
  readonly size: string;
  readonly colour: string;
  readonly ringWidth: string;
  readonly lastMove: string;
  readonly wash: string;
  readonly brackets: string;
  readonly bikjang: string;
  readonly check: string;
  readonly hints: string;
  readonly outline: string;
  readonly pieceInHand: string;
}
