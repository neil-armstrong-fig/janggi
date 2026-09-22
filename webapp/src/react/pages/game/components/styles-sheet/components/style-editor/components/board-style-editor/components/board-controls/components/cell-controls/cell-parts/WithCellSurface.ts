import type {CellStyle} from "@src/styles/types/CellStyle";

/** The cell with a background of its own painted behind it, or letting the board's show through where `surface` is undefined. */
export function withCellSurface(cellStyle: CellStyle, surface: string | undefined): CellStyle {
  if (surface !== undefined) return {...cellStyle, surface};

  const {surface: _, ...bare} = cellStyle;

  return bare;
}
