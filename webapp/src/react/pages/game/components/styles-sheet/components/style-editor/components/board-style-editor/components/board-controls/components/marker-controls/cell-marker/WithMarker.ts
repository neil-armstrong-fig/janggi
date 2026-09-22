import type {CellMarker, CellStyle} from "@src/styles/types/CellStyle";

/** The cell with a marker on it, or without one where `marker` is undefined. */
export function withMarker(cellStyle: CellStyle, cellMarker: CellMarker | undefined): CellStyle {
  if (cellMarker !== undefined) return {...cellStyle, marker: cellMarker};

  const {marker: _, ...bare} = cellStyle;

  return bare;
}
