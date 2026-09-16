import type {BoardStyle, CellOverrides} from "@src/styles/types/BoardStyle";
import {CELL_MARKER_SHAPES} from "@src/styles/types/CellStyle";
import type {CellMarker, CellStyle} from "@src/styles/types/CellStyle";
import type {Checked} from "@src/redux/custom-styles/untrusted/types/Checked";
import type {PositionKey} from "@src/game/board/types/Position";
import {Reading} from "@src/redux/custom-styles/untrusted/reading/Reading";
import {RefusedReading} from "@src/redux/custom-styles/untrusted/reading/RefusedReading";
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
  const diagonalStrokeWidth = cell.optionalNumber("diagonalStrokeWidth", 0, WIDEST_LINE);
  const marker = cell.optionalObject("marker");

  return {
    ...(surface === undefined ? {} : {surface}),
    stroke: cell.css("stroke"),
    strokeWidth: cell.number("strokeWidth", 0, WIDEST_LINE),
    ...(diagonalStroke === undefined ? {} : {diagonalStroke}),
    ...(diagonalStrokeWidth === undefined ? {} : {diagonalStrokeWidth}),
    ...(marker === undefined ? {} : {marker: cellMarker(marker)}),
  };
}

function cellMarker(marker: Reading): CellMarker {
  const strokeWidth = marker.optionalNumber("strokeWidth", 0, WIDEST_LINE);

  return {
    shape: marker.among("shape", CELL_MARKER_SHAPES),
    radius: marker.number("radius", 0, LARGEST_MARKER),
    colour: marker.css("colour"),
    ...(strokeWidth === undefined ? {} : {strokeWidth}),
  };
}

function isPositionKey(key: string): key is PositionKey {
  return /^f[1-9]r(?:[1-9]|10)$/.test(key);
}

const WIDEST_LINE = 10;
const LARGEST_MARKER = 50;
