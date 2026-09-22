import type {CellStyle} from "@src/styles/types/CellStyle";

/**
 * The cell with its palace diagonals picked out in a line of their own, or matching its grid again. Picked
 * out, they begin as the grid's own line, so turning it on changes nothing until something is.
 */
export function withDiagonals(cellStyle: CellStyle, own: boolean): CellStyle {
  if (own) return {...cellStyle, diagonalStroke: cellStyle.stroke, diagonalStrokeWidth: cellStyle.strokeWidth};

  const {diagonalStroke: _stroke, diagonalStrokeWidth: _width, ...matching} = cellStyle;

  return matching;
}
