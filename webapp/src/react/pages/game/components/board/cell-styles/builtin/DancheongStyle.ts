import type {BuiltInBoardStyle} from "@src/react/pages/game/components/board/cell-styles/builtin/types/BuiltInBoardStyle";
import type {CellStyle} from "@src/styles/types/CellStyle";
import {toPositionKey} from "@src/game/board/PositionKeys";

const LINE: CellStyle = {
  stroke: "#3fa37a",
  strokeWidth: 1.2,
  diagonalStroke: "#4a90d9",
  diagonalStrokeWidth: 1.6,
};

/**
 * 단청: the painted woodwork of a palace — lacquer red, bands of green and blue, and gold where it
 * matters. The grid is the green, the palace diagonals the blue, and the two palaces, being where the
 * generals live, are picked out in gold at their centres.
 */
export const dancheongStyle: BuiltInBoardStyle = {
  name: "Dancheong",
  surface: "linear-gradient(180deg, #7a1f1a, #5c1512)",
  defaultCell: LINE,
  cells: {
    [toPositionKey({file: 5, rank: 2})]: palaceCentre(),
    [toPositionKey({file: 5, rank: 9})]: palaceCentre(),
  },
  lastMove: {
    wash: "rgba(242, 193, 78, 0.22)",
    brackets: "#f2c14e",
  },
};

function palaceCentre(): CellStyle {
  return {...LINE, marker: {shape: "ring", radius: 14, colour: "#f2c14e", strokeWidth: 2}};
}
