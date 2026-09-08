import {isInPalace, palaceCentreContaining} from "@src/game/board/utils/Palaces";
import type {Position} from "@src/game/board/types/Position";
import {expect, it} from "vitest";

it("stands each army's palace on the centre files, against its own edge of the board", () => {
  expect(isInPalace({file: 4, rank: 1}, "han")).toBe(true);
  expect(isInPalace({file: 6, rank: 3}, "han")).toBe(true);
  expect(isInPalace({file: 3, rank: 1}, "han")).toBe(false);
  expect(isInPalace({file: 4, rank: 4}, "han")).toBe(false);

  expect(isInPalace({file: 4, rank: 8}, "cho")).toBe(true);
  expect(isInPalace({file: 6, rank: 10}, "cho")).toBe(true);
  expect(isInPalace({file: 7, rank: 10}, "cho")).toBe(false);
  expect(isInPalace({file: 4, rank: 7}, "cho")).toBe(false);
});

it("counts all nine points around a centre as inside that palace", () => {
  const corners: readonly Position[] = [
    {file: 4, rank: 8},
    {file: 6, rank: 8},
    {file: 4, rank: 10},
    {file: 6, rank: 10},
  ];

  expect(corners.every(corner => isInPalace(corner, "cho"))).toBe(true);
  expect(isInPalace({file: 5, rank: 9}, "cho")).toBe(true);
});

it("keeps the open board outside both palaces", () => {
  expect(isInPalace({file: 5, rank: 7}, "cho")).toBe(false);
  expect(isInPalace({file: 3, rank: 9}, "cho")).toBe(false);
});

it("does not mistake the enemy's palace for its own", () => {
  expect(isInPalace({file: 5, rank: 2}, "cho")).toBe(false);
  expect(isInPalace({file: 5, rank: 2}, "han")).toBe(true);
});

it("finds whichever palace a point belongs to without being told whose", () => {
  expect(palaceCentreContaining({file: 4, rank: 3})).toEqual({file: 5, rank: 2});
  expect(palaceCentreContaining({file: 6, rank: 10})).toEqual({file: 5, rank: 9});
});

it("finds no palace out on the open board", () => {
  expect(palaceCentreContaining({file: 5, rank: 5})).toBeUndefined();
  expect(palaceCentreContaining({file: 1, rank: 1})).toBeUndefined();
});
