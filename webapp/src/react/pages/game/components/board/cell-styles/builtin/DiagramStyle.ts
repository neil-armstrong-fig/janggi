import type {BuiltInBoardStyle} from "@src/react/pages/game/components/board/cell-styles/builtin/types/BuiltInBoardStyle";
import type {CellStyle} from "@src/styles/types/CellStyle";
import {toPositionKey} from "@src/game/board/PositionKeys";

const RULE: CellStyle = {stroke: "#1a1a1a", strokeWidth: 0.9};

/**
 * A position as a chess book prints one: white paper, thin black rules, and nothing on the board that
 * is not information. The two palace centres carry the small dot a printed xiangqi or janggi diagram
 * sets there, so the palace reads even where the diagonals are crowded with pieces.
 *
 * Worn with the Diagram pieces it is a page out of a problem book; with any other set, a plain board
 * that gets out of the way.
 */
export const diagramStyle: BuiltInBoardStyle = {
  name: "Diagram",
  surface: "#fbfaf6",
  defaultCell: RULE,
  cells: {
    [toPositionKey({file: 5, rank: 2})]: {...RULE, marker: {shape: "dot", radius: 3, colour: "#1a1a1a"}},
    [toPositionKey({file: 5, rank: 9})]: {...RULE, marker: {shape: "dot", radius: 3, colour: "#1a1a1a"}},
  },
  lastMove: {
    wash: "rgba(26, 26, 26, 0.1)",
    brackets: "#1a1a1a",
  },
};
