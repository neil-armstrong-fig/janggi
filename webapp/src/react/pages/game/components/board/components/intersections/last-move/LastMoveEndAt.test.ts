import type {Move} from "@src/game/types/Move";
import {expect, it} from "vitest";
import {lastMoveEndAt} from "@src/react/pages/game/components/board/components/intersections/last-move/LastMoveEndAt";

const MOVE: Move = {from: {file: 1, rank: 7}, to: {file: 1, rank: 6}};

it("names the point the piece left as where the move started", () => {
  expect(lastMoveEndAt(MOVE, MOVE.from)).toBe("from");
});

it("names the point the piece arrived on as where the move ended", () => {
  expect(lastMoveEndAt(MOVE, MOVE.to)).toBe("to");
});

it("leaves every other point alone", () => {
  expect(lastMoveEndAt(MOVE, {file: 2, rank: 7})).toBeUndefined();
});

it("marks nowhere when there is no last move", () => {
  expect(lastMoveEndAt(undefined, MOVE.from)).toBeUndefined();
});
