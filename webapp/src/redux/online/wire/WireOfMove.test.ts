import {expect, it} from "vitest";
import {moveFromWire} from "@src/redux/online/wire/MoveFromWire";
import {wireOfMove} from "@src/redux/online/wire/WireOfMove";

it("writes a move as plain numbers, and reads back as it was", () => {
  const move = {from: {file: 5, rank: 2}, to: {file: 4, rank: 3}} as const;

  expect(wireOfMove(move)).toEqual({from: {file: 5, rank: 2}, to: {file: 4, rank: 3}});
  expect(moveFromWire(wireOfMove(move))).toEqual(move);
});
