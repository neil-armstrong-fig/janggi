import type {BikjangStyle} from "@src/styles/types/board-marks/BikjangStyle";
import type {CheckStyle} from "@src/styles/types/board-marks/CheckStyle";
import type {HintsStyle} from "@src/styles/types/board-marks/HintsStyle";

/**
 * The colours of the marks a board draws over its cells, as opposed to the cells themselves — none of
 * which is a `CellStyle` field, since whose turn it is has no business written into one.
 *
 * Whether a mark is drawn is never a style's to say; only what it looks like.
 */
export interface BoardMarks {
  readonly bikjang: BikjangStyle;
  readonly check: CheckStyle;
  readonly hints: HintsStyle;
}
