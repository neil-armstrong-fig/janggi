import type {CellStyle} from "@src/react/pages/game/components/board/cell-styles/types/CellStyle";
import type {PositionKey} from "@src/react/pages/game/components/board/types/Position";

/** Overrides keyed by `toPositionKey`, e.g. `{f5r2: {...}}`. */
export type CellOverrides = Readonly<Partial<Record<PositionKey, CellStyle>>>;

/**
 * How a whole board looks: one cell style for every intersection, and any number of per-position
 * overrides. Every cell on the grid is individually stylable — restyling one means one more entry
 * in `cells`, and nothing else on the board has to know.
 */
export interface BoardStyle {
  readonly name: string;
  /** Any CSS background value, painted behind the whole grid. */
  readonly surface: string;
  readonly defaultCell: CellStyle;
  /**
   * Typed as the 90 real keys, so an override hard-coded for a cell that does not exist fails to
   * compile rather than silently never matching.
   */
  readonly cells?: CellOverrides;
}
