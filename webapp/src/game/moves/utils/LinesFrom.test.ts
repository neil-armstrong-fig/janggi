import type {Line} from "@src/game/moves/types/Line";
import type {Position} from "@src/game/board/types/Position";
import {expect, it} from "vitest";
import {linesFrom} from "@src/game/moves/utils/LinesFrom";
import {toPositionKey} from "@src/game/board/utils/PositionKeys";

it("runs a line out to the edge of the board in each of the four directions", () => {
  const lines = linesFrom({file: 5, rank: 5});

  expect(lines).toHaveLength(4);
  expect(lines.map(line => line.length).sort()).toEqual([4, 4, 4, 5]);
});

it("starts each line at the next point along, never where the piece is standing", () => {
  const lines = linesFrom({file: 5, rank: 5});

  expect(lines.flat().map(toPositionKey)).not.toContain(toPositionKey({file: 5, rank: 5}));
});

it("puts the nearest point first, so a piece meets what is closest to it soonest", () => {
  expect(points(lineTowards({file: 7, rank: 3}, {file: 8, rank: 3}))).toEqual(["f8r3", "f9r3"]);
});

it("gives an empty line where the very next point is already off the board", () => {
  const lines = linesFrom({file: 9, rank: 1});

  expect(lines.filter(line => line.length === 0)).toHaveLength(2);
});

it("adds no diagonal out on the open board, where none is drawn", () => {
  expect(linesFrom({file: 5, rank: 5})).toHaveLength(4);
});

it("adds the drawn diagonal inside a palace", () => {
  expect(linesFrom({file: 4, rank: 8})).toHaveLength(5);
  expect(points(lineTowards({file: 4, rank: 8}, {file: 5, rank: 9}))).toEqual(["f5r9", "f6r10"]);
});

it("stops a palace diagonal at the palace wall rather than running on across the board", () => {
  expect(points(lineTowards({file: 6, rank: 10}, {file: 5, rank: 9}))).toEqual(["f5r9", "f4r8"]);
});

it("adds all four diagonals at the centre of a palace, and none at the middle of an edge", () => {
  expect(linesFrom({file: 5, rank: 9})).toHaveLength(8);
  expect(linesFrom({file: 5, rank: 8})).toHaveLength(4);
});

/** The one line that sets off towards a given neighbour — how a caller picks a direction. */
function lineTowards(from: Position, neighbour: Position): Line {
  const towards = toPositionKey(neighbour);

  const found = linesFrom(from).find(line => line[0] && toPositionKey(line[0]) === towards);
  if (!found) throw new Error(`No line leads from ${toPositionKey(from)} towards ${towards}`);

  return found;
}

function points(line: Line): string[] {
  return line.map(toPositionKey);
}
