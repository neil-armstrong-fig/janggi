import type {PositionKey} from "@src/game/board/types/Position";
import {emphasisFor} from "@src/react/pages/game/components/board/components/intersections/movable-pieces/EmphasisFor";
import {expect, it} from "vitest";
import {toPositionKey} from "@src/game/board/PositionKeys";

const MOVABLE = {file: 1, rank: 7} as const;
const STUCK = {file: 5, rank: 10} as const;

const MOVABLE_PIECES: ReadonlySet<PositionKey> = new Set([toPositionKey(MOVABLE)]);

it("marks a piece that may move in full while nothing is in hand", () => {
  expect(emphasisFor(MOVABLE_PIECES, MOVABLE, false)).toBe("full");
});

it("marks it faintly while a piece is in hand, so the piece being held carries the eye", () => {
  expect(emphasisFor(MOVABLE_PIECES, MOVABLE, true)).toBe("faint");
});

it("leaves a piece that may not move unmarked, whether or not anything is in hand", () => {
  expect(emphasisFor(MOVABLE_PIECES, STUCK, false)).toBeUndefined();
  expect(emphasisFor(MOVABLE_PIECES, STUCK, true)).toBeUndefined();
});
