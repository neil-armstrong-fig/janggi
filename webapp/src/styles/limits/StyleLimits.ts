import type {NumberRange} from "@src/styles/limits/types/NumberRange";

/**
 * How far each number in a style may go before the board or a piece stops being drawable — a line a
 * cell wide is not a line, and a piece bigger than its cell is a piece over its neighbours.
 *
 * One list, read by both the check an imported style must pass and the sliders the style editor draws,
 * so a slider can never offer a value the check would refuse.
 */
export const STYLE_LIMITS = {
  /** A line, an outline or a ring's thickness, in the units of the cell or piece it is drawn in. */
  lineWidth: {least: 0, most: 10},
  /** A cell marker's radius, in the cell's own 100-unit box. */
  markerRadius: {least: 0, most: 50},
  /** A piece's diameter as a fraction of its cell. */
  pieceSize: {least: 0.1, most: 1},
  /** How far inside a piece's edge its inlay sits, as a fraction of the radius. */
  inlayInset: {least: 0, most: 1},
  /** A mark's size as a fraction of the piece it is drawn on. */
  glyphScale: {least: 0, most: 1.5},
  fontWeight: {least: 1, most: 1000},
  /** In degrees, either way. */
  glyphSlant: {least: -45, most: 45},
  /** The line down the open file between two generals, in pixels. */
  bikjangWidth: {least: 1, most: 12},
  /** How many times thicker a piece's outline is drawn under the pointer. */
  hoverOutline: {least: 1, most: 4},
} as const satisfies Readonly<Record<string, NumberRange>>;
