import {BOARD_POSITIONS} from "@src/react/pages/game/components/board/utils/BoardPositions";
import {toPositionKey} from "@src/game/board/utils/PositionKeys";
import {expect, it} from "vitest";

it("covers the 90 intersections of 9 files and 10 ranks", () => {
  expect(BOARD_POSITIONS).toHaveLength(90);
  expect(new Set(BOARD_POSITIONS.map(toPositionKey)).size).toBe(90);
});

it("reads left to right then top to bottom, the order a CSS grid fills in", () => {
  expect(BOARD_POSITIONS[0]).toEqual({file: 1, rank: 1});
  expect(BOARD_POSITIONS[1]).toEqual({file: 2, rank: 1});
  expect(BOARD_POSITIONS[8]).toEqual({file: 9, rank: 1});
  expect(BOARD_POSITIONS[9]).toEqual({file: 1, rank: 2});
});

it("ends on the far corner", () => {
  expect(BOARD_POSITIONS.at(-1)).toEqual({file: 9, rank: 10});
});
