import type {BoardMarks} from "@src/styles/types/board-marks/BoardMarks";
import type {BoardStyle, CellOverrides} from "@src/styles/types/BoardStyle";
import {CELL_MARKER_SHAPES} from "@src/styles/types/CellStyle";
import type {CellMarker, CellStyle} from "@src/styles/types/CellStyle";
import type {Checked} from "@src/redux/custom-styles/untrusted/types/Checked";
import type {PositionKey} from "@src/game/board/types/Position";
import {DEFAULT_BOARD_MARKS} from "@src/styles/defaults/DefaultBoardMarks";
import {Reading} from "@src/redux/custom-styles/untrusted/reading/Reading";
import {RefusedReading} from "@src/redux/custom-styles/untrusted/reading/RefusedReading";
import {STYLE_LIMITS} from "@src/styles/limits/StyleLimits";
import {checkedBy} from "@src/redux/custom-styles/untrusted/reading/CheckedBy";

/**
 * A board style somebody else wrote — pasted as a key, typed into the editor, or read back from the
 * device — checked all the way down, or the reason it is not one.
 *
 * Every colour and surface goes through `isCssValue`, so a style that would load anything from beyond
 * the page is refused whole rather than drawn. Numbers are held to what a board can draw: a line a cell
 * wide is not a line.
 */
export function boardStyleFrom(value: unknown): Checked<BoardStyle> {
  return checkedBy(() => boardStyle(Reading.of(value, "style")));
}

function boardStyle(style: Reading): BoardStyle {
  const cells = style.optionalObject("cells");
  const lastMove = style.object("lastMove");

  return {
    name: style.name("name"),
    surface: style.css("surface"),
    defaultCell: cellStyle(style.object("defaultCell")),
    ...(cells === undefined ? {} : {cells: cellOverrides(cells)}),
    lastMove: {wash: lastMove.css("wash"), brackets: lastMove.css("brackets")},
    ...boardMarks(style),
  };
}

/** Each group of marks as written, or as boards drew it before a style could say — see `DEFAULT_BOARD_MARKS`. */
function boardMarks(boardStyleReading: Reading): BoardMarks {
  const bikjang = boardStyleReading.optionalObject("bikjang");
  const check = boardStyleReading.optionalObject("check");
  const hints = boardStyleReading.optionalObject("hints");

  return {
    bikjang:
      bikjang === undefined
        ? DEFAULT_BOARD_MARKS.bikjang
        : {colour: bikjang.css("colour"), width: bikjang.number("width", STYLE_LIMITS.bikjangWidth)},
    check: check === undefined ? DEFAULT_BOARD_MARKS.check : {colour: check.css("colour")},
    hints:
      hints === undefined
        ? DEFAULT_BOARD_MARKS.hints
        : {colour: hints.css("colour"), outline: hints.css("outline"), selection: hints.css("selection")},
  };
}

function cellOverrides(cells: Reading): CellOverrides {
  return Object.fromEntries(
    cells.keys().map(key => {
      if (!isPositionKey(key)) {
        throw new RefusedReading(
          `${cells.where(key)} is not a point on the board — name one f<file>r<rank>, like f5r2`,
        );
      }

      return [key, cellStyle(cells.object(key))];
    }),
  );
}

function cellStyle(cell: Reading): CellStyle {
  const surface = cell.optionalCss("surface");
  const diagonalStroke = cell.optionalCss("diagonalStroke");
  const diagonalStrokeWidth = cell.optionalNumber("diagonalStrokeWidth", STYLE_LIMITS.lineWidth);
  const marker = cell.optionalObject("marker");

  return {
    ...(surface === undefined ? {} : {surface}),
    stroke: cell.css("stroke"),
    strokeWidth: cell.number("strokeWidth", STYLE_LIMITS.lineWidth),
    ...(diagonalStroke === undefined ? {} : {diagonalStroke}),
    ...(diagonalStrokeWidth === undefined ? {} : {diagonalStrokeWidth}),
    ...(marker === undefined ? {} : {marker: cellMarker(marker)}),
  };
}

function cellMarker(marker: Reading): CellMarker {
  const strokeWidth = marker.optionalNumber("strokeWidth", STYLE_LIMITS.lineWidth);

  return {
    shape: marker.among("shape", CELL_MARKER_SHAPES),
    radius: marker.number("radius", STYLE_LIMITS.markerRadius),
    colour: marker.css("colour"),
    ...(strokeWidth === undefined ? {} : {strokeWidth}),
  };
}

function isPositionKey(key: string): key is PositionKey {
  return /^f[1-9]r(?:[1-9]|10)$/.test(key);
}
