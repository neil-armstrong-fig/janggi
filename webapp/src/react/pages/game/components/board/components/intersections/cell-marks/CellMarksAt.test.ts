import type {MarkSources} from "@src/react/pages/game/components/board/components/intersections/cell-marks/types/MarkSources";
import type {Piece} from "@janggi/shared/janggi/pieces/Piece";
import type {Position} from "@src/game/board/types/Position";
import {cellMarksAt} from "@src/react/pages/game/components/board/components/intersections/cell-marks/CellMarksAt";
import {expect, it} from "vitest";
import {toPositionKey} from "@src/game/board/PositionKeys";

const CHARIOT: Piece = {side: "cho", type: "chariot"};
const HERE: Position = {file: 1, rank: 10};
const THERE: Position = {file: 1, rank: 9};
const ELSEWHERE: Position = {file: 2, rank: 10};

const NOTHING: MarkSources = {
  pieces: new Map(),
  heldKey: undefined,
  reachable: new Set(),
  covered: new Set(),
  movable: new Set(),
  lastMove: undefined,
  threatenedKey: undefined,
  attackerKeys: new Set(),
  bikjangRiskKeys: new Set(),
};

it("marks nothing on a point nothing is happening to", () => {
  expect(cellMarksAt(HERE, NOTHING)).toEqual({
    piece: undefined,
    selected: false,
    canMoveTo: false,
    covered: false,
    movable: undefined,
    lastMove: undefined,
    underAttack: false,
    attacking: false,
    bikjangRisk: false,
  });
});

it("hands over the piece standing there", () => {
  const sources = {...NOTHING, pieces: new Map([[toPositionKey(HERE), CHARIOT]])};

  expect(cellMarksAt(HERE, sources).piece).toBe(CHARIOT);
  expect(cellMarksAt(THERE, sources).piece).toBeUndefined();
});

it("marks the point of the piece in hand as selected, and no other", () => {
  const sources = {...NOTHING, heldKey: toPositionKey(HERE)};

  expect(cellMarksAt(HERE, sources).selected).toBe(true);
  expect(cellMarksAt(THERE, sources).selected).toBe(false);
});

it("marks the points the piece in hand may move to, and the ones it would land on but for its own army", () => {
  const sources = {...NOTHING, reachable: new Set([toPositionKey(THERE)]), covered: new Set([toPositionKey(HERE)])};

  expect(cellMarksAt(THERE, sources)).toMatchObject({canMoveTo: true, covered: false});
  expect(cellMarksAt(HERE, sources)).toMatchObject({canMoveTo: false, covered: true});
});

it("marks a piece its owner may move loudly, and quietly while another piece is in hand", () => {
  const movable = new Set([toPositionKey(HERE)]);

  expect(cellMarksAt(HERE, {...NOTHING, movable}).movable).toBe("full");
  expect(cellMarksAt(HERE, {...NOTHING, movable, heldKey: toPositionKey(THERE)}).movable).toBe("faint");
  expect(cellMarksAt(THERE, {...NOTHING, movable}).movable).toBeUndefined();
});

it("marks both ends of the last move", () => {
  const sources = {...NOTHING, lastMove: {from: HERE, to: THERE}};

  expect(cellMarksAt(HERE, sources).lastMove).toBe("from");
  expect(cellMarksAt(THERE, sources).lastMove).toBe("to");
  expect(cellMarksAt(ELSEWHERE, sources).lastMove).toBeUndefined();
});

it("marks the general under attack, and each piece attacking it", () => {
  const sources = {...NOTHING, threatenedKey: toPositionKey(HERE), attackerKeys: new Set([toPositionKey(THERE)])};

  expect(cellMarksAt(HERE, sources)).toMatchObject({underAttack: true, attacking: false});
  expect(cellMarksAt(THERE, sources)).toMatchObject({underAttack: false, attacking: true});
});

it("marks a point where the move would leave the opponent a bikjang to call", () => {
  const sources = {...NOTHING, bikjangRiskKeys: new Set([toPositionKey(HERE)])};

  expect(cellMarksAt(HERE, sources).bikjangRisk).toBe(true);
  expect(cellMarksAt(THERE, sources).bikjangRisk).toBe(false);
});
